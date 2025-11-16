from rest_framework import serializers
from .models import Friendship



class FriendRequestSerializer(serializers.ModelSerializer):
    """Creates a Friendship instance when the user sends a friend request"""

    class Meta:  
        model = Friendship
        fields = ['friendship_id', 'user1', 'user2', 'status', 'friend_since']
        read_only_fields = ['friendship_id', 'friend_since', 'user1']  # Prevent manual setting
    

    def create(self, validated_data):
        # Automatically set the sender of the request
        validated_data['user1'] = self.context['request'].user

        return Friendship.objects.create(**validated_data)
    

    """This will be called when the status of Friendship is updated"""
    def update(self,instance, validated_data):
        request = self.context.get('request')
        new_status = validated_data.get['status']
        

        # Validation: Only recipient can accept/reject
        if instance.user2 != request.user:
            raise serializers.ValidationError(
                "You can only repond to requests sent to you"
            )
        
        if instance.status != 'pending':
            raise serializers.ValidationError(
                "This request no longer exists"
            )
        
        # Validation: Status must be valid
        if new_status not in ['accepted', 'rejected']:
            raise serializers.ValidationError(
                "Status must be 'accepted' or 'rejected'"
            )
        

        # Only allow status updates
        instance.status = validated_data.get('status', instance.status)

        instance.save()

        return instance
    

    def validate(self, data):
        user1 = self.context['request'].user
        user2 = data['user2']

        # Check if the friendship already exists
        if Friendship.friendship_exists(user1=user1, user2=user2):
            raise serializers.ValidationError("Friendship already exists")
        
        # Check if user is trying to friend themselves
        if user1 == user2:
            raise serializers.ValidationError("Cannot send friend request to yourself")
        

        return data
    



class BlockUserSerializer(serializers.ModelSerializer):
   class Meta:  
        model = Friendship
        fields = ['friendship_id', 'user1', 'user2', 'status', 'friend_since']
        read_only_fields = ['friendship_id', 'friend_since', 'user1']  # Prevent manual setting
        
        def validate(self, data):
            # any user can be blocked besides already blocked users and the current user

            user = self.context['request'].user
            user2 = data['user2']

            # if the user tries to block themself
            if user == user2:
                raise serializers.ValidationError(
                    "Cannot block yourself"
                )
            
            # if the requester has already blocked the user
            if Friendship.is_blocked(user1=user, user2=user2):
                raise serializers.ValidationError(
                    "This user is already blocked by you"
                )