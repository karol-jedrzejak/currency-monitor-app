from django.db import models

# Create your models here.

class Currency(models.Model):
    name = models.CharField(max_length=100, blank=False, unique=True)
    code = models.CharField(max_length=4, blank=False, unique=True)
    flag = models.URLField(max_length=200, blank=False)
    
    def __self__(self):
        return f"{self.name} [{self.code}]"