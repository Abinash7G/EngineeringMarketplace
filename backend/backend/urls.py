"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from ersathi.views import ServiceList, get_user_profile
from ersathi.views import SignupView, LoginView
from django.urls import path, include
from ersathi.views import ForgotPasswordView
from ersathi.views import CompanyRegistrationView, get_company_registrations, approve_company, reject_company,get_company_details
from ersathi.views import ServiceList
from ersathi.views import ConfirmEmailView , ResetPasswordView
from ersathi.views import change_password
from ersathi.views import get_all_products, get_products_by_category, get_company_products
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/services/', ServiceList.as_view(), name='service-list'),
    path('api/signup/', SignupView.as_view(), name='signup'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('auth/', include('social_django.urls', namespace='social')),
    path('api/forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
    path('api/password_reset/<str:token>/', ResetPasswordView.as_view()),
    #company
    path('company-registration/', CompanyRegistrationView.as_view(), name='company-registration'),
    path('company-registration-list/', get_company_registrations, name='company-registration-list'),
    path('approve-company/<int:pk>/', approve_company, name='approve-company'),
    path('reject-company/<int:pk>/', reject_company, name='reject-company'),
    path('api/confirm-email/<str:token>/', ConfirmEmailView.as_view(), name='confirm-email'),
    path('company-registration/<int:pk>/', get_company_details, name='company-details'),  
    path('api/user-profile/', get_user_profile, name='user-profile'),
    path('api/change-password/', change_password, name='change_password'),
    path('api/products/', get_all_products, name='get_all_products'),
    path('api/products/<str:category>/', get_products_by_category, name='get_products_by_category'),
    path('api/company-products/', get_company_products, name='get_company_products'),
    
]   


# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)