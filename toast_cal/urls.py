from django.urls import path

from toast_cal import views, crud

app_name = "toast_cal"

urlpatterns = [
    path("changePw/", views.changePw, name="changePw"),  # 회원정보 관련 기능들
    path("findId/", views.findId, name="findId"),
    path("findInfo/", views.findInfo, name="findInfo"),
    path("findPass/", views.findPass, name="findPass"),
    path("", views.calendar, name="calendar"),  # 로그인시 메인 화면
    # 캘린더 기능들
    path("ourstores/", crud.ourstores, name="ourstores"),
    path("calSetData/", crud.calSetData, name="calSetData"),
    path("create/", crud.createData, name="createData"),
    path("update/", crud.updateData, name="updateData"),
    path("delete/", crud.deleteData, name="deleteData"),
    path("dateList/", crud.dateList, name="dateList"),  # 우측 네비게이션
    path("getWeekSchedule/", crud.getWeekSchedule, name="getWeekSchedule"),
    # 학생 기능들
    path("checked/", crud.checked, name="checked"),
    path("department/", crud.department, name="department"),  # 강의 버튼클릭시 학과 가져옴
    path("subject/", crud.subject, name="subject"),  # 학과 선택시 해당 과목 가져옴
    path("chanege_type/", crud.chanege_type, name="chanege_type"),  # 과목선택시 해당 이수구분 가져옴
    path("lecture_lookup/", crud.lecture_lookup, name="lecture_lookup"),  # 조회
    path("lecture_save/", crud.lecture_save, name="lecture_save"),  # 강의 저장
    path(
        "student_lecture_load/", crud.student_lecture_load, name="student_lecture_load"
    ),  # 학생 강의 불러오기
    path(
        "student_lecture_delete/",
        crud.student_lecture_delete,
        name="student_lecture_delete",
    ),  # 학생 강의 삭제
    path("voteTable/", crud.voteTable, name="voteTable"),  # 교수 기능들
    path("voteChart/", crud.voteChart, name="voteChart"),
    path("makeSubject/", crud.makeSubject, name="makeSubject"),
    path("makeCalendars/", crud.makeCalendars, name="makeCalendars"),
]
