from rest_framework import routers, serializers, viewsets
from .models import Currency,Country

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields ="__all__"
        #fields = ['id', 'code', 'name']

class CurrencySerializer(serializers.ModelSerializer):
    countries = CountrySerializer(many = True, read_only = True)
    class Meta:
        model = Currency
        fields ="__all__"
        #fields = ['id', 'code', 'name']