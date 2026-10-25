import uuid
from collections import Counter, defaultdict
from datetime import UTC, datetime
from itertools import chain, count
from typing import Any

from django.db import models
from django.db.models import Avg, Count, F
from django.utils import timezone

USER_FIELDS = ("id", "name", "is_spectator", "is_active", "vote")
# Appended to the name of a user joining with the same name as an active user, falling back to numbers.
NAME_SUFFIXES = ("🦊", "🐼", "🐸", "🐙", "🦉", "🐢", "🦔", "🐝")


class PokerSessionManager(models.Manager):
    def statistics(self) -> dict[str, Any]:
        """
        Generate basic statistics.

        Start at 2023-10-01, because we only started collecting detailed logs after that date.
        """
        sessions = self.exclude(reveal_count=0).filter(created__gte=datetime(2023, 10, 1, tzinfo=UTC))
        avg_reveal_count = sessions.aggregate(mean=Avg("reveal_count"))["mean"]
        user_count = sessions.values_list(Count("users"), flat=True)

        vote_counter = defaultdict(Counter)
        reveals = Log.objects.filter(event="reveal")
        for deck, votes in reveals.values("data__deck").values_list("data__deck", "data__votes"):
            votes = list(filter(lambda x: x, votes))
            if len(votes) > 1:  # Ignore rounds with only one vote.
                vote_counter[deck].update(votes)

        def order_by_frequency(counter):
            return list(sorted(counter.items(), key=lambda x: x[1], reverse=True))

        return {
            "basic": (
                ("Sessions", sessions.count()),
                ("Total votes", sum(deck.total() for deck in vote_counter.values())),
                ("Average #rounds", round(avg_reveal_count, 1) if avg_reveal_count else "-"),
                ("Average #participants", round(sum(user_count) / len(user_count), 1) if user_count else "-"),
            ),
            "decks": [order_by_frequency(counter) for counter in vote_counter.values()],
        }


class PokerSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created = models.DateTimeField(auto_now_add=True)
    is_revealed = models.BooleanField(default=False)

    auto_reveal = models.BooleanField(default=True)
    reveal_count = models.IntegerField(default=0)

    class Deck(models.TextChoices):
        TSHIRT = "tshirt", "T-shirt"
        FIBONACCI = "fibonacci", "Fibonacci"

    deck = models.CharField(max_length=20, choices=Deck.choices, default=Deck.FIBONACCI)

    objects = PokerSessionManager()

    def __str__(self) -> str:
        return f"{self.id}"

    @property
    def active_users(self):
        return self.users.filter(is_active=True)

    @property
    def is_fibonacci(self) -> bool:
        return self.deck == PokerSession.Deck.FIBONACCI

    def set_deck(self, deck: str) -> None:
        """Set a new deck if the requested dack is different from the current deck."""
        if deck in self.Deck.values and self.deck != deck:
            self.deck = deck
            self.save(update_fields=["deck"])
            self.logs.create(event="set_deck", data={"deck": deck})
            self.clear()

    def reveal(self) -> None:
        # Update conditionally in the database, so concurrent calls reveal (and count/log the round) only once.
        revealed = PokerSession.objects.filter(pk=self.pk, is_revealed=False).update(
            is_revealed=True, reveal_count=F("reveal_count") + 1
        )
        self.refresh_from_db(fields=["is_revealed", "reveal_count"])
        if revealed:
            votes = list(self.active_users.values_list("vote", flat=True))
            self.logs.create(event="reveal", data=dict(round=self.reveal_count, deck=self.deck, votes=votes))

    @property
    def is_voting_complete(self):
        """With at least one voter, all voters voted."""
        voters = self.active_users.exclude(is_spectator=True)
        return voters.exists() and not voters.filter(vote__isnull=True).exists()

    def clear(self) -> None:
        """Clear all votes and return to voting state."""
        self.users.all().update(vote=None)
        self.is_revealed = False
        self.save(update_fields=["is_revealed"])
        self.logs.create(event="clear")

    def add_user(self, name, is_spectator=False) -> User:
        """Add a user, adding a suffix to the name if an active user already has that name (ignoring case)."""
        max_length = User._meta.get_field("name").max_length
        name = name.strip()[:max_length]

        taken = {n.casefold() for n in self.active_users.values_list("name", flat=True)}
        suffixed = (f"{name[: max_length - len(str(s)) - 1].rstrip()} {s}" for s in chain(NAME_SUFFIXES, count(2)))
        name = next(n for n in chain([name], suffixed) if n.casefold() not in taken)

        user = self.users.create(name=name, is_spectator=is_spectator, is_active=True)
        self.logs.create(event="add_user", data=dict(name=name, is_spectator=is_spectator))
        return user

    def deactivate_user(self, user_id) -> None:
        self.users.filter(id=user_id).first().deactivate()

    def users_as_list(self) -> list[dict]:
        return list(self.active_users.values(*USER_FIELDS))

    def deck_as_list(self) -> list[str]:
        return ("0,½,1,2,3,5,8,13,20,?,∞,☕️" if self.is_fibonacci else "XS,S,M,L,XL,?,☕️").split(",")

    def log_as_list(self, event: str | None = None, limit: int | None = 20) -> list[dict[str, str | dict]]:
        logs = self.logs.filter(event=event) if event else self.logs.all()
        return list(
            {"time": timezone.localtime(created).strftime("%H:%M:%S"), "event": log_event, "data": data}
            for created, log_event, data in logs.values_list("created", "event", "data")[:limit]
        )

    def settings_as_dict(self) -> dict[str, Any]:
        return {
            "auto_reveal": self.auto_reveal,
            "is_revealed": self.is_revealed,
            "deck": self.deck,
            "decks": self.Deck.choices,
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
        self.save(update_fields=["is_active"])

    def deactivate(self) -> None:
        self.is_active = False
        self.save(update_fields=["is_active"])
