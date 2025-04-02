from decimal import Decimal
from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser
from django.forms import ValidationError




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
    last_inquiry_check = models.DateTimeField(null=True, blank=True)  # New field to track last inquiry check
    def __str__(self):
        return self.company_name


# Service Model
from django.db import models
from django.conf import settings

class ServiceCategory(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

class Service(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(ServiceCategory, on_delete=models.CASCADE, related_name="services")

    def __str__(self):
        return f"{self.name} ({self.category.name})"

class CompanyServices(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="company_services")  # Link to ersathi_company
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="company_services")  # Link to ersathi_service
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # Price in Nepali Rupees
    status = models.CharField(max_length=20, default="Available", choices=[("Available", "Available"), ("Unavailable", "Unavailable")])  # Availability status
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp for creation
    updated_at = models.DateTimeField(auto_now=True)  # Timestamp for updates

    def __str__(self):
        return f"{self.company.company_name}'s {self.service.name} - Rs.{self.price} ({self.status})"

    class Meta:
        unique_together = ('company', 'service') # Ensure a company can't add the same service twice

    
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
    category = models.CharField(max_length=50, choices=[('selling', 'Selling'), ('renting', 'Renting')])
    per_day_rent = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # Field for per day rent
    image = models.ImageField(upload_to='product_images/', null=True, blank=True)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)  # Discount percentage
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

#####################
##COMPANY_INFO####
#####################

from django.db import models
from django.conf import settings

class CompanyInfo(models.Model):
    customuser = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # Use settings.AUTH_USER_MODEL instead of User
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='company_infos'
    )

    company = models.ForeignKey(
        Company,  # Make sure Company model is imported
        on_delete=models.CASCADE, 
        related_name='company_info'
    )
    
    # Rest of your existing fields remain the same
    company_name = models.CharField(max_length=255)
    company_email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=255)
    logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    about_us = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.company_name

class ProjectInfo(models.Model):
    company = models.ForeignKey(
        CompanyInfo,
        on_delete=models.CASCADE,
        related_name='projects'
    )
    name = models.CharField(max_length=255)
    description = models.TextField(max_length=200)
    year = models.CharField(max_length=20, default="")
    image = models.ImageField(upload_to='project_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
class TeamMemberInfo(models.Model):
    company = models.ForeignKey(CompanyInfo, on_delete=models.CASCADE, related_name='team_members')
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=100)
    avatar = models.ImageField(upload_to='team_avatars/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name



    

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

########
##RentVerification Model
#########

from django.db import models

class RentVerification(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected')
    ]
    
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    submitted_at = models.DateTimeField(auto_now_add=True)
    admin_notes = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.full_name} - {self.status}"

class VerificationImage(models.Model):
    verification = models.ForeignKey(RentVerification, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='rent_verifications/')
    uploaded_at = models.DateTimeField(auto_now_add=True)


