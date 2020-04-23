from django.urls import path

from . import views
from . import dbcrud

urlpatterns = [
    path("", views.index, name="index"),
    path("create/", dbcrud.insertData, name="create"),
    path("ourstores/", views.ourstores, name="ourstores"),
]
