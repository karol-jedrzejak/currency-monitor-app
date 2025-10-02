from django.urls import path
from . import views

urlpatterns = [
    path("nbp_api", views.nbp_api, name="nbp_api"),
    path("types", views.currency_types, name="types"),
    path("types/<int:id>/", views.currency_type, name="type"),

    path("types_cv/", views.CurrencyClassView.as_view(), name="type_cv"),
]
