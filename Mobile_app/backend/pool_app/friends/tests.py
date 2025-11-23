from django.test import TestCase
from django.test import Client
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase



User = get_user_model()

# Create your tests here.
class TestFriendships(APITestCase):
    def setUp(self):
        # create the test Users
        self.user1 = User.objects.create_user(
            username='user1',
            password='testpass123'
        )
        self.user2 = User.objects.create_user(
            username='user2',
            password='testpass123'
        )
        
        # Authenticate as user1
        self.client.force_authenticate(user=self.user1)

    def test_send_request(self):
        # get the url
        url = reverse('relationship-send')

        # send the request
        response = self.client.post(
            url,
            {'user2': self.user2.id},
            format='json'
        )

        print(f"📦 Response-1: {response.json()}")
        
        # check if it succeeded
        self.assertEqual(response.json()['status'], 'pending')
        self.assertEqual(response.status_code, 201)


class TestBlocks(APITestCase):
    def setUp(self):
        # create test users
        self.user1 = User.objects.create(
            username='king',
            password='King1234@'
        )

        self.user2 = User.objects.create(
            username='queen',
            password='queen1234@'
        )

        # authenticate user1 (the sender)
        self.client.force_authenticate(user=self.user1)

    # test if the user can block other user
    def test_blocking(self):
        url = reverse('block-block-user')
        response = self.client.post(url,
            {
                'user2': self.user2.id,
                'status': 'blocked'
            },
            format='json'
        )

        print(f"📦 Response: {response.json()}")
        
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['status'], 'blocked')
