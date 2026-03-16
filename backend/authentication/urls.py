from django.urls import path
from . import views

urlpatterns = [
    # Authentication endpoints
    path('register', views.register_view, name='register'),
    path('recruiter-register', views.recruiter_register_view, name='recruiter_register'),
    path('login', views.login_view, name='login'),
    path('logout', views.logout_view, name='logout'),
    
    # Password reset endpoints
    path('forgot-password', views.forgot_password_view, name='forgot_password'),
    path('reset-password', views.reset_password_view, name='reset_password'),
    
    # Profile endpoints
    path('profile', views.profile_view, name='profile'),
    path('profile/update', views.profile_update_view, name='profile_update'),
    path('profile/upload-resume', views.upload_resume_view, name='upload_resume'),
    path('profile/stats', views.user_stats_view, name='user_stats'),
    
    # Recruiter endpoints
    path('candidates', views.candidates_list_view, name='candidates_list'),
    
    # Admin endpoints
    path('users', views.users_list_view, name='users_list'),
    
    # Additional endpoints for frontend compatibility
    path('my-applications', views.my_applications_view, name='my_applications'),
    path('upload-photo', views.upload_photo_view, name='upload_photo'),
]