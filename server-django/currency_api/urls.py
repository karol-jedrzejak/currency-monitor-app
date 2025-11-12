from django.urls import path,include
from . import views
from accounts import views as UserViews
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('currencies', views.CurrenciesViewSet, basename='currencies')
router.register('countries', views.CountryViewSet, basename='countries')
router.register('user_transactions', views.UserCurrencyTransactionViewSet, basename='user_transactions')

urlpatterns = [
    path("stock_prediction/", views.StockPrediction.as_view(), name="stock_prediction"),
    path("currency_by_code/", views.CurrencyByCodeView.as_view(), name="currency_by_code"),
    path("register/", UserViews.UserRegister.as_view(), name="account-create"),
    path('', include(router.urls)),  # Include the router URLs
]


"""  
    path("register/", UserViews.UserRegister.as_view(), name="account-create"),
    path("countries_html", views.test_countries, name="test_countries"),
    path("currencies_html", views.test_currencies, name="test_currencies"), """

"""
    path("types_cv/", views.CurrenciesClassView.as_view(), name="type_cv"),
    path("types_cv/<int:id>/", views.CurrencyClassView.as_view(), name="type_cv"),
"""
""" path("nbp_api", views.nbp_api, name="nbp_api"),
    path("types", views.currency_types, name="types"),
    path("types/<int:id>/", views.currency_type, name="type"), """