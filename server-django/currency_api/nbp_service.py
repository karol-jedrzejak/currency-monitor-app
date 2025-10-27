import requests
from django.core.cache import cache


def get_from_api(cache_key,API_KEY):
    try:
        response = requests.get(API_KEY, timeout=5)
        response.raise_for_status()
        data = response.json()

        # Przekształcamy odpowiedź w słownik {code: mid}
        rates = {item["code"]: item["mid"] for item in data[0]["rates"]}

        # Cache na 1 godzinę (3600 sekund)
        cache.set(cache_key, rates, timeout=3600)
        return rates

    except Exception as e:
        print(f"Błąd pobierania danych z NBP: {e}")
        return False

def get_nbp_rates():

    NBP_API_URL_TABLE_A = "https://api.nbp.pl/api/exchangerates/tables/a/?format=json"
    NBP_API_URL_TABLE_B = "https://api.nbp.pl/api/exchangerates/tables/b/?format=json"

    cache_key_a = "nbp_rates_a"
    cache_key_b = "nbp_rates_b"
    
    rates_a = cache.get(cache_key_a)
    rates_b = cache.get(cache_key_b)
    
    if (not rates_a or not rates_b):
        rates_a = get_from_api(cache_key_a,NBP_API_URL_TABLE_A)
        rates_b = get_from_api(cache_key_b,NBP_API_URL_TABLE_B)
    
    rates = rates_a|rates_b
    return rates
