"""
URL configuration for backend project.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from ersathi import views
from ersathi.views import (
    CheckNewInquiriesView,
    ClientAgreementsView,
    CompanyAgreementsView,
    CompanyAppointmentsView,
    CompanyInquiriesView,
    DeleteAppointmentView,
    GetLastInquiryCheckView,
    MarkInquiriesCheckedView,
    RentVerificationAdminView,
    RentVerificationCreateView,
    RentVerificationListView,
    RentVerificationUserUpdateView,
    SubmitInquiryView,
    Test,
    UpdateAgreementView,
    UpdateAppointmentStatusView,
    UpdateAppointmentView,
    UpdateInquiryStatusView,
    UpdateOrderPaymentView,
    

    company_info,
    company_info_detail,
    create_company_service,
    dashboard_stats,
    
    delete_company_service,
    delete_project,
    delete_team_member,
    generate_agreement,
   
    get_company_info,
    get_company_projects,
    
    
    get_company_services,
    get_company_services_basic,
    get_company_services_by_id,
    get_company_team_members,
    get_user_profile,
    project_list_create,
    send_training_email,
   
    team_member_list_create,
    
    update_company_service,
    update_project,
    update_team_member,
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
    #dashboard stat
    path('dashboard-stats/', dashboard_stats, name='dashboard_stats'),
    #company info
    path('company-info/', company_info, name='company-info-list'), #post
    path('company-info/<int:company_id>/', company_info_detail, name='company-info-detail'),  # Handles GET and PUT
    #Company/project]
    path('company-info/<int:company_id>/projects/', project_list_create, name='project-list-create'),
    path('company-info/<int:company_id>/projects/<int:project_id>/', update_project, name='update-project'),  # PUT update project
    path('company-info/<int:company_id>/projects/<int:project_id>/delete/', delete_project, name='delete-project'),  # DELETE project
    #TEAMmember
    path('company-info/<int:company_id>/team/', team_member_list_create, name='team_member_list_create'),
    path('company-info/<int:company_id>/team/<int:member_id>/', update_team_member, name='update_team_member'),
    path('company-info/<int:company_id>/team/<int:member_id>/delete/', delete_team_member, name='delete_team_member'),
        #companysetailsclient side
    path('get-company-info/<int:company_id>/', get_company_info, name='get-company-info'),
    path('get-company-projects/<int:company_id>/', get_company_projects, name='get-company-projects'),
    path('get-company-team-members/<int:company_id>/', get_company_team_members, name='get-company-team-members'),
    path('api/company-services/<int:company_id>/', get_company_services_by_id, name='get_company_services_by_id'),
#
    path('api/submit-inquiry/<int:company_id>/', views.SubmitInquiryView.as_view(), name='submit-inquiry'),
    path('api/company-inquiries/', CompanyInquiriesView.as_view(), name='company-inquiries'),
    path('api/update-inquiry-status/<int:inquiry_id>/', UpdateInquiryStatusView.as_view(), name='update-inquiry-status'),
    path('company-appointments/', CompanyAppointmentsView.as_view(), name='company-appointments'),
    path('mark-inquiries-checked/', MarkInquiriesCheckedView.as_view(), name='mark-inquiries-checked'),
    path('check-new-company-inquiries/', CheckNewInquiriesView.as_view(), name='check-new-inquiries'),
    path('api/get-last-inquiry-check/', GetLastInquiryCheckView.as_view(), name='get-last-inquiry-check'),
    path('appointments/<int:appointment_id>/update-status/', UpdateAppointmentStatusView.as_view(), name='update-appointment-status'),
    path('api/appointments/<int:appointment_id>/update/', UpdateAppointmentView.as_view(), name='update-appointment'),
    path('api/appointments/<int:appointment_id>/delete/', DeleteAppointmentView.as_view(), name='delete-appointment'),
   # path('api/submit-inquiry/<int:company_id>/', SubmitInquiryView.as_view(), name='submit-inquiry'),
   # path('api/company-inquiries/', CompanyInquiriesView.as_view(), name='company-inquiries'),
   #aggrement
   path('generate-agreement/<int:appointment_id>/', generate_agreement, name='generate_agreement'),
#  path('company-agreements/<int:user_id>/', CompanyAgreementsView.as_view(), name='company_agreements'),
   path('company-agreements/', CompanyAgreementsView.as_view(), name='company_agreements'),
   path('client-agreements/', ClientAgreementsView.as_view(), name='client_agreements'),
   path('api/agreements/<int:agreement_id>/update/', UpdateAgreementView.as_view(), name='update_agreement'),
    
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
    #order
    path('api/orders/create/', views.create_order, name='create_order'),
    path('api/orders/', views.get_orders, name='get_orders'),
    path('api/company/orders/', views.get_company_orders, name='get_company_orders'),
    path("api/orders/update-payment/", UpdateOrderPaymentView.as_view(), name="update-order-payment"),
    # Payment
    path('api/verify-khalti-payment/', verify_khalti_payment, name='verify_khalti_payment'),
    path('api/verify-esewa-payment/', views.verify_esewa_payment, name='verify_esewa_payment'),
    # Rent Verification
    path('api/rent-verification/', RentVerificationCreateView.as_view(), name='rent-verification-create'),
    path('api/rent-verification/<int:pk>/', RentVerificationAdminView.as_view(), name='rent-verification-admin'),
    path('api/rent-verification/list/', RentVerificationListView.as_view(), name='rent-verification-list'),
    path('api/rent-verification/user/', user_verification_status, name='rent-verification-user'),
    path('api/rent-verification/user-update/<int:pk>/', RentVerificationUserUpdateView.as_view(), name='rent-verification-user-update'),

    # JWT Token
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    #safetyemail
    path('api/send-training-email/', send_training_email, name='send_training_email'),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)