from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager
# Create your models here.

class CustomUser(AbstractUser):
    
    username = None
    last_name = models.CharField(max_length=150, blank=True, null=True)
    email = models.EmailField(unique= True, max_length=254)
    email_token = models.CharField(max_length=100, null=True, blank=True)
    is_email_verified = models.BooleanField(default=False)
    register_date = models.DateTimeField(auto_now_add=True)
    
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    objects = CustomUserManager()
    
    def __str__(self) -> str:
        return self.email
    
    def name(self):
        return self.first_name + " " +self.last_name