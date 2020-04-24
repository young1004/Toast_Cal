from django.shortcuts import render
from django.http import HttpResponse  # , JsonResponse
from django.core import serializers
from .models import Calendar
from django.views.decorators.csrf import csrf_exempt

# 메인 홈페이지 리턴
def index(request):
    print(request.POST)
    return render(request, "index.html")


# 서버에서 ajax로 일정 보내주는 뷰
def ourstores(request):
    stores_list = Calendar.objects.all()

    stores_list_json = serializers.serialize("json", stores_list)

    return HttpResponse(stores_list_json, content_type="application/json")


# ajax로 들어온 데이터를 db에 ORM사용 저장
@csrf_exempt
def createData(request):
    if request.method == "POST":
        new_instance = Calendar.objects.create(
            calendar=request.POST["calendar"],
            title=request.POST["title"],
            location=request.POST["location"],
            start_date=request.POST["start_date"],
            end_date=request.POST["end_date"],
            isAllDay=request.POST["isAllDay"],
            state=request.POST["state"],
            calendarClass=request.POST["class"],
        )
        new_instance.save()

        return HttpResponse(new_instance.id, content_type="application/json")


# ajax로 들어온 데이터를 db에 ORM사용 수정
# @csrf_exempt
# def updateData(request):
#     if request.method == "POST":

#         return HttpResponse(update_instance, content_type="application/json")


# ajax로 들어온 pk값으로 데이터 삭제
@csrf_exempt
def deleteData(request):
    if request.method == "POST":
        query = Calendar.objects.get(pk=request.POST["id"])
        query.delete()
        # 더미데이터로 응답
        return HttpResponse(100, content_type="application/json")
