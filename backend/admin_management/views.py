from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from authentication.models import User
from recruiter.models import JobPost
from .models import Webinar, AdmissionPost, WebinarRegistration, AdmissionRegistration
from .serializers import (
    UserManagementSerializer, JobPostSerializer, 
    WebinarSerializer, AdmissionPostSerializer,
    WebinarRegistrationSerializer, AdmissionRegistrationSerializer
)

def require_admin(view_func):
    """Decorator to ensure only admin users can access the view"""
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated or request.user.role != 'admin':
            return Response(
                {'error': 'Admin access required'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return view_func(request, *args, **kwargs)
    return wrapper

# User Management Views
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@require_admin
def manage_users(request):
    """List all users or create a new user"""
    
    if request.method == 'GET':
        users = User.objects.all().order_by('-created_at')
        
        # Search functionality
        search = request.GET.get('search', '')
        if search:
            users = users.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(email__icontains=search)
            )
        
        # Role filter
        role = request.GET.get('role', '')
        if role:
            users = users.filter(role=role)
        
        serializer = UserManagementSerializer(users, many=True)
        return Response({
            'success': True,
            'users': serializer.data,
            'total': users.count()
        })
    
    elif request.method == 'POST':
        serializer = UserManagementSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'success': True,
                'message': 'User created successfully',
                'user': UserManagementSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@require_admin
def manage_user_detail(request, user_id):
    """Get, update, or delete a specific user"""
    
    user = get_object_or_404(User, id=user_id)
    
    if request.method == 'GET':
        serializer = UserManagementSerializer(user)
        return Response({
            'success': True,
            'user': serializer.data
        })
    
    elif request.method == 'PUT':
        serializer = UserManagementSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            updated_user = serializer.save()
            return Response({
                'success': True,
                'message': 'User updated successfully',
                'user': UserManagementSerializer(updated_user).data
            })
        
        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Prevent admin from deleting themselves
        if user.id == request.user.id:
            return Response({
                'success': False,
                'message': 'Cannot delete your own account'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user.delete()
        return Response({
            'success': True,
            'message': 'User deleted successfully'
        })

# Job Management Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@require_admin
def manage_jobs(request):
    """List all job posts"""
    
    jobs = JobPost.objects.select_related('recruiter').order_by('-created_at')
    
    # Search functionality
    search = request.GET.get('search', '')
    if search:
        jobs = jobs.filter(
            Q(job_title__icontains=search) |
            Q(location__icontains=search) |
            Q(recruiter__company_profile__company_name__icontains=search)
        )
    
    serializer = JobPostSerializer(jobs, many=True)
    return Response({
        'success': True,
        'jobs': serializer.data,
        'total': jobs.count()
    })

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@require_admin
def delete_job(request, job_id):
    """Delete a specific job post"""
    
    job = get_object_or_404(JobPost, id=job_id)
    job_title = job.job_title
    job.delete()
    
    return Response({
        'success': True,
        'message': f'Job "{job_title}" deleted successfully'
    })

# Webinar Management Views
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@require_admin
def manage_webinars(request):
    """List all webinars or create a new webinar"""
    
    if request.method == 'GET':
        webinars = Webinar.objects.select_related('created_by').order_by('-created_at')
        
        # Search functionality
        search = request.GET.get('search', '')
        if search:
            webinars = webinars.filter(
                Q(title__icontains=search) |
                Q(speaker__icontains=search) |
                Q(organization__icontains=search)
            )
        
        serializer = WebinarSerializer(webinars, many=True)
        return Response({
            'success': True,
            'webinars': serializer.data,
            'total': webinars.count()
        })
    
    elif request.method == 'POST':
        serializer = WebinarSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            webinar = serializer.save()
            return Response({
                'success': True,
                'message': 'Webinar created successfully',
                'webinar': WebinarSerializer(webinar).data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@require_admin
def manage_webinar_detail(request, webinar_id):
    """Get, update, or delete a specific webinar"""
    
    webinar = get_object_or_404(Webinar, id=webinar_id)
    
    if request.method == 'GET':
        serializer = WebinarSerializer(webinar)
        return Response({
            'success': True,
            'webinar': serializer.data
        })
    
    elif request.method == 'PUT':
        serializer = WebinarSerializer(webinar, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            updated_webinar = serializer.save()
            return Response({
                'success': True,
                'message': 'Webinar updated successfully',
                'webinar': WebinarSerializer(updated_webinar).data
            })
        
        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        webinar_title = webinar.title
        webinar.delete()
        return Response({
            'success': True,
            'message': f'Webinar "{webinar_title}" deleted successfully'
        })

# Admission Management Views
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@require_admin
def manage_admissions(request):
    """List all admission posts or create a new admission post"""
    
    if request.method == 'GET':
        admissions = AdmissionPost.objects.select_related('created_by').order_by('-created_at')
        
        # Search functionality
        search = request.GET.get('search', '')
        if search:
            admissions = admissions.filter(
                Q(college_name__icontains=search) |
                Q(location__icontains=search) |
                Q(courses__icontains=search)
            )
        
        serializer = AdmissionPostSerializer(admissions, many=True)
        return Response({
            'success': True,
            'admissions': serializer.data,
            'total': admissions.count()
        })
    
    elif request.method == 'POST':
        serializer = AdmissionPostSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            admission = serializer.save()
            return Response({
                'success': True,
                'message': 'Admission post created successfully',
                'admission': AdmissionPostSerializer(admission).data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@require_admin
def manage_admission_detail(request, admission_id):
    """Get, update, or delete a specific admission post"""
    
    admission = get_object_or_404(AdmissionPost, id=admission_id)
    
    if request.method == 'GET':
        serializer = AdmissionPostSerializer(admission)
        return Response({
            'success': True,
            'admission': serializer.data
        })
    
    elif request.method == 'PUT':
        serializer = AdmissionPostSerializer(admission, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            updated_admission = serializer.save()
            return Response({
                'success': True,
                'message': 'Admission post updated successfully',
                'admission': AdmissionPostSerializer(updated_admission).data
            })
        
        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        college_name = admission.college_name
        admission.delete()
        return Response({
            'success': True,
            'message': f'Admission post for "{college_name}" deleted successfully'
        })

# Dashboard Stats
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@require_admin
def dashboard_stats(request):
    """Get dashboard statistics"""
    
    stats = {
        'total_users': User.objects.count(),
        'total_candidates': User.objects.filter(role='candidate').count(),
        'total_recruiters': User.objects.filter(role='recruiter').count(),
        'total_admins': User.objects.filter(role='admin').count(),
        'total_jobs': JobPost.objects.count(),
        'published_jobs': JobPost.objects.filter(is_published=True).count(),
        'total_webinars': Webinar.objects.count(),
        'active_webinars': Webinar.objects.filter(is_active=True).count(),
        'total_admissions': AdmissionPost.objects.count(),
        'active_admissions': AdmissionPost.objects.filter(is_active=True).count(),
        'total_webinar_registrations': WebinarRegistration.objects.count(),
        'total_admission_applications': AdmissionRegistration.objects.count(),
    }
    
    return Response({
        'success': True,
        'stats': stats
    })

# Registration Management Views
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_webinar(request):
    """Register a candidate for a webinar"""
    
    webinar_id = request.data.get('webinar_id')
    if not webinar_id:
        return Response({
            'success': False,
            'message': 'Webinar ID is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        webinar = Webinar.objects.get(id=webinar_id)
    except Webinar.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Webinar not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Check if user is already registered
    existing_registration = WebinarRegistration.objects.filter(
        webinar=webinar, user=request.user
    ).first()
    
    if existing_registration:
        return Response({
            'success': False,
            'message': 'You are already registered for this webinar'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Create registration
    registration = WebinarRegistration.objects.create(
        webinar=webinar,
        user=request.user
    )
    
    serializer = WebinarRegistrationSerializer(registration)
    return Response({
        'success': True,
        'message': 'Successfully registered for webinar',
        'registration': serializer.data
    }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_admission(request):
    """Apply for an admission"""
    
    admission_id = request.data.get('admission_id')
    if not admission_id:
        return Response({
            'success': False,
            'message': 'Admission ID is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        admission = AdmissionPost.objects.get(id=admission_id)
    except AdmissionPost.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Admission post not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Check if user has already applied
    existing_application = AdmissionRegistration.objects.filter(
        admission=admission, user=request.user
    ).first()
    
    if existing_application:
        return Response({
            'success': False,
            'message': 'You have already applied for this admission'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Create application
    application = AdmissionRegistration.objects.create(
        admission=admission,
        user=request.user
    )
    
    serializer = AdmissionRegistrationSerializer(application)
    return Response({
        'success': True,
        'message': 'Successfully applied for admission',
        'application': serializer.data
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@require_admin
def manage_webinar_registrations(request):
    """List all webinar registrations for admin"""
    
    registrations = WebinarRegistration.objects.select_related(
        'webinar', 'user'
    ).order_by('-registered_at')
    
    # Filter by webinar if specified
    webinar_id = request.GET.get('webinar_id')
    if webinar_id:
        registrations = registrations.filter(webinar_id=webinar_id)
    
    # Search functionality
    search = request.GET.get('search', '')
    if search:
        registrations = registrations.filter(
            Q(user__first_name__icontains=search) |
            Q(user__last_name__icontains=search) |
            Q(user__email__icontains=search) |
            Q(webinar__title__icontains=search)
        )
    
    serializer = WebinarRegistrationSerializer(registrations, many=True)
    return Response({
        'success': True,
        'registrations': serializer.data,
        'total': registrations.count()
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@require_admin
def manage_admission_applications(request):
    """List all admission applications for admin"""
    
    applications = AdmissionRegistration.objects.select_related(
        'admission', 'user'
    ).order_by('-applied_at')
    
    # Filter by admission if specified
    admission_id = request.GET.get('admission_id')
    if admission_id:
        applications = applications.filter(admission_id=admission_id)
    
    # Search functionality
    search = request.GET.get('search', '')
    if search:
        applications = applications.filter(
            Q(user__first_name__icontains=search) |
            Q(user__last_name__icontains=search) |
            Q(user__email__icontains=search) |
            Q(admission__college_name__icontains=search)
        )
    
    serializer = AdmissionRegistrationSerializer(applications, many=True)
    return Response({
        'success': True,
        'applications': serializer.data,
        'total': applications.count()
    })

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@require_admin
def update_registration_status(request, registration_id):
    """Update webinar registration status"""
    
    registration = get_object_or_404(WebinarRegistration, id=registration_id)
    
    new_status = request.data.get('status')
    if new_status not in ['registered', 'attended', 'cancelled']:
        return Response({
            'success': False,
            'message': 'Invalid status. Must be: registered, attended, or cancelled'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    registration.status = new_status
    registration.save()
    
    serializer = WebinarRegistrationSerializer(registration)
    return Response({
        'success': True,
        'message': 'Registration status updated successfully',
        'registration': serializer.data
    })

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@require_admin
def update_application_status(request, application_id):
    """Update admission application status"""
    
    application = get_object_or_404(AdmissionRegistration, id=application_id)
    
    new_status = request.data.get('status')
    if new_status not in ['applied', 'under_review', 'accepted', 'rejected', 'withdrawn']:
        return Response({
            'success': False,
            'message': 'Invalid status. Must be: applied, under_review, accepted, rejected, or withdrawn'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    application.status = new_status
    
    # Update notes if provided
    notes = request.data.get('notes')
    if notes:
        application.notes = notes
    
    # Update documents status if provided
    documents_submitted = request.data.get('documents_submitted')
    if documents_submitted is not None:
        application.documents_submitted = documents_submitted
    
    application.save()
    
    serializer = AdmissionRegistrationSerializer(application)
    return Response({
        'success': True,
        'message': 'Application status updated successfully',
        'application': serializer.data
    })@api_view(['GET'])
@permission_classes([AllowAny])  # Public endpoint for share links
def webinar_share_detail(request, webinar_id):
    """
    Get webinar details for share links (public access)
    """
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
@permission_classes([AllowAny])  # Public endpoint
def public_webinars(request):
    """
    Get all webinars for public access (no authentication required)
    """
    webinars = Webinar.objects.all().order_by('-created_at')
    serializer = WebinarSerializer(webinars, many=True)
    return Response({
        'success': True,
        'webinars': serializer.data,
        'total': webinars.count()
    })

@api_view(['GET'])
@permission_classes([AllowAny])  # Public endpoint
def public_admissions(request):
    """
    Get all admissions for public access (no authentication required)
    """
    admissions = AdmissionPost.objects.all().order_by('-created_at')
    serializer = AdmissionPostSerializer(admissions, many=True)
    return Response({
        'success': True,
        'admissions': serializer.data,
        'total': admissions.count()
    })