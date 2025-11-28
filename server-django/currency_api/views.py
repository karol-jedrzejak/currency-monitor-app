import requests
from pprint import pprint

# potrzeben ?
import json,requests

from .models import Currency,Country,UserCurrencyTransaction
from .pagination import CustomPagination
from .filters import CurrencyFilter,UserCurrencyFilter
from .serializers import CurrencySerializer,CountrySerializer,StockPredictionSerializer,CurrencyIdSerializer,UserCurrencyTransactionSerializer,UserCurrencyTransactionSumSerializer,UserModCurrencyTransactionSerializer

from django.db.models import Exists, OuterRef,Sum
from django.http import HttpResponse,JsonResponse,Http404
from django.shortcuts import render

from rest_framework.response import Response
from rest_framework import status,permissions,mixins,generics,viewsets
from rest_framework.decorators import api_view, permission_classes,action
from rest_framework.views import APIView
from rest_framework.filters import SearchFilter,OrderingFilter
from rest_framework.permissions import IsAuthenticated, AllowAny

import pandas as pd
import numpy as np
import matplotlib as mpl
from datetime import datetime
from sklearn.preprocessing import MinMaxScaler
from keras.models import load_model

NBP_API_URL = "https://api.nbp.pl/api/exchangerates/tables/c/?format=json"

# Create your views here.

def currency_types_old(request):
    # Manual Serializer
    return JsonResponse({'currencies': list(Currency.objects.values())}, safe=False)

