# Generated by Django 5.1.4 on 2025-03-17 19:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ersathi', '0015_paymentdistribution_booking_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='company',
            name='last_inquiry_check',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
