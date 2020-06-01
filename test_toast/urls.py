from django.contrib import admin
from django.urls import include, path
from toast_cal import views


urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.index, name="index"),
    path("toast_cal/", include("toast_cal.urls")),
    path("signup/", views.signup, name="signup"),
    path("login/", views.login, name="login"),
    path("logout/", views.logout, name="logout"),
    path("findInfo/", views.findInfo, name="findInfo"),
    path("findId/", views.findId, name="findId"),
    path("findPass/", views.findPass, name="findPass"),
    path("changePw/",views.changePw, name="changePw"),
]
