import requests
from django.shortcuts import render
from currency_api.models import Currency
from django.http import HttpResponse,JsonResponse
from pprint import pprint
from .serializers import CurrencySerializer
from rest_framework.response import Response
from rest_framework import status,permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView

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


class CurrencyClassView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        currencies = Currency.objects.all()
        serializer = CurrencySerializer(currencies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)









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