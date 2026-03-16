from django.urls import path
from . import views

urlpatterns = [
    # Dashboard
    path('stats/', views.dashboard_stats, name='admin_dashboard_stats'),
    
    # User Management
    path('users/', views.manage_users, name='admin_manage_users'),
    path('users/<int:user_id>/', views.manage_user_detail, name='admin_manage_user_detail'),
    
    # Job Management
    path('jobs/', views.manage_jobs, name='admin_manage_jobs'),
    path('jobs/<int:job_id>/', views.delete_job, name='admin_delete_job'),
    
    # Webinar Management
    path('webinars/', views.manage_webinars, name='admin_manage_webinars'),
    path('webinars/<int:webinar_id>/', views.manage_webinar_detail, name='admin_manage_webinar_detail'),
    
    # Admission Management
    path('admissions/', views.manage_admissions, name='admin_manage_admissions'),
    path('admissions/<int:admission_id>/', views.manage_admission_detail, name='admin_manage_admission_detail'),
    
    # Registration Management
    path('webinar-registrations/', views.manage_webinar_registrations, name='admin_webinar_registrations'),
    path('admission-applications/', views.manage_admission_applications, name='admin_admission_applications'),
    path('webinar-registrations/<int:registration_id>/status/', views.update_registration_status, name='update_registration_status'),
    path('admission-applications/<int:application_id>/status/', views.update_application_status, name='update_application_status'),
]

# Public endpoints (no admin required)
public_urlpatterns = [
    path('webinars/public/', views.public_webinars, name='public_webinars'),
    path('webinars/share/<int:webinar_id>/', views.webinar_share_detail, name='webinar_share_detail'),
    path('admissions/public/', views.public_admissions, name='public_admissions'),
]

# Registration endpoints (authenticated users)
registration_urlpatterns = [
    path('register-webinar/', views.register_webinar, name='register_webinar'),
    path('apply-admission/', views.apply_admission, name='apply_admission'),
]

# Combine all patterns
urlpatterns += public_urlpatterns + registration_urlpatterns