###########
#Payment#
"""
class EWallet(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='ewallet')
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=3000.00)  # Default balance is 3000

    def _str_(self):
        return f"{self.user.username}'s E-Wallet"

    def transfer_balance(self, payee, amount):
       / Transfer balance from this user's wallet to another user's wallet./
        if self.balance >= amount:
            # Subtract from payer (this user)
            self.balance -= amount
            self.save()

            # Add to payee's wallet
            payee_wallet = EWallet.objects.get(user=payee)
            payee_wallet.balance += amount
            payee_wallet.save()

            return True
        return False

    def get_balance(self):
        /Return the current balance./
        return self.balance
    
class Transaction(models.Model):
    payer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='transactions_made')
    payee = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='transactions_received')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    description = models.CharField(max_length=255, null=True, blank=True)  # Optional description for the transaction
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed')
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    admin_commission = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def save(self, *args, **kwargs):
        if not self.pk:  # Only on creation
            # Calculate 3% commission
            fee_percentage = Decimal('0.03')
            self.admin_commission = self.amount * fee_percentage
            self.status = 'completed'  # Set to completed when payment is successful
        super().save(*args, **kwargs)

    def _str_(self):
        return f"Transaction of {self.amount} from {self.payer.username} to {self.payee.username}"

    class Meta:
        ordering = ['-date']

    def save(self, *args, **kwargs):
        //Override the save method to handle balance transfer.//
        print("Starting transaction save process...")

        # Ensure payer and payee are valid users
        if not self.payer or not self.payee:
            print("Payer or payee is missing.")
            raise ValidationError("Payer and payee must be valid users.")

        # Ensure payer and payee are not the same
        if self.payer == self.payee:
            print("Payer and payee are the same.")
            raise ValidationError("Payer and payee cannot be the same.")

        # Convert amount to Decimal (if it's not already)
        try:
            self.amount = Decimal(str(self.amount))  # Convert to string first, then to Decimal
        except (TypeError, ValueError):
            print("Invalid amount value.")
            raise ValidationError("Amount must be a valid number.")

        # Ensure the amount is positive
        if self.amount <= Decimal('0'):  # Compare with Decimal('0')
            print("Amount is not positive.")
            raise ValidationError("Amount must be greater than zero.")

        # Get the payer's e-wallet
        try:
            payer_wallet = EWallet.objects.get(user=self.payer)
            print(f"Payer's wallet found with balance: {payer_wallet.balance}")
        except EWallet.DoesNotExist:
            print(f"Payer {self.payer.username} does not have an e-wallet.")
            raise ValidationError(f"Payer {self.payer.username} does not have an e-wallet.")

        # Get the payee's e-wallet
        try:
            payee_wallet = EWallet.objects.get(user=self.payee)
            print(f"Payee's wallet found with balance: {payee_wallet.balance}")
        except EWallet.DoesNotExist:
            print(f"Payee {self.payee.username} does not have an e-wallet.")
            raise ValidationError(f"Payee {self.payee.username} does not have an e-wallet.")

        # Get the admin's e-wallet
        try:
            admin_user = CustomUser.objects.get(username="admin")  # Replace "admin" with the actual admin username
            admin_wallet = EWallet.objects.get(user=admin_user)
            print(f"Admin's wallet found with balance: {admin_wallet.balance}")
        except CustomUser.DoesNotExist:
            print("Admin user does not exist.")
            raise ValidationError("Admin user does not exist.")
        except EWallet.DoesNotExist:
            print("Admin does not have an e-wallet.")
            raise ValidationError("Admin does not have an e-wallet.")

        # Calculate 3% of the transaction amount
        fee_percentage = Decimal('0.03')  # 3%
        fee_amount = self.amount * fee_percentage
        remaining_amount = self.amount - fee_amount

        # Check if the payer has sufficient balance
        if payer_wallet.balance < self.amount:
            print(f"Insufficient balance in {self.payer.username}'s e-wallet.")
            raise ValidationError(f"Insufficient balance in {self.payer.username}'s e-wallet.")

        # Perform the balance transfer
        print(f"Transferring {self.amount} from {self.payer.username} to {self.payee.username}...")

        # Deduct the full amount from the payer
        payer_wallet.balance -= self.amount

        # Add the fee amount to the admin's wallet
        admin_wallet.balance += fee_amount

        # Add the remaining amount to the payee's wallet
        payee_wallet.balance += remaining_amount

        # Save the updated wallets
        payer_wallet.save()
        admin_wallet.save()
        payee_wallet.save()
        print("Balance transfer successful.")

        # Save the transaction
        super().save(*args, **kwargs)
        print("Transaction saved successfully.")

"""""
# # models.py
# from django.db import models
# from django.conf import settings

# class Inquiry(models.Model):
#     user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='inquiries')
#     company = models.ForeignKey('Company', on_delete=models.CASCADE, related_name='inquiries', db_column='company_id')
#     full_name = models.CharField(max_length=100)
#     location = models.CharField(max_length=200)
#     email = models.EmailField()
#     phone_number = models.CharField(max_length=20)
#     category = models.CharField(max_length=100)
#     sub_service = models.CharField(max_length=100)
#     type_of_building = models.CharField(max_length=50, blank=True, null=True)
#     building_purpose = models.CharField(max_length=200, blank=True, null=True)
#     num_floors = models.PositiveIntegerField(blank=True, null=True)
#     land_area = models.CharField(max_length=50, blank=True, null=True)
#     architectural_style = models.CharField(max_length=100, blank=True, null=True)
#     architectural_style_other = models.CharField(max_length=100, blank=True, null=True)
#     budget_estimate = models.CharField(max_length=50, blank=True, null=True)
#     special_requirements = models.TextField(blank=True, null=True)
#     site_plan = models.FileField(upload_to='inquiry_files/', blank=True, null=True)
#     architectural_plan = models.FileField(upload_to='inquiry_files/', blank=True, null=True)
#     soil_test_report = models.FileField(upload_to='inquiry_files/', blank=True, null=True)
#     foundation_design = models.FileField(upload_to='inquiry_files/', blank=True, null=True)
#     electrical_plan = models.FileField(upload_to='inquiry_files/', blank=True, null=True)
#     plumbing_plan = models.FileField(upload_to='inquiry_files/', blank=True, null=True)
#     hvac_plan = models.FileField(upload_to='inquiry_files/', blank=True, null=True)
#     construction_permit = models.FileField(upload_to='inquiry_files/', blank=True, null=True)
#     cost_estimation = models.FileField(upload_to='inquiry_files/', blank=True, null=True)
#     status = models.CharField(
#         max_length=20,
#         choices=[('Pending', 'Pending'), ('Scheduled', 'Scheduled'), ('Completed', 'Completed'), ('No-Show', 'No-Show'),],
#         default='Pending'
#     )
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.full_name} - {self.company.company_name}"

