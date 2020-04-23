from .models import *
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def insertData(request):
    print("success")
    print(request.POST)
