"""
URL configuration for job_portal project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from recruiter import views as recruiter_views
from admin_management.models import Webinar, AdmissionPost
from admin_management.serializers import WebinarSerializer, AdmissionPostSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def public_webinars_view(request):
    """Public webinars endpoint - no authentication required"""
    webinars = Webinar.objects.filter(is_active=True).order_by('-created_at')
    serializer = WebinarSerializer(webinars, many=True)
    return Response({
        'success': True,
        'webinars': serializer.data,
        'total': webinars.count()
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def public_admissions_view(request):
    """Public admissions endpoint - no authentication required"""
    admissions = AdmissionPost.objects.filter(is_active=True).order_by('-created_at')
    serializer = AdmissionPostSerializer(admissions, many=True)
    return Response({
        'success': True,
        'admissions': serializer.data,
        'total': admissions.count()
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def webinar_share_view(request, webinar_id):
    """Webinar share endpoint - public access"""
    try:
        webinar = Webinar.objects.get(id=webinar_id)
        serializer = WebinarSerializer(webinar)
        return Response({
            'success': True,
            'webinar': serializer.data
        })
    except Webinar.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Webinar not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def resume_info_view(request):
    """Resume upload info endpoint"""
    user = request.user
    return Response({
        'success': True,
        'resume': {
            'file_name': user.resume_file_name,
            'file_url': request.build_absolute_uri(user.resume_file_path.url) if user.resume_file_path else None,
            'uploaded_at': user.resume_uploaded_at
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    path('api/recruiter/', include('recruiter.urls')),
    path('api/admissions/', include('admissions.urls')),
    path('api/admin/', include('admin_management.urls')),
    
    # Public endpoints
    path('api/jobs/public', recruiter_views.public_jobs_view, name='public_jobs'),
    path('api/jobs/<int:job_id>', recruiter_views.job_detail_public_view, name='job_detail_public'),
    path('api/jobs/<int:job_id>/apply', recruiter_views.apply_job_view, name='apply_job'),
    path('api/jobs/<int:job_id>/check-status', recruiter_views.check_application_status_view, name='check_application_status'),
    path('api/webinars/public', public_webinars_view, name='public_webinars'),
    path('api/webinars/share/<int:webinar_id>', webinar_share_view, name='webinar_share'),
    path('api/admissions/public', public_admissions_view, name='public_admissions'),
    
    path('api/resume-upload/info', resume_info_view, name='resume_info'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)