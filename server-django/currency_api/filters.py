import django_filters
from django.db.models import Q
from .models import Currency

class CurrencyFilter(django_filters.FilterSet):
    table = django_filters.CharFilter(field_name='table')
    """ name = django_filters.CharFilter(field_name='name', lookup_expr="icontains", method='name_or_code') """
    name = django_filters.CharFilter(method='name_or_code')
    orderBy = django_filters.OrderingFilter(fields=(
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