# models.py
from django.db import models
from django.conf import settings

class Inquiry(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='inquiries')
    company = models.ForeignKey('Company', on_delete=models.CASCADE, related_name='inquiries', db_column='company_id')
    full_name = models.CharField(max_length=100)
    location = models.CharField(max_length=200)
    email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    category = models.CharField(max_length=100)
    sub_service = models.CharField(max_length=100)
    status = models.CharField(
        max_length=20,
        choices=[('Pending', 'Pending'), ('Scheduled', 'Scheduled'), ('Completed', 'Completed'), ('No-Show', 'No-Show')],
        default='Pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    certificate = models.FileField(upload_to='certificates/', null=True, blank=True)  
    def __str__(self):
        return f"{self.full_name} - {self.company.company_name}"

# Base model for service-specific form data
class ServiceFormData(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True  # This makes it a base class that won't create a table itself

# Engineering Consulting Form Data
class EngineeringConsultingData(ServiceFormData):
    inquiry = models.OneToOneField(Inquiry, on_delete=models.CASCADE, related_name='engineering_data')
    type_of_building = models.CharField(max_length=50, blank=True, null=True)
    building_purpose = models.CharField(max_length=200, blank=True, null=True)
    num_floors = models.PositiveIntegerField(blank=True, null=True)
    land_area = models.CharField(max_length=50, blank=True, null=True)
    architectural_style = models.CharField(max_length=100, blank=True, null=True)
    architectural_style_other = models.CharField(max_length=100, blank=True, null=True)
    budget_estimate = models.CharField(max_length=50, blank=True, null=True)
    special_requirements = models.TextField(blank=True, null=True)
    site_plan = models.FileField(upload_to='inquiry_files/engineering/', blank=True, null=True)
    architectural_plan = models.FileField(upload_to='inquiry_files/engineering/', blank=True, null=True)
    soil_test_report = models.FileField(upload_to='inquiry_files/engineering/', blank=True, null=True)
    foundation_design = models.FileField(upload_to='inquiry_files/engineering/', blank=True, null=True)
    electrical_plan = models.FileField(upload_to='inquiry_files/engineering/', blank=True, null=True)
    plumbing_plan = models.FileField(upload_to='inquiry_files/engineering/', blank=True, null=True)
    hvac_plan = models.FileField(upload_to='inquiry_files/engineering/', blank=True, null=True)
    construction_permit = models.FileField(upload_to='inquiry_files/engineering/', blank=True, null=True)
    cost_estimation = models.FileField(upload_to='inquiry_files/engineering/', blank=True, null=True)

# Building Construction Form Data
class BuildingConstructionData(ServiceFormData):
    inquiry = models.OneToOneField(Inquiry, on_delete=models.CASCADE, related_name='building_data')
    # Common fields
    lalpurja = models.FileField(upload_to='inquiry_files/building/', blank=True, null=True)
    napi_naksa = models.FileField(upload_to='inquiry_files/building/', blank=True, null=True)
    tax_clearance = models.FileField(upload_to='inquiry_files/building/', blank=True, null=True)
    approved_building_drawings = models.FileField(upload_to='inquiry_files/building/', blank=True, null=True)
    
    # Residential fields
    soil_test_report = models.FileField(upload_to='inquiry_files/building/', blank=True, null=True)
    structural_stability_certificate = models.FileField(upload_to='inquiry_files/building/', blank=True, null=True)
    house_design_approval = models.FileField(upload_to='inquiry_files/building/', blank=True, null=True)
    neighbour_consent = models.FileField(upload_to='inquiry_files/building/', blank=True, null=True)
    
    # Commercial fields
    iee_report = models.FileField(upload_to='inquiry_files/building/', blank=True, null=True)
    fire_safety_certificate = models.FileField(upload_to='inquiry_files/building/', blank=True, null=True)
    lift_permit = models.FileField(upload_to='inquiry_files/building/', blank=True, null=True)
    parking_layout_plan = models.FileField(upload_to='inquiry_files/building/', blank=True, null=True)
    commercial_special_requirements = models.TextField(blank=True, null=True)
    
    # Renovation fields
    type_of_building = models.CharField(max_length=50, blank=True, null=True)
    existing_building_details = models.TextField(blank=True, null=True)
    owner_permission_letter = models.FileField(upload_to='inquiry_files/building/', blank=True, null=True)
    existing_structure_analysis = models.FileField(upload_to='inquiry_files/building/', blank=True, null=True)
    renovation_plan = models.FileField(upload_to='inquiry_files/building/', blank=True, null=True)
    noc_municipality = models.FileField(upload_to='inquiry_files/building/', blank=True, null=True)
    waste_management_plan = models.FileField(upload_to='inquiry_files/building/', blank=True, null=True)
    area_to_renovate = models.CharField(max_length=50, blank=True, null=True)
    budget_estimate = models.CharField(max_length=50, blank=True, null=True)
    renovation_special_requirements = models.TextField(blank=True, null=True)

# Post Construction Maintenance Form Data
class PostConstructionMaintenanceData(ServiceFormData):
    inquiry = models.OneToOneField(Inquiry, on_delete=models.CASCADE, related_name='maintenance_data')
    maintenance_type = models.CharField(max_length=100, blank=True, null=True)
    maintenance_details = models.TextField(blank=True, null=True)
    maintenance_photos = models.FileField(upload_to='inquiry_files/maintenance/', blank=True, null=True)
    preferred_date = models.DateField(blank=True, null=True)
    preferred_time = models.CharField(max_length=50, blank=True, null=True)
    payment_agreed = models.BooleanField(default=False)

# Safety Training Form Data
class SafetyTrainingData(ServiceFormData):
    inquiry = models.OneToOneField(Inquiry, on_delete=models.CASCADE, related_name='training_data')
    language_preference = models.CharField(max_length=50, blank=True, null=True)
    language_preference_other = models.CharField(max_length=100, blank=True, null=True)
    training_date = models.DateField(blank=True, null=True)
    training_time = models.CharField(max_length=50, blank=True, null=True)
    training_agreement = models.BooleanField(default=False)




# Signal to send WebSocket notification on new inquiry
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.db.models.signals import post_save
@receiver(post_save, sender=Inquiry)
def send_inquiry_notification(sender, instance, created, **kwargs):
    if created:
        company = instance.company
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'company_{company.id}_inquiries',
            {
                'type': 'inquiry_update',
                'message': 'New inquiry received'
            }
        )




class Appointment(models.Model):
    inquiry = models.OneToOneField(Inquiry, on_delete=models.CASCADE, related_name='appointment')
    company = models.ForeignKey('Company', on_delete=models.CASCADE, related_name='appointments', db_column='company_id')
    appointment_date = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField(default=21)
    status = models.CharField(
        max_length=20,
        choices=[('Pending', 'Pending'), ('Confirmed', 'Confirmed'), ('No-Show', 'No-Show'), ('Completed', 'Completed')],
        default='Pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.inquiry.full_name} - {self.appointment_date}"
    


###order


class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="orders")
    order_type = models.CharField(max_length=20, choices=[('buying', 'Buying'), ('renting', 'Renting')])
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    renting_details = models.JSONField(null=True, blank=True)  # For renting-specific details
    billing_details = models.JSONField(null=True, blank=True)  # For buying-specific details
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    booking_id = models.CharField(max_length=255, null=True, blank=True)  # Add this field
    def __str__(self):
        return f"Order {self.id} - {self.order_type} for {self.company.company_name}"

# OrderItem Model (Each product in an order)
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    def __str__(self):
        return f"{self.quantity} x {self.product.name} in Order {self.order.id}"

# PaymentDistribution Model (To split payments among companies)
class PaymentDistribution(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="payment_distributions")
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=20, default='pending')
    payment_reference = models.CharField(max_length=255, null=True, blank=True)  # e.g., Khalti transaction ID
    created_at = models.DateTimeField(auto_now_add=True)
    booking_id = models.CharField(max_length=255, null=True, blank=True)
    def __str__(self):
        return f"Payment of Rs. {self.amount} to {self.company.company_name} for Order {self.order.id}"





# models.py
from django.db import models
from django.conf import settings

class Agreement(models.Model):
    inquiry = models.ForeignKey('Inquiry', on_delete=models.CASCADE, related_name='agreements')
    company = models.ForeignKey('Company', on_delete=models.CASCADE, related_name='agreements')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='agreements')
    service = models.ForeignKey('Service', on_delete=models.CASCADE)
    company_representative_name = models.CharField(max_length=100, blank=True, null=True)  # Manual input for company rep name
    service_charge = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # Service charge in NPR
    document = models.FileField(upload_to='agreements/', blank=True, null=True)  # Generated agreement PDF
    signed_document = models.FileField(upload_to='signed_agreements/', blank=True, null=True)  # Signed agreement uploaded by client/company
    status = models.CharField(
        max_length=20,
        choices=[('Draft', 'Draft'), ('Sent', 'Sent'), ('Signed', 'Signed'), ('Rejected', 'Rejected')],
        default='Draft'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    signed_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"Agreement for {self.inquiry.full_name} - {self.service.name}"