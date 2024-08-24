from django.contrib import admin
from authentication.models import CustomUser
from django.contrib.auth.admin import UserAdmin
# Register your models here.

class CustomUserAdmin(UserAdmin):
    list_display = ['email','first_name','is_email_verified', 'is_superuser','register_date']
    list_filter = ['is_email_verified']
    search_fields = ['email']
    ordering = ['email']
    
admin.site.register(CustomUser, CustomUserAdmin)