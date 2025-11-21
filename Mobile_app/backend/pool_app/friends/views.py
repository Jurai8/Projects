from .models import Relationship
from django.shortcuts import render
from .serializers import UserSerializer, ListUsersSerializer, BlockUserSerializer
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
    

    # view friends
    @action(detail=False, methods=['get'])
    def get_friends(self, request):
        user = request.user
        queryset = Relationship.get_friends(user)

        serializer = self.get_serializer(queryset, many=True)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )
    

    #!! rather combine all requests in one? then filter on the frontend?
    
    # view rejected requests
    @action(detail=False, methods=['get'])
    def get_outgoing_rejected_friend_requests(self,request):
        user = request.user
        queryset = Relationship.get_(user)

        serializer = self.get_serializer(queryset, many=True)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    # view pending requests
    @action(detail=False, methods=['get'])
    def get_pending_friend_requests(self, request):
        user = request.user
        queryset = Relationship.get_friends(user)

        serializer = self.get_serializer(queryset, many=True)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

class BlockUserViewSet(viewsets.ModelViewSet):
    queryset = Relationship.objects.all()
    serializer_class = BlockUserSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def block_user(self, request):

        serializer = self.get_serializer_class(data=request.data)

        if serializer.is_valid():
            return Response(
                serializer.data,  
                status=status.HTTP_201_CREATED 
            )
        
        return Response(
            serializer.error,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['post'])
    def unblock_user(self, request, pk=None):
        instance = self.get_object()

        serializer = self.get_serializer(instance, data={'status': 'unblocked'})

        if serializer.is_valid():
            return Response(
                serializer.data,  
                status=status.HTTP_200_OK 
            )
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # view users the user has blocked
    @action(detail=False, methods=['get'])
    def get_blocked_users(self, request):
        user = request.user
        queryset = Relationship.get_blocked_users(user)

        serializer = self.get_serializer(queryset, many=True)

    
        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )
        
        