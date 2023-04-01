from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.conf import settings
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import path
from django.views.decorators.csrf import csrf_exempt

from .consumers import PokerConsumer, PokerSession


@csrf_exempt
def index_view(request, session_id=None):
    # If requested without a session_id, create a new poker session
    poker = PokerSession.get_or_create(session_id)
    if session_id is None:
        return redirect("poker", session_id=poker.uuid)

    # Handle a user join request
    if name := request.POST.get("name"):
        user = poker.add_user(name=name, is_spectator=request.POST.get("is_spectator") == "true")
        request.session["user_id"] = user["id"]
        request.session["name"] = name

        return redirect("poker", session_id=session_id)

    # If the user is known (in the session), add the websocket URL to the context so the voting can begin.
    context = {}
    if user_id := request.session.get("user_id"):
        if user_id in poker.users:
            protocol = "wss" if settings.IS_PRODUCTION else "ws"
            context["websocket_url"] = f"{protocol}://{request.get_host()}/ws/poker/{poker.uuid}/"

    return render(request, "index.html", context)


urlpatterns = [
    path("", index_view, name="index"),
    path("poker/", index_view, name="index"),
    path("poker/<str:session_id>/", index_view, name="poker"),
]


websocket_urlpatterns = [
    path("ws/poker/<str:poker_id>/", PokerConsumer.as_asgi()),
]
