from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.core import serializers
from .models import Calendar, Student, Professor, Subject, Student_lecture

from django.contrib.auth.hashers import make_password, check_password

# 메인 홈페이지 리턴
def index(request):
    return render(request, "index.html")


def calendar(request):
    return render(request, "calendar.html")


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
            userName = "1"  # 더미데이터로 변수 생성
            userType = "1"  # 더미데이터로 변수 생성
            try:
                user_data = Student.objects.get(userID=userID)
                userName = user_data.username
                userType = "student"
            except Student.DoesNotExist:
                try:
                    user_data = Professor.objects.get(userID=userID)
                    userName = user_data.username
                    userType = "professor"
                except Professor.DoesNotExist:
                    return render(request, "login.html", {"error": "아이디가 존재하지 않습니다."})

            if check_password(password, user_data.password):
                request.session["userID"] = userID
                request.session["userName"] = userName
                request.session["userType"] = userType
                request.session["email"] = user_data.email
                return redirect("/toast_cal/")
            else:
                return render(request, "login.html", {"error": "비밀번호가 일치하지 않습니다."})
    else:
        return render(request, "login.html")


# 로그아웃
def logout(request):
    request.session.pop("userID")
    request.session.pop("userName")
    request.session.pop("userType")
    request.session.pop("email")

    return redirect("login")


# 아이디 / 비밀번호 찾는 페이지
def findInfo(request):
    return render(request, "findInfo.html")


# 아이디 찾기
def findId(request):
    if request.method == "POST":
        userType = request.POST["userType"]
        username = request.POST["username"]
        department = request.POST["department"]
        phone = request.POST["phone"]

        if userType == "student":
            try:
                user_data = Student.objects.get(
                    username=username, department=department, phone=phone
                )
                return render(
                    request,
                    "getMessage.html",
                    {"message": user_data.userID, "sep": "findId"},
                )
            except Student.DoesNotExist:
                return render(
                    request,
                    "getMessage.html",
                    {"message": "일치하는 아이디가 없습니다.", "log_sep": "false"},
                )
        elif userType == "professor":
            try:
                user_data = Professor.objects.get(
                    username=username, department=department, phone=phone
                )
                return render(
                    request,
                    "getMessage.html",
                    {"message": user_data.userID, "sep": "findId"},
                )
            except Professor.DoesNotExist:
                return render(
                    request,
                    "getMessage.html",
                    {"message": "일치하는 아이디가 없습니다.", "log_sep": "false"},
                )

    return render(request, "findId.html")


# 비밀번호 찾기
def findPass(request):
    if request.method == "POST":
        userType = request.POST["userType"]
        userID = request.POST["userID"]
        username = request.POST["username"]
        department = request.POST["department"]

        if userType == "student":
            try:
                user_data = Student.objects.get(
                    pk=userID, username=username, department=department
                )
                update = Student.objects.filter(
                    pk=userID, username=username, department=department
                ).update(
                    department=user_data.department,
                    studentID=user_data.studentID,
                    username=user_data.username,
                    email=user_data.email,
                    password=make_password(user_data.userID),
                    phone=user_data.phone,
                )
                return render(
                    request,
                    "getMessage.html",
                    {"message": "임시 비밀번호로 변경합니다.(비밀번호는 ID와 일치)", "log_sep": "false"},
                )
            except Student.DoesNotExist:
                return render(
                    request,
                    "getMessage.html",
                    {"message": "데이터가 일치하지 않습니다.", "log_sep": "false"},
                )
        elif userType == "professor":
            try:
                user_data = Professor.objects.get(
                    pk=userID, username=username, department=department
                )
                update = Professor.objects.filter(
                    pk=userID, username=username, department=department
                ).update(
                    department=user_data.department,
                    username=user_data.username,
                    email=user_data.email,
                    password=make_password(user_data.userID),
                    phone=user_data.phone,
                )
                return render(
                    request,
                    "getMessage.html",
                    {"message": "임시 비밀번호로 변경합니다.(비밀번호는 ID와 일치)", "log_sep": "false"},
                )
            except Professor.DoesNotExist:
                return render(
                    request,
                    "getMessage.html",
                    {"message": "데이터가 일치하지 않습니다.", "log_sep": "false"},
                )

    return render(request, "findPass.html")


# 비밀번호 변경
def changePw(request):
    if request.method == "POST":
        userType = request.POST["userType"]
        userID = request.POST["userID"]
        password = request.POST["password"]
        password2 = request.POST["password2"]
        password2_check = request.POST["password2_check"]

        if userType == "student":

            user_data = Student.objects.get(pk=userID)

            if check_password(password, user_data.password):
                if password2 == password2_check:
                    try:
                        update = Student.objects.filter(pk=userID).update(
                            department=user_data.department,
                            studentID=user_data.studentID,
                            username=user_data.username,
                            email=user_data.email,
                            password=make_password(password2),
                            phone=user_data.phone,
                        )
                        if request.session._session:
                            request.session.pop("userID")
                            request.session.pop("userName")
                            request.session.pop("userType")
                            request.session.pop("email")

                        return render(
                            request,
                            "getMessage.html",
                            {"message": "비밀번호가 변경되었습니다.", "sep": "changePw"},
                        )
                    except Student.DoesNotExist:
                        return render(
                            request,
                            "getMessage.html",
                            {"message": "잘못입력된 값이 있습니다.", "sep": "changePw"},
                        )
                else:
                    return render(
                        request,
                        "getMessage.html",
                        {"message": "새로입력한 비밀번호가 일치하지않습니다.", "sep": "changePw"},
                    )
            else:
                return render(
                    request,
                    "getMessage.html",
                    {"message": "비밀번호가 다릅니다.", "sep": "changePw"},
                )

        elif userType == "professor":

            user_data = Professor.objects.get(pk=userID)

            if check_password(password, user_data.password):
                if password2 == password2_check:
                    try:
                        update = Professor.objects.filter(pk=userID).update(
                            department=user_data.department,
                            username=user_data.username,
                            email=user_data.email,
                            password=make_password(password2),
                            phone=user_data.phone,
                        )
                        if request.session._session:
                            request.session.pop("userID")
                            request.session.pop("userName")
                            request.session.pop("userType")
                            request.session.pop("email")

                        return render(
                            request,
                            "getMessage.html",
                            {"message": "비밀번호가 변경되었습니다.", "sep": "changePw"},
                        )
                    except Professor.DoesNotExist:
                        return render(
                            request,
                            "getMessage.html",
                            {"message": "잘못입력된 값이 있습니다.", "sep": "changePw"},
                        )
                else:
                    return render(
                        request,
                        "getMessage.html",
                        {"message": "새로입력한 비밀번호가 일치하지않습니다.", "sep": "changePw"},
                    )
            else:
                return render(
                    request,
                    "getMessage.html",
                    {"message": "비밀번호가 다릅니다.", "sep": "changePw"},
                )
    else:
        return render(request, "changePw.html")


