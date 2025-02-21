from ast import Load
import token
from typing import Generic
from django.contrib.auth.models import Group
from django.forms import ValidationError
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

import os
import json
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from dotenv import load_dotenv

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
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
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
        serializer = ProductSerializer(products, many=True)
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


# #post Product from from company 
# class CreateProduct(APIView):
#     permission_classes = [AllowAny]
#     def post(self, request):
#         user = request.user
#         data = request.data
#         try:
#             # Assign company dynamically
#             company = user.company
#             category = "Renting" if "Construction" in company.company_type else "Selling"

#             # Create a new product
#             product = Product.objects.create(
#                 title=data['title'],
#                 description=data['description'],
#                 price=data['price'],
#                 per_day_rent=data['per_day_rent'],
#                 image=data.get('image'),
#                 discount_percentage=data['discount_percentage'],
#                 category=category,
#                 company=company,
#                 is_available=data['is_available'],
#             )
#             serializer = ProductSerializer(product)
#             return Response(serializer.data, status=201)
#         except Exception as e:
#             return Response({"error": str(e)}, status=500)

from decimal import Decimal
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Product

class Test(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        # 1) Check if user has a company
        company = getattr(user, "company", None)
        if company is None:
            return Response({"error": "This user has no associated company."}, status=400)

        # 2) Read category from request instead of forcing it
        data = request.data
        category = data.get("category", "").lower()  # Ensure lowercase consistency

        # 3) Validate category
        if category not in ["selling", "renting"]:
            return Response({"error": "Invalid category. Must be 'Selling' or 'Renting'."}, status=400)

        # 4) Read the uploaded file
        image_file = request.FILES.get("image")

        # 5) Convert 'discountPercentage' to Decimal (handle empty case)
        discount_value = Decimal(data.get("discountPercentage", "0"))  # Default to 0

        # 6) Convert 'isAvailable' string to boolean
        is_available = data.get("isAvailable", "false").lower() == "true"

        # 7) Handle per_day_rent properly
        per_day_rent = None
        if category == "renting":
            try:
                per_day_rent = Decimal(data.get("perDayRent", "0"))  # Default to 0 if missing
            except:
                return Response({"error": "Invalid perDayRent value."}, status=400)

        # 8) Create the new product
        product = Product.objects.create(
            title=data["title"],
            description=data["description"],
            price=Decimal(data["price"]),
            category=category,  # Now using frontend category
            per_day_rent=per_day_rent,  # Allow NULL for "Selling"
            discount_percentage=discount_value,
            image=image_file,  # Handle file
            company=company,
            is_available=is_available,
        )

        return Response({"message": "Product created successfully"}, status=201)

            
# ########
# ##RentVerification view
# #########        
# # views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.mail import send_mail
from django.conf import settings
from .models import RentVerification
from .serializers import RentVerificationSerializer

class RentVerificationCreateView(generics.CreateAPIView):
    queryset = RentVerification.objects.all()
    serializer_class = RentVerificationSerializer
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        # Prepare the data including multiple images
        data = {
            'full_name': request.data.get('full_name'),
            'email': request.data.get('email'),
            'phone': request.data.get('phone'),
            'address': request.data.get('address'),
            'uploaded_images': request.FILES.getlist('images')
        }
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class RentVerificationAdminView(generics.UpdateAPIView):
    queryset = RentVerification.objects.all()
    serializer_class = RentVerificationSerializer

    def update(self, request, *args, **kwargs):
        verification = self.get_object()
        new_status = request.data.get('status')
        admin_notes = request.data.get('admin_notes', '')
        
        if new_status not in ['verified', 'rejected']:
            return Response(
                {'error': 'Invalid status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        verification.status = new_status
        verification.admin_notes = admin_notes
        verification.save()
        
        # Send email notification
        subject = f'Rent Verification {new_status.title()}'
        message = f"""
        Dear {verification.full_name},
        
        Your rent verification request has been {new_status}.
        
        {f'Admin Notes: {admin_notes}' if admin_notes else ''}
        
        {'You may submit a new verification request if needed.' if new_status == 'rejected' else 'Thank you for using our service.'}
        """
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [verification.email],
            fail_silently=False,
        )
        
        return Response(self.get_serializer(verification).data)

#  ADD THIS NEW VIEW FOR FETCHING PENDING REQUESTS
class RentVerificationListView(generics.ListAPIView):
    serializer_class = RentVerificationSerializer

    def get_queryset(self):
        status_filter = self.request.query_params.get("status", None)
        if status_filter:
            return RentVerification.objects.filter(status=status_filter)
        return RentVerification.objects.all()

class RentVerificationUserUpdateView(generics.UpdateAPIView):
    queryset = RentVerification.objects.all()
    serializer_class = RentVerificationSerializer
    parser_classes = (MultiPartParser, FormParser)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        uploaded_images = request.FILES.getlist('images')
        
        # Construct data manually to avoid deepcopy errors
        data = {
            "address": request.data.get("address", instance.address),
            "uploaded_images": uploaded_images
        }
        
        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Ensures only authenticated users can access this
def user_verification_status(request):
    """
    Fetches the verification status of the currently logged-in user.
    """
    try:
        verification = RentVerification.objects.get(email=request.user.email)
        serializer = RentVerificationSerializer(verification)
        return Response(serializer.data)
    except RentVerification.DoesNotExist:
        return Response({"status": "not_found"}, status=404)


####################################
#Django Views for Cart and Wishlist
####################################
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Cart, Wishlist, Product
from django.contrib.auth import get_user_model

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    user = request.user
    cart_items = Cart.objects.filter(user=user)
    data = [{'image':item.product.image.url, 'company_name': item.product.company.company_name, 'category':item.product.category, 'product_id': item.product.id, 'name': item.product.title, 'price': str(item.product.price), 'quantity': item.quantity} for item in cart_items]
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    user = request.user
    product_id = request.data.get('product_id')
    quantity = request.data.get('quantity', 1)

    product = get_object_or_404(Product, id=product_id)
    cart_item, created = Cart.objects.get_or_create(user=user, product=product, defaults={'quantity': quantity})
    if not created:
        cart_item.quantity += quantity
        cart_item.save()

    return Response({'message': 'Item added to cart'}, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, product_id):
    user = request.user
    cart_item = get_object_or_404(Cart, user=user, product_id=product_id)
    cart_item.delete()
    return Response({'message': 'Item removed from cart'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_wishlist(request):
    user = request.user
    wishlist_items = Wishlist.objects.filter(user=user)
    data = [{'product_id': item.product.id, 'name': item.product.title, 'price': str(item.product.price)} for item in wishlist_items]
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_wishlist(request):
    user = request.user
    product_id = request.data.get('product_id')

    product = get_object_or_404(Product, id=product_id)
    Wishlist.objects.get_or_create(user=user, product=product)
    return Response({'message': 'Item added to wishlist'}, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_wishlist(request, product_id):
    user = request.user
    wishlist_item = get_object_or_404(Wishlist, user=user, product_id=product_id)
    wishlist_item.delete()
    return Response({'message': 'Item removed from wishlist'}, status=status.HTTP_204_NO_CONTENT)


##payment##
'''''''''''''''''

class TransactionCreateAPIView(APIView):

    def post(self, request):
        data = request.data
        
        # Get payer and payee IDs
        payer_id = data.get('payer')
        payee_id = data.get('payee')
        amount = data.get('amount')
        description = data.get('description', '')  # Optional description

        # Validate if payer and payee are valid users
        try:
            payer = CustomUser.objects.get(id=payer_id)
        except CustomUser.DoesNotExist:
            raise ValidationError("Payer does not exist.")

        try:
            payee = CustomUser.objects.get(id=payee_id)
        except CustomUser.DoesNotExist:
            raise ValidationError("Payee does not exist.")

        # Create the transaction
        transaction = Transaction.objects.create(
            payer=payer,
            payee=payee,
            amount=amount,
            description=description
        )

        # Serialize and return the transaction data
        serializer = TransactionSerializer(transaction)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

        
class TransactionAPIView(APIView):
    def get(self, request):
        transactions = Transaction.objects.all()
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)

    def delete(self, request, transaction_id):
        try:
            transaction = Transaction.objects.get(id=transaction_id)
            transaction.delete()
            return Response({"message": "Transaction deleted successfully"}, 
                          status=status.HTTP_204_NO_CONTENT)
        except Transaction.DoesNotExist:
            return Response({"error": "Transaction not found"}, 
                          status=status.HTTP_404_NOT_FOUND)    
'''''''''''''''''


#Load API keys from .env file
load_dotenv()
KHALTI_SECRET_KEY = os.getenv("KHALTI_SECRET_KEY")

@csrf_exempt
def verify_khalti_payment(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            token = data.get("token")  # Get token from frontend
            amount = data.get("amount*100")  # Amount should be in paisa (NPR 10 = 1000 paisa)
            print(data)
            if not token or not amount:
                return JsonResponse({"status": "failed", "message": "Missing token or amount"}, status=400)

            # Khalti API URL for verifying payments
            url = "https://khalti.com/api/v2/payment/verify/"
            headers = {"Authorization": f"Key {KHALTI_SECRET_KEY}"}
            payload = {"token": token, "amount": amount}

            # Send request to Khalti for verification
            response = requests.post(url, json=payload, headers=headers)
            response_data = response.json()

            if response.status_code == 200:
                return JsonResponse({"status": "success", "message": "Payment Verified!", "data": response_data})
            else:
                return JsonResponse({"status": "failed", "message": "Payment Verification Failed!", "data": response_data}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({"status": "failed", "message": "Invalid JSON data"}, status=400)

    return JsonResponse({"status": "failed", "message": "Invalid request method"}, status=405)



# khalti payment
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# import requests
# import os
# import uuid

# def initiate_khalti_payment(request):
#     """Initiate a payment request to Khalti."""
#     if request.method == 'POST':
#         url = "https://dev.khalti.com/api/v2/payment/initiate/"
#         headers = {
#             "Authorization": f"Key 63f32942f293495e81d9126a9bc6085d",
#             "Content-Type": "application/json"
#         }
#         purchase_order_id = str(uuid.uuid4())  # Generates a unique order ID
#         data_info = json.loads(request.body)
#         data = {
#             "return_url": "http://localhost:3001/payment/callback/",
#             "website_url": "http://localhost:3001/",
#             "amount": data_info.get("amount"),
#             "purchase_order_id": purchase_order_id,
#             "purchase_order_name": purchase_order_id+"test",
#             "mobile": "9800000001",
#             "product_identity": 1,
#             "product_name": "name",
#             "public_key": "09720e0b39a048758031c72d2adb9aa4",
#             "transaction_pin": "1111",
#             "customer_info": {
#                 "name": data_info.get("name"),
#                 "email": data_info.get("email"),
#                 "phone": data_info.get("phone")
#             }
#         }
#         response = requests.post(url, headers=headers, json=data)
#         print(response.text)
#         return JsonResponse(json.loads(response.json()))
    
#     return JsonResponse({"message": "Invalid request method."}, status=405)

# def khalti_lookup_api(transaction_id):
#     """Call Khalti Lookup API to verify transaction."""
#     url = "https://khalti.com/api/v2/payment/lookup/"
#     headers = {
#         "Authorization": f"Key {os.getenv('KHALTI_SECRET_KEY')}"
#     }
#     data = {"transaction_id": transaction_id}
#     response = requests.post(url, headers=headers, data=data)
#     return response.json()

# @csrf_exempt
# def payment_success_callback(request):
#     """Handle the payment success callback from Khalti."""
#     if request.method == 'GET':
#         pidx = request.GET.get('pidx')
#         status = request.GET.get('status')
#         transaction_id = request.GET.get('transaction_id')
#         amount = request.GET.get('amount')
#         mobile = request.GET.get('mobile')
#         purchase_order_id = request.GET.get('purchase_order_id')
#         purchase_order_name = request.GET.get('purchase_order_name')
#         total_amount = request.GET.get('total_amount')
        
#         if status == "Completed":
#             # Call lookup API for confirmation
#             lookup_response = khalti_lookup_api(transaction_id)
#             if lookup_response.get("status") == "Completed":
#                 # Payment confirmed, process order or update database
#                 return JsonResponse({"message": "Payment confirmed", "data": lookup_response}, status=200)
#             else:
#                 return JsonResponse({"message": "Payment lookup failed", "data": lookup_response}, status=400)
        
#         elif status == "Pending":
#             return JsonResponse({"message": "Payment is still pending. Please verify later."}, status=202)
        
#         elif status == "User canceled":
#             return JsonResponse({"message": "Payment was canceled by the user."}, status=400)
        
#         else:
#             return JsonResponse({"message": "Unknown status received."}, status=400)
    
#     return JsonResponse({"message": "Invalid request method."}, status=405)
