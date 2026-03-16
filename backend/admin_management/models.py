from django.db import models
from authentication.models import User

class Webinar(models.Model):
    """Webinar model for admin management"""
    
    MODE_CHOICES = [
        ('online', 'Online'),
        ('offline', 'Offline'),
        ('hybrid', 'Hybrid'),
    ]
    
    CATEGORY_CHOICES = [
        ('technology', 'Technology'),
        ('business', 'Business'),
        ('career', 'Career Development'),
        ('education', 'Education'),
        ('other', 'Other'),
    ]
    
    title = models.CharField(max_length=300)
    speaker = models.CharField(max_length=200)
    organization = models.CharField(max_length=200)
    date = models.DateField()
    time = models.TimeField()
    mode = models.CharField(max_length=20, choices=MODE_CHOICES, default='online')
    platform = models.CharField(max_length=200, help_text="Platform/Venue name")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='technology')
    description = models.TextField()
    agenda = models.TextField(blank=True, null=True)
    
    # Admin fields
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_webinars')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'webinars'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title

class AdmissionPost(models.Model):
    """Admission Post model for college admissions"""
    
    college_name = models.CharField(max_length=300)
    location = models.CharField(max_length=200)
    courses = models.TextField(help_text="Courses offered")
    eligibility = models.TextField(help_text="Eligibility criteria")
    deadline = models.DateField(help_text="Application deadline")
    fees = models.CharField(max_length=100, help_text="Fee structure")
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)
    description = models.TextField()
    
    # Admin fields
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_admissions')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'admission_posts'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.college_name

class WebinarRegistration(models.Model):
    """Track webinar registrations by candidates"""
    
    STATUS_CHOICES = [
        ('registered', 'Registered'),
        ('attended', 'Attended'),
        ('cancelled', 'Cancelled'),
    ]
    
    webinar = models.ForeignKey(Webinar, on_delete=models.CASCADE, related_name='registrations')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='webinar_registrations')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='registered')
    registered_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'webinar_registrations'
        unique_together = ['webinar', 'user']  # Prevent duplicate registrations
        ordering = ['-registered_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.webinar.title}"

class AdmissionRegistration(models.Model):
    """Track admission applications by candidates"""
    
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('under_review', 'Under Review'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    ]
    
    admission = models.ForeignKey(AdmissionPost, on_delete=models.CASCADE, related_name='applications')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='admission_applications')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='applied')
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Additional application details
    documents_submitted = models.BooleanField(default=False)
    notes = models.TextField(blank=True, null=True, help_text="Admin notes")
    
    class Meta:
        db_table = 'admission_registrations'
        unique_together = ['admission', 'user']  # Prevent duplicate applications
        ordering = ['-applied_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.admission.college_name}"