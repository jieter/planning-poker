from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer

from .models import PokerSession


class PokerConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.poker_id = None
        self.poker = None
        self.name = None

    def connect(self):
        self.user_id = self.scope["session"].get("user_id")
        self.poker_id = self.scope["url_route"]["kwargs"]["poker_id"]
        self.poker = PokerSession.objects.get(id=self.poker_id)

        self.accept()

        if user := self.poker.users.filter(id=self.user_id).first():
            async_to_sync(self.channel_layer.group_add)(self.poker_id, self.channel_name)
            user.activate()

            self.send_json(
                {
                    "type": "init",
                    "user": user.as_dict() if user else None,
                    "users": self.poker.users_as_dict(),
                    "choices": self.poker.deck_as_list(),
                }
            )
        else:
            print("user not found", dict(self.scope["session"]))

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(self.poker_id, self.channel_name)
        if self.user_id:
            self.poker.deactivate_user(self.user_id)
            message = {"type": "leave", "id": self.user_id}
            async_to_sync(self.channel_layer.group_send)(self.poker_id, message)

            self.user_id = None

    def receive_json(self, content):
        print(content)

        match (content["action"]):
            case "join":
                name = content["name"]

                new_user = self.poker.add_user(name, is_spectator=content["is_spectator"]).as_dict()
                self.user_id = new_user.id
                self.send_json({"type": "joined", "user": new_user})

                message = {"type": "join", "user": new_user}
                async_to_sync(self.channel_layer.group_send)(self.poker_id, message)

            case "vote":
                if self.user_id:
                    user = self.poker.users.get(id=self.user_id)
                    user.vote = content["value"]
                    user.save()

                    message = {"type": "vote", "user_id": self.user_id, "value": content["value"]}
                    async_to_sync(self.channel_layer.group_send)(self.poker_id, message)

            case "reveal":
                message = {"type": "reveal"}
                async_to_sync(self.channel_layer.group_send)(self.poker_id, message)

            case "clear":
                message = {"type": "clear"}
                self.poker.users.all().update(vote=None)
                async_to_sync(self.channel_layer.group_send)(self.poker_id, message)

    def join(self, event):
        self.send_json(event)

    def leave(self, event):
        self.send_json(event)

    def vote(self, event):
        self.send_json(event)

    def reveal(self, event):
        self.send_json(event)

    def clear(self, event):
        self.send_json(event)
