from asgiref.sync import async_to_sync
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import path

from .consumers import PokerConsumer
from .models import PokerSession


def index_view(request, session_id=None):
    if session_id is None:
        poker = PokerSession.objects.create()
        return redirect("poker", session_id=poker.id)

    poker = get_object_or_404(PokerSession, id=session_id)

    if name := request.POST.get("name"):
        user = poker.add_user(name=name, is_spectator=request.POST.get("is_spectator") == "true")
        consumer = PokerConsumer()
        message = {"type": "join", "user": user}
        print("cretaed new user ", user)
        # async_to_sync(consumer.channel_layer.group_send)(session_id, message)
        request.session["name"] = user.name

        return redirect("poker", session_id=session_id)

    print(dict(request.session))
    context = {}
    if name := request.session.get("name"):
        if user := poker.users.filter(name=name).first():
            context["websocket_url"] = f"ws://{request.get_host()}/ws/poker/{poker.id}/"

    return render(request, "index.html", context)


urlpatterns = [
    path("", index_view, name="index"),
    path("poker/<str:session_id>/", index_view, name="poker"),
]
