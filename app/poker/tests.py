from datetime import datetime

from django.test import TestCase
from django.urls import reverse

from .models import PokerSession


class PokerModelsTestCase(TestCase):
    def test_users(self):
        poker = PokerSession.objects.create()

        self.assertEqual(poker.users_as_list(), [])
        user = poker.add_user("Alice")

        self.assertEqual(poker.users_as_list(), [user.as_dict()])

        poker.deactivate_user(user.pk)
        self.assertEqual(poker.users_as_list(), [])

    def test_join_after_other_user_voted(self):
        poker = PokerSession.objects.create()

        alice = poker.add_user("Alice")
        alice.vote = "L"
        alice.save()

        poker.add_user("Bob")

        self.assertCountEqual([user.vote for user in poker.users.all()], ["L", None])

    def test_reveal(self):
        poker = PokerSession.objects.create()

        poker.reveal()
        self.assertTrue(poker.is_revealed)
        self.assertEqual(poker.reveal_count, 1)

        poker.clear()
        poker.reveal()
        self.assertEqual(poker.reveal_count, 2)

    def test_is_voting_complete(self):
        poker = PokerSession.objects.create()

        user = poker.add_user("Alice")
        self.assertFalse(poker.is_voting_complete)

        user.vote = "L"
        user.save()

        self.assertTrue(poker.is_voting_complete)

        poker = PokerSession.objects.create()
        poker.add_user("Alice", is_spectator=True)
        self.assertFalse(poker.is_voting_complete)

        user = poker.add_user("Bob")
        self.assertFalse(poker.is_voting_complete)
        user.vote = "L"
        user.save()
        self.assertTrue(poker.is_voting_complete)

    def test_clear(self):
        poker = PokerSession.objects.create()

        user = poker.add_user("Alice")
        user.vote = "L"
        user.save()

        poker.clear()
        user.refresh_from_db()
        self.assertEqual(user.vote, None)

    def test_set_deck(self):
        poker = PokerSession.objects.create()

        self.assertEqual(poker.deck, "fibonacci")
        self.assertEqual(poker.deck_as_list()[0], "0")

        poker.set_deck(PokerSession.Deck.FIBONACCI)
        self.assertEqual(poker.deck, "fibonacci")
        self.assertEqual(poker.deck_as_list()[0], "0")

        poker.set_deck(PokerSession.Deck.TSHIRT)
        self.assertEqual(poker.deck, "tshirt")
        self.assertEqual(poker.deck_as_list()[0], "XS")

        poker.set_deck("foo")
        self.assertEqual(poker.deck, "tshirt")

    def test_set_deck_preserves_votes_if_not_changed(self):
        poker = PokerSession.objects.create()
        self.assertEqual(poker.deck, "fibonacci")

        bob = poker.add_user("Bob")
        bob.vote = "L"
        bob.save()
        poker.add_user("Alice")

        poker.set_deck("fibonacci")

        self.assertCountEqual([user.vote for user in poker.users.all()], ["L", None])

    def test_log_as_list(self):
        log_time = datetime.now().strftime("%H:%M:%I")
        poker = PokerSession.objects.create(deck=PokerSession.Deck.TSHIRT)
        bob = poker.add_user("Bob")
        bob.vote = "L"
        bob.save()

        george = poker.add_user("George")
        george.vote = "XL"
        george.save()
        poker.reveal()
        poker.set_deck("fibonacci")

        self.assertEqual(
            poker.log_as_list(),
            [
                {"time": log_time, "event": "clear", "data": {}},
                {"time": log_time, "event": "set_deck", "data": {"deck": "fibonacci"}},
                {"time": log_time, "event": "reveal", "data": {"deck": "tshirt", "round": 1, "votes": ["L", "XL"]}},
                {"time": log_time, "event": "add_user", "data": {"is_spectator": False, "name": "George"}},
                {"time": log_time, "event": "add_user", "data": {"is_spectator": False, "name": "Bob"}},
            ],
        )

    def test_settings_as_dict(self):
        poker = PokerSession.objects.create(deck=PokerSession.Deck.TSHIRT)
        self.assertEqual(
            poker.settings_as_dict(),
            {
                "auto_reveal": True,
                "is_revealed": False,
                "deck": "tshirt",
                "decks": [("tshirt", "T-shirt"), ("fibonacci", "Fibonacci")],
                "choices": ["XS", "S", "M", "L", "XL", "?", "☕️"],
            },
        )

    def test_statistics(self):
        poker = PokerSession.objects.create(reveal_count=1)
        poker.add_user("Bob")
        poker.add_user("Charlie")
        poker.add_user("George")
        poker.logs.create(event="reveal", data={"deck": PokerSession.Deck.FIBONACCI, "votes": ["1", "1", "3"]})

        poker = PokerSession.objects.create(reveal_count=2)
        poker.add_user("Bob")
        poker.add_user("George")
        poker.logs.create(event="reveal", data={"deck": PokerSession.Deck.TSHIRT, "votes": ["L", None, "L"]})
        poker.logs.create(
            event="reveal", data={"deck": PokerSession.Deck.TSHIRT, "votes": ["L", None, "L", "XL", "XL"]}
        )
        # Single vote rounds are ignored
        poker.logs.create(event="reveal", data={"deck": PokerSession.Deck.TSHIRT, "votes": ["L"]})

        self.assertEqual(
            PokerSession.objects.statistics(),
            {
                "basic": (
                    ("Sessions", 2),
                    ("Total votes", 9),
                    ("Average #rounds", 1.5),
                    ("Average #participants", 2.5),
                ),
                "decks": [
                    [("L", 4), ("XL", 2)],
                    [("1", 2), ("3", 1)],
                ],
            },
        )


class ViewTestCase(TestCase):
    def test_index_view(self):
        poker = PokerSession.objects.create()
        poker.add_user("Alice")
        poker.add_user("Bob", is_spectator=True)
        poker.users.get_or_create(name="Charlie", is_active=False)

        response = self.client.get(reverse("poker", args=[poker.id]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Join Alice, Bob in a planning poker session.")
