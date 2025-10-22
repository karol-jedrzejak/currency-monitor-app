import requests
from django.core.cache import cache

NBP_API_URL_TABLE_A = "https://api.nbp.pl/api/exchangerates/tables/a/?format=json"
NBP_API_URL_TABLE_B = "https://api.nbp.pl/api/exchangerates/tables/b/?format=json"


def get_nbp_rates():

    cache_key_a = "nbp_rates_a"
    rates_a = cache.get(cache_key_a)
    cache_key_b = "nbp_rates_b"
    rates_b = cache.get(cache_key_b)
    
    if rates_a and rates_b:
        rates = rates_a|rates_b
        return rates

    try:
        response_a = requests.get(NBP_API_URL_TABLE_A, timeout=5)
        response_a.raise_for_status()
        data_a = response_a.json()

        # Przekształcamy odpowiedź w słownik {code: mid}
        rates_a = {item["code"]: item["mid"] for item in data_a[0]["rates"]}

        # Cache na 1 godzinę (3600 sekund)
        cache.set(cache_key_a, rates_a, timeout=3600)

    except Exception as e:
        print(f"Błąd pobierania danych z NBP: {e}")
        return {}
    
    try:
        response_b = requests.get(NBP_API_URL_TABLE_B, timeout=5)
        response_b.raise_for_status()
        data_b = response_b.json()

        # Przekształcamy odpowiedź w słownik {code: mid}
        rates_b = {item["code"]: item["mid"] for item in data_b[0]["rates"]}

        # Cache na 1 godzinę (3600 sekund)
        cache.set(cache_key_b, rates_b, timeout=3600)
    except Exception as e:
        print(f"Błąd pobierania danych z NBP: {e}")
        return {}
    
    rates = rates_a|rates_b
    return rates