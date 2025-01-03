from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from marketplace.models import User as CustomUser  # Import your custom User model

@api_view(['POST'])
def signup(request):
    data = request.data
    try:
        # Create User
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password']
        )
        user_profile = CustomUser.objects.create(
            user=user,
            is_engineer=(data.get('role') == 'company'),
            company_type=data.get('companyType', ''),
            company_name=data.get('companyName', ''),
            company_email=data.get('companyEmail', ''),
            company_registration_id=data.get('companyRegistrationId', ''),
            location=data.get('location', ''),
        )
        user.save()
        user_profile.save()
        return JsonResponse({"message": "Signup successful!"}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@api_view(['POST'])
def login(request):
    from django.contrib.auth import authenticate

    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return JsonResponse({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=200)
    else:
        return JsonResponse({"error": "Invalid username or password"}, status=401)
