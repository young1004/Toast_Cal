from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.core import serializers
from .models import Calendar, Student, Professor

from django.contrib.auth.hashers import make_password, check_password

# 메인 홈페이지 리턴
def index(request):
    return render(request, "index.html")


# 서버에서 ajax로 일정 보내주는 뷰 (수정)
def ourstores(request):
    stores_list = Calendar.objects.filter(userID=request.session["userID"])

    stores_list_json = serializers.serialize("json", stores_list)

    return HttpResponse(stores_list_json, content_type="application/json")


# 회원가입과 로그인 기능에서 Student, Professor 조건문으로 분기
# 회원가입 페이지
def signup(request):
    if request.method == "POST":
        userType = request.POST["userType"]
        userID = request.POST["userID"]
        password = request.POST["password"]
        password_check = request.POST["password_check"]

        if password == password_check:
            if userType == "student":
                user_data = Student(
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
            elif userType == "professor":
                user_data = Professor(
                    userID=userID,
                    password=make_password(password),
                    username=request.POST["username"],
                    department=request.POST["department"],
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
            user_data = "1"  # 더미데이터로 변수 생성
            userType = "1"  # 더미데이터로 변수 생성
            try:
                user_data = Student.objects.get(userID=userID)
                userType = "student"
            except Student.DoesNotExist:
                user_data = Professor.objects.get(userID=userID)
                userType = "professor"

            if check_password(password, user_data.password):
                request.session["userID"] = userID
                request.session["userType"] = userType
                return redirect("/toast_cal/")
            else:
                return render(request, "login.html", {"error": "비밀번호를 틀렸습니다."})
    else:
        return render(request, "login.html")


# 로그아웃
def logout(request):
    request.session.pop("userID")
    request.session.pop("userType")

    return redirect("login")
