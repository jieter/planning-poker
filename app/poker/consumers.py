import random

from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer
from django.conf import settings

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
            self.channel_send_init()
        else:
            self.send_json({"type": "error", "message": "User not found"})

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(self.poker_id, self.channel_name)
        if self.user_id:
            self.user.deactivate()
            self.user_id = None

            self.channel_send_init()

    def channel_send_init(self):
        self.channel_send_message({"type": "init"})

    def channel_send_message(self, message: dict):
        async_to_sync(self.channel_layer.group_send)(self.poker_id, message)

    def receive_json(self, content):
        match (content["action"]):
            case "join":
                new_user = self.poker.add_user(name=content["name"], is_spectator=content["is_spectator"]).as_dict()
                self.user_id = new_user.id
                self.channel_send_init()

            case "vote":
                if self.user:
                    self.user.vote = content["value"]
                    self.user.save()

                    message = {"type": "vote", "user_id": self.user_id, "value": content["value"]}
                    self.channel_send_message(message)

            case "reveal":
                self.poker.is_revealed = True
                self.poker.save()
                self.channel_send_init()

            case "clear":
                self.poker.clear()
                self.channel_send_init()

            case "change_deck":
                self.poker.cycle_deck()
                self.channel_send_init()

            case "add_fakes":
                if not settings.IS_PRODUCTION:
                    for name in ["Marina", "Shanna", "Jalen", "Kobe", "Dallin", "Erin", "Will"]:
                        self.poker.add_user(name)
                    self.channel_send_init()

            case "fake_votes":
                if not settings.IS_PRODUCTION:
                    deck = self.poker.deck_as_list()
                    deck.extend([deck[0]] * 3)
                    for user in self.poker.users.all():
                        user.vote = random.choice(deck)
                        user.save()
                    self.channel_send_init()

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
            "users": self.poker.users_as_list(),
            "choices": self.poker.deck_as_list(),
        }
        self.send_json(message)

    def vote(self, event):
        self.send_json(event)
