import uuid

from django.db import models

USER_FIELDS = ("id", "name", "is_spectator", "is_active", "vote")


class PokerSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created = models.DateTimeField(auto_now_add=True)
    is_revealed = models.BooleanField(default=False)

    auto_reveal = models.BooleanField(default=False)
    reveal_count = models.IntegerField(default=0)

    class Decks(models.TextChoices):
        TSHIRT = "tshirt", "T-shirt"
        FIBONACCI = "fibonacci", "Fibonacci"

    deck = models.CharField(max_length=20, choices=Decks.choices, default=Decks.TSHIRT)

    def __str__(self) -> str:
        return f"{self.id}"

    @property
    def active_users(self):
        return self.users.filter(is_active=True)

    def users_as_list(self) -> list[dict]:
        return list(self.active_users.order_by("id").values(*USER_FIELDS))

    def deck_as_list(self) -> list:
        return ("0,½,1,2,3,5,8,13,20,?,∞,☕️" if self.is_fibonacci else "XS,S,M,L,XL,?,☕️").split(",")

    @property
    def is_fibonacci(self) -> bool:
        return self.deck == PokerSession.Decks.FIBONACCI

    def set_deck(self, deck: str) -> None:
        if deck in self.Decks:
            self.deck = deck
        self.clear()

    def reveal(self) -> None:
        self.is_revealed = True
        self.reveal_count += 1
        self.save()

    @property
    def is_voting_complete(self):
        return self.active_users.filter(vote__isnull=True).count() == 0

    def clear(self) -> None:
        """Clear all votes and return to voting state."""
        self.users.all().update(vote=None)
        self.is_revealed = False
        self.save()

    def add_user(self, name, is_spectator=False) -> "User":
        user, created = self.users.get_or_create(name=name, is_spectator=is_spectator, is_active=True)
        return user

    def deactivate_user(self, user_id) -> None:
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

    def __str__(self) -> str:
        return self.name

    def as_dict(self) -> dict:
        return {field: getattr(self, field) for field in USER_FIELDS}

    def activate(self) -> None:
        self.is_active = True
        self.save()

    def deactivate(self) -> None:
        self.is_active = False
        self.save()
