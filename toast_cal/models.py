from django.db import models


# id: a,
# calendarId: 'Major Subject',
# title: '자료구조론',
# category: 'time', // 일반 일정
# start: '2020-04-20T10:00:00',
# end: '2020-04-20T11:00:00'
class Timetable(models.Model):
    calendarId = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    start = models.DateTimeField()
    end = models.DateTimeField()


# Create your models here.
class Calendar(models.Model):
    calendar = models.CharField(max_length=30)
    title = models.CharField(max_length=30)
    location = models.CharField(max_length=30)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    def __str__(self):
        return self.title
