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
    

###companyInfofrom rest_framework import serializers
# ersathi/serializers.py
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
        fields = ['id', 'company', 'company_name', 'company_email', 'phone_number', 'address', 'logo', 'about_us', 'projects', 'team']

    def create(self, validated_data):
        projects_data = validated_data.pop('projects', [])
        team_data = validated_data.pop('team', [])
        company_info = CompanyInfo.objects.create(**validated_data)

        for project_data in projects_data:
            ProjectInfo.objects.create(company=company_info, **project_data)
        for member_data in team_data:
            TeamMemberInfo.objects.create(company=company_info, **member_data)

        return company_info

    def update(self, instance, validated_data):
        projects_data = validated_data.pop('projects', [])
        team_data = validated_data.pop('team', [])

        instance.company_name = validated_data.get('company_name', instance.company_name)
        instance.company_email = validated_data.get('company_email', instance.company_email)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.address = validated_data.get('address', instance.address)
        if 'logo' in validated_data:
            instance.logo = validated_data['logo']
        instance.about_us = validated_data.get('about_us', instance.about_us)
        instance.save()

        if projects_data:
            instance.projects.all().delete()
            for project_data in projects_data:
                ProjectInfo.objects.create(company=instance, **project_data)
        if team_data:
            instance.team.all().delete()
            for member_data in team_data:
                TeamMemberInfo.objects.create(company=instance, **member_data)

        return instance