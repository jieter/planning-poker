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
        poker = self.poker
        match (content["action"]):
            case "join":
                new_user = poker.add_user(name=content["name"], is_spectator=content["is_spectator"]).as_dict()
                self.user_id = new_user.id

            case "settings":
                if "autoReveal" in content:
                    poker.auto_reveal = bool(content["autoReveal"])
                if "deck" in content:
                    poker.set_deck(content["deck"])
                poker.save()

            case "vote":
                if self.user:
                    vote = content.get("value")
                    vote = vote if vote in poker.deck_as_list() else "🍗"

                    self.user.vote = vote
                    self.user.save()

                    if not poker.is_voting_complete:
                        message = {"type": "vote", "user_id": self.user_id, "value": vote}
                        self.channel_send_message(message)
                        return

            case "reveal":
                poker.reveal()

            case "clear":
                poker.clear()

            case "add_fakes":
                if not settings.IS_PRODUCTION:
                    for name in ["Marina", "Shanna", "Jalen", "Kobe", "Dallin", "Erin", "Will"]:
                        poker.add_user(name)

            case "fake_votes":
                if not settings.IS_PRODUCTION:
                    deck = poker.deck_as_list().copy()
                    deck.extend([deck[0]] * 3)
                    for user in poker.users.all():
                        user.vote = random.choice(deck)
                        user.save()

        self.channel_send_init()

    def init(self, event=None):
        # Create the message here to make sure it contains the up to date user and poker session
        user = None
        if self.user:
            self.user.refresh_from_db()
            user = self.user.as_dict()

        self.poker = poker = PokerSession.objects.get(pk=self.poker.pk)
        if poker.is_voting_complete and poker.auto_reveal:
            poker.reveal()

        message = {
            "type": "init",
            "user": user,
            "users": poker.users_as_list(),
            "settings": {
                "autoReveal": poker.auto_reveal,
                "isRevealed": poker.is_revealed,
                "deck": poker.deck,
                "decks": poker.Decks.choices,
                "choices": poker.deck_as_list(),
            },
        }
        self.send_json(message)

    def vote(self, event):
        self.send_json(event)
