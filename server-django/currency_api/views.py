import requests
from pprint import pprint

from .models import Currency,Country
from .pagination import CustomPagination
from .filters import CurrencyFilter
from .serializers import CurrencySerializer,CountrySerializer

from django.db.models import Exists, OuterRef
from django.http import HttpResponse,JsonResponse,Http404
from django.shortcuts import render

from rest_framework.response import Response
from rest_framework import status,permissions,mixins,generics,viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.filters import SearchFilter,OrderingFilter
from rest_framework.permissions import IsAuthenticated, AllowAny

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
    #permission_classes = (IsAuthenticated,)
    permission_classes = (AllowAny,)
    pagination_class = CustomPagination
    filterset_class = CurrencyFilter


class CountryViewSet (viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    permission_classes = (AllowAny,)
    pagination_class = CustomPagination
    filter_backends = [SearchFilter,OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["id","name"]
    #filterset_fields = ['name']
    
def test_countries(request):
    return render(request, 'countries.html', {'countries': Country.objects.all()})

def test_currencies(request):
    return render(request, 'currencies.html', {'currencies': Currency.objects.all()})






"""
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
 """

""" # Generic Views
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
"""











def nbp_api(request):
    """
    Pobiera i wyświetla aktualne kursy walut z API NBP (tabela C).
    """
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