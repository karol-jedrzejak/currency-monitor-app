from rest_framework import routers, serializers, viewsets
from .models import Currency,Country,UserCurrencyTransaction
from .nbp_service import get_nbp_rates

class StockPredictionSerializer(serializers.Serializer):
    ticker = serializers.CharField(max_length=20)

class SimpleCurrencySerializer(serializers.ModelSerializer):
    rate = serializers.SerializerMethodField()

    class Meta:
        model = Currency
        fields = ['id', 'name', 'code', 'table', 'rate']

    def get_rate(self, obj):
        if not hasattr(self, "_rates_cache"):
            self._rates_cache = get_nbp_rates()
        return self._rates_cache.get(obj.code)

class CountrySerializer(serializers.ModelSerializer):
    currencies = SimpleCurrencySerializer(many=True, read_only=True)
    class Meta:
        model = Country
       # fields ="__all__"
        fields = ['id', 'name','currencies','official_name','flag','region','ccn3']

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
    
class CurrencyIdSerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = ['id', 'name', 'code']

class UserCurrencyTransactionSerializer(serializers.ModelSerializer):
    currency = CurrencyIdSerializer(read_only=True)

    class Meta:
        model = UserCurrencyTransaction
        fields = ['id', 'currency', 'user','amount', 'created_at']


class UserCurrencyTransactionSumSerializer(serializers.Serializer):
    currency = CurrencyIdSerializer()
    total_amount = serializers.DecimalField(max_digits=20, decimal_places=2)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["total_amount"] = float(data["total_amount"])
        return data