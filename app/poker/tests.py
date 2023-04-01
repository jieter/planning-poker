from unittest import TestCase

from .consumers import PokerSession


class PokerTestCase(TestCase):
    def test_clear(self):
        poker = PokerSession.get_or_create(None)

        user = poker.add_user("Alice")
        user["vote"] = "L"

        poker.clear()
        self.assertEqual(user["vote"], None)

    def test_cycle_deck(self):
        poker = PokerSession.get_or_create(None)

        self.assertEqual(poker.deck, "tshirt")

        poker.cycle_deck()
        self.assertEqual(poker.deck, "fibonacci")
