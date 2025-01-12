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

from .models import CompanyRegistration
from .serializers import CompanyRegistrationSerializer
from rest_framework.decorators import api_view

from .models import Service  # Import your Service model
from .serializers import ServiceSerializer


class ServiceList(APIView):
    def get(self, request):
        return Response({"message": "Service List View is working!"})


# Dynamically get the user model
CustomUser = get_user_model()

class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data

        # Check for existing username and email
        if CustomUser.objects.filter(username=data.get('username')).exists():
            return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)
        if CustomUser.objects.filter(email=data.get('email')).exists():
            return Response({'error': 'Email already in use'}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new CustomUser
        user = CustomUser.objects.create_user(
            username=data.get('username'),
            email=data.get('email'),
            password=data.get('password'),
            contact_number=data.get('contactNumber'),  # Add contact_number from request
            role=data.get('role', 'Client')  # Use default role if not provided
        )
        user.save()

        return Response({'message': 'Signup successful'}, status=status.HTTP_201_CREATED) #message that shown after signup
    
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user:
            # Generate tokens (if using JWT or session-based auth)
            return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class ForgotPasswordView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')  # Extract the email from the request
        User = get_user_model()  # Dynamically retrieve the custom user model

        try:
            user = User.objects.get(email=email)  # Get the user by email
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist."}, status=400)

        # Logic for sending the password reset email goes here
        return Response({"success": "Password reset email sent successfully."}, status=200)
    


class CompanyRegistrationView(APIView):
    def post(self, request):
        serializer = CompanyRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Company registration submitted successfully!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(['GET'])
def get_company_registrations(request):
    companies = CompanyRegistration.objects.all()  # Fetch all companies from the database
    serializer = CompanyRegistrationSerializer(companies, many=True)  # Serialize the data
    return Response(serializer.data)  # Send the data as a response

@api_view(['POST'])
def approve_company(request, pk):
    try:
        company = CompanyRegistration.objects.get(pk=pk)  # Get the company by its ID
        company.is_approved = True  # Mark as approved
        company.is_rejected = False  # Ensure not rejected
        company.save()  # Save the changes
        return Response({'message': 'Company approved successfully!'}, status=status.HTTP_200_OK)
    except CompanyRegistration.DoesNotExist:
        return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)
    


@api_view(['POST'])
def reject_company(request, pk):
    try:
        company = CompanyRegistration.objects.get(pk=pk)  # Get the company by its ID
        company.is_approved = False  # Mark as not approved
        company.is_rejected = True  # Mark as rejected
        company.save()  # Save the changes
        return Response({'message': 'Company rejected successfully!'}, status=status.HTTP_200_OK)
    except CompanyRegistration.DoesNotExist:
        return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)
    

class ServiceList(APIView):
    def get(self, request):
        # Query all services from the database
        services = Service.objects.all()
        # Serialize the data
        serializer = ServiceSerializer(services, many=True)
        # Return serialized data as a response
        return Response(serializer.data)