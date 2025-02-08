from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import EWallet, CustomUser


@receiver(post_save, sender=CustomUser)
def create_user_ewallet(sender, instance, created, **kwargs):
    """Automatically create an E-Wallet with a default balance when a new user is created."""
    if created:
        # Create the EWallet with a default balance of 3000
        EWallet.objects.create(user=instance, balance=3000.00)

@receiver(post_save, sender=CustomUser)
def save_user_ewallet(sender, instance, **kwargs):
    """Save the E-Wallet when the user instance is saved."""
    try:
        instance.ewallet.save()
    except EWallet.DoesNotExist:
        pass