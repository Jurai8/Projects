from django.shortcuts import render
from rest_framework import viewsets, status
from .models import User
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import IsOwnerOrReadOnly
from .serializers import UserSerializer
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
    


class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            token = Token.objects.get(user=user)

            return Response({
                'user': serializer.data,
                'token': token
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)