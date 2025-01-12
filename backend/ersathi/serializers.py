from rest_framework import serializers
from .models import Service, CompanyRegistration

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name']

class CompanyRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyRegistration
        fields = '__all__'
