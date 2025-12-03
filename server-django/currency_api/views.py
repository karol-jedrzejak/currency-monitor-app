import requests

from .models import Currency,Country,UserCurrencyTransaction
from .pagination import CustomPagination
from .filters import CurrencyFilter,UserCurrencyFilter
from .serializers import CurrencySerializer,CurrencyIdSerializer,CountrySerializer,StockPredictionSerializer
from .serializers import UserCurrencyTransactionSerializer,UserCurrencyTransactionSumSerializer,UserModCurrencyTransactionSerializer

from django.db.models import Sum

from rest_framework.response import Response
from rest_framework import status,permissions,viewsets
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.filters import SearchFilter,OrderingFilter
from rest_framework.permissions import IsAuthenticated,AllowAny

import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from keras.models import load_model


class CurrenciesViewSet (viewsets.ModelViewSet):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
    permission_classes = (AllowAny,)
    pagination_class = CustomPagination
    filterset_class = CurrencyFilter

class CountryViewSet (viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    permission_classes = (AllowAny,)
    pagination_class = CustomPagination
    filter_backends = [SearchFilter,OrderingFilter]
    search_fields = ["name","official_name"]
    ordering_fields = ["id","name","official_name","region"]
    
class UserCurrencyTransactionViewSet(viewsets.ModelViewSet):
    queryset = UserCurrencyTransaction.objects.all()
    serializer_class = UserCurrencyTransactionSerializer
    permission_classes = (permissions.IsAuthenticated,)
    pagination_class = CustomPagination
    filterset_class = UserCurrencyFilter

    def get_queryset(self):
        return UserCurrencyTransaction.objects.filter(user=self.request.user)

    # -----------------------------
    #   HELPER – WALIDACJA SALDA
    # -----------------------------
    def validate_balance(self, user, currency, amount):
        current_balance = UserCurrencyTransaction.objects.filter(
            user=user.id,
            currency_id=currency.id
        ).aggregate(total=Sum('amount'))['total'] or 0

        if amount < 0 and abs(amount) > current_balance:
            return {
                "amount": [
                    "Wpisana wartość ujemna jest większa niż twoje saldo."
                ]
            }
        return None

    # -----------------------------
    #       CREATE (POST)
    # -----------------------------
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data['user'] = request.user.id

        serializer = UserModCurrencyTransactionSerializer(data=data)

        if serializer.is_valid():
            currency = serializer.validated_data['currency']
            amount = serializer.validated_data['amount']

            err = self.validate_balance(request.user, currency, amount)
            if err:
                return Response(err, status=status.HTTP_400_BAD_REQUEST)

            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # -----------------------------
    #         UPDATE (PUT/PATCH)
    # -----------------------------
    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = UserModCurrencyTransactionSerializer(instance, data=request.data)

        if serializer.is_valid():
            currency = serializer.validated_data['currency']
            amount = serializer.validated_data['amount']

            err = self.validate_balance(request.user, currency, amount)
            if err:
                return Response(err, status=status.HTTP_400_BAD_REQUEST)

            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # -----------------------------
    #         DELETE
    # -----------------------------
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"success": "Usunięto wpis"}, status=status.HTTP_204_NO_CONTENT)

    # -----------------------------
    #        SUMMARY endpoint
    # -----------------------------
    @action(detail=False, methods=['get'])
    def summary(self, request):
        qs = (
            self.get_queryset()
            .select_related('currency')
            .values('currency__id', 'currency__name', 'currency__code')
            .annotate(total_amount=Sum('amount'))
            .filter(total_amount__isnull=False)
            .exclude(total_amount=0)
        )

        data = [
            {
                "currency": {
                    "id": item["currency__id"],
                    "name": item["currency__name"],
                    "code": item["currency__code"]
                },
                "total_amount": item["total_amount"]
            }
            for item in qs
        ]

        serializer = UserCurrencyTransactionSumSerializer(data, many=True)
        return Response(serializer.data)

class AllCurrencies(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        currencies = Currency.objects.all().order_by('name')
        serializer = CurrencyIdSerializer(currencies, many=True)
        return Response(serializer.data)

class StockPrediction(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self,request):
        serializer = StockPredictionSerializer(data=request.data)
        if serializer.is_valid():
            ticker = serializer.validated_data['ticker']
            blad = False

            try:
                response = requests.get("https://api.nbp.pl/api/exchangerates/rates/a/"+ticker+"/last/255/", timeout=10) # Ustawienie timeoutu
                response.raise_for_status() 
                data = response.json()
                
            except requests.exceptions.RequestException as e:
                blad = f"Błąd połączenia z API: {e}"
            except Exception as e:
                blad = f"Wystąpił nieoczekiwany błąd: {e}"

            if blad:
                return  Response({'status': "error", 'info': blad})

            df = pd.DataFrame.from_records(data['rates'])

            data_training = pd.DataFrame(df.mid[0:int(len(df)*0.7)])
            data_testing = pd.DataFrame(df.mid[int(len(df)*0.7):int(len(df))])

            scaler = MinMaxScaler(feature_range=(0,1))

            model = load_model("D:\Priv\Github\currency-monitor-app\server-django\currency_api\currency_predict.keras")

            last_100_days = data_training.tail(100)
            future = pd.DataFrame([0], columns=['mid'])
            final_df = pd.concat([last_100_days,data_testing,future],ignore_index=True)

            input_data = scaler.fit_transform(final_df)

            test_x = []
            test_y = []
            for i in range (100,input_data.shape[0]):
                test_x.append(input_data[i-100:i])
                test_y.append(input_data[i,0])
            test_x,test_y = np.array(test_x),np.array(test_y)

            y_predicted = model.predict(test_x)

            y_predicted = scaler.inverse_transform(y_predicted.reshape(-1,1)).flatten()
            test_y = scaler.inverse_transform(test_y.reshape(-1,1)).flatten()

            return Response({
                'status': "ok", 
                'tomorrow_price': y_predicted[-1],
                })

class CurrencyByCodeView(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        codes = request.query_params.get('code')
        if not codes:
            return Response({"error": "Parametr 'code' jest wymagany !"}, status=400)

        code_list = [c.strip().upper() for c in codes.split(',')]
        currencies = Currency.objects.filter(code__in=code_list)
        serializer = CurrencyIdSerializer(currencies, many=True)
        return Response(serializer.data)



