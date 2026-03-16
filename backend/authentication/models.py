from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.core.validators import RegexValidator

class UserManager(BaseUserManager):
    """Custom user manager for email-based authentication"""
    
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    """
    Custom User model for Job Portal (Candidates and Recruiters)
    """
    # Override username field to use email
    username = None
    email = models.EmailField(unique=True)
    
    # User Role
    ROLE_CHOICES = [
        ('candidate', 'Candidate'),
        ('recruiter', 'Recruiter'),
        ('admin', 'Admin'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='candidate')
    
    # Basic Info
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    phone = models.CharField(
        max_length=20,  # Increased to accommodate + and country codes
        blank=True,
        null=True,
        help_text="Phone number in international format (e.g., +1234567890)"
    )
    
    # Personal Info
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(
        max_length=10,
        choices=[
            ('male', 'Male'),
            ('female', 'Female'),
            ('other', 'Other'),
        ],
        null=True,
        blank=True
    )
    address = models.TextField(null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    pincode = models.CharField(max_length=10, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    
    # Professional Info
    skills = models.TextField(null=True, blank=True, help_text="Comma-separated skills")
    experience = models.TextField(null=True, blank=True)
    education = models.TextField(null=True, blank=True)
    
    # Social Links
    linkedin_url = models.URLField(null=True, blank=True)
    github_url = models.URLField(null=True, blank=True)
    portfolio_url = models.URLField(null=True, blank=True)
    
    # Resume
    resume_file_name = models.CharField(max_length=255, null=True, blank=True)
    resume_file_path = models.FileField(upload_to='resumes/', null=True, blank=True)
    resume_uploaded_at = models.DateTimeField(null=True, blank=True)
    
    # Password Reset OTP
    reset_otp = models.CharField(max_length=4, null=True, blank=True)
    reset_otp_created = models.DateTimeField(null=True, blank=True)
    
    # Profile and Approval Status (for recruiters)
    profile_completed = models.BooleanField(default=False, help_text="Whether recruiter has completed their profile")
    
    APPROVAL_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    approval_status = models.CharField(
        max_length=20, 
        choices=APPROVAL_STATUS_CHOICES, 
        default='pending',
        help_text="Admin approval status for recruiters"
    )
    approved_at = models.DateTimeField(null=True, blank=True, help_text="When the recruiter was approved")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    objects = UserManager()
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def get_skills_list(self):
        """Return skills as a list"""
        if self.skills:
            return [skill.strip() for skill in self.skills.split(',')]
        return []
    
    def can_post_jobs(self):
        """Check if recruiter can post jobs (must have completed company profile AND be approved)"""
        if self.role != 'recruiter':
            return False
        
        # Must be approved by admin
        if self.approval_status != 'approved':
            return False
        
        # Check if recruiter has a company profile
        try:
            from recruiter.models import RecruiterCompanyProfile
            company_profile = RecruiterCompanyProfile.objects.filter(recruiter=self).first()
            # Recruiter can post jobs if they have filled company information AND are approved
            return company_profile is not None
        except:
            return False
    
    def mark_profile_completed(self):
        """Mark recruiter profile as completed"""
        if self.role == 'recruiter':
            self.profile_completed = True
            self.save()
    
    def approve_recruiter(self):
        """Approve recruiter (admin action)"""
        if self.role == 'recruiter':
            from django.utils import timezone
            self.approval_status = 'approved'
            self.approved_at = timezone.now()
            self.save()
    
    def reject_recruiter(self):
        """Reject recruiter (admin action)"""
        if self.role == 'recruiter':
            self.approval_status = 'rejected'
            self.approved_at = None
            self.save()