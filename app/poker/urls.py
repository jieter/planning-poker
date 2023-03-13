from asgiref.sync import async_to_sync
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from .consumers import PokerConsumer
from .models import PokerSession


# @csrf_exempt
def index_view(request, session_id=None):
    if session_id is None:
        poker = PokerSession.objects.create()
        return redirect("poker", session_id=poker.id)

    poker = get_object_or_404(PokerSession, id=session_id)

    if name := request.POST.get("name"):
        user = poker.add_user(name=name, is_spectator=request.POST.get("is_spectator") == "true")
        print("created new user ", user)
        consumer = PokerConsumer()
        message = {"type": "join", "user": user}
        async_to_sync(consumer.channel_layer.group_send)(session_id, message)
        request.session["user_id"] = user.id

        return redirect("poker", session_id=session_id)

    context = {}
    if user_id := request.session.get("user_id"):
        if user := poker.users.filter(id=user_id).first():
            context["websocket_url"] = f"ws://{request.get_host()}/ws/poker/{poker.id}/"

    return render(request, "index.html", context)


urlpatterns = [
    path("", index_view, name="index"),
    path("poker/<str:session_id>/", index_view, name="poker"),
]
