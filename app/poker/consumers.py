import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer

from .models import Session


class PokerConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.session_id = None
        self.session = None
        self.name = None

    def connect(self):
        self.session_id = self.scope["url_route"]["kwargs"]["session_id"]
        self.session = Session.objects.get(id=self.session_id)

        self.accept()

        async_to_sync(self.channel_layer.group_add)(self.session_id, self.channel_name)

        self.send_json(
            {
                "type": "init",
                "participants": self.session.participants(),
                "choices": ["XXS", "XS", "S", "M", "L", "XL", "☕️"],
            }
        )

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(self.session_id, self.channel_name)
        if self.name:
            self.session.participant_set.filter(name=self.name).delete()
            message = {"type": "leave", "name": self.name}
            async_to_sync(self.channel_layer.group_send)(self.session_id, message)

            self.name = None

    def receive_json(self, content):
        print(content)

        match (content["action"]):
            case "join":
                name = content["name"]
                self.name = name
                participant, created = self.session.participant_set.get_or_create(name=name)
                message = {"type": "join", "participant": participant.as_dict()}
                async_to_sync(self.channel_layer.group_send)(self.session_id, message)

            case "vote":
                if self.name:
                    participant = self.session.participant_set.get(name=self.name)
                    participant.vote = content["value"]
                    participant.save()

                    message = {"type": "vote", "name": self.name, "value": content["value"]}
                    async_to_sync(self.channel_layer.group_send)(self.session_id, message)

            case "reveal":
                message = {"type": "reveal"}
                async_to_sync(self.channel_layer.group_send)(self.session_id, message)

            case "clear":
                message = {"type": "clear"}
                self.session.participant_set.all().update(vote=None)
                async_to_sync(self.channel_layer.group_send)(self.session_id, message)

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
