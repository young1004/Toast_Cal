from django.http import HttpResponse
from django.core import serializers
from .models import Calendar

# ajax로 들어온 데이터를 db에 ORM사용 저장
def createData(request):
    if request.method == "POST":
        new_instance = Calendar.objects.create(
            userID=request.session["userID"],
            calendarId=request.POST["calendarId"],
            title=request.POST["title"],
            category=request.POST["category"],
            location=request.POST["location"],
            start=request.POST["start"],
            end=request.POST["end"],
            isAllDay=request.POST["isAllDay"],
            state=request.POST["state"],
            calendarClass=request.POST["class"],
        )
        new_instance.save()

        return HttpResponse(new_instance.id)


# ajax로 들어온 데이터를 db에 ORM사용 수정
def updateData(request):
    if request.method == "POST":
        update = Calendar.objects.filter(pk=request.POST["id"]).update(
            calendarId=request.POST["calendarId"],
            title=request.POST["title"],
            category=request.POST["category"],
            location=request.POST["location"],
            start=request.POST["start"],
            end=request.POST["end"],
            isAllDay=request.POST["isAllDay"],
            state=request.POST["state"],
            calendarClass=request.POST["class"],
        )
        return HttpResponse(1)


# ajax로 들어온 pk값으로 데이터 삭제
def deleteData(request):
    if request.method == "POST":
        query = Calendar.objects.get(pk=request.POST["id"])
        query.delete()
        # 더미데이터로 응답
        return HttpResponse(1)
