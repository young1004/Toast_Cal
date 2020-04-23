from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
from .models import Calendar


def index(request):
    print(request.POST)
    return render(request, "index.html")


def ourstores(request):
    stores_list = Calendar.objects.all()

    stores_list_json = serializers.serialize("json", stores_list)

    return HttpResponse(stores_list_json, content_type="application/json")
