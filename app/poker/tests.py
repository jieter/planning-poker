import uuid
from datetime import UTC, datetime
from unittest.mock import patch

from asgiref.sync import sync_to_async
from channels.routing import URLRouter
from channels.testing import WebsocketCommunicator
from django.test import TestCase, override_settings
from django.urls import reverse

from app.asgi import application

from . import models
from .models import PokerSession
from .routing import websocket_urlpatterns


class PokerModelsTestCase(TestCase):
    def test_users(self):
        poker = PokerSession.objects.create()

        self.assertEqual(poker.users_as_list(), [])
        user = poker.add_user("Alice")

        self.assertEqual(poker.users_as_list(), [user.as_dict()])

        poker.deactivate_user(user.pk)
        self.assertEqual(poker.users_as_list(), [])

    def test_add_user_with_duplicate_name(self):
        poker = PokerSession.objects.create()
        poker.add_user("Jan", is_spectator=True)
        poker.add_user("Jan")
        self.assertEqual([user["name"] for user in poker.users_as_list()], ["Jan", "Jan 🦊"])

        # The scenario that used to raise MultipleObjectsReturned
        poker.users.filter(name="Jan").update(is_spectator=False)
        poker.add_user("Jan")
        self.assertEqual([user["name"] for user in poker.users_as_list()], ["Jan", "Jan 🦊", "Jan 🐼"])

        # Names of users who left are free again, suffixes fall back to numbers when exhausted
        poker.users.filter(name="Jan").first().deactivate()
        self.assertEqual(poker.add_user("Jan").name, "Jan")
        for suffix in models.NAME_SUFFIXES[2:]:
            self.assertEqual(poker.add_user("Jan").name, f"Jan {suffix}")
        self.assertEqual(poker.add_user("Jan").name, "Jan 2")

    def test_add_user_with_duplicate_name_different_case(self):
        poker = PokerSession.objects.create()
        poker.add_user("Jan")
        self.assertEqual(poker.add_user("jan").name, "jan 🦊")
        self.assertEqual(poker.add_user("JAN").name, "JAN 🐼")

    def test_add_user_name_length(self):
        poker = PokerSession.objects.create()
        long_name = "x" * 100_000
        self.assertEqual(poker.add_user(f"  {long_name}  ").name, "x" * 30)

        # Suffixes for duplicate names fit too
        self.assertEqual(poker.add_user(long_name).name, "x" * 28 + " 🦊")

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

    def test_reveal_concurrently(self):
        poker = PokerSession.objects.create()
        stale = PokerSession.objects.get(pk=poker.pk)

        poker.reveal()
        stale.reveal()
        self.assertTrue(stale.is_revealed)
        self.assertEqual(stale.reveal_count, 1)
        self.assertEqual(poker.logs.filter(event="reveal").count(), 1)

    def test_saves_do_not_overwrite_concurrent_changes(self):
        poker = PokerSession.objects.create()
        alice = poker.add_user("Alice")
        alice.vote = "5"
        alice.save()
        stale_poker = PokerSession.objects.get(pk=poker.pk)
        stale_alice = poker.users.get(pk=alice.pk)

        poker.auto_reveal = False
        poker.save()
        poker.reveal()
        poker.clear()

        stale_poker.set_deck(PokerSession.Deck.TSHIRT)
        stale_alice.deactivate()

        poker.refresh_from_db()
        self.assertFalse(poker.auto_reveal)
        self.assertEqual(poker.reveal_count, 1)
        self.assertEqual(poker.deck, PokerSession.Deck.TSHIRT)
        alice.refresh_from_db()
        self.assertIsNone(alice.vote)
        self.assertFalse(alice.is_active)

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
        # 14:05:37 in Europe/Amsterdam, so a 12-hour clock or a wrong field would show up in the output
        log_time = "14:05:37"
        # Tick a microsecond per call to keep the log ordering (by created) deterministic
        ticks = (datetime(2026, 7, 1, 12, 5, 37, i, tzinfo=UTC) for i in range(1000))
        with patch("django.utils.timezone.now", side_effect=ticks):
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

    def test_log_as_list_reveal_history(self):
        poker = PokerSession.objects.create()
        poker.add_user("Alice")
        for _ in range(15):
            poker.reveal()
            poker.clear()

        self.assertEqual(len(poker.log_as_list()), 20)
        history = poker.log_as_list(event="reveal", limit=None)
        expected = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
        self.assertEqual([entry["data"]["round"] for entry in history], expected)

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

    def test_referrer_policy(self):
        # Other sites (like the CDN) must not get the session URL as referrer.
        poker = PokerSession.objects.create()
        response = self.client.get(reverse("poker", args=[poker.id]))
        self.assertEqual(response["Referrer-Policy"], "same-origin")

    def test_join(self):
        poker = PokerSession.objects.create()
        url = reverse("poker", args=[poker.id])

        response = self.client.post(url, {"name": "   "})
        self.assertEqual(response.status_code, 200)
        self.assertFalse(poker.users.exists())

        response = self.client.post(url, {"name": "x" * 100_000})
        self.assertRedirects(response, url)
        self.assertEqual(poker.users.get().name, "x" * 30)

    def test_index_view_invalid_session_id(self):
        response = self.client.get("/poker/not-a-uuid/")
        self.assertEqual(response.status_code, 404)


