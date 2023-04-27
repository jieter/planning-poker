from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer

from .models import PokerSession


class PokerConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.poker_id = None
        self.poker = None

    def connect(self):
        self.user_id = self.scope["session"].get("user_id")
        self.poker_id = self.scope["url_route"]["kwargs"]["poker_id"]
        self.accept()

        try:
            self.poker = PokerSession.objects.get(id=self.poker_id)
        except PokerSession.DoesNotExist:
            self.send_json({"type": "error", "message": "Poker session not found"})

        self.user = self.poker.users.filter(id=self.user_id).first()
        if self.user:
            async_to_sync(self.channel_layer.group_add)(self.poker_id, self.channel_name)
            self.user.activate()
            self.channel_send_message()
        else:
            self.send_json({"type": "error", "message": "User not found"})

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(self.poker_id, self.channel_name)
        if self.user_id:
            self.user.deactivate()
            self.user_id = None

            self.channel_send_message()

    def channel_send_message(self, message: dict | None = None):
        if message is None:
            message = {"type": "init"}
        async_to_sync(self.channel_layer.group_send)(self.poker_id, message)

    def receive_json(self, content):
        match (content["action"]):
            case "join":
                new_user = self.poker.add_user(name=content["name"], is_spectator=content["is_spectator"]).as_dict()
                self.user_id = new_user.id
                self.channel_send_message()

            case "vote":
                if self.user:
                    self.user.vote = content["value"]
                    self.user.save()

                    message = {"type": "vote", "user_id": self.user_id, "value": content["value"]}
                    self.channel_send_message(message)

            case "reveal":
                self.poker.is_revealed = True
                self.poker.save()
                self.channel_send_message()

            case "clear":
                self.poker.clear()
                self.channel_send_message()

            case "change_deck":
                self.poker.cycle_deck()
                self.channel_send_message()

    def init(self, event=None):
        # Create the message here to make sure it contains the up to date user and poker session
        user = None
        if self.user:
            self.user.refresh_from_db()
            user = self.user.as_dict()

        self.poker = PokerSession.objects.get(pk=self.poker.pk)
        message = {
            "type": "init",
            "is_revealed": self.poker.is_revealed,
            "user": user,
            "users": self.poker.users_as_dict(),
            "choices": self.poker.deck_as_list(),
        }
        self.send_json(message)

    def join(self, event):
        self.send_json(event)

    def leave(self, event):
        self.send_json(event)

    def vote(self, event):
        self.send_json(event)
