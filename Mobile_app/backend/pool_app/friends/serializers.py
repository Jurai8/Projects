from rest_framework import serializers
from .models import Relationship
from django.utils import timezone



class FriendRequestSerializer(serializers.ModelSerializer):
    """Creates a Relationship instance when the user sends a friend request"""

    class Meta:  
        model = Relationship
        fields = ['id', 'user1', 'user2', 'status', 'friend_since', 'blocked_since', 'blocked_by']
        read_only_fields = ['relationship_id', 'friend_since',  'blocked_since', 'blocked_by', 'user1', 'user2']  # Prevent manual setting
    

    def create(self, validated_data):
        # Automatically set the sender of the request
        validated_data['user1'] = self.context['request'].user

        return Relationship.objects.create(**validated_data)
    

    """This will be called when the status of the Relationship is updated"""
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
        
        if new_status == 'accepted':
            instance.friend_since = timezone.now().date()
            instance.blocked_since = None

        # Only allow status updates
        instance.status = validated_data.get('status', instance.status)

        instance.save()

        return instance
    

    def validate(self, data):
        user1 = self.context['request'].user
        user2 = data['user2']

        # Check if the friendship already exists
        if Relationship.are_friends(user1=user1, user2=user2):
            raise serializers.ValidationError("Friendship already exists")
        
        # Check if user is trying to friend themselves
        if user1 == user2:
            raise serializers.ValidationError("Cannot send friend request to yourself")
        

        return data
    



class BlockUserSerializer(serializers.ModelSerializer):
   class Meta:  
        model = Relationship
        fields = ['id', 'user1', 'user2', 'status', 'friend_since', 'blocked_since', 'blocked_by']
        read_only_fields = ['relationship_id', 'friend_since',  'blocked_since', 'blocked_by', 'user1', 'user2']  


        def create(self, validated_data):
            validated_data['user1'] = self.context['request'].user
            status = validated_data.get('status', 'pending')

            if status == 'blocked':
                validated_data['blocked_by'] = self.context['request'].user
                validated_data['blocked_since'] = timezone.now().date()
                validated_data['friend_since'] = None 



            return Relationship.objects.create(**validated_data)
        

        def update(self, instance, validated_data):
            """
            The user may already have a friendship with this person or they need to unblock them 
            """

            # get the user
            user = self.context['request'].user
            status = validated_data['status']

            if status == 'blocked':
                instance.status = 'blocked'
                instance.blocked_by = user
                instance.blocked_since = timezone.now().date()
                instance.friend_since = None

            if status == 'unblocked':
                instance.status = 'unblocked'
                instance.blocked_by = None
                instance.blocked_since = None
                instance.friend_since = None
            

            instance.save()

            return instance
        
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
            if Relationship.is_blocked_by(blocker=user, blocked_user=user2):
                raise serializers.ValidationError(
                    "This user is already blocked by you"
                )