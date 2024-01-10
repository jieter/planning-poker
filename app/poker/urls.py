from django.urls import path

from app.poker.views import index_view

urlpatterns = [
    path("", index_view, name="index"),
    path("poker/", index_view, name="index"),
    path("poker/<str:session_id>/", index_view, name="poker"),
]
