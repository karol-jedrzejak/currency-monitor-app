from django.contrib import admin
from .models import Currency,Country

# Register your models here.
@admin.register(Currency)

class CurrencyAdmin(admin.ModelAdmin):
    fields = ["name", "code", "table","countries"] # Specify fields to be displayed in the admin form
    list_display = ["id","name", "code", "table"]    # Fields to be displayed in the admin list view
    list_filter = ["name","code", "table"]   # Filters available in the admin list view
    search_fields = ["name", "code", "table"]    # Fields to be searchable in the admin interface

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    fields = ["name", "official_name", "flag","region","ccn3"] # Specify fields to be displayed in the admin form
    list_display = ["id","name", "official_name", "flag","region","ccn3"]    # Fields to be displayed in the admin list view
    list_filter = ["name", "official_name", "flag","region","ccn3"]   # Filters available in the admin list view
    search_fields = ["name", "official_name", "flag","region","ccn3"]    # Fields to be searchable in the admin interface