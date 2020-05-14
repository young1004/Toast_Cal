from django.urls import path

from toast_cal import views, crud

app_name = "toast_cal"

urlpatterns = [
    path("", views.index, name="index"),
    path("ourstores/", crud.ourstores, name="ourstores"),
    path("calSetData/", crud.calSetData, name="calSetData"),
    path("voteTable/", crud.voteTable, name="voteTable"),
    path("voteChart/", crud.voteChart, name="voteChart"),
    path("create/", crud.createData, name="createData"),
    path("update/", crud.updateData, name="updateData"),
    path("delete/", crud.deleteData, name="deleteData"),
]
