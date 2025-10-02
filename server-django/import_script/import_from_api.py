import json,requests

NBP_API_URL_A = "https://api.nbp.pl/api/exchangerates/tables/a/?format=json"
NBP_API_URL_B = "https://api.nbp.pl/api/exchangerates/tables/b/?format=json"
NBP_API_URL_C = "https://api.nbp.pl/api/exchangerates/tables/c/?format=json"

COUTRIES_API = "https://restcountries.com/v3.1/all?fields=name,flags,region,cca2,ccn3,cca3,cioc"

COUTRIES_CURRENCY_RELATION_API = "https://restcountries.com/v3.1/currency/"

blad = None
dane_kursow_a = {}
dane_kursow_b = {}
dane_kursow_c = {}
dane_countries = {}

# --------------------------------------------
# Zapytanie do API krajów
# --------------------------------------------

try:
    # 1. Wykonanie zapytania GET do API
    response = requests.get(COUTRIES_API, timeout=10) # Ustawienie timeoutu jest dobrą praktyką

    # 2. Sprawdzenie, czy odpowiedź jest poprawna (status 200)
    response.raise_for_status() 

    # 3. Parsowanie danych JSON na słownik Pythona
    dane_countries = response.json()
    
except requests.exceptions.RequestException as e:
    # Obsługa błędów związanych z zapytaniem (np. brak połączenia, timeout)
    blad = f"Błąd połączenia z API: {e}"
except Exception as e:
    # Inne błędy (np. błąd parsowania JSON, choć requests.json() to obsługuje)
    blad = f"Wystąpił nieoczekiwany błąd: {e}"

# --------------------------------------------
# Zapytanie do NBP API tabela A
# --------------------------------------------

try:
    # 1. Wykonanie zapytania GET do API
    response = requests.get(NBP_API_URL_A, timeout=10) # Ustawienie timeoutu jest dobrą praktyką

    # 2. Sprawdzenie, czy odpowiedź jest poprawna (status 200)
    response.raise_for_status() 

    # 3. Parsowanie danych JSON na słownik Pythona
    dane_nbp_a = response.json()
    
    # API NBP dla tabel zwraca listę, zazwyczaj z jednym elementem,
    # który zawiera dane tabeli i kursy
    if dane_nbp_a and isinstance(dane_nbp_a, list) and 'rates' in dane_nbp_a[0]:
        dane_kursow_a = dane_nbp_a[0]
    else:
        blad = "Niepoprawna struktura danych z API NBP."
except requests.exceptions.RequestException as e:
    # Obsługa błędów związanych z zapytaniem (np. brak połączenia, timeout)
    blad = f"Błąd połączenia z API NBP: {e}"
except Exception as e:
    # Inne błędy (np. błąd parsowania JSON, choć requests.json() to obsługuje)
    blad = f"Wystąpił nieoczekiwany błąd: {e}"

# --------------------------------------------
# Zapytanie do NBP API tabela B
# --------------------------------------------

try:
    # 1. Wykonanie zapytania GET do API
    response = requests.get(NBP_API_URL_B, timeout=10) # Ustawienie timeoutu jest dobrą praktyką

    # 2. Sprawdzenie, czy odpowiedź jest poprawna (status 200)
    response.raise_for_status() 

    # 3. Parsowanie danych JSON na słownik Pythona
    dane_nbp_b = response.json()
    
    # API NBP dla tabel zwraca listę, zazwyczaj z jednym elementem,
    # który zawiera dane tabeli i kursy
    if dane_nbp_b and isinstance(dane_nbp_b, list) and 'rates' in dane_nbp_b[0]:
        dane_kursow_b = dane_nbp_b[0]
    else:
        blad = "Niepoprawna struktura danych z API NBP."
except requests.exceptions.RequestException as e:
    # Obsługa błędów związanych z zapytaniem (np. brak połączenia, timeout)
    blad = f"Błąd połączenia z API NBP: {e}"
except Exception as e:
    # Inne błędy (np. błąd parsowania JSON, choć requests.json() to obsługuje)
    blad = f"Wystąpił nieoczekiwany błąd: {e}"

# --------------------------------------------
# Zapytanie do NBP API tabela C
# --------------------------------------------

try:
    # 1. Wykonanie zapytania GET do API
    response = requests.get(NBP_API_URL_C, timeout=10) # Ustawienie timeoutu jest dobrą praktyką

    # 2. Sprawdzenie, czy odpowiedź jest poprawna (status 200)
    response.raise_for_status() 

    # 3. Parsowanie danych JSON na słownik Pythona
    dane_nbp_c = response.json()
    
    # API NBP dla tabel zwraca listę, zazwyczaj z jednym elementem,
    # który zawiera dane tabeli i kursy
    if dane_nbp_c and isinstance(dane_nbp_c, list) and 'rates' in dane_nbp_c[0]:
        dane_kursow_c = dane_nbp_c[0]
    else:
        blad = "Niepoprawna struktura danych z API NBP."
except requests.exceptions.RequestException as e:
    # Obsługa błędów związanych z zapytaniem (np. brak połączenia, timeout)
    blad = f"Błąd połączenia z API NBP: {e}"
except Exception as e:
    # Inne błędy (np. błąd parsowania JSON, choć requests.json() to obsługuje)
    blad = f"Wystąpił nieoczekiwany błąd: {e}"

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
    count_c = len(dane_kursow_c.get('rates', []))
    count_countries = len(dane_countries)
    print("--------------------------------------------")  
    print(f"Pobrano {count_a} kursów z tabeli A, {count_b} kursów z tabeli B oraz {count_c} kursów z tabeli C.")
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
        country_info = {
            'id': id,
            'name': country.get('name', {}).get('common', ''),
            'official_name': country.get('name', {}).get('official', ''),
            'flag': country.get('flags', {}).get('svg', ''),
            'region': country.get('region', ''),
            'ccn3': country.get('ccn3', ''),
        }
        countries.append(country_info)
        id+=1
        
    iteracja = 1
    dane_kursow = dane_kursow_a.get('rates', [])+dane_kursow_b.get('rates', [])
    for rate in dane_kursow: 
        currency_code = rate.get('code', '')

        try:
            response = requests.get(COUTRIES_CURRENCY_RELATION_API+currency_code.lower(), timeout=10) # Ustawienie timeoutu jest dobrą praktyką
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
                for country in countries:
                    if country.get('ccn3', {}) == ccn3:
                        found_countries.append(country.get('id', {}))
                        break

        currency_info = {
            'currency': rate.get('currency', ''),
            'code': currency_code,
            'table': 'B',
            'countries': found_countries
        }
        print(f'Przerabiam walutę {currency_code} [{iteracja}/{len(dane_kursow)}].')
        iteracja+=1
        waluty.append(currency_info)

    # --------------------------------------------
    # Zapis do plików JSON
    # --------------------------------------------

    print("--------------------------------------------")
    print(f"Utworzono {len(waluty) } walut w pliku currencies.json.")
    with open('server-django/import_script/currencies.json', 'w', encoding='utf-8') as f:
        json.dump([waluty], f, ensure_ascii=False, indent=4)

    print("--------------------------------------------")        
    print(f"Utworzono {len(countries) } krajów w pliku countries.json.")
    with open('server-django/import_script/countries.json', 'w', encoding='utf-8') as f:
        json.dump([countries], f, ensure_ascii=False, indent=4)


"""
Regiony:

Europe
Americas
Africa
Asia
Oceania
Antarctic

 """
