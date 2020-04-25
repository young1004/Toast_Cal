from django.shortcuts import render, redirect
from django.http import HttpResponse  # , JsonResponse
from django.core import serializers
from .models import Calendar
from django.views.decorators.csrf import csrf_exempt

from django.contrib.auth.models import User
from django.contrib import auth
from django.contrib.auth import login, authenticate

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
@csrf_exempt
def updateData(request):
    if request.method == "POST":
        update = Calendar.objects.filter(pk=request.POST["id"]).update(
            calendar=request.POST["calendarId"],
            title=request.POST["title"],
            location=request.POST["location"],
            start_date=request.POST["start_date"],
            end_date=request.POST["end_date"],
            isAllDay=request.POST["isAllDay"],
            state=request.POST["state"],
            calendarClass=request.POST["class"],
        )
        return HttpResponse(1, content_type="application/json")


# ajax로 들어온 pk값으로 데이터 삭제
@csrf_exempt
def deleteData(request):
    if request.method == "POST":
        query = Calendar.objects.get(pk=request.POST["id"])
        query.delete()
        # 더미데이터로 응답
        return HttpResponse(100, content_type="application/json")


# 회원가입 페이지
def signup(request):
    if request.method == "POST":
        if request.POST["password1"] == request.POST["password2"]:
            user = User.objects.create_user(
                username=request.POST["username"],
                password=request.POST["password1"],
                email=request.POST["email"],
            )
            auth.login(request, user)

            return redirect("login")
        return render(request, "signup.html")
    return render(request, "signup.html")


# 로그인 페이지
def login(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]
        user = auth.authenticate(request, username=username, password=password)

        if user is not None:
            auth.login(request, user)
            request.session["username"] = username
            request.session["password"] = password

            return redirect("/toast_cal/")
        else:
            return render(
                request, "login.html", {"error": "username or password is incorrent"}
            )
    else:
        return render(request, "login.html")


# 로그아웃
def logout(request):
    auth.logout(request)
    return redirect("login")
