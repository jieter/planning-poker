from django.urls import path

from .consumers import PokerConsumer

websocket_urlpatterns = [
    path("ws/poker/<str:session_id>/", PokerConsumer.as_asgi(), name="websocket"),
]
