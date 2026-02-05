# Currency Monitor App

<img src="https://github.com/karol-jedrzejak/karol-jedrzejak.github.io/blob/master/src/assets/projects/13.jpg" height="400">

## Tech Stack
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white) ![Django](https://img.shields.io/badge/Django-092E20?style=flat&logo=django&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) ![API](https://img.shields.io/badge/API-REST-0A66C2?style=flat)

## Installation & Run

To Setup backend:
```
cd server-django
copy env.example env.
python -m venv venv
venv/Scripts/activate
pip install -r requirements.txt
docker-compose up
python manage.py makemigrations
python manage.py migrate
```

To start Server:

```
cd server-django
venv/Scripts/activate
docker-compose start
python manage.py runserver
```

after setting up database run python script and it will import data from external api to docker database (backend server must be running):
```
server-django\import_script\import_countries_and_currencies_list_from_api.py
```

Enter url and register user
```
http://127.0.0.1:8000/api/v1/register/
```

To Setup Frontend:
```
cd client-react
npm install
```

To run Frontend:
```
cd client-react
npm run dev
```

Login with previously registered user
