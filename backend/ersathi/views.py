import token
from django.contrib.auth.models import Group
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.utils.crypto import get_random_string


from .models import Company
from .serializers import CompanyRegistrationSerializer
from rest_framework.decorators import api_view

from .models import Service  # Import your Service model
from .serializers import ServiceSerializer

from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import get_object_or_404
from datetime import timedelta
from django.utils.timezone import now


from rest_framework.decorators import api_view , permission_classes

from itsdangerous import URLSafeTimedSerializer

# Configure a secret key (use a strong, unique key)
SECRET_KEY = "2e14a6352c97c2fe33315af6804d89d474432d4d5835326005d55695fd8a4274"
SALT = "c3d00104b56828f98d4592e81dba0ece"

def generate_verification_token(email):
    """
    Generate a token for email verification.
    """
    serializer = URLSafeTimedSerializer(SECRET_KEY)
    return serializer.dumps(email, salt=SALT)

def verify_verification_token(token, expiration=3600):
    """
    Verify the token and return the email if valid.
    :param token: The token to verify.
    :param expiration: Expiry time in seconds.
    """
    serializer = URLSafeTimedSerializer(SECRET_KEY)
    try:
        email = serializer.loads(token, salt=SALT, max_age=expiration)
        return email
    except Exception as e:
        return None  # Token is invalid or expired










class ServiceList(APIView):
    def get(self, request):
        return Response({"message": "Service List View is working!"})


# Dynamically get the user model
CustomUser = get_user_model()

class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data

        if CustomUser.objects.filter(username=data.get('username')).exists():
            return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)
        if CustomUser.objects.filter(email=data.get('email')).exists():
            return Response({'error': 'Email already in use'}, status=status.HTTP_400_BAD_REQUEST)

        user = CustomUser.objects.create_user(
            username=data.get('username'),
            email=data.get('email'),
            password=data.get('password'),
            phone_number=data.get('phoneNumber'),
        )
        user.is_active = False  # Disable login until email is verified
        user.save()

        

        # Send confirmation email
        confirmation_link = f"http://localhost:3001/confirm-email/{generate_verification_token(email=user.email)}"
        send_mail(
            subject="Email Confirmation",
            message=f"Hi {user.username},\n\nPlease confirm your email by clicking the link below:\n{confirmation_link}",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
        )

        return Response({'message': 'Signup successful! Check your email to confirm your account.'}, status=status.HTTP_201_CREATED)

#email confirmation endpoint
class ConfirmEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
            # First check if the user is already verified
            email = verify_verification_token(token)
            if not email: 
                return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
            user = CustomUser.objects.filter(email=email).first()
            if user and user.is_verified:
                return Response({
                    'message': 'Your email has already been verified. You can now login.',
                    'status': 'already_verified'
                }, status=status.HTTP_200_OK)

            # Confirm the user
            user.is_active = True
            user.is_verified = True
            # Check if the group "Platformadmin" exists
            group, created = Group.objects.get_or_create(name='User')
            # Add the user to the group
            user.groups.add(group)
            user.save()

            

            # Send success response before deleting the token
            response = Response({
                'message': 'Email successfully confirmed! You can now login.',
                'status': 'verified'
            }, status=status.HTTP_200_OK)

            # Delete the token after sending the response
            #confirmation_token.delete()
            return response
        



#LOGIN LOGIC
class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        
        if user:
            groups = user.groups.first()
               

            
            # Generate tokens
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(user)

            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "role": groups.name if groups else None,
            }, status=status.HTTP_200_OK)
        
        return Response({"message": "Invalid username or password."}, status=status.HTTP_401_UNAUTHORIZED)

        
class ForgotPasswordView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')  # Extract the email from the request
        User = get_user_model()  # Dynamically retrieve the custom user model

        try:
            user = User.objects.get(email=email)  # Get the user by email
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist."}, status=400)
        
        reset_url = f"http://localhost:3001/restpasswordview/{generate_verification_token(email=user.email)}/"

        send_mail(
                subject="Password Reset Request",
                message=f"Click the link below to reset your password://\n{reset_url}",
                from_email="noreply@yourdomain.com",  # Replace with your sender email
                recipient_list=[email],
                fail_silently=False,
            )
        # Logic for sending the password reset email goes here
        return Response({"success": "Password reset email sent successfully."}, status=200)
        
    
class ResetPasswordView(APIView):
    def post(self, request, token, *args, **kwargs):
        email = verify_verification_token(token)
        if not email: 
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        password = request.data.get('password')
        confirm_password = request.data.get('confirm_password')
        if password != confirm_password:
            return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
        print(password)

        User = get_user_model()
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist."}, status=400)
        print(user.email)
        user.set_password(password)
        user.save()
        return Response({"success": "Password reset Sucessfull."}, status=200)
    
    
        
        





