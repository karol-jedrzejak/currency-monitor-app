import json,requests

NBP_API_URL_A = "https://api.nbp.pl/api/exchangerates/tables/a/?format=json"
NBP_API_URL_B = "https://api.nbp.pl/api/exchangerates/tables/b/?format=json"

COUNTRIES_API = "https://restcountries.com/v3.1/all?fields=name,flags,region,cca2,ccn3,cca3,cioc"

COUNTRIES_CURRENCY_RELATION_API = "https://restcountries.com/v3.1/currency/"

ADD_COUNTRY_API_URL = "http://127.0.0.1:8000/api/v1/countries/"
ADD_CURRENCY_API_URL = "http://127.0.0.1:8000/api/v1/currencies/"

blad = None
dane_kursow_a = {}
dane_kursow_b = {}
dane_countries = {}

# --------------------------------------------
# Definicja funkcji
# --------------------------------------------

def get_data(api_point,blad):
    data = []
    try:
        # 1. Wykonanie zapytania GET do API
        response = requests.get(api_point, timeout=10) # Ustawienie timeoutu
        # 2. Sprawdzenie, czy odpowiedź jest poprawna (status 200)
        response.raise_for_status() 
        # 3. Parsowanie danych JSON na słownik Pythona
        data = response.json()
        
    except requests.exceptions.RequestException as e:
        # Obsługa błędów związanych z zapytaniem (np. brak połączenia, timeout)
        blad = f"Błąd połączenia z API: {e}"
    except Exception as e:
        # Inne błędy (np. błąd parsowania JSON, choć requests.json() to obsługuje)
        blad = f"Wystąpił nieoczekiwany błąd: {e}"
    return [ data, blad]



def send_data(data,api_point):
    try:
        # Sending a PUT request to update data
        response = requests.post(api_point, json=data)
        if response.status_code == 201:
            pass
        else:
            print("Failed to add items:", response.status_code, response.json())
    except Exception as e:
        print("An error occurred:", e)

# --------------------------------------------
# Zapytania API
# --------------------------------------------

[dane_countries ,blad] = get_data(COUNTRIES_API,blad)

[dane_nbp_a ,blad] = get_data(NBP_API_URL_A,blad)
[dane_nbp_b ,blad] = get_data(NBP_API_URL_B,blad)

# --------------------------------------------
# Sprawdzenie struktury
# --------------------------------------------

if dane_nbp_a and isinstance(dane_nbp_a, list) and 'rates' in dane_nbp_a[0]:
    dane_kursow_a = dane_nbp_a[0]
else:
    blad = "Niepoprawna struktura danych z API NBP."

if dane_nbp_b and isinstance(dane_nbp_b, list) and 'rates' in dane_nbp_b[0]:
    dane_kursow_b = dane_nbp_b[0]
else:
    blad = "Niepoprawna struktura danych z API NBP."

# --------------------------------------------
# Obsługa błędów i zapis danych do plików JSON
# --------------------------------------------

if blad:
    print(blad)
else:
    # --------------------------------------------
    # Wypis podsumowania
    # --------------------------------------------

    count_a = len(dane_kursow_a.get('rates', []))
    count_b = len(dane_kursow_b.get('rates', []))
    count_countries = len(dane_countries)
    print("--------------------------------------------")  
    print(f"Pobrano {count_a} kursów z tabeli A, {count_b} kursów z tabeli B.")
    print(f"Pobrano {count_countries } krajów.")
    print(f"Przystępuję do formatowania danych :)")
    print("--------------------------------------------")  

    # --------------------------------------------
    # Formatowanie danych
    # --------------------------------------------

    countries = []
    waluty = []
    id=1
    for country in dane_countries:
        region = country.get('region', '')
        if region=="Europe":
            region="EUR"
        elif region=="Americas":
            region="AME"
        elif region=="Africa":
            region="AFR"
        elif region=="Asia":
            region="ASI"
        elif region=="Oceania":
            region="OCE"
        elif region=="Antarctic":
            region="ANT"

        name = country.get('name', {}).get('common', '')
        ccn3=country.get('ccn3', '')
        if name == "Kosovo":
            ccn3="926"

        country_info = {
            'name': name,
            'official_name': country.get('name', {}).get('official', ''),
            'flag': country.get('flags', {}).get('svg', ''),
            'region': region,
            'ccn3': ccn3,
        }

        #send_data(country_info,ADD_COUNTRY_API_URL)
        print(f'[{id}/{len(dane_countries)}] Dodałem kraj {name}.')
        country_info = {
            'id': id,
            'name': country.get('name', {}).get('common', ''),
            'official_name': country.get('name', {}).get('official', ''),
            'flag': country.get('flags', {}).get('svg', ''),
            'region': region,
            'ccn3': country.get('ccn3', ''),
        }
        countries.append(country_info)
        id+=1

    print("--------------------------------------------")   
    iteracja = 1
    leng_1 = len(dane_kursow_a.get('rates', []))
    dane_kursow = dane_kursow_a.get('rates', [])+dane_kursow_b.get('rates', [])
    for rate in dane_kursow: 
        currency_code = rate.get('code', '')

        try:
            response = requests.get(COUNTRIES_CURRENCY_RELATION_API+currency_code.lower(), timeout=10) # Ustawienie timeoutu jest dobrą praktyką
            response.raise_for_status() 
            currency_countries = response.json()
        except requests.exceptions.RequestException as e:
            blad = f"Błąd połączenia z API: {e}"
        except Exception as e:
            blad = f"Wystąpił nieoczekiwany błąd: {e}"

        found_countries = []
        if isinstance(currency_countries, list):
            for cc_country in currency_countries:

                ccn3 = cc_country.get('ccn3', {})
                if ccn3=="":
                    ccn3="926"
                for country in countries:
                    if country.get('ccn3', {}) == ccn3:
                        found_countries.append(country.get('id', {}))
                        break

        if iteracja <= leng_1:
            table = "A"
        else:
            table = "B"

        currency_info = {
            'name': rate.get('currency', ''),
            'code': currency_code,
            'table': table,
            'countries': found_countries
        }
        #send_data(currency_info,ADD_CURRENCY_API_URL)
        print(f'[{iteracja}/{len(dane_kursow)}] Dodałem walutę {currency_code}. Wsytępuje w krajach o ID: [',end="")
        for fc in found_countries[:-1]:
            print(fc,end=",")
        print(found_countries[-1],end='')
        print("]")
        iteracja+=1
        waluty.append(currency_info)



