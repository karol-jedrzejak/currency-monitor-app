from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Country(models.Model):
    REGION_CHOICES = {
        "EUR":"Europe",
        "AME":"Americas",
        "AFR":"Africa",
        "ASI":"Asia",
        "OCE":"Oceania",
        "ANT":"Antarctic",
    }
    name = models.CharField(max_length=100, blank=False, unique=True)
    official_name = models.CharField(max_length=300, blank=False, unique=True)
    flag = models.URLField(max_length=200, blank=False)
    region = models.CharField(
        max_length=3,
        choices=REGION_CHOICES,
        default="EUR",
    )
    ccn3 = models.CharField(max_length=3, blank=False, unique=True)
    
    def __self__(self):
        return f"{self.name} [{self.official_name}]"
    
class Currency(models.Model):
    name = models.CharField(max_length=100, blank=False, unique=True)
    code = models.CharField(max_length=4, blank=False, unique=True)
    table = models.CharField(max_length=1, blank=False, default="A")
    countries = models.ManyToManyField(Country,related_name="currencies")
    def __self__(self):
        return f"{self.name} [{self.code}]"


class UserCurrencyTransaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="currency_transactions")
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE, related_name="transactions")
    amount = models.DecimalField(max_digits=20, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        sign = '+' if self.amount >= 0 else '-'
        return f"{self.user.username}: {sign}{self.amount} {self.currency.code} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"
