from django.http import HttpResponse
from django.core import serializers
from .models import *


# 서버에서 ajax로 일정 보내주는 함수
def ourstores(request):
    stores_list = Calendar.objects.filter(userID=request.session["userID"])

    return HttpResponse(
        serializers.serialize("json", stores_list), content_type="application/json"
    )


# calendar 초기세팅 데이터 보내주는 함수
def calSetData(request):
    calData = CalID.objects.all()

    return HttpResponse(
        serializers.serialize("json", calData), content_type="application/json"
    )


# ajax로 들어온 데이터를 db에 ORM사용 저장
def createData(request):
    if request.method == "POST":
        new_instance = Calendar.objects.create(
            userID=request.session["userID"],
            calendarId_id=request.POST["calendarId"],
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
            calendarId_id=request.POST["calendarId"],
            title=request.POST["title"],
            category=request.POST["category"],
            location=request.POST["location"],
            start=request.POST["start"],
            end=request.POST["end"],
            isAllDay=request.POST["isAllDay"],
            state=request.POST["state"],
            calendarClass=request.POST["class"],
        )
        # 더미데이터로 응답
        return HttpResponse(1)


# ajax로 들어온 pk값으로 데이터 삭제
def deleteData(request):
    if request.method == "POST":
        query = Calendar.objects.get(pk=request.POST["id"])
        query.delete()
        # 더미데이터로 응답
        return HttpResponse(1)


# 학생 기능
# 왼쪽 사이드바 체크시 데이터를 보내줌
def checked(request):
    if request.method == "POST":
        checked_list = Calendar.objects.filter(
            userID=request.session["userID"], calendarId=request.POST["checked"]
        )

    return HttpResponse(
        serializers.serialize("json", checked_list), content_type="application/json"
    )


# 메뉴
# 강의 버튼 클릭시 학과 데이터 반환
def department(request):
    department_list = Department.objects.all().order_by("name")

    return HttpResponse(
        serializers.serialize("json", department_list), content_type="application/json"
    )


# 학과 선택시 해당 과목반환
def subject(request):
    subject_list = Subject.objects.filter(
        department=request.POST.get("name", None)
    ).order_by("name")

    return HttpResponse(
        serializers.serialize("json", subject_list), content_type="application/json"
    )


# 과목 선택시 해당 이수구분 반환
def chanege_type(request):
    lecture_type = Subject.objects.filter(name=request.POST.get("name", None))

    return HttpResponse(
        serializers.serialize("json", lecture_type), content_type="application/json"
    )


# 조회 버튼
def lecture_lookup(request):
    if request.method == "POST":
        department = request.POST.get("department")
        subject = request.POST.get("subject")
        lecture_type = request.POST.get("lecture_type")
        if subject == "전체":
            if lecture_type == "일반교양" or lecture_type == "전체":
                subject = Subject.objects.filter(department=department)

                return HttpResponse(
                    serializers.serialize("json", subject),
                    content_type="application/json",
                )
            else:
                subject = Subject.objects.filter(
                    department=department, lecture_type=lecture_type
                )

                return HttpResponse(
                    serializers.serialize("json", subject),
                    content_type="application/json",
                )
        else:
            if lecture_type == "일반교양" or lecture_type == "전체":
                subject = Subject.objects.filter(department=department, name=subject)

                return HttpResponse(
                    serializers.serialize("json", subject),
                    content_type="application/json",
                )
            else:
                subject = Subject.objects.filter(
                    department=department, name=subject, lecture_type=lecture_type
                )

                return HttpResponse(
                    serializers.serialize("json", subject),
                    content_type="application/json",
                )


# 과목 저장
def lecture_save(request):
    if request.method == "POST":
        for data in range(int(len(request.POST) / 6)):
            flag = Student_lecture.objects.filter(
                student_id=request.session["userID"],
                code=request.POST["data[" + str(data) + "][code]"],
            ).exists()
            if flag:
                print("중복된 데이터입니다.")
            else:
                new_instance = Student_lecture.objects.create(
                    student_id=request.session["userID"],
                    code=request.POST["data[" + str(data) + "][code]"],
                    department=request.POST["data[" + str(data) + "][department]"],
                    lecture_type=request.POST["data[" + str(data) + "][lecture_type]"],
                    name=request.POST["data[" + str(data) + "][name]"],
                    professor=request.POST["data[" + str(data) + "][professor]"],
                    period=request.POST["data[" + str(data) + "][period]"],
                )
        return HttpResponse("저장 완료!!")


# 교수 기능
# ajax로 필터링하여 table 생성할 값 반환
def voteTable(request):
    stores_list = Vote.objects.filter(
        lecture_type=request.POST["lecture_type"],
        vote_status=request.POST["vote_status"],
    )

    return HttpResponse(
        serializers.serialize("json", stores_list), content_type="application/json"
    )


# ajax로 필터링하여 chart를 만들기 위한 값 반환
def voteChart(request):
    stores_list = Vote.objects.filter(code=request.POST["code"])

    return HttpResponse(
        serializers.serialize("json", stores_list), content_type="application/json"
    )
