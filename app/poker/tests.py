from django.test import TestCase

from .models import PokerSession


class PokerTestCase(TestCase):
    def test_users(self):
        poker = PokerSession.objects.create()

        self.assertEqual(poker.users_as_list(), [])
        user = poker.add_user("Alice")
        user.is_active = True
        user.save()

        self.assertEqual(poker.users_as_list(), [user.as_dict()])

        poker.deactivate_user(user.pk)
        self.assertEqual(poker.users_as_list(), [])

    def test_clear(self):
        poker = PokerSession.objects.create()

        user = poker.add_user("Alice")
        user.vote = "L"
        user.save()

        poker.clear()
        user.refresh_from_db()
        self.assertEqual(user.vote, None)

    def test_cycle_deck(self):
        poker = PokerSession.objects.create()

        self.assertEqual(poker.deck, "tshirt")
        self.assertEqual(poker.deck_as_list()[0], "XS")

        poker.cycle_deck()
        self.assertEqual(poker.deck, "fibonacci")
        self.assertEqual(poker.deck_as_list()[0], "0")
