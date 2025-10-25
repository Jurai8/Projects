from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
   from django.contrib.auth.models import AbstractUser
   from django.db import models

class User(AbstractUser):
    # Ranking
    ranking = models.IntegerField(
        default=0,
        help_text='User ranking or score',
        editable=False 
    )
    
    # Location coordinates
    location_lat = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
        help_text='Latitude coordinate',
        editable=False 
    )
    location_lng = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
        help_text='Longitude coordinate',
        editable=False 
    )

    last_location_update = models.DateTimeField(null=True, blank=True, editable=False )
    
    # Location details
    city = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text='User city'
    )
    country = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text='User country'
    )
    
    # Profile picture
    display_pic = models.ImageField(
        upload_to='profile_pics/',
        blank=True,
        null=True,
        help_text='User profile picture'
    )
   
    def __str__(self):
        return self.username
   