from rest_framework import routers, serializers, viewsets
from .models import Currency

class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields ="__all__"
        #fields = ['id', 'code', 'name']