@override_settings(CHANNEL_LAYERS={"default": {"BACKEND": "channels.layers.InMemoryChannelLayer"}})
class ConsumerTestCase(TestCase):
    def setUp(self):
        self.poker = PokerSession.objects.create()
        self.alice = self.poker.add_user("Alice")
        self.alice.deactivate()

    def communicator(self, poker_id, user_id):
        communicator = WebsocketCommunicator(URLRouter(websocket_urlpatterns), f"/ws/poker/{poker_id}/")
        communicator.scope["session"] = {"user_id": user_id}
        return communicator

    async def test_connect_and_disconnect(self):
        communicator = self.communicator(self.poker.id, self.alice.id)
        connected, _ = await communicator.connect()
        self.assertTrue(connected)

        message = await communicator.receive_json_from()
        self.assertEqual(message["type"], "init")
        self.assertEqual(message["user"]["name"], "Alice")
        self.assertEqual([user["name"] for user in message["users"]], ["Alice"])

        await communicator.disconnect()
        await sync_to_async(self.alice.refresh_from_db)()
        self.assertFalse(self.alice.is_active)

    async def test_vote(self):
        communicator = self.communicator(self.poker.id, self.alice.id)
        await communicator.connect()
        await communicator.receive_json_from()

        await communicator.send_json_to({"action": "vote", "value": "5"})
        message = await communicator.receive_json_from()
        # Alice is the only voter, so her vote completes the round and it is auto-revealed.
        self.assertEqual(message["type"], "init")
        self.assertEqual(message["users"][0]["vote"], "5")
        self.assertTrue(message["settings"]["is_revealed"])

        await communicator.disconnect()

    async def test_auto_reveal_when_last_voter_leaves(self):
        bob = await sync_to_async(self.poker.add_user)("Bob")
        alice_communicator = self.communicator(self.poker.id, self.alice.id)
        await alice_communicator.connect()
        bob_communicator = self.communicator(self.poker.id, bob.id)
        await bob_communicator.connect()

        await alice_communicator.send_json_to({"action": "vote", "value": "5"})
        await bob_communicator.disconnect()

        # Drain the init messages, the last one contains the state after Bob left.
        while not await alice_communicator.receive_nothing():
            message = await alice_communicator.receive_json_from()
        self.assertEqual([user["name"] for user in message["users"]], ["Alice"])
        self.assertTrue(message["settings"]["is_revealed"])
        self.assertEqual(message["reveal_count"], 1)

        await alice_communicator.disconnect()

    async def test_websocket_origin(self):
        # The full ASGI application, including the origin check. The test runner adds testserver to ALLOWED_HOSTS.
        path = f"/ws/poker/{self.poker.id}/"
        for origin, allowed in [(b"http://testserver", True), (b"https://evil.example", False), (None, False)]:
            with self.subTest(origin=origin):
                headers = [(b"origin", origin)] if origin else []
                communicator = WebsocketCommunicator(application, path, headers=headers)
                connected, _ = await communicator.connect()
                self.assertEqual(connected, allowed)
                await communicator.disconnect()

    async def test_unknown_poker_session(self):
        communicator = self.communicator(uuid.uuid4(), self.alice.id)
        await communicator.connect()
        message = await communicator.receive_json_from()
        self.assertEqual(message, {"type": "error", "message": "Poker session not found"})

        await communicator.send_json_to({"action": "vote", "value": "5"})
        self.assertTrue(await communicator.receive_nothing())

        await communicator.disconnect()

    async def test_user_of_another_poker_session(self):
        other = await sync_to_async(PokerSession.objects.create)()
        bob = await sync_to_async(other.add_user)("Bob")

        communicator = self.communicator(self.poker.id, bob.id)
        await communicator.connect()
        message = await communicator.receive_json_from()
        self.assertEqual(message, {"type": "error", "message": "User not found"})

        # Actions are ignored, and don't crash the consumer
        await communicator.send_json_to({"action": "settings", "is_spectator": True})
        await communicator.send_json_to({"action": "reveal"})
        self.assertTrue(await communicator.receive_nothing())
        await sync_to_async(self.poker.refresh_from_db)()
        self.assertFalse(self.poker.is_revealed)

        await communicator.disconnect()
        await sync_to_async(bob.refresh_from_db)()
        self.assertTrue(bob.is_active, "Disconnecting from another session must not deactivate Bob")
