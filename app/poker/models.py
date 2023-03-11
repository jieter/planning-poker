import uuid

from django.db import models

PARTICIPANT_FIELDS = ("id", "name", "is_admin", "is_spectator", "vote")


class Session(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created = models.DateTimeField(auto_now_add=True)
    is_revealed = models.BooleanField(default=False)

    class Decks(models.TextChoices):
        TSHIRT = "tshirt", "T-shirt sizes"
        FIBONACCI = "fibonacci", "Fibonacci"

    deck = models.CharField(max_length=20, choices=Decks.choices)

    def __str__(self):
        return f"{self.id}"

    def participants(self):
        return list(self.participant_set.values(*PARTICIPANT_FIELDS))


class Participant(models.Model):
    name = models.CharField(max_length=30)
    is_spectator = models.BooleanField(default=False, help_text="Spectators cannot vote themselves")
    is_admin = models.BooleanField(default=False, help_text="Admins can reveal and reset the votes.")

    created = models.DateTimeField(auto_now_add=True)
    session = models.ForeignKey(Session, on_delete=models.CASCADE)

    vote = models.CharField(max_length=10, null=True)

    def as_dict(self):
        return {field: getattr(self, field) for field in PARTICIPANT_FIELDS}
