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

from django.core.mail import send_mail
from django.conf import settings
from .models import EmailConfirmationToken
from django.shortcuts import get_object_or_404
from datetime import timedelta
from django.utils.timezone import now


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
            contact_number=data.get('contactNumber'),
            role=data.get('role', 'Client')
        )
        user.is_active = False  # Disable login until email is verified
        user.save()

        # Generate and save token
        token = EmailConfirmationToken.objects.create(user=user)

        # Send confirmation email
        confirmation_link = f"http://localhost:3001/confirm-email/{token.token}"
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
        print(f"Received token: {token}")  # Debugging
        try:
            # Retrieve the token from the database
            confirmation_token = EmailConfirmationToken.objects.get(token=token)
            print(f"Found token: {confirmation_token.token} for user: {confirmation_token.user}")  # Debugging

            # Check if the token has expired
            if confirmation_token.created_at < now() - timedelta(days=1):  # Token valid for 24 hours
                return Response({'error': 'Token has expired. Please sign up again or request a new confirmation email.'},
                                status=status.HTTP_400_BAD_REQUEST)

            # Retrieve the associated user
            user = confirmation_token.user
            if user.is_verified:  # Check if the user is already confirmed
                return Response({'message': 'Your email is already confirmed.'}, status=status.HTTP_200_OK)

            # Mark the user as verified and active
            user.is_active = True
            user.is_verified = True
            user.save()

            # Delete the token after successful confirmation
            confirmation_token.delete()

            return Response({'message': 'Email successfully confirmed!'}, status=status.HTTP_200_OK)

        except EmailConfirmationToken.DoesNotExist:
            print("Token does not exist.")  # Debugging
            return Response({'error': 'Invalid or expired toen.'}, status=status.HTTP_400_BAD_REQUEST)



#LOGIN LOGIC
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user:
            if not user.is_verified:
                return Response({'error': 'Please confirm your email before logging in.'}, status=status.HTTP_403_FORBIDDEN)
            return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials. Please try again.'}, status=status.HTTP_401_UNAUTHORIZED)


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