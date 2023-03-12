import uuid

from django.db import models

USER_FIELDS = ("id", "name", "is_admin", "is_spectator", "is_active", "vote")


class PokerSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created = models.DateTimeField(auto_now_add=True)
    is_revealed = models.BooleanField(default=False)

    class Decks(models.TextChoices):
        TSHIRT = "tshirt", "T-shirt sizes"
        FIBONACCI = "fibonacci", "Fibonacci"

    deck = models.CharField(max_length=20, choices=Decks.choices)

    def __str__(self):
        return f"{self.id}"

    def users_as_dict(self):
        return list(self.users.values(*USER_FIELDS))

    def deck_as_list(self):
        return "XXS,XS,S,M,L,XL,?,☕️".split(",") if self.deck == "tshirt" else "0,½,1,2,3,5,8,13,20,?,∞,☕️".split(",")

    def add_user(self, name, is_spectator=False):
        is_first = not self.users.exists()

        user, created = self.users.get_or_create(name=name, is_admin=is_first, is_spectator=is_spectator)
        for name in ["Anouk", "Sjaak", "Daniel", "Alex Kerkum", "Alex Kwak", "Arnout", "Lonnie", "Jonathan"]:
            self.users.get_or_create(name=name, vote="S")
        return user

    def deactivate_user(self, name):
        self.users.filter(name=name).update(is_active=False)


class User(models.Model):
    name = models.CharField(max_length=30)
    is_spectator = models.BooleanField(default=False, help_text="Spectators cannot vote themselves")
    is_admin = models.BooleanField(default=False, help_text="Admins can reveal and reset the votes.")
    is_active = models.BooleanField(
        default=False, help_text="Users are active if they have an active websocket connection"
    )
    created = models.DateTimeField(auto_now_add=True)
    session = models.ForeignKey(PokerSession, on_delete=models.CASCADE, related_name="users")

    vote = models.CharField(max_length=10, null=True)

    def as_dict(self):
        return {field: getattr(self, field) for field in USER_FIELDS}

    def activate(self):
        self.is_active = True
        self.save()

    def deactivate(self):
        self.is_active = False
        self.save()