@api_view(['GET','POST'])
@permission_classes((permissions.AllowAny,))
def currency_types(request):
    # Professional Serializer
    if request.method == 'GET':
        currencies = Currency.objects.all()
        serializer = CurrencySerializer(currencies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    if request.method == 'POST':
        serializer = CurrencySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET','PUT','DELETE'])
@permission_classes((permissions.AllowAny,))
def currency_type(request,id):
    # Professional Serializer
    try:
        currency = Currency.objects.get(id=id)
    except Currency.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        serializer = CurrencySerializer(currency)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        serializer = CurrencySerializer(currency, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        currency.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CurrenciesViewSet (viewsets.ModelViewSet):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination
    filterset_class = CurrencyFilter


class CountryViewSet (viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CustomPagination
    filter_backends = [SearchFilter,OrderingFilter]
    search_fields = ["name","official_name"]
    ordering_fields = ["id","name","official_name","region"]
    
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

class AllCurrencies(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self, request):
        currencies = Currency.objects.all().order_by('name')
        serializer = CurrencyIdSerializer(currencies, many=True)
        return Response(serializer.data)

class UserCurrencyTransactionViewSet(viewsets.ModelViewSet):
    """
    Standardowy CRUD + dodatkowy endpoint /summary/
    """
    queryset = UserCurrencyTransaction.objects.all()
    pagination_class = CustomPagination
    serializer_class = UserCurrencyTransactionSerializer
    #permission_classes = (permissions.AllowAny)
    permission_classes = (IsAuthenticated,)
    filterset_class = UserCurrencyFilter

    def get_queryset(self):
        return UserCurrencyTransaction.objects.filter(user=self.request.user)

    #def perform_create(self, serializer):
        #serializer.save(user=self.request.user)

    #def perform_create(self, request):
        #serializer = UserCurrencyTransactionSerializer(data=request.data)
        #if serializer.is_valid():
        #    serializer.save(user=self.request.user)
        #    return Response("ok", status=status.HTTP_201_CREATED)
        #return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
    









class GetCurrencyTransaction(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, id):
        try:
            obj = UserCurrencyTransaction.objects.get(id=id)
        except UserCurrencyTransaction.DoesNotExist:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserCurrencyTransactionSerializer(instance=obj)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AddCurrencyTransaction(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def post(self, request,id):
        data_mod = request.data.copy()
        data_mod['user']=request.user.id
        serializer = UserModCurrencyTransactionSerializer(data=data_mod)

        if serializer.is_valid():

            currency_id = serializer.validated_data['currency'].id
            amount = serializer.validated_data['amount']

            # Obliczamy aktualne saldo użytkownika dla tej waluty
            current_balance = UserCurrencyTransaction.objects.filter(
                user=request.user.id,
                currency_id=currency_id
            ).aggregate(total=Sum('amount'))['total'] or 0

            # Sprawdzamy czy kwota nie jest ujemna i większa niż saldo
            if amount < 0 and abs(amount) > current_balance:
                return Response(
                    {"amount": ["Wpisana wartość ujemna jest wieksza niż twoje saldo."]},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # zapisujemy transakcję
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UpdateCurrencyTransaction(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def put(self, request, id):
        try:
            obj = UserCurrencyTransaction.objects.get(id=id)
        except UserCurrencyTransaction.DoesNotExist:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserModCurrencyTransactionSerializer(instance=obj, data=request.data)

        if serializer.is_valid():
            currency_id = serializer.validated_data['currency'].id
            amount = serializer.validated_data['amount']

            # Obliczamy aktualne saldo użytkownika dla tej waluty
            current_balance = UserCurrencyTransaction.objects.filter(
                user=request.user.id,
                currency_id=currency_id
            ).aggregate(total=Sum('amount'))['total'] or 0

            # Sprawdzamy czy kwota nie jest ujemna i większa niż saldo
            if amount < 0 and abs(amount) > current_balance:
                return Response(
                    {"amount": ["Wpisana wartość ujemna jest wieksza niż twoje saldo."]},
                    status=status.HTTP_400_BAD_REQUEST
                )

            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class DelCurrencyTransaction(APIView):
    permission_classes = (AllowAny,)

    def delete(self, request, id):
        try:
            obj = UserCurrencyTransaction.objects.get(id=id)
        except UserCurrencyTransaction.DoesNotExist:
            return Response({"error": "Wpis nie istnieje"}, status=status.HTTP_404_NOT_FOUND)

        obj.delete()
        return Response({"sucess": "Usunięto wpis"}, status=status.HTTP_204_NO_CONTENT)



"""
class UserCurrencyTransactions(viewsets.ModelViewSet):
    serializer_class = UserCurrencyTransactionSerializer
    permission_classes = (IsAuthenticated,)
    def get_queryset(self):
        return UserCurrencyTransaction.objects.filter(user=self.request.user)



class UserCurrencyTransactionsSum(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        queryset = (
            UserCurrencyTransaction.objects
            .filter(user=request.user)
            .values('currency__code')
            .annotate(total_amount=sum('amount'))
            .filter(total_amount__isnull=False)
            .exclude(total_amount=0)
        )

        data = [
            {'currency': item['currency__code'], 'total_amount': item['total_amount']}
            for item in queryset
        ]

        serializer = UserCurrencyTransactionSumSerializer(data, many=True)
        return Response(serializer.data)





def test_countries(request):
    return render(request, 'countries.html', {'countries': Country.objects.all()})

def test_currencies(request):
    return render(request, 'currencies.html', {'currencies': Currency.objects.all()})


def find_countries(request):
    return render(request, 'currencies.html', {'currencies': Currency.objects.all()})



# ClassView
class CurrenciesClassView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        currencies = Currency.objects.all()
        serializer = CurrencySerializer(currencies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = CurrencySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ClassView
class CurrencyClassView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get_object(self, id):
        try:
            return Currency.objects.get(id=id)
        except Currency.DoesNotExist:
            raise Http404       
        
    def get(self, request,id ):
        currency = self.get_object(id)
        serializer = CurrencySerializer(currency)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, id):
        currency = self.get_object(id)
        serializer = CurrencySerializer(currency, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id):
        currency = self.get_object(id)
        currency.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
 """

""" 
# Mixins
class CurrenciesClassView(mixins.ListModelMixin,mixins.CreateModelMixin, generics.GenericAPIView):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
# Mixins
class CurrencyClassView(mixins.RetrieveModelMixin,mixins.UpdateModelMixin,mixins.DestroyModelMixin, generics.GenericAPIView):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
    permission_classes = (permissions.AllowAny,)

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
    
    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
    
    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

        
          # Generic Views
class CurrenciesClassView(generics.ListCreateAPIView):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
    permission_classes = (permissions.AllowAny,)

# Generic Views
class CurrencyClassView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
    permission_classes = (permissions.AllowAny,) """

""" 
class CurrenciesViewSet (viewsets.ModelViewSet):
    def list(self, request):
        queryset = Currency.objects.all()
        serializer = CurrencySerializer(queryset, many=True)
        return Response(serializer.data)
    def create(self, request):
        serializer = CurrencySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def retrieve(self, request, id=None):
        try:
            currency = Currency.objects.get(id=id)
        except Currency.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = CurrencySerializer(currency)
        return Response(serializer.data)
    def update(self, request, id=None):
        try:
            currency = Currency.objects.get(id=id)
        except Currency.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = CurrencySerializer(currency, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def destroy(self, request, id=None):
        try:
            currency = Currency.objects.get(id=id)
        except Currency.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        currency.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



def nbp_api(request):

    Pobiera i wyświetla aktualne kursy walut z API NBP (tabela C).

    dane_kursow = None
    blad = None

    try:
        # 1. Wykonanie zapytania GET do API
        response = requests.get(NBP_API_URL, timeout=10) # Ustawienie timeoutu jest dobrą praktyką

        # 2. Sprawdzenie, czy odpowiedź jest poprawna (status 200)
        response.raise_for_status() 

        # 3. Parsowanie danych JSON na słownik Pythona
        dane_nbp = response.json()
        
        # API NBP dla tabel zwraca listę, zazwyczaj z jednym elementem,
        # który zawiera dane tabeli i kursy
        if dane_nbp and isinstance(dane_nbp, list) and 'rates' in dane_nbp[0]:
            dane_kursow = dane_nbp[0]
        else:
            blad = "Niepoprawna struktura danych z API NBP."


    except requests.exceptions.RequestException as e:
        # Obsługa błędów związanych z zapytaniem (np. brak połączenia, timeout)
        blad = f"Błąd połączenia z API NBP: {e}"
    except Exception as e:
        # Inne błędy (np. błąd parsowania JSON, choć requests.json() to obsługuje)
        blad = f"Wystąpił nieoczekiwany błąd: {e}"
    
    # Przekazanie danych lub błędu do szablonu
    context = {
        'dane_kursow': dane_kursow,
        'blad': blad
    }

    #return HttpResponse(dane_kursow['rates'])
    return render(request, 'test.html', {'dane': dane_kursow})

"""