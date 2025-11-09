from django.shortcuts import render
from rest_framework import viewsets, status
from django.contrib.auth import authenticate
from .models import User
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import IsOwnerOrReadOnly
from .serializers import UserSerializer, ListUsersSerializer
from rest_framework.response import Response
from rest_framework.authtoken.models import Token





# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        
        if self.action == 'create':
            return [AllowAny]
        elif self.action in ['update', 'partial-update', 'destroy']:
            return [IsOwnerOrReadOnly]
        return [IsAuthenticated]
    

""" returns a list of users whos usernames match the requested username  """
class ListUsers(APIView):
    # permissions 
        ## Allow authenticated users to access this view

    def get(self, request):
        # Get the search string from query parameters (?username=john)
        username = request.query_params.get('username', '')
        
        # Query the database for matching usernames
        # __icontains = partial match
        users = User.objects.filter(username__icontains=username)
        
        # Serialize the queryset to JSON
        serializer = ListUsersSerializer(users, many=True)  # many=True for multiple objects
        
        if users.exists():
            return Response({
                'users': serializer.data 
            })
        else:
            return Response({
                'users': []  # Return empty list 
            })


class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # token is already created by the signal
            token = Token.objects.get(user=user)

            return Response({
                'user': serializer.data,
                'token': token.key
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class SignInView(APIView):
    # anyone can access the login page
    permission_classes = [AllowAny]

    # post request
    def post(self, request):

        user = authenticate(username=request.POST['username'], password=request.POST['password']) # ! use a serializer
        
        if user is not None:
            token = Token.objects.get_or_create(user=user)

            return Response({
                'token': token.key
            })
           
        else:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)



    
    