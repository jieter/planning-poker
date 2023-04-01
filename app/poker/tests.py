from unittest import TestCase

from .consumers import PokerSession


class PokerTestCase(TestCase):
    def test_users(self):
        poker = PokerSession.get_or_create(None)

        self.assertEqual(poker.users, {})
        user = poker.add_user("Alice")

        self.assertEqual(poker.users, {user["id"]: user})

        poker.remove_user(user["id"])
        self.assertEqual(poker.users, {})

    def test_clear(self):
        poker = PokerSession.get_or_create(None)

        user = poker.add_user("Alice")
        user["vote"] = "L"

        poker.clear()
        self.assertEqual(user["vote"], None)

    def test_cycle_deck(self):
        poker = PokerSession.get_or_create(None)

        self.assertEqual(poker.deck, "tshirt")
        self.assertEqual(poker.deck_as_list()[0], "XXS")

        poker.cycle_deck()
        self.assertEqual(poker.deck, "fibonacci")
        self.assertEqual(poker.deck_as_list()[0], "0")
