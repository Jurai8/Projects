from .models import User
from .permissions import IsOwnerOrReadOnly
from .serializers import UserSerializer, ListUsersSerializer
from django.contrib.auth import authenticate
from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView





# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    """
      this custom view is for when a user wants to view another users profile
    """
    # /api/users/get_user/
    @action(detail=False, methods=['get'])
    def get_user(self, request):
        # get username from request
        req_user = request.query_params.get('username')

        if not req_user:
            return Response({'error': 'Username parameter required'}, status=400)

       
        try:
            # query db for that user
            user = User.objects.get(username=req_user)

            # get the user data from the serializer
            serializer = self.get_serializer(user)

            # return serializer data
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        

        # ! i'll need a seperate profile view for the user that owns the profile

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
    permission_classes = [AllowAny]

    def get(self, request):
        # Get the search string from query parameters (?username=john)
        # ! return an error
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



    
    