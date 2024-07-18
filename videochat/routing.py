from django.urls import path
from .consumers import ChatConsumer

ws_urlpatterns = [
    path('ws/<str:room_name>/', ChatConsumer.as_asgi()),

]