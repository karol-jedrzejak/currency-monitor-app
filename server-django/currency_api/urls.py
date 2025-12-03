from django.urls import path,include
from . import views
from accounts import views as UserViews
from rest_framework.routers import DefaultRouter

router = DefaultRouter()



router.register('currencies', views.CurrenciesViewSet, basename='currencies')
router.register('countries', views.CountryViewSet, basename='countries')
router.register("user_transaction",  views.UserCurrencyTransactionViewSet, basename="user_transaction")

urlpatterns = [
    path("register/", UserViews.UserRegister.as_view(), name="account-create"),
    path("all_currencies/", views.AllCurrencies.as_view(), name="all_currencies"),
    path("stock_prediction/", views.StockPrediction.as_view(), name="stock_prediction"),
    path("currency_by_code/", views.CurrencyByCodeView.as_view(), name="currency_by_code"),
    path('', include(router.urls)), 
]

