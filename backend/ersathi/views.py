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