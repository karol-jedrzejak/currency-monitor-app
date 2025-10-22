from rest_framework import routers, serializers, viewsets
from .models import Currency,Country
from .nbp_service import get_nbp_rates


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields ="__all__"
        #fields = ['id', 'code', 'name']

class CurrencySerializer(serializers.ModelSerializer):
    countries = CountrySerializer(many = True, read_only = True)
    rate = serializers.SerializerMethodField()
    class Meta:
        model = Currency
        #fields ="__all__"
        fields = ['id', 'name', 'code', 'table','countries','rate']
    
    
    def get_rate(self, obj):
        """
        Zwraca kurs waluty z NBP API na podstawie pola 'code'.
        """
        # Aby uniknąć wielokrotnych zapytań, cache'ujemy wynik na poziomie serializera
        if not hasattr(self, "_rates_cache"):
            self._rates_cache = get_nbp_rates()
        return self._rates_cache.get(obj.code)