from rest_framework import serializers
from .models import Service, Company, Product

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name']

class CompanyRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'



class ProductSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.company_name', read_only=True)  
    class Meta:
        model = Product
        fields = '__all__'
    def get_image(self, obj):
        request = self.context.get('request')  # Pass `request` context from views
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None