from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.conf import settings
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from .models import PokerSession


@csrf_exempt
def index_view(request, session_id=None):
    # If requested without a session_id, create a new poker session
    if session_id is None:
        poker = PokerSession.objects.create()
        return redirect("poker", session_id=poker.id)

    poker = get_object_or_404(PokerSession, id=session_id)

    # Handle a user join request
    if name := request.POST.get("name"):
        user = poker.add_user(name=name, is_spectator=request.POST.get("is_spectator") == "true")
        request.session["user_id"] = user.id
        return redirect("poker", session_id=session_id)

    # If the user is known (in the session), add the websocket URL to the context so the voting can begin.
    context = {}
    if user_id := request.session.get("user_id"):
        if user := poker.users.filter(id=user_id).first():
            protocol = "wss" if settings.IS_PRODUCTION else "ws"
            context["websocket_url"] = f"{protocol}://{request.get_host()}/ws/poker/{poker.id}/"

    return render(request, "index.html", context)


urlpatterns = [
    path("", index_view, name="index"),
    path("poker/", index_view, name="index"),
    path("poker/<str:session_id>/", index_view, name="poker"),
]
