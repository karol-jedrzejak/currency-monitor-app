# Currency Monitor App

## Description

This project consists of 2 applications:
- Backend created with Django & Django Rest
- Frontend created with React, js and Tailwind

The application monitors current exchange rates retrieved from the National Bank of Poland (NBP) API + country information stored in a Postgresql database (imported from restcountries api). The application allows you to check future exchange rate predictions using an LSTM model. The application also implements the option of saving your currency balance (CRUD).

## Installation & Run

To Setup backend:
```
cd server-django
venv/Scripts/activate
docker-compose up
python manage.py makemigrations
python manage.py migrate
```

after setting up database run python script (it will import data from external api to docker database):
```
server-django\import_script\import_countries_and_currencies_list_from_api.py
```

To start Server:

```
cd server-django
venv/Scripts/activate
docker-compose start
python manage.py runserver
```

To run Frontend:
```
cd client-react
npm run dev
```