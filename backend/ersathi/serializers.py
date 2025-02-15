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
    


from rest_framework import serializers
from .models import RentVerification, VerificationImage

class VerificationImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VerificationImage
        fields = ['id', 'image']

class RentVerificationSerializer(serializers.ModelSerializer):
    images = VerificationImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = RentVerification
        fields = ['id', 'full_name', 'email', 'phone', 'address', 
                 'status', 'submitted_at', 'images', 'uploaded_images']

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        verification = RentVerification.objects.create(**validated_data)
        
        for image in uploaded_images:
            VerificationImage.objects.create(verification=verification, image=image)
        
        return verification

    def update(self, instance, validated_data):
        # Remove non-editable fields to prevent accidental updates
        validated_data.pop('full_name', None)
        validated_data.pop('email', None)
        validated_data.pop('phone', None)

        uploaded_images = validated_data.pop('uploaded_images', [])
        
        # Update address only
        instance.address = validated_data.get('address', instance.address)
        instance.status = "pending"  # status will be pending after resubmitting!
        instance.save()
        
        # Delete existing images and add new ones
        instance.images.all().delete()
        for image in uploaded_images:
            VerificationImage.objects.create(verification=instance, image=image)
        
        return instance