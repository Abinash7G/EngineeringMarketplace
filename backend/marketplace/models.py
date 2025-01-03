from django.db import models

# Role model for polymorphic user roles
class Role(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


# Abstract user model to handle multiple roles
class User(models.Model):
    ROLE_CHOICES = [
        ('Client', 'Client'),
        ('ConstructionCompany', 'Construction Company'),
        ('MaterialSupplier', 'Material Supplier'),
        ('Admin', 'Admin'),
    ]
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    address = models.TextField(blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)

    class Meta:
        abstract = True


# Specific user models
class Client(User):
    pass


# Service model
class Service(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=100)
    rating = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return self.name

class ConstructionCompany(User):
    verified = models.BooleanField(default=False)
    subscription_status = models.CharField(max_length=50)
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="construction_company")

class MaterialSupplier(User):
    subscription_status = models.CharField(max_length=50)


class Admin(User):
    pass




# Material model
class Material(models.Model):
    supplier = models.ForeignKey(MaterialSupplier, on_delete=models.CASCADE, related_name='materials')
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.IntegerField()

    def __str__(self):
        return self.name


# Booking model
class Booking(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='bookings')
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='bookings')
    date = models.DateTimeField()
    status = models.CharField(max_length=50)
    payment_status = models.CharField(max_length=50)


# Order model
class Order(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='orders')
    material = models.ForeignKey(Material, on_delete=models.CASCADE, related_name='orders')
    quantity = models.IntegerField()
    date = models.DateTimeField()
    status = models.CharField(max_length=50)
    payment_status = models.CharField(max_length=50)


# Milestone model
class Milestone(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='milestones')
    description = models.TextField()
    progress_status = models.CharField(max_length=50)
    deadline = models.DateTimeField()


# Training session model
class TrainingSession(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    date = models.DateTimeField()
    location = models.CharField(max_length=100)
    participants = models.ManyToManyField(ConstructionCompany, related_name='training_sessions')


# Feedback model
class Feedback(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='feedbacks')
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='feedbacks')
    rating = models.IntegerField()
    comments = models.TextField()


# Subscription model
class Subscription(models.Model):
    company = models.ForeignKey(ConstructionCompany, on_delete=models.CASCADE, related_name='subscriptions', null=True, blank=True)
    supplier = models.ForeignKey(MaterialSupplier, on_delete=models.CASCADE, related_name='subscriptions', null=True, blank=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    type = models.CharField(max_length=50)
    status = models.CharField(max_length=50)


# Dispute model
class Dispute(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='disputes', null=True, blank=True)
    company = models.ForeignKey(ConstructionCompany, on_delete=models.CASCADE, related_name='disputes', null=True, blank=True)
    supplier = models.ForeignKey(MaterialSupplier, on_delete=models.CASCADE, related_name='disputes', null=True, blank=True)
    description = models.TextField()
    status = models.CharField(max_length=50)
