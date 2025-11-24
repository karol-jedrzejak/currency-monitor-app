import django_filters
from django.db.models import Q
from .models import Currency,UserCurrencyTransaction

class CurrencyFilter(django_filters.FilterSet):
    table = django_filters.CharFilter(field_name='table')
    name = django_filters.CharFilter(method='name_or_code')
    order_by = django_filters.OrderingFilter(fields=(
            ('name', 'name'),
            ('code', 'code'),
            ('table', 'table'),
        ),)

    id_min = django_filters.CharFilter(method="filter_by_id_range",label="From start ID:")
    id_max = django_filters.CharFilter(method="filter_by_id_range",label="To end ID:")
    
    class Meta:
        model = Currency
        fields = ["table","name","id_min","id_max"]
    
    def filter_by_id_range(self, queryset, name, value):
        if name=='id_min':
            return queryset.filter(id__gte=value)
        if name=='id_max':
            return queryset.filter(id__lte=value)
        
    def name_or_code(self, queryset, name, value):
        return queryset.filter(
            Q(name__icontains=value) | Q(code__icontains=value)
        )

class UserCurrencyFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(method='name_or_code')
    order_by = django_filters.OrderingFilter(
        fields=(
            ('created_at', 'created_at'),
            ('currency__name', 'currency_name'),
            ('currency__code', 'currency_code'),
        )
    )

    class Meta:
        model = UserCurrencyTransaction
        fields = ["name"]
    
    def name_or_code(self, queryset, name, value):
        return queryset.filter(
            Q(currency__name__icontains=value) | Q(currency__code__icontains=value)
        )