from django.urls import path

from .consumers import PokerConsumer

websocket_urlpatterns = [
    path("ws/poker/<uuid:poker_id>/", PokerConsumer.as_asgi()),
]
