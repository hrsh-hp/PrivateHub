from django.urls import path
from .views import main_view,index

urlpatterns = [
    path('', index, name="index"),
    path('room/', main_view, name="main_view")
]
