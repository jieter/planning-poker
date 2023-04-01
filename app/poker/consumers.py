from uuid import uuid4

from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer

sessions = {}


class PokerSession:
    def __init__(self, uuid):
        self.uuid = uuid
        self.is_revealed = False
        self.deck = "tshirt"
        self.users = {}

    def cycle_deck(self):
        self.deck = "fibonacci" if self.deck == "tshirt" else "tshirt"
        self.clear()

    def deck_as_list(self):
        return ("XXS,XS,S,M,L,XL,?,☕️" if self.deck == "tshirt" else "0,½,1,2,3,5,8,13,20,?,∞,☕️").split(",")

    def add_user(self, name, is_spectator=False):
        uuid = str(uuid4())
        self.users[uuid] = {"id": uuid, "name": name, "is_spectator": is_spectator, "vote": None}

        return self.users[uuid]

    def remove_user(self, uuid):
        if uuid in self.users:
            del self.users[uuid]

    def clear(self):
        self.is_revealed = False
        for uuid in self.users:
            self.users[uuid]["vote"] = None

    @classmethod
    def get_or_create(cls, uuid):
        """Always return a PokerSession instance, even if the uuid is None or a session does noet exist for the uuid."""
        uuid = uuid or str(uuid4())
        if uuid not in sessions:
            sessions[uuid] = PokerSession(uuid)

        return sessions[uuid]


class PokerConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(args, kwargs)
        self.poker_id = None
        self.poker = None

    def connect(self):
        self.accept()

        self.user_id = self.scope["session"].get("user_id")
        self.poker_id = self.scope["url_route"]["kwargs"]["poker_id"]

        self.poker = PokerSession.get_or_create(self.poker_id)
        if self.user_id in self.poker.users:
            self.user = self.poker.users[self.user_id]
        else:
            self.user = self.poker.add_user(name=self.scope["session"].get("name"))

        if self.user:
            async_to_sync(self.channel_layer.group_add)(self.poker_id, self.channel_name)
            self.init()
        else:
            self.send_json({"type": "error", "message": "User not found"})

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(self.poker_id, self.channel_name)
        if self.user_id:
            print(self.user_id)
            self.poker.remove_user(self.user_id)

            async_to_sync(self.channel_layer.group_send)(self.poker_id, {"type": "init"})
            self.user_id = None

    def receive_json(self, content):
        match (content["action"]):
            case "join":
                new_user = self.poker.add_user(name=content["name"], is_spectator=content["is_spectator"])
                self.user_id = new_user["id"]
                async_to_sync(self.channel_layer.group_send)(self.poker_id, {"type": "init"})

            case "vote":
                if self.user:
                    self.user["vote"] = content["value"]

                    message = {"type": "vote", "user_id": self.user_id, "value": content["value"]}
                    async_to_sync(self.channel_layer.group_send)(self.poker_id, message)

            case "reveal":
                self.poker.is_revealed = True
                async_to_sync(self.channel_layer.group_send)(self.poker_id, {"type": "init"})

            case "clear":
                self.poker.clear()
                async_to_sync(self.channel_layer.group_send)(self.poker_id, {"type": "init"})

            case "change_deck":
                self.poker.cycle_deck()
                async_to_sync(self.channel_layer.group_send)(self.poker_id, {"type": "init"})

    def init(self, event=None):
        # Create the message here to make sure it contains the up to date user and poker session
        user = None
        if self.user:
            user = self.user

        message = {
            "type": "init",
            "is_revealed": self.poker.is_revealed,
            "user": user,
            "users": list(self.poker.users.values()),
            "choices": self.poker.deck_as_list(),
        }
        self.send_json(message)

    def join(self, event):
        self.send_json(event)

    def leave(self, event):
        self.send_json(event)

    def vote(self, event):
        self.send_json(event)
