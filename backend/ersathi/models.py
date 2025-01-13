from django.db import models
import uuid

# Create your models here.
from django.contrib.auth.models import AbstractUser
class CustomUser(AbstractUser):
    contact_number = models.CharField(max_length=15, blank=True, null=True)
    role = models.CharField(max_length=20, default="Client")
    is_verified = models.BooleanField(default=False)  # field to track email verification
    
class EmailConfirmationToken(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='email_token')
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)



class Service(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

#
#company registartion model
#
class CompanyRegistration(models.Model):
    COMPANY_TYPE_CHOICES = [
        ('construction', 'Construction Company'),
        ('supplier', 'Material Supplier'),
    ]

    company_type = models.CharField(max_length=50, choices=COMPANY_TYPE_CHOICES)
    company_name = models.CharField(max_length=255)
    company_email = models.EmailField(unique=True)
    company_registration_id = models.CharField(max_length=50, unique=True)
    location = models.CharField(max_length=255)
    services_provided = models.JSONField(default=list, blank=True)  # Optional for Construction
    is_approved = models.BooleanField(default=False)
    is_rejected = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.company_name