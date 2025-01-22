from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Service

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')  # Customize this to show fields in the admin table
    
from .models import CustomUser, Company

# Avoid duplicate registration
@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    pass

@admin.register(Company)
class CompanyRegistrationAdmin(admin.ModelAdmin):
    pass
