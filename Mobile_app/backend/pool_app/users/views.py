from django.shortcuts import render
from rest_framework import viewsets
from .models import User
from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import IsOwnerOrReadOnly
from .serializers import UserSerializer




# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = [UserSerializer]
    
    def get_permissions(self):
        
        if self.action == 'create':
            return [AllowAny()]
        elif self.action in ['update', 'partial-update', 'destroy']:
            return [IsOwnerOrReadOnly()]
        return [IsAuthenticated()]