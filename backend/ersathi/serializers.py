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
    
from rest_framework import serializers
from .models import CompanyInfo, ProjectInfo, TeamMemberInfo

class ProjectInfoSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(allow_empty_file=True, required=False)

    class Meta:
        model = ProjectInfo
        fields = ['id', 'name', 'description', 'year', 'image']


class TeamMemberInfoSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(allow_empty_file=True, required=False)

    class Meta:
        model = TeamMemberInfo
        fields = ['id', 'name', 'role', 'avatar']


class CompanyInfoSerializer(serializers.ModelSerializer):
    projects = ProjectInfoSerializer(many=True, required=False)
    team = TeamMemberInfoSerializer(many=True, required=False)

    class Meta:
        model = CompanyInfo
        fields = [
            'id',
            'company',
            'company_name',
            'company_email',
            'phone_number',
            'address',
            'logo',
            'about_us',
            'projects',
            'team'
        ]

    def create(self, validated_data):
        projects_data = validated_data.pop('projects', [])
        team_data = validated_data.pop('team', [])
       

        # CompanyInfo instance
        company_info = CompanyInfo.objects.create(**validated_data)

        # Create nested projects
        for project_data in projects_data:
            ProjectInfo.objects.create(company=company_info, **project_data)

        # Create nested team members
        for member_data in team_data:
            TeamMemberInfo.objects.create(company=company_info, **member_data)

        return company_info

    def update(self, instance, validated_data):
        projects_data = validated_data.pop('projects', [])
        team_data = validated_data.pop('team', [])

        # Update simple fields
        instance.company_name = validated_data.get('company_name', instance.company_name)
        instance.company_email = validated_data.get('company_email', instance.company_email)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.address = validated_data.get('address', instance.address)
        if 'logo' in validated_data:
            instance.logo = validated_data['logo']
        instance.about_us = validated_data.get('about_us', instance.about_us)
        instance.save()

        # Recreate projects if data is provided
        if projects_data:
            instance.projects.all().delete()
            for project_data in projects_data:
                ProjectInfo.objects.create(company=instance, **project_data)

        # Recreate team if data is provided
        if team_data:
            instance.team_members.all().delete()
            for member_data in team_data:
                TeamMemberInfo.objects.create(company=instance, **member_data)

        return instance


# serializers.py
from rest_framework import serializers
from .models import Inquiry, Appointment, Company
class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'appointment_date']

class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = [
            'id', 'full_name', 'location', 'email', 'phone_number', 'category', 'sub_service',
            'type_of_building', 'building_purpose', 'num_floors', 'land_area',
            'architectural_style', 'architectural_style_other', 'budget_estimate',
            'special_requirements', 'status', 'created_at',
            'site_plan', 'architectural_plan', 'soil_test_report', 'foundation_design',
            'electrical_plan', 'plumbing_plan', 'hvac_plan', 'construction_permit', 'cost_estimation'
        ]

# serializers.py
class AppointmentSerializer(serializers.ModelSerializer):
    inquiry = InquirySerializer(read_only=True)
    company = serializers.CharField(source='company.company_name', read_only=True)

    class Meta:
        model = Appointment
        fields = ['id', 'inquiry', 'company', 'appointment_date', 'duration_minutes', 'status', 'created_at']




##order
# backend/serializers.py
from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = ['id', 'order_type', 'items', 'total_amount', 'renting_details', 'billing_details', 'status', 'created_at']



# serializers.py
# from rest_framework import serializers
# from .models import Agreement

# class AgreementSerializer(serializers.ModelSerializer):
#     inquiry = serializers.StringRelatedField()
#     service = serializers.StringRelatedField()
#     document = serializers.FileField()
#     signed_document = serializers.FileField()

#     class Meta:
#         model = Agreement
#         fields = ['id', 'inquiry', 'service', 'status', 'created_at', 'document', 'signed_document']# serializers.py
# from rest_framework import serializers
# from .models import Agreement

# class AgreementSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Agreement
#         fields = ['id', 'inquiry', 'company', 'user', 'service', 'company_representative_name', 'service_charge', 'document', 'signed_document', 'status', 'created_at', 'signed_at']
#         read_only_fields = ['created_at', 'signed_at']

#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         # Include full URLs for document and signed_document
#         if instance.document:
#             representation['document'] = instance.document.url
#         if instance.signed_document:
#             representation['signed_document'] = instance.signed_document.url
#         # Include nested fields for inquiry and service
#         representation['inquiry'] = {'full_name': instance.inquiry.full_name}
#         representation['service'] = {'name': instance.service.name}
#         return representation
from rest_framework import serializers
from .models import Agreement

class AgreementSerializer(serializers.ModelSerializer):
    document = serializers.SerializerMethodField()
    signed_document = serializers.SerializerMethodField()

    class Meta:
        model = Agreement
        fields = ['id', 'inquiry', 'company', 'user', 'service', 'company_representative_name', 'service_charge', 'document', 'signed_document', 'status', 'created_at', 'signed_at']
        read_only_fields = ['created_at', 'signed_at']

    def get_document(self, obj):
        if obj.document:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.document.url)
        return None

    def get_signed_document(self, obj):
        if obj.signed_document:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.signed_document.url)
        return None

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Include nested fields for inquiry and service
        representation['inquiry'] = {'full_name': instance.inquiry.full_name}
        representation['service'] = {'name': instance.service.name}
        return representation