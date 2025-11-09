from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken import views
from rest_framework.routers import DefaultRouter
from users.views import SignUpView, ListUsers


urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('signin/', views.obtain_auth_token, name='signin'),
    path('search/', ListUsers.as_view(), name='user-search')
]