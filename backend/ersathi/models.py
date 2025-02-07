from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser

# Service Model
class Service(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


# Define company type choices
COMPANY_TYPE_CHOICES = [
    ('construction', 'Construction Company'),
    ('supplier', 'Material Supplier'),
    ('service', 'Service Provider'),
]


# Company Registration Model
class Company(models.Model):
    company_type = models.CharField(max_length=50, choices=COMPANY_TYPE_CHOICES)
    company_name = models.CharField(max_length=255)
    company_email = models.EmailField(unique=True)
    company_registration_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    location = models.CharField(max_length=255)
    services_provided = models.JSONField(default=list, blank=True)
    is_approved = models.BooleanField(default=False)
    is_rejected = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.company_name
    
# Define CustomUser Model
class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=10, blank=True, null=True)
    is_verified = models.BooleanField(default=False)  # Field to track email verification
    company = models.ForeignKey(Company, on_delete=models.CASCADE, blank = True, null= True) #if company delet, the user will delete
    class Meta:
        verbose_name = "Custom User"
        verbose_name_plural = "Custom Users"

    def __str__(self):
        return self.username
    

#product model
from django.db import models
class Product(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    per_day_rent = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Field for per day rent
    image = models.ImageField(upload_to='product_images/', null=True, blank=True)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)  # Discount percentage
    category = models.CharField(max_length=50, choices=[('selling', 'Selling'), ('renting', 'Renting')])
    company = models.ForeignKey('Company', on_delete=models.CASCADE, related_name='products', null=True, blank=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def final_rent_price(self):
        """Calculate the final rent price after applying discount."""
        if self.per_day_rent and self.discount_percentage:
            discount_amount = (self.per_day_rent * self.discount_percentage) / 100
            return self.per_day_rent - discount_amount
        return self.per_day_rent

    def __str__(self):
        return self.title
    

#
#
#cart and Wishlist
#
#
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cart')
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')  # Ensure a product is added only once per user

class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist')
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')  # Ensure a product is added only once per user