class CompanyRegistrationView(APIView):
    def post(self, request):
        serializer = CompanyRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Company registration submitted successfully!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(['GET'])
def get_company_registrations(request):
    companies = Company.objects.all()  # Fetch all companies from the database
    serializer = CompanyRegistrationSerializer(companies, many=True)  # Serialize the data
    return Response(serializer.data)  # Send the data as a response

# Function to generate username and password
def generate_credentials(company_name):
    random_digits = get_random_string(length=4, allowed_chars='0123456789')
    username = ''.join(e for e in company_name if e.isalnum())[:8] + random_digits
    password = get_random_string(length=12)
    return username.lower(), password

from django.contrib.auth.hashers import make_password  # Import for password hashing


#function to send comany user/password
@api_view(['POST'])
def approve_company(request, pk):
    try:
        company = Company.objects.get(pk=pk)  # Fetch the company using the primary key
        if company.is_approved:
            return Response({'message': 'Company is already approved!'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate username and password
        username, password = generate_credentials(company.company_name)

        # Save the credentials and mark the company as approved
        company.is_approved = True
        company.is_rejected = False
        #company.username = username
        #company.password = make_password(password)  # Save hashed password
        company.save()
        User = get_user_model()
        user = User.objects.create_user(username=username, email=f"{username}@yopmail.com")
        user.set_password(password)
        user.is_verified = True
        user.company = company
        user.save()
        

        # Check if the group "admin" exists
        group, created = Group.objects.get_or_create(name='Admin')

        # Add the user to the group
        user.groups.add(group)
        user.save()


        # Send email to the company with credentials
        send_mail(
            subject="Your Company Login Credentials",
            message=f"""
            Dear {company.company_name},

            Your company has been approved. Below are your login credentials:

            Username: {username}
            Password: {password}

            Please log in and change your password immediately.

            Regards,
            Admin Team
            """,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[company.company_email],
        )

        return Response({'message': 'Company approved successfully!', 'username': username}, status=status.HTTP_200_OK)

    except Company.DoesNotExist:
        return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def reject_company(request, pk):
    try:
        company = Company.objects.get(pk=pk)
        if company.is_rejected:
            return Response({'message': 'Company is  rejected!'}, status=status.HTTP_400_BAD_REQUEST)

        # Mark as rejected
        company.is_approved = False
        company.is_rejected = True
        company.save()

        # Send rejection email
        send_mail(
            subject="Company Registration Rejected",
            message=f"""
            Dear {company.company_name},

            We regret to inform you that your company registration has been rejected. If you have any questions, feel free to contact us.

            Regards,
            Admin Team
            """,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[company.company_email],
        )

        return Response({'message': 'Company rejected successfully!'}, status=status.HTTP_200_OK)

    except Company.DoesNotExist:
        return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_company_details(request, pk):
    try:
        # Fetch the company details using the primary key (id)
        company = Company.objects.get(pk=pk)
        serializer = CompanyRegistrationSerializer(company)  # Serialize the company object
        return Response(serializer.data, status=200)  # Return serialized data
    except Company.DoesNotExist:
        return Response({'error': 'Company not found'}, status=404)  # Handle company not found






class ServiceList(APIView):
    def get(self, request):
        # Query all services from the database
        services = Service.objects.all()
        # Serialize the data
        serializer = ServiceSerializer(services, many=True)
        # Return serialized data as a response
        return Response(serializer.data)



#Userprofile 
from rest_framework.permissions import IsAuthenticated

CustomUser = get_user_model()

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = request.user

    # GET Request: Return the user's profile data
    if request.method == 'GET':
        return Response({
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone_number": user.phone_number,  # Ensure phone_number is included
            "address": user.profile.address if hasattr(user, "profile") else "",
        })

    # PUT Request: Update the user's profile data
    elif request.method == 'PUT':
        data = request.data
        user.first_name = data.get("first_name", user.first_name)
        user.last_name = data.get("last_name", user.last_name)
        user.phone_number = data.get("phone_number", user.phone_number)
        if hasattr(user, "profile"):
            user.profile.address = data.get("address", user.profile.address)
            user.profile.save()
        user.save()

        return Response({"message": "Profile updated successfully!"})
        
    #client profile password change
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    data = request.data
    print(f"Request Data: {request.data}")
    print(f"User: {request.user}")

    current_password = data.get('currentPassword')
    new_password = data.get('newPassword')

    if not user.check_password(current_password):
        return Response({"error": "Current password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

    if new_password:
        user.set_password(new_password)
        user.save()
        return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)

    return Response({"error": "New password is required."}, status=status.HTTP_400_BAD_REQUEST)



#fetching product
from .models import Product
from .serializers import ProductSerializer
@api_view(['GET'])
def get_all_products(request):
    try:
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_products_by_category(request, category):
    products = Product.objects.filter(category=category, is_available=True)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_company_products(request):
    user = request.user
    products = Product.objects.filter(company=user)
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)