# 개인정보 관리 페이지
def manageInfo(request):
    return render(request, "manageInfo.html")


# 로그인 정보 받아오는 기능 수행
def loginInfo(request):
    if request.session._session:
        userType = request.session["userType"]
        userID = request.session["userID"]
    else:
        return render(
            request, "getMessage.html", {"message": "로그인 정보가 없습니다.", "log_sep": "true"}
        )

    if userType == "student":
        user_data = Student.objects.get(pk=userID)

        return render(
            request,
            "modifyInfo.html",
            {
                "department": user_data.department,
                "studentID": user_data.studentID,
                "username": user_data.username,
                "email": user_data.email,
                "phone": user_data.phone,
            },
        )
    elif userType == "professor":
        user_data = Professor.objects.get(pk=userID)

        return render(
            request,
            "modifyInfo.html",
            {
                "department": user_data.department,
                "username": user_data.username,
                "email": user_data.email,
                "phone": user_data.phone,
            },
        )


# 개인정보 변경
def modifyInfo(request):
    if request.method == "POST":
        userType = request.session["userType"]
        userID = request.session["userID"]
        username = request.POST["username"]
        department = request.POST["department"]
        studentID = request.POST["studentID"]
        email = request.POST["email"]
        phone = request.POST["phone"]

        if userType == "student":
            try:
                user_data = Student.objects.get(pk=userID)
                update = Student.objects.filter(pk=userID).update(
                    department=department,
                    studentID=studentID,
                    username=username,
                    email=email,
                    password=user_data.password,
                    phone=phone,
                )

                return render(
                    request,
                    "getMessage.html",
                    {"message": "개인정보가 변경되었습니다.", "log_sep": "true"},
                )
            except Exception:
                return render(
                    request, "getMessage.html", {"message": "수정 에러", "log_sep": "true"}
                )
        elif userType == "professor":
            try:
                user_data = Professor.objects.get(pk=userID)
                update = Professor.objects.filter(pk=userID).update(
                    department=department,
                    username=username,
                    email=email,
                    password=user_data.password,
                    phone=phone,
                )

                return render(
                    request,
                    "getMessage.html",
                    {"message": "개인정보가 변경되었습니다.", "log_sep": "true"},
                )
            except Exception:
                return render(
                    request, "getMessage.html", {"message": "수정 에러", "log_sep": "true"}
                )

    return render(request, "modifyInfo.html")


# 회원탈퇴
def signout(request):
    if request.method == "POST":
        userType = request.session["userType"]
        userID = request.session["userID"]
        userName = request.session["userName"]

        confirm = request.POST["confirm"]

        if confirm == "탈퇴합니다":
            if userType == "student":
                cal_del = Calendar.objects.filter(userID=userID)
                cal_del.delete()
                lec_del = Student_lecture.objects.filter(student_id=userID)

                for i in range(lec_del.count()):
                    code = lec_del[i].code
                    codeClass = lec_del[i].codeClass

                    update_count = Subject.objects.get(code=code, codeClass=codeClass)
                    update_count.stdCount -= 1
                    update_count.save()

                lec_del.delete()
                std_del = Student.objects.filter(userID=userID)
                std_del.delete()

                # vote 테이블에 대한 처리 필요

                request.session.pop("userID")
                request.session.pop("userName")
                request.session.pop("userType")
                request.session.pop("email")
            elif userType == "professor":
                cal_Pdel = Calendar.objects.filter(userID=userID)
                lec_del = Student_lecture.objects.filter(professor=userName)

                for i in range(lec_del.count()):
                    for j in range(cal_Pdel.count()):
                        cal_Sdel = Calendar.objects.filter(
                            userID=lec_del[i].student_id,
                            start=cal_Pdel[j].start,
                            end=cal_Pdel[j].end,
                        )
                        cal_Sdel.delete()

                cal_Pdel.delete()
                sub_del = Subject.objects.filter(professor=userName)
                sub_del.delete()
                lec_del.delete()
                pro_del = Professor.objects.filter(userID=userID)
                pro_del.delete()

                # vote 테이블에 대한 처리 필요

                request.session.pop("userID")
                request.session.pop("userName")
                request.session.pop("userType")
                request.session.pop("email")

            return render(
                request, "getMessage.html", {"message": "회원탈퇴 되었습니다.", "sep": "signout"}
            )
        else:
            return render(
                request,
                "getMessage.html",
                {"message": "잘못 입력하였습니다.", "log_sep": "true"},
            )

    return render(request, "signout.html")
