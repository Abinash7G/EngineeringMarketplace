from django.db import models

# Create your models here.
class Order(models.Model):
    customer_name = models.CharField(max_length=255)
    contact_number = models.CharField(max_length=20)
    delivery_location = models.TextField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

class Payment(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    stripe_payment_intent_id = models.CharField(max_length=255)
    status = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)