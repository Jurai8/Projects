from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from friends.views import FriendRequestViewSet, BlockUserViewSet


router = DefaultRouter()
router.register(r'relationship', FriendRequestViewSet, basename='relationship')
router.register(r'blocked', BlockUserViewSet, basename='block')


urlpatterns = [
    path('', include(router.urls)),
]