from django.contrib import admin
from .models import Currency

# Register your models here.
@admin.register(Currency)

class CurrencyAdmin(admin.ModelAdmin):
    fields = ["name", "code", "flag"] # Specify fields to be displayed in the admin form
    list_display = ["id","name", "code", "flag"]    # Fields to be displayed in the admin list view
    list_filter = ["name","code"]   # Filters available in the admin list view
    search_fields = ["name", "code"]    # Fields to be searchable in the admin interface