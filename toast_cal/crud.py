from django.http import HttpResponse
from django.core import serializers
from .models import *
from django.db.models.aggregates import Count


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
# 학과 데이터 반환
def department(request):
    if request.session["userType"] == "student":
        department_list = Department.objects.all().order_by("name")
    elif request.session["userType"] == "professor":
        pro_department = Professor.objects.get(
            userID=request.session["userID"]
        ).department
        # print(pro_department)
        department_list = Department.objects.filter(name=pro_department).order_by(
            "name"
        )

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
        boolean_name = Student_lecture.objects.filter(
            student_id=request.session["userID"], name=request.POST["name"],
        ).exists()

        request_period = request.POST["period"].split()
        first_period = Student_lecture.objects.filter(
            student_id=request.session["userID"], period__icontains=request_period[0]
        ).exists()
        second_period = Student_lecture.objects.filter(
            student_id=request.session["userID"], period__icontains=request_period[1]
        ).exists()
        Count = Subject.objects.get(
            code=request.POST["code"], codeClass=request.POST["codeClass"]
        )

        if Count.stdCount < Count.total_stdCount:
            if boolean_name or first_period or second_period:
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
                obj = Subject.objects.get(code=new_instance.code)
                obj.stdCount += 1
                obj.save()
                return HttpResponse("저장 성공")
        else:
            return HttpResponse("수강 인원이 초과된 과목입니다.")


# 학생 강의 불러오기
def student_lecture_load(request):
    if request.method == "POST":
        date_list = Student_lecture.objects.filter(
            student_id=request.session["userID"]
        ).order_by("code")
        return HttpResponse(
            serializers.serialize("json", date_list), content_type="application/json"
        )


# 학생 강의 삭제
def student_lecture_delete(request):
    if request.method == "POST":
        for data in range(int(len(request.POST) / 7)):
            query = Student_lecture.objects.get(
                student_id=request.session["userID"],
                code=request.POST["array[" + str(data) + "][code]"],
                codeClass=request.POST["array[" + str(data) + "][codeClass]"],
            )
            query.delete()
            obj = Subject.objects.get(code=query.code)
            obj.stdCount -= 1
            obj.save()
        date_list = Student_lecture.objects.filter(student_id=request.session["userID"])
        return HttpResponse(
            serializers.serialize("json", date_list), content_type="application/json"
        )


# 학생투표페이지의 강의정보
# 로직상 맞는 구조지만,과목테이블에서 투표테이블로 맞춰서 출력할것임.
def getLectureInfo(request):
    lecCode = request.POST["code"]
    print(request.POST["code"])

    subject_data = Vote.objects.filter(code=lecCode)
    print(subject_data)

    return HttpResponse(
        serializers.serialize("json", subject_data), content_type="application/json"
    )


# 교수 기능
# ajax로 필터링하여 table 생성할 값 반환
def voteTable(request):
    if request.POST["lecture_type"] == "전체" and request.POST["vote_status"] != "전체":
        stores_list = Vote.objects.filter(
            # lecture_type=request.POST["lecture_type"],
            vote_status=request.POST["vote_status"],
        )
    elif request.POST["lecture_type"] != "전체" and request.POST["vote_status"] == "전체":
        stores_list = Vote.objects.filter(
            lecture_type=request.POST["lecture_type"],
            # vote_status=request.POST["vote_status"],
        )
    elif request.POST["lecture_type"] == "전체" and request.POST["vote_status"] == "전체":
        stores_list = Vote.objects.all()
    else:
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
    if request.method == "POST":
        if Subject.objects.filter(
            code=request.POST["code"], codeClass=request.POST["codeClass"]
        ).exists():
            return HttpResponse("강의 코드가 겹치는 강의가 있습니다.")

        splitdata1, splitdata2 = request.POST["period"].split(" ")

        if splitdata1 == splitdata2:
            return HttpResponse("강의 시간이 겹치지 않게 설정해주세요")

        makedData = Subject.objects.create(
            name=request.POST["name"],
            code=request.POST["code"],
            codeClass=request.POST["codeClass"],
            professor=request.session["userName"],
            period=request.POST["period"],
            lecture_type=request.POST["lecture_type"],
            department=request.POST["department"],
            stdCount=0,
            total_stdCount=request.POST["total_count"],
        )
        makedData.save()

        createdData = Subject.objects.filter(id=makedData.id)
        return HttpResponse(
            serializers.serialize("json", createdData), content_type="application/json"
        )


# 교수 강의 테이블 출력
def pro_lecture_table(request):
    if request.method == "POST":
        userID = request.session["userID"]
        professor = Professor.objects.get(userID=userID)
        pro_subject = Subject.objects.filter(
            professor=professor.username, department=professor.department
        )

        return HttpResponse(
            serializers.serialize("json", pro_subject), content_type="application/json"
        )


# 교수 강의 삭제
def professor_lecture_delete(request):
    if request.method == "POST":
        try:
            lec_del = Student_lecture.objects.filter(code=request.POST["code"])
            lec_del.delete()
        except lec_del.DoesNotExist:
            a = "aa"

        sub_del = Subject.objects.get(
            code=request.POST["code"], codeClass=request.POST["codeClass"]
        )
        sub_del.delete()

        date_list = Subject.objects.filter(professor=request.session["userName"])

        return HttpResponse(
            serializers.serialize("json", date_list), content_type="application/json"
        )


# 교수 투표 개설 테이블 데이터 전송 함수
def pro_vote_open_table(request):
    if request.method == "POST":
        userID = request.session["userID"]
        professor = Professor.objects.get(userID=userID)
        pro_subject = Subject.objects.filter(
            professor=professor.username, department=professor.department
        )

        return HttpResponse(
            serializers.serialize("json", pro_subject), content_type="application/json"
        )


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
            start__range=[request.POST["StartDate"], request.POST["EndDate"]],
        ).order_by("start")

    return HttpResponse(
        serializers.serialize("json", date_list), content_type="application/json"
    )


# ajax로 들어온 데이터들로 calendar DB에 저장
def makeCalendars(request):
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
    return HttpResponse("강의 일정 저장 완료!")


# 학생,교수 기능 공유 부분
# 공통 부분 : 강의 일정 삭제
def deleteCalendars(request):
    if request.method == "POST":
        print(request.POST)
        if request.session["userType"] == "student":
            for i in range(int(len(request.POST) / 7)):
                title = request.POST["array[" + str(i) + "][name]"]
                new_instance = Calendar.objects.filter(
                    userID=request.session["userID"], title=title
                )
                new_instance.delete()
            return HttpResponse("db와 일정 데이터 삭제 성공")
        elif request.session["userType"] == "professor":
            title = request.POST["title"]
            cal_Pdel = Calendar.objects.filter(
                userID=request.session["userID"], title=title
            )

            try:
                lec_del = Student_lecture.objects.filter(
                    professor=request.session["userName"], name=title
                )

                for i in range(lec_del.count()):
                    for j in range(cal_Pdel.count()):
                        cal_Sdel = Calendar.objects.filter(
                            userID=lec_del[i].student_id,
                            title=title,
                            start=cal_Pdel[j].start,
                            end=cal_Pdel[j].end,
                        )
                        cal_Sdel.delete()

            except lec_del.DoesNotExist:
                a = "aa"

            cal_Pdel.delete()

            return HttpResponse("db와 일정 데이터 삭제 성공")


# 공용 캘린더 부분 기능들
# 공용 캘린더용 calId 보내주는 부분
def pubCalSetData(request):
    pubCalSetData = PubCalID.objects.all()

    return HttpResponse(
        serializers.serialize("json", pubCalSetData), content_type="application/json"
    )


# 공유 캘린더 클릭시 교수의 강의 불러옴
def pro_lecture(request):
    if request.method == "POST":
        professor = Professor.objects.get(userID=request.session["userID"])
        data = Subject.objects.filter(
            professor=professor.username, department=professor.department
        )
        return HttpResponse(
            serializers.serialize("json", data), content_type="application/json"
        )


# 공용 일정 저장하는 함수
def pubCalSave(request):
    lecCode = request.POST["code"]  # request에서 온 강의 코드로 가정
    calID = "낮음"
    stdLecData = Student_lecture.objects.filter(code=lecCode)
    # print("request에서 온 강의를 듣는 학생들의 쿼리셋", stdLecData)
    subjectCount = Subject.objects.filter(code=lecCode)[0].stdCount + 1  # +1은 교수 카운트
    # print("subject 수강 인원 : ", subjectCount)

    pubCalData = Calendar.objects.filter(userID="NULL")  # 초기화
    for data in stdLecData:  # 강의를 듣는 학생들의 공개 일정을 가져오는 쿼리 생성
        pubCalData = pubCalData | Calendar.objects.filter(
            userID=data.student_id,
            start__range=[request.POST["start"], request.POST["end"]],
        )
        # print("필터링 데이터 : ", pubCalData[0].userID)
        # print(data.student_id) # 학생의 id값

    # 교수의 일정도 가져옴
    pubCalData = pubCalData | Calendar.objects.filter(
        userID=request.session["userID"],
        start__range=[request.POST["start"], request.POST["end"]],
    )
    tmpData = pubCalData

    pubCalData = pubCalData.values("start", "end").annotate(count=Count("start"))

    # 데이터 초기화
    beforeData = PubCalendar.objects.filter(code=lecCode)
    beforeData.delete()

    for i in pubCalData:
        pubStdData = tmpData.filter(start=i["start"], end=i["end"]).distinct()
        stdStr = ""
        for j in pubStdData:
            stdStr += j.userID + ", "

        stdStr = stdStr[:-2]  # 마지막 쉼표 제거
        if i["count"] / subjectCount > 0.7:
            calID = "매우 높음"
        elif i["count"] / subjectCount > 0.5:
            calID = "높음"
        else:
            calID = "낮음"
        PubCalendar.objects.create(
            code=lecCode,
            calendarId=calID,
            title=str(i["count"]) + "명 일정 있음",
            start=i["start"],
            end=i["end"],
            count=i["count"],
            countPer=i["count"] / subjectCount,
            attendees=stdStr,
        )

    return HttpResponse("일정 저장 완료.")


def pubCalLoad(request):
    lecCode = request.POST["code"]

    pubCalData = PubCalendar.objects.filter(
        code=lecCode, start__range=[request.POST["start"], request.POST["end"]]
    )

    return HttpResponse(
        serializers.serialize("json", pubCalData), content_type="application/json"
    )
