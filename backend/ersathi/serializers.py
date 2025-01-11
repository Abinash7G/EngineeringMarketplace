# serializers.py
from rest_framework import serializers
from .models import Company, Service

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name']


class CompanySerializer(serializers.ModelSerializer):
    services_provided = ServiceSerializer(many=True, read_only=True)

    class Meta:
        model = Company
        fields = [
            'id',
            'company_type',
            'company_name',
            'company_email',
            'company_registration_id',
            'location',
            'services_provided',
        ]


class CompanyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            'company_type',
            'company_name',
            'company_email',
            'company_registration_id',
            'location',
            'services_provided',
        ]
