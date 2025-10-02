from rest_framework import routers, serializers, viewsets
from .models import Currency,Country

class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields ="__all__"
        #fields = ['id', 'code', 'name']

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields ="__all__"
        #fields = ['id', 'code', 'name']