from django.urls import path

from toast_cal import views, crud

app_name = "toast_cal"

urlpatterns = [
    path("", views.calendar, name="calendar"),  # 로그인시 메인 화면
    # 캘린더 기능들
    path("ourstores/", crud.ourstores, name="ourstores"),
    path("calSetData/", crud.calSetData, name="calSetData"),
    path("create/", crud.createData, name="createData"),
    path("update/", crud.updateData, name="updateData"),
    path("delete/", crud.deleteData, name="deleteData"),
    # 우측 네비게이션
    path("dateList/", crud.dateList, name="dateList"),
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
    # vote 테이블의 아무값이나 받은 테스트 데이터
    path("voteSelectTest/", crud.voteSelectTest, name="voteSelectTest/"),
    path("test/", crud.test, name="test/"),
    path("getLectureInfo/", crud.getLectureInfo, name="getLectureInfo"),  # 학생 투표 강의 정보
    # 교수 기능들
    path("voteTable/", crud.voteTable, name="voteTable"),
    path("voteChart/", crud.voteChart, name="voteChart"),
    path("makeSubject/", crud.makeSubject, name="makeSubject"),
    path(
        "pro_lecture_table/", crud.pro_lecture_table, name="pro_lecture_table"
    ),  # 교수 강의 테이블 출력
    path(
        "professor_lecture_delete/",
        crud.professor_lecture_delete,
        name="professor_lecture_delete",
    ),  # 교수 강의 삭제
    path("pro_vote_open_table/", crud.pro_vote_open_table, name="pro_vote_open_table"),
    # 교수 투표 개설
    path("manageInfo/", views.manageInfo, name="manageInfo"),
    path("loginInfo/", views.loginInfo, name="loginInfo"),
    path("modifyInfo/", views.modifyInfo, name="modifyInfo"),
    # 공통 기능들
    path("deleteCalendars/", crud.deleteCalendars, name="deleteCalendars"),
    path("makeCalendars/", crud.makeCalendars, name="makeCalendars"),
    path("signout/", views.signout, name="signout"),
    path("pubCalSave/", crud.pubCalSave, name="pubCalSave"),
    # 공용 캘린더 부분들
    path("pubCalSetData/", crud.pubCalSetData, name="pubCalSetData"),
    path("pro_lecture/", crud.pro_lecture, name="pro_lecture"),
    path("pubCalSave/", crud.pubCalSave, name="pubCalSave"),
    path("pubCalLoad/", crud.pubCalLoad, name="pubCalLoad"),
]
