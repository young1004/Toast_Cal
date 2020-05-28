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
        flag = Student_lecture.objects.filter(
            student_id=request.session["userID"], code=request.POST["code"],
        ).exists()
        if flag:
            return HttpResponse("중복된 데이터입니다. 수강 강의를 확인하세요.")
        else:
            new_instance = Student_lecture.objects.create(
                student_id=request.session["userID"],
                code=request.POST["code"],
                department=request.POST["department"],
                lecture_type=request.POST["lecture_type"],
                codeClass=request.POST["codeClass"],
                name=request.POST["name"],
                professor=request.POST["professor"],
                period=request.POST["period"],
            )
            return HttpResponse("저장 성공")


# 학생 강의 불러오기
def student_lecture_load(request):
    if request.method == "POST":
        date_list = Student_lecture.objects.filter(student_id=request.session["userID"])
        return HttpResponse(
            serializers.serialize("json", date_list), content_type="application/json"
        )


# 학생 강의 삭제
def student_lecture_delete(request):
    if request.method == "POST":
        for data in range(int(len(request.POST) / 7)):
            query = Student_lecture.objects.get(
                student_id=request.session["userID"],
                code=request.POST["data[" + str(data) + "][code]"],
            )
            query.delete()
        date_list = Student_lecture.objects.all()
        return HttpResponse(
            serializers.serialize("json", date_list), content_type="application/json"
        )


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


# ajax로 들어온 데이터로 강의 개설
def makeSubject(request):
    # print("---------makeSubject--------------------------")
    # print(request.POST)
    makedData = Subject.objects.create(
        name=request.POST["name"],
        code=request.POST["code"],
        codeClass=request.POST["codeClass"],
        professor=request.session["userName"],
        period=request.POST["period"],
        lecture_type=request.POST["lecture_type"],
        department=request.POST["department"],
        stdCount=0,
    )
    makedData.save()

    createdData = Subject.objects.filter(id=makedData.id)

    # print("---------makeSubject--------------------------")
    return HttpResponse(
        serializers.serialize("json", createdData), content_type="application/json"
    )


# ajax로 들어온 데이터들로 calendar DB에 저장
def makeCalendars(request):
    # print("-----------makeCalendars--------------")
    # print(request.POST)

    for i in range(int(len(request.POST) / 10)):
        new_instance = Calendar.objects.create(
            userID=request.session["userID"],
            calendarId=request.POST["scheduleData[" + str(i) + "][calendarId]"],
            title=request.POST["scheduleData[" + str(i) + "][title]"],
            category=request.POST["scheduleData[" + str(i) + "][category]"],
            location=request.POST["scheduleData[" + str(i) + "][location]"],
            start=request.POST["scheduleData[" + str(i) + "][start]"],
            end=request.POST["scheduleData[" + str(i) + "][end]"],
            isAllDay=request.POST["scheduleData[" + str(i) + "][isAllDay]"],
            state=request.POST["scheduleData[" + str(i) + "][state]"],
            calendarClass=request.POST["scheduleData[" + str(i) + "][class]"],
        )

    # print("-----------makeCalendars--------------")

    return HttpResponse("강의 일정 저장 완료!")


# 공통 기능
# right nav 부분 ajax 통신
def dateList(request):
    if request.method == "POST":

        date_list = Calendar.objects.filter(
            userID=request.session["userID"],
            start__startswith=request.POST["todayData"],
            end__startswith=request.POST["todayData"],
        )
    return HttpResponse(
        serializers.serialize("json", date_list), content_type="application/json"
    )

def getWeekSchedule(request):
    if request.method == "POST":
        date_list = Calendar.objects.filter(
            userID=request.session["userID"],
            start__range=[request.POST["StartDate"], request.POST["EndDate"]]
        ).order_by('start')

    return HttpResponse(
        serializers.serialize("json", date_list), content_type="application/json"
    )