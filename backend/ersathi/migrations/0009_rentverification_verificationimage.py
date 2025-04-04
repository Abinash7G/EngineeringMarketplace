# Generated by Django 5.1.4 on 2025-02-13 16:28

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ersathi', '0008_remove_transaction_payee_remove_transaction_payer_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='RentVerification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=254)),
                ('phone', models.CharField(max_length=20)),
                ('address', models.TextField()),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('verified', 'Verified'), ('rejected', 'Rejected')], default='pending', max_length=20)),
                ('submitted_at', models.DateTimeField(auto_now_add=True)),
                ('admin_notes', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='VerificationImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='rent_verifications/')),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('verification', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='ersathi.rentverification')),
            ],
        ),
    ]
