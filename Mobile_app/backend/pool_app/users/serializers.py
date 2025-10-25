from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 
            'username', 
            'email',
            'city', 
            'country',
            'ranking',  # Read-only (auto from editable=False)
            'last_known_lat',  # Read-only
            'last_known_lng',  # Read-only
            'display_pic'
        ]

    def create(self, validated_data):
        # Extract password
        password = validated_data.pop('password')
        
        # Create user with hashed password
        user = User.objects.create_user(
            password=password,
            **validated_data  # Spreads all other fields
        )
        return user


    def update(self, instance, validated_data):
        # Extract password if present
        password = validated_data.pop('password', None)
        
        # Let parent class handle other fields
        instance = super().update(instance, validated_data)
        
        # Hash password if provided
        if password:
            instance.set_password(password)
            instance.save()
        
        return instance