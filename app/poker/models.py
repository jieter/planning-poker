import uuid
from collections import Counter, defaultdict
from typing import Any

from django.db import models
from django.db.models import Avg, Count
from django.utils import timezone

USER_FIELDS = ("id", "name", "is_spectator", "is_active", "vote")


class PokerSessionManager(models.Manager):
    def statistics(self):
        sessions = self.exclude(reveal_count=0)
        avg_reveal_count = sessions.aggregate(mean=Avg("reveal_count"))["mean"]

        user_count = sessions.values_list(Count("users"), flat=True)

        vote_counter = defaultdict(Counter)
        for deck, votes in (
            Log.objects.filter(event="reveal").values("data__deck").values_list("data__deck", "data__votes")
        ):
            vote_counter[deck].update(filter(lambda x: x, votes))

        return {
            "basic": (
                ("Sessions", self.count()),
                ("Total votes", sum(deck.total() for deck in vote_counter.values())),
                ("Average #rounds", round(avg_reveal_count, 1) if avg_reveal_count else "-"),
                ("Average #participants", round(sum(user_count) / len(user_count), 1) if user_count else "-"),
            ),
            "decks": [
                list(sorted(counter.items(), key=lambda x: x[1], reverse=True)) for counter in vote_counter.values()
            ],
        }


class PokerSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created = models.DateTimeField(auto_now_add=True)
    is_revealed = models.BooleanField(default=False)

    auto_reveal = models.BooleanField(default=True)
    reveal_count = models.IntegerField(default=0)

    class Decks(models.TextChoices):
        TSHIRT = "tshirt", "T-shirt"
        FIBONACCI = "fibonacci", "Fibonacci"

    deck = models.CharField(max_length=20, choices=Decks.choices, default=Decks.TSHIRT)

    objects = PokerSessionManager()

    def __str__(self) -> str:
        return f"{self.id}"

    @property
    def active_users(self):
        return self.users.filter(is_active=True)

    @property
    def is_fibonacci(self) -> bool:
        return self.deck == PokerSession.Decks.FIBONACCI

    def set_deck(self, deck: str) -> None:
        """Set a new deck if the requested dack is different from the current deck."""
        if deck in self.Decks and self.deck != deck:
            self.deck = deck
            self.logs.create(event="set_deck", data={"deck": deck})
            self.clear()

    def reveal(self) -> None:
        if not self.is_revealed:
            self.is_revealed = True
            self.reveal_count += 1
            self.save()

            votes = list(self.active_users.values_list("vote", flat=True))
            self.logs.create(event="reveal", data=dict(round=self.reveal_count, deck=self.deck, votes=votes))

    @property
    def is_voting_complete(self):
        return self.active_users.exclude(is_spectator=True).filter(vote__isnull=True).count() == 0

    def clear(self) -> None:
        """Clear all votes and return to voting state."""
        self.users.all().update(vote=None)
        self.is_revealed = False
        self.save()
        self.logs.create(event="clear")

    def add_user(self, name, is_spectator=False) -> "User":
        user, created = self.users.get_or_create(name=name, is_spectator=is_spectator, is_active=True)
        self.logs.create(event="add_user", data=dict(name=name, is_spectator=is_spectator))
        return user

    def deactivate_user(self, user_id) -> None:
        self.users.filter(id=user_id).first().deactivate()

    def users_as_list(self) -> list[dict]:
        return list(self.active_users.values(*USER_FIELDS))

    def deck_as_list(self) -> list[str]:
        return ("0,½,1,2,3,5,8,13,20,?,∞,☕️" if self.is_fibonacci else "XS,S,M,L,XL,?,☕️").split(",")

    def log_as_list(self) -> list[dict[str, str, dict]]:
        return list(
            {"time": timezone.localtime(created).strftime("%H:%M:%I"), "event": event, "data": data}
            for created, event, data in self.logs.values_list("created", "event", "data")[:20]
        )

    def settings_as_dict(self) -> dict[str, Any]:
        return {
            "auto_reveal": self.auto_reveal,
            "is_revealed": self.is_revealed,
            "deck": self.deck,
            "decks": self.Decks.choices,
            "choices": self.deck_as_list(),
        }


class Log(models.Model):
    session = models.ForeignKey(PokerSession, on_delete=models.CASCADE, related_name="logs")

    created = models.DateTimeField(auto_now_add=True)
    event = models.CharField(max_length=100)
    data = models.JSONField(default=dict)

    class Meta:
        ordering = ("-created",)


class User(models.Model):
    name = models.CharField(max_length=30)
    is_spectator = models.BooleanField(default=False, help_text="Spectators cannot vote themselves")
    is_active = models.BooleanField(
        default=False, help_text="Users are active if they have an active websocket connection"
    )
    created = models.DateTimeField(auto_now_add=True)
    session = models.ForeignKey(PokerSession, on_delete=models.CASCADE, related_name="users")

    vote = models.CharField(max_length=10, null=True)

    class Meta:
        ordering = ["pk"]

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
