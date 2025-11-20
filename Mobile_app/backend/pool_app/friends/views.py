from .models import Relationship
from django.shortcuts import render
from .serializers import UserSerializer, ListUsersSerializer
from django.contrib.auth import authenticate
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import FriendRequestSerializer

# Create your views here.
    
    
class FriendRequestViewSet(viewsets.ModelViewSet):
    queryset = Relationship.objects.all()
    serializer_class = FriendRequestSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def send(self, request):
        """Creates the friendship instance and sets status to pending"""
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid(): 
            serializer.save()

            return Response(
                serializer.data,  
                status=status.HTTP_201_CREATED 
            )
        
        return Response(
            serializer.errors,  
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['post'])
    def accept(self, request):
        """Updates friendship status (accepts friend request)"""
        friendship = self.get_object()  # Get the friendship by ID from URL
        serializer = self.get_serializer(friendship, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            
            return Response(
                serializer.data,
                status=status.HTTP_200_OK,
            )
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['post'])
    def reject(self, request):
        """Updates friendship status (rejects friend request)"""
        friendship = self.get_object()  # Get the friendship by ID from URL
        serializer = self.get_serializer(friendship, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            
            return Response(
                serializer.data,
                status=status.HTTP_200_OK,
            )
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    

class BlockUserViewSet(viewsets.ModelViewSet):
    queryset = Relationship.objects.all()
    serializer_class = BlockUserSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'])
    def block_user(self, request):
