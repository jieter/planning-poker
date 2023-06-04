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

    def test_reveal(self):
        poker = PokerSession.objects.create()

        poker.reveal()
        self.assertTrue(poker.is_revealed)
        self.assertEqual(poker.reveal_count, 1)

        poker.reveal()
        self.assertEqual(poker.reveal_count, 2)

    def test_is_voting_complete(self):
        poker = PokerSession.objects.create()
        self.assertTrue(poker.is_voting_complete)

        user = poker.add_user("Alice")
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

        self.assertEqual(poker.deck, "tshirt")
        self.assertEqual(poker.deck_as_list()[0], "XS")

        poker.set_deck(PokerSession.Decks.FIBONACCI)
        self.assertEqual(poker.deck, "fibonacci")
        self.assertEqual(poker.deck_as_list()[0], "0")

        poker.set_deck(PokerSession.Decks.TSHIRT)
        self.assertEqual(poker.deck, "tshirt")
        self.assertEqual(poker.deck_as_list()[0], "XS")

        poker.set_deck("foo")
        self.assertEqual(poker.deck, "tshirt")
