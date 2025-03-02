"""
URL configuration for backend project.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from ersathi.views import (
    RentVerificationAdminView,
    RentVerificationCreateView,
    RentVerificationListView,
    RentVerificationUserUpdateView,
    Test,
    create_company_service,
    delete_company_service,
    get_company_services,
    get_company_services_basic,
    get_user_profile,
    update_company_service,
    user_verification_status,
    verify_khalti_payment,
    SignupView,
    LoginView,
    ForgotPasswordView,
    CompanyRegistrationView,
    get_company_registrations,
    approve_company,
    reject_company,
    get_company_details,
    get_services,
    ConfirmEmailView,
    ResetPasswordView,
    change_password,
    get_all_products,
    get_products_by_category,
    get_company_products,
    get_cart,
    add_to_cart,
    remove_from_cart,
    get_wishlist,
    add_to_wishlist,
    remove_from_wishlist,
    # New company info views
    get_company_info,
    update_company_info,
    delete_project,
    delete_team_member,
)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/services/', get_services, name='get_services'),

    # Auth
    path('api/signup/', SignupView.as_view(), name='signup'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('auth/', include('social_django.urls', namespace='social')),
    path('api/forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
    path('api/password_reset/<str:token>/', ResetPasswordView.as_view()),

    # Company
    path('company-registration/', CompanyRegistrationView.as_view(), name='company-registration'),
    path('company-registration-list/', get_company_registrations, name='company-registration-list'),
    path('approve-company/<int:pk>/', approve_company, name='approve-company'),
    path('reject-company/<int:pk>/', reject_company, name='reject-company'),
    path('api/confirm-email/<str:token>/', ConfirmEmailView.as_view(), name='confirm-email'),
    path('company-registration/<int:pk>/', get_company_details, name='company-details'),

    # CompanyInfo (replacing ViewSet with function-based views)
    path('companyInfo/<int:pk>/', get_company_info, name='get_company_info'),  # GET
    path('companyInfo/<int:pk>/update/', update_company_info, name='update_company_info'),  # PUT
    path('companyInfo/<int:pk>/projects/<int:project_id>/', delete_project, name='delete-project'),  # DELETE
    path('companyInfo/<int:pk>/team/<int:member_id>/', delete_team_member, name='delete-team-member'),  # DELETE

    # Services
    path('api/company-services/get/', get_company_services, name='get_company_services'),
    path('api/company-services/create/', create_company_service, name='create_company_service'),
    path('api/company-services/<int:service_id>/update/', update_company_service, name='update_company_service'),
    path('api/company-services/<int:service_id>/delete/', delete_company_service, name='delete_company_service'),
    path('api/company-services/basic/', get_company_services_basic, name='get_company_services_basic'),

    # User
    path('api/user-profile/', get_user_profile, name='user-profile'),
    path('api/change-password/', change_password, name='change_password'),

    # Products
    path('api/products/', get_all_products, name='get_all_products'),
    path('api/products/<str:category>/', get_products_by_category, name='get_products_by_category'),
    path('api/company-products/', get_company_products, name='get_company_products'),

    # Test
    path('api/test/', Test.as_view(), name='create_Test'),
    path('api/test/<int:pk>/', Test.as_view(), name='update_delete_test'),

    # Cart
    path('api/cart/', get_cart, name='get_cart'),
    path('api/cart/add/', add_to_cart, name='add_to_cart'),
    path('api/cart/remove/<int:product_id>/', remove_from_cart, name='remove_from_cart'),
    path('api/wishlist/', get_wishlist, name='get_wishlist'),
    path('api/wishlist/add/', add_to_wishlist, name='add_to_wishlist'),
    path('api/wishlist/remove/<int:product_id>/', remove_from_wishlist, name='remove_from_wishlist'),

    # Payment
    path('api/verify-khalti-payment/', verify_khalti_payment, name='verify_khalti_payment'),

    # Rent Verification
    path('api/rent-verification/', RentVerificationCreateView.as_view(), name='rent-verification-create'),
    path('api/rent-verification/<int:pk>/', RentVerificationAdminView.as_view(), name='rent-verification-admin'),
    path('api/rent-verification/list/', RentVerificationListView.as_view(), name='rent-verification-list'),
    path('api/rent-verification/user/', user_verification_status, name='rent-verification-user'),
    path('api/rent-verification/user-update/<int:pk>/', RentVerificationUserUpdateView.as_view(), name='rent-verification-user-update'),

    # JWT Token
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)