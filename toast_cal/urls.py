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
    path("voteTable/", crud.voteTable, name="voteTable"),  # 교수 기능들
    path("voteChart/", crud.voteChart, name="voteChart"),
]
