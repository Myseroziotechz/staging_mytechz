#!/usr/bin/env python3
"""
Script to create sample admission posts for testing the registration system
"""

import os
import sys
import django
from datetime import datetime, timedelta

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from admin_management.models import AdmissionPost
from authentication.models import User

def create_sample_admissions():
    """Create sample admission posts"""
    
    # Get or create an admin user
    admin_user, created = User.objects.get_or_create(
        email='admin2@test.com',
        defaults={
            'first_name': 'Admin',
            'last_name': 'User',
            'role': 'admin',
            'phone': '1234567890'
        }
    )
    
    if created:
        admin_user.set_password('admin123')
        admin_user.save()
        print(f"Created admin user: {admin_user.email}")
    else:
        print(f"Using existing admin user: {admin_user.email}")
    
    # Sample admission data
    sample_admissions = [
        {
            'college_name': 'Indian Institute of Technology Delhi',
            'location': 'New Delhi, India',
            'courses': 'B.Tech in Computer Science, Electrical Engineering, Mechanical Engineering, Civil Engineering',
            'eligibility': 'JEE Advanced qualified candidates with minimum 75% in 12th grade',
            'deadline': datetime.now() + timedelta(days=60),
            'fees': '₹2,50,000 per year',
            'contact_email': 'admissions@iitd.ac.in',
            'contact_phone': '+91-11-2659-1000',
            'description': 'IIT Delhi is one of the premier engineering institutions in India, offering world-class education in engineering and technology.',
        },
        {
            'college_name': 'Indian Institute of Management Bangalore',
            'location': 'Bangalore, Karnataka',
            'courses': 'MBA, Executive MBA, PhD in Management',
            'eligibility': 'CAT score above 90 percentile, Bachelor\'s degree with minimum 60% marks',
            'deadline': datetime.now() + timedelta(days=45),
            'fees': '₹24,50,000 for 2-year MBA',
            'contact_email': 'admissions@iimb.ac.in',
            'contact_phone': '+91-80-2699-3000',
            'description': 'IIM Bangalore is a leading business school in India, known for its rigorous MBA program and excellent placement records.',
        },
        {
            'college_name': 'All India Institute of Medical Sciences',
            'location': 'New Delhi, India',
            'courses': 'MBBS, MD, MS, DM, MCh, PhD',
            'eligibility': 'NEET qualified candidates with minimum 50% in PCB for general category',
            'deadline': datetime.now() + timedelta(days=30),
            'fees': '₹5,856 per year for MBBS',
            'contact_email': 'admissions@aiims.edu',
            'contact_phone': '+91-11-2658-8500',
            'description': 'AIIMS Delhi is the premier medical institution in India, offering undergraduate and postgraduate medical education.',
        },
        {
            'college_name': 'Delhi University - St. Stephens College',
            'location': 'New Delhi, India',
            'courses': 'BA (Hons) in English, Economics, History, Philosophy, Political Science',
            'eligibility': 'CUET qualified with minimum 85% in best of four subjects',
            'deadline': datetime.now() + timedelta(days=40),
            'fees': '₹45,000 per year',
            'contact_email': 'admissions@ststephens.edu',
            'contact_phone': '+91-11-2397-4700',
            'description': 'St. Stephen\'s College is one of the most prestigious colleges under Delhi University, known for its liberal arts education.',
        },
        {
            'college_name': 'National Institute of Technology Trichy',
            'location': 'Tiruchirappalli, Tamil Nadu',
            'courses': 'B.Tech, M.Tech, MBA, PhD in various engineering disciplines',
            'eligibility': 'JEE Main qualified candidates with minimum 75% in 12th grade',
            'deadline': datetime.now() + timedelta(days=50),
            'fees': '₹1,75,000 per year',
            'contact_email': 'admissions@nitt.edu',
            'contact_phone': '+91-431-250-3000',
            'description': 'NIT Trichy is one of the top National Institutes of Technology, offering excellent engineering education.',
        }
    ]
    
    created_count = 0
    for admission_data in sample_admissions:
        # Check if admission already exists
        existing = AdmissionPost.objects.filter(
            college_name=admission_data['college_name']
        ).first()
        
        if not existing:
            admission = AdmissionPost.objects.create(
                created_by=admin_user,
                **admission_data
            )
            print(f"Created admission post: {admission.college_name}")
            created_count += 1
        else:
            print(f"Admission post already exists: {admission_data['college_name']}")
    
    print(f"\nSample admission creation completed!")
    print(f"Created {created_count} new admission posts")
    print(f"Total admission posts in database: {AdmissionPost.objects.count()}")

if __name__ == '__main__':
    create_sample_admissions()