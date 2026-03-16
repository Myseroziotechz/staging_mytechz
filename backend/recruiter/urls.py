from django.urls import path
from . import views

urlpatterns = [
    # Resume Database endpoint
    path('resume-database/', views.resume_database_view, name='resume_database'),
    
    # Individual candidate profile endpoint
    path('candidate/<int:candidate_id>/', views.candidate_profile_view, name='candidate_profile'),
    
    # Recruiter Company Profile endpoints
    path('company-profile', views.company_profile_view, name='company_profile'),
    path('update-company-profile', views.company_profile_view, name='update_company_profile'),  # Alias for frontend
    path('profile', views.company_profile_view, name='recruiter_profile'),  # Alias for frontend
    path('company-profile/upload-document', views.upload_company_document_view, name='upload_company_document'),
    path('company-profile/upload-photos', views.upload_office_photos_view, name='upload_office_photos'),
    
    # Admin endpoints for company verification
    path('admin/company-profiles', views.admin_company_profiles_view, name='admin_company_profiles'),
    path('admin/company-profiles/<int:profile_id>/verify', views.admin_verify_company_view, name='admin_verify_company'),
    
    # Admin endpoints for recruiter approval workflow
    path('admin/recruiters', views.admin_recruiters_list_view, name='admin_recruiters_list'),
    path('admin/recruiters/<int:recruiter_id>', views.admin_recruiter_detail_view, name='admin_recruiter_detail'),
    path('admin/recruiters/<int:recruiter_id>/approve', views.admin_approve_recruiter_view, name='admin_approve_recruiter'),
    path('admin/recruiters/<int:recruiter_id>/reject', views.admin_reject_recruiter_view, name='admin_reject_recruiter'),
    
    # Job posting endpoints (with approval guard)
    path('jobs/create', views.create_job_view, name='create_job'),
    path('post-job', views.create_job_view, name='post_job'),  # Alias for frontend
    path('jobs/my-jobs', views.my_jobs_view, name='my_jobs'),
    path('jobs/<int:job_id>', views.job_detail_view, name='job_detail'),
    path('jobs/<int:job_id>/update', views.update_job_view, name='update_job'),
    
    # Job Application endpoints (LinkedIn-style flow)
    path('applications/my-applications', views.my_applications_view, name='my_applications'),
    path('applications/recruiter', views.recruiter_applications_view, name='recruiter_applications'),
    path('applications/<int:application_id>/update-status', views.update_application_status_view, name='update_application_status'),
]