from django.db import models

# Create your models here.
class Calendar(models.Model):
    calendar = models.CharField(max_length=30)
    title = models.CharField(max_length=30)
    location = models.CharField(max_length=30)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    isAllDay = models.BooleanField(default=False)
    state = models.CharField(max_length=30, default="Busy")
    calendarClass = models.CharField(max_length=30, default="public")

    def __str__(self):
        return self.title
