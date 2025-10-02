from django.urls import path,include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('currencies', views.CurrenciesViewSet, basename='currencies')
router.register('countries', views.CountryViewSet, basename='countries')

urlpatterns = [
    path("nbp_api", views.nbp_api, name="nbp_api"),
    path("types", views.currency_types, name="types"),
    path("types/<int:id>/", views.currency_type, name="type"),
    path("test", views.test, name="test"),

    path('', include(router.urls)),  # Include the router URLs
]
"""
    path("types_cv/", views.CurrenciesClassView.as_view(), name="type_cv"),
    path("types_cv/<int:id>/", views.CurrencyClassView.as_view(), name="type_cv"),
"""