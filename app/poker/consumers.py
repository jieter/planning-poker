import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer

from .models import Session


class PokerConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.session_id = None
        self.session = None

    def connect(self):
        self.session_id = self.scope["url_route"]["kwargs"]["session_id"]
        self.session = Session.objects.get(id=self.session_id)

        self.accept()

        # join the room group
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
        # self.session.participants.remove(...)

    def receive_json(self, content):
        print(content)

        match (content["action"]):
            case "join":
                name = content["name"]
                participant, created = self.session.participant_set.get_or_create(name=name)
                self.send_json({"type": "join", "participant": participant.as_dict()})
            case "vote":
                pass
            case "reveal":
                pass
            case "clear":
                pass
