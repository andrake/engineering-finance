from django.shortcuts import render

# Create your views here.

from django.http import HttpResponse

def index(request):
    x = 5
    return HttpResponse("This is the Hydronics App!")