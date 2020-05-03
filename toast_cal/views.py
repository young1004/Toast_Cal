from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.core import serializers
from .models import Calendar, Users

from django.contrib.auth.hashers import make_password, check_password

# 메인 홈페이지 리턴
def index(request):
    return render(request, "index.html")


# 서버에서 ajax로 일정 보내주는 뷰 (수정)
def ourstores(request):
    stores_list = Calendar.objects.filter(userID=request.session["userID"])

    stores_list_json = serializers.serialize("json", stores_list)

    return HttpResponse(stores_list_json, content_type="application/json")


# 회원가입 페이지
def signup(request):
    if request.method == "POST":
        userID = request.POST["userID"]
        password = request.POST["password"]
        password_check = request.POST["password_check"]

        if password == password_check:
            user_data = Users(
                userID=userID,
                password=make_password(password),
                username=request.POST["username"],
                department=request.POST["department"],
                studentID=request.POST["studentID"],
                email=request.POST["email"],
                phone=request.POST["phone"],
            )
            user_data.save()

            return redirect("login")
        return render(request, "signup.html")
    return render(request, "signup.html")


# 로그인 페이지
def login(request):
    if request.method == "POST":
        userID = request.POST.get("userID", None)
        password = request.POST.get("password", None)

        if not (userID and password):
            return render(request, "login.html", {"error": "아이디와 비밀번호를 모두 입력해주세요."})
        else:
            user_data = Users.objects.get(userID=userID)
            if check_password(password, user_data.password):
                request.session["userID"] = userID
                return redirect("/toast_cal/")
            else:
                return render(request, "login.html", {"error": "비밀번호를 틀렸습니다."})
    else:
        return render(request, "login.html")


# 로그아웃
def logout(request):
    request.session.pop("userID")

    return redirect("login")
