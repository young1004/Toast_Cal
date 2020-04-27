from django.db import models

# Create your models here.
class Calendar(models.Model):
    userID = models.CharField(max_length=30, default="none")  # session값
    calendar = models.CharField(max_length=30)  # calendarID
    title = models.CharField(max_length=30)
    location = models.CharField(max_length=30)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    isAllDay = models.BooleanField(default=False)
    state = models.CharField(max_length=30, default="Busy")
    # state only "Busy", "Free"
    calendarClass = models.CharField(max_length=30, default="public")
    # class only "public", "private"

    def __str__(self):
        return self.title
