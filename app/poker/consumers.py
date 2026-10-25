import random

from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer
from django.conf import settings

from .models import PokerSession


class PokerConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.poker_id = None
        self.poker = None
        self.user = None

    def connect(self):
        self.user_id = self.scope["session"].get("user_id")
        self.poker_id = str(self.scope["url_route"]["kwargs"]["poker_id"])
        self.accept()

        try:
            self.poker = PokerSession.objects.get(id=self.poker_id)
        except PokerSession.DoesNotExist:
            self.send_json({"type": "error", "message": "Poker session not found"})
            return

        self.user = self.poker.users.filter(id=self.user_id).first()
        if self.user:
            async_to_sync(self.channel_layer.group_add)(self.poker_id, self.channel_name)
            self.user.activate()
            self.channel_send_init("connect")
        else:
            self.send_json({"type": "error", "message": "User not found"})

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(self.poker_id, self.channel_name)
        if self.user:
            self.user.deactivate()
            self.user = None

            self.auto_reveal()
            self.channel_send_init("disconnect")

    def auto_reveal(self):
        """Reveal if voting is complete. Called by the consumer handling an event, not by every consumer."""
        self.poker.refresh_from_db()
        if self.poker.auto_reveal and self.poker.is_voting_complete:
            self.poker.reveal()

    def channel_send_init(self, origin=None):
        self.channel_send_message({"type": "init", "origin": origin})

    def channel_send_message(self, message: dict):
        async_to_sync(self.channel_layer.group_send)(self.poker_id, message)

    def receive_json(self, content):
        # Ignore messages from connections without a (valid) user, they received an error in connect().
        if not self.user:
            return

        poker = self.poker
        poker.refresh_from_db()
        action = content.get("action")
        match action:
            case "settings":
                if "auto_reveal" in content:
                    poker.auto_reveal = bool(content["auto_reveal"])
                    poker.save(update_fields=["auto_reveal"])
                if "deck" in content:
                    poker.set_deck(content["deck"])
                if "is_spectator" in content:
                    self.user.is_spectator = bool(content["is_spectator"])
                    self.user.save(update_fields=["is_spectator"])

            case "vote":
                vote = content.get("value")
                vote = vote if vote in poker.deck_as_list() else "🍗"

                self.user.vote = vote
                self.user.save(update_fields=["vote"])

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
                        user.save(update_fields=["vote"])

        self.auto_reveal()
        self.channel_send_init(f"{action=}")

    def init(self, event=None):
        # Create the message here to make sure it contains the up to date user and poker session
        user = None
        if self.user:
            self.user.refresh_from_db()
            user = self.user.as_dict()

        self.poker = poker = PokerSession.objects.get(pk=self.poker.pk)

        message = {
            "type": "init",
            "event": event,
            "user": user,
            "users": poker.users_as_list(),
            "settings": poker.settings_as_dict(),
            "reveal_count": poker.reveal_count,
            "log": poker.log_as_list(),
            "history": poker.log_as_list(event="reveal", limit=None),
        }
        self.send_json(message)

    def vote(self, event):
        self.send_json(event)
