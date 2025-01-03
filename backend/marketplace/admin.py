from django.contrib import admin
from .models import (
    Role,
    Client,
    Service,
    ConstructionCompany,
    MaterialSupplier,
    Admin,
    Material,
    Booking,
    Order,
    Milestone,
    TrainingSession,
    Feedback,
    Subscription,
    Dispute,
)

# Registering models with the admin interface
@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'location', 'rating')
    search_fields = ('name', 'location')
    list_filter = ('rating',)


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone')
    search_fields = ('name', 'email')
    list_filter = ('role',)


@admin.register(ConstructionCompany)
class ConstructionCompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'verified', 'subscription_status')
    search_fields = ('name', 'email')
    list_filter = ('verified', 'subscription_status')


@admin.register(MaterialSupplier)
class MaterialSupplierAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subscription_status')
    search_fields = ('name', 'email')
    list_filter = ('subscription_status',)


@admin.register(Admin)
class AdminUserAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'role')
    search_fields = ('name', 'email')


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'stock_quantity', 'supplier')
    search_fields = ('name',)
    list_filter = ('supplier',)


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('client', 'service', 'date', 'status', 'payment_status')
    search_fields = ('client__name', 'service__name')
    list_filter = ('status', 'payment_status')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('client', 'material', 'quantity', 'date', 'status', 'payment_status')
    search_fields = ('client__name', 'material__name')
    list_filter = ('status', 'payment_status')


@admin.register(Milestone)
class MilestoneAdmin(admin.ModelAdmin):
    list_display = ('service', 'description', 'progress_status', 'deadline')
    search_fields = ('service__name',)
    list_filter = ('progress_status',)


@admin.register(TrainingSession)
class TrainingSessionAdmin(admin.ModelAdmin):
    list_display = ('name', 'date', 'location')
    search_fields = ('name', 'location')
    list_filter = ('date',)


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('client', 'service', 'rating', 'comments')
    search_fields = ('client__name', 'service__name')
    list_filter = ('rating',)


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('company', 'supplier', 'start_date', 'end_date', 'type', 'status')
    search_fields = ('company__name', 'supplier__name')
    list_filter = ('type', 'status')


@admin.register(Dispute)
class DisputeAdmin(admin.ModelAdmin):
    list_display = ('client', 'company', 'supplier', 'description', 'status')
    search_fields = ('client__name', 'company__name', 'supplier__name')
    list_filter = ('status',)
