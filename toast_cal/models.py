from django.db import models

# Create your models here.
class Calendar(models.Model):
    calendar = models.CharField(max_length=30)
    title = models.CharField(max_length=30)
    location = models.CharField(max_length=30)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    def __str__(self):
        return self.title
