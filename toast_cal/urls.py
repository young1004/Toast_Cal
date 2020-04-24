from django.urls import path

from toast_cal import views

app_name = "toast_cal"

urlpatterns = [
    path("", views.index, name="index"),
    path("ourstores/", views.ourstores, name="ourstores"),
    path("create/", views.createData, name="createData"),
    # path("update/", views.updateData, name="updateData"),
    path("delete/", views.deleteData, name="deleteData"),
]
