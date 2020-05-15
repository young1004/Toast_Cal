from django.urls import path

from toast_cal import views, crud

app_name = "toast_cal"

urlpatterns = [
    path("", views.index, name="index"),
    path("ourstores/", crud.ourstores, name="ourstores"),  # 캘린더 기능들
    path("calSetData/", crud.calSetData, name="calSetData"),
    path("create/", crud.createData, name="createData"),
    path("update/", crud.updateData, name="updateData"),
    path("delete/", crud.deleteData, name="deleteData"),
    path("checked/", crud.checked, name="checked"),  # 학생 기능들
    path("department/", crud.department, name="department"),  # 강의 버튼클릭시 학과 가져옴
    path("subject/", crud.subject, name="subject"),  # 학과 선택시 해당 과목 가져옴
    path("chanege_type/", crud.chanege_type, name="chanege_type"),  # 과목선택시 해당 이수구분 가져옴
    path("lecture_lookup/", crud.lecture_lookup, name="lecture_lookup"),  # 조회
    path("lecture_save/", crud.lecture_save, name="lecture_save"),  # 강의 저장
    path("voteTable/", crud.voteTable, name="voteTable"),  # 교수 기능들
    path("voteChart/", crud.voteChart, name="voteChart"),
]
