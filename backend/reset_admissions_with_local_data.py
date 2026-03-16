#!/usr/bin/env python3
"""
Script to reset admission posts with college names that match the local frontend data
"""

import os
import sys
import django
import json
from datetime import datetime, timedelta

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from admin_management.models import AdmissionPost, AdmissionRegistration
from authentication.models import User

def reset_admissions():
    """Delete all existing admissions and create new ones matching local data"""
    
    print("=== Resetting Admission Posts ===\n")
    
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
    
    # Delete all existing admission posts and registrations
    print(f"Deleting {AdmissionRegistration.objects.count()} existing admission registrations...")
    AdmissionRegistration.objects.all().delete()
    
    print(f"Deleting {AdmissionPost.objects.count()} existing admission posts...")
    AdmissionPost.objects.all().delete()
    
    # Create new admission posts matching local college data
    local_colleges = [
        {
            'college_name': 'Galgotias College of Engineering and Technology',
            'location': 'Greater Noida, Uttar Pradesh',
            'courses': 'B.Tech in CSE, ECE, ME, IT; M.Tech; MBA',
            'eligibility': 'UPCET qualified candidates with minimum 60% in 12th grade',
            'deadline': datetime.now() + timedelta(days=45),
            'fees': '₹1,25,000 per year',
            'contact_email': 'admissions@galgotias.edu.in',
            'contact_phone': '+91-120-275-2000',
            'description': 'Galgotias College, Greater Noida offers B.Tech, M.Tech, MBA. Approved by AICTE & affiliated to AKTU. NAAC accredited with strong placement records.',
        },
        {
            'college_name': 'MS Engineering College',
            'location': 'Bangalore, Karnataka',
            'courses': 'B.E. in CSE, EEE, ISE; M.Tech; MBA',
            'eligibility': 'KCET/COMEDK qualified candidates with minimum 60% in 12th grade',
            'deadline': datetime.now() + timedelta(days=50),
            'fees': '₹1,20,000 per year',
            'contact_email': 'admissions@msec.ac.in',
            'contact_phone': '+91-80-2345-6789',
            'description': 'Top private engineering college in Bangalore under VTU. Known for excellent placements and industry connections.',
        },
        {
            'college_name': 'MSEC Bangalore',
            'location': 'Bangalore, Karnataka',
            'courses': 'B.E. in CSE, EEE, ISE; M.Tech in various specializations',
            'eligibility': 'KCET/COMEDK qualified with minimum 60% in PCM for engineering courses',
            'deadline': datetime.now() + timedelta(days=40),
            'fees': '₹1,20,000 per year for B.E.',
            'contact_email': 'admissions@msecbangalore.edu.in',
            'contact_phone': '+91-80-2876-5432',
            'description': 'Affiliated to VTU and accredited by NBA/NAAC. Offers UG and PG courses in Engineering with excellent infrastructure and placement support.',
        },
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
        }
    ]
    
    created_count = 0
    for admission_data in local_colleges:
        admission = AdmissionPost.objects.create(
            created_by=admin_user,
            **admission_data
        )
        print(f"✓ Created admission post: {admission.college_name}")
        created_count += 1
    
    print(f"\n=== Reset Complete ===")
    print(f"Created {created_count} new admission posts")
    print(f"Total admission posts in database: {AdmissionPost.objects.count()}")
    print(f"Total admission registrations: {AdmissionRegistration.objects.count()}")
    
    print("\nNow you can apply to these colleges from the frontend:")
    for college in local_colleges:
        print(f"- {college['college_name']}")

if __name__ == '__main__':
    reset_admissions()