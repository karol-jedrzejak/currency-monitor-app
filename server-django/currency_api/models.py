from django.db import models

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
    countries = models.ManyToManyField(Country)
    def __self__(self):
        return f"{self.name} [{self.code}]"
    

"""
                "id": 1,
            "name": "Lithuania",
            "official_name": "Republic of Lithuania",
            "flag": "https://flagcdn.com/lt.svg",
            "region": "Europe",
            "ccn3": "440"


                    {
            "currency": "bat (Tajlandia)",
            "code": "THB",
            "table": "B",
            "countries": [
                206
            ]
        },

"""
