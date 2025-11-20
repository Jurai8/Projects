from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

# Create your models here.
class Relationship(models.Model):
    """Represents any relationship between two users"""
    
    STATUS_CHOICES = [
        # Friend statuses
        ('pending', 'Friend Request Pending'),
        ('accepted', 'Friends'),
        ('rejected', 'Friend Request Rejected'),
        
        # Block status
        ('blocked', 'Blocked'),
    ]
    
    relationship_id = models.AutoField(primary_key=True)
    user1 = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='relationships_initiated',
        db_index=True
    )
    user2 = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='relationships_received',
        db_index=True
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='pending'
    )

    friend_since = models.DateField(null=True, blank=True)
    blocked_since = models.DateField(null=True, blank=True)

    blocked_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='blocks_initiated'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'relationships'
        unique_together = ['user1', 'user2']
        indexes = [
            models.Index(fields=['user1', 'status']),
            models.Index(fields=['user2', 'status']),
        ]
    
    def clean(self):
        if self.user1 == self.user2:
            raise ValidationError("Users cannot have a relationship with themselves.")
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.user1.username} → {self.user2.username} ({self.status})"
    
    # Helper properties
    @property
    def is_friendship(self):
        return self.status in ['pending', 'accepted', 'rejected']
    
    @property
    def is_block(self):
        return self.status == 'blocked'
    
    @property
    def is_active_friendship(self):
        return self.status == 'accepted'
    
    # Class methods
    @classmethod
    def get_friends(cls, user):
        """Get all accepted friends for a user"""
        return cls.objects.filter(
            models.Q(user1=user) | models.Q(user2=user),
            status='accepted'
        )
    
    @classmethod
    def get_blocked_users(cls, user):
        """Get all users blocked by this user"""
        return cls.objects.filter(
            user1=user,  # Only where user is the blocker
            status='blocked'
        )
    
    @classmethod
    def are_friends(cls, user1, user2):
        """Check if two users are friends"""
        return cls.objects.filter(
            models.Q(user1=user1, user2=user2) | models.Q(user1=user2, user2=user1),
            status='accepted'
        ).exists()
    
    @classmethod
    def is_blocked(cls, user1, user2):
        """Check if either user has blocked the other"""
        return cls.objects.filter(
            models.Q(user1=user1, user2=user2) | models.Q(user1=user2, user2=user1),
            status='blocked'
        ).exists()
    
    @classmethod
    def is_blocked_by(cls, blocker, blocked_user):
        """Check if blocker has blocked blocked_user"""
        return cls.objects.filter(
            models.Q(user1=blocker, user2=blocked_user) | 
            models.Q(user1=blocked_user, user2=blocker),
            status='blocked',
            blocked_by=blocker
        ).exists()
        
    
    @classmethod
    def get_relationship(cls, user1, user2):
        """Get relationship between two users (regardless of direction)"""
        return cls.objects.filter(
            models.Q(user1=user1, user2=user2) | models.Q(user1=user2, user2=user1)
        ).first()

