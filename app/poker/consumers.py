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
        self.name = self.scope["session"].get("name")
        self.poker_id = self.scope["url_route"]["kwargs"]["poker_id"]
        self.poker = PokerSession.objects.get(id=self.poker_id)

        self.accept()

        async_to_sync(self.channel_layer.group_add)(self.poker_id, self.channel_name)
        user = self.poker.users.filter(name=self.name).first()
        print("user", user)
        self.send_json(
            {
                "type": "init",
                "user": user.as_dict() if user else None,
                "users": self.poker.users_as_dict(),
                "choices": ["XXS", "XS", "S", "M", "L", "XL", "☕️"],
            }
        )

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(self.poker_id, self.channel_name)
        if self.name:
            self.poker.deactivate_user(self.name)
            message = {"type": "leave", "name": self.name}
            async_to_sync(self.channel_layer.group_send)(self.poker_id, message)

            self.name = None

    def receive_json(self, content):
        print(content)

        match (content["action"]):
            case "join":
                name = content["name"]
                self.name = name

                new_user = self.poker.add_user(name, is_spectator=content["is_spectator"]).as_dict()
                self.send_json({"type": "joined", "user": new_user})

                message = {"type": "join", "user": new_user}
                async_to_sync(self.channel_layer.group_send)(self.poker_id, message)

            case "vote":
                if self.name:
                    user = self.poker.users.get(name=self.name)
                    user.vote = content["value"]
                    user.save()

                    message = {"type": "vote", "name": self.name, "value": content["value"]}
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
