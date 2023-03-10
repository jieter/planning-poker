from django.shortcuts import get_object_or_404, redirect, render
from django.urls import path

from .models import Session


def index_view(request, session_id=None):
    if session_id is None:
        session = Session.objects.create()
        return redirect("poker", session_id=session.id)

    session = get_object_or_404(Session, id=session_id)
    return render(request, "index.html", {"websocket_url": f"ws://{request.get_host()}/ws/poker/{session.id}/"})


urlpatterns = [
    path("", index_view, name="index"),
    path("poker/<str:session_id>/", index_view, name="poker"),
]
