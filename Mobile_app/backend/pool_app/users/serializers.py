from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    class Meta:
        model = User
        fields = [
            'id', 
            'username', 
            'email',
            'password',
            'city', 
            'country',
            'ranking',  # Read-only (auto from editable=False)
            'location_lat',  # Read-only
            'location_lng',  # Read-only
            'last_location_update',
            'display_pic'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

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