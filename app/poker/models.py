import uuid

from django.db import models

USER_FIELDS = ("id", "name", "is_spectator", "is_active", "vote")


class PokerSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created = models.DateTimeField(auto_now_add=True)
    is_revealed = models.BooleanField(default=False)

    class Decks(models.TextChoices):
        TSHIRT = "tshirt", "T-shirt sizes"
        FIBONACCI = "fibonacci", "Fibonacci"

    deck = models.CharField(max_length=20, choices=Decks.choices, default=Decks.TSHIRT)

    def __str__(self):
        return f"{self.id}"

    def users_as_list(self):
        return list(self.users.filter(is_active=True).order_by("id").values(*USER_FIELDS))

    def deck_as_list(self):
        return (
            "XS,S,M,L,XL,?,☕️".split(",") if self.deck == self.Decks.TSHIRT else "0,½,1,2,3,5,8,13,20,?,∞,☕️".split(",")
        )

    def clear(self):
        self.users.all().update(vote=None)
        self.is_revealed = False
        self.save()

    def cycle_deck(self):
        if_fibonacci = self.deck == PokerSession.Decks.FIBONACCI
        self.deck = PokerSession.Decks.TSHIRT if if_fibonacci else PokerSession.Decks.FIBONACCI
        self.clear()

    def add_user(self, name, is_spectator=False):
        user, created = self.users.get_or_create(name=name, is_spectator=is_spectator)
        return user

    def deactivate_user(self, user_id):
        self.users.filter(id=user_id).first().deactivate()


class User(models.Model):
    name = models.CharField(max_length=30)
    is_spectator = models.BooleanField(default=False, help_text="Spectators cannot vote themselves")
    is_active = models.BooleanField(
        default=False, help_text="Users are active if they have an active websocket connection"
    )
    created = models.DateTimeField(auto_now_add=True)
    session = models.ForeignKey(PokerSession, on_delete=models.CASCADE, related_name="users")

    vote = models.CharField(max_length=10, null=True)

    def __str__(self):
        return self.name

    def as_dict(self):
        return {field: getattr(self, field) for field in USER_FIELDS}

    def activate(self):
        self.is_active = True
        self.save()

    def deactivate(self):
        self.is_active = False
        self.save()
