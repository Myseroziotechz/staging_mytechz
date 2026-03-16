#!/usr/bin/env python3
"""
Test script to verify the registration tracking system
"""

import os
import sys
import django
import requests
import json

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from admin_management.models import Webinar, AdmissionPost, WebinarRegistration, AdmissionRegistration
from authentication.models import User

def test_registration_system():
    """Test the registration tracking system"""
    
    print("=== Registration System Test ===\n")
    
    # Check database state
    print("Current Database State:")
    print(f"- Users: {User.objects.count()}")
    print(f"- Webinars: {Webinar.objects.count()}")
    print(f"- Admission Posts: {AdmissionPost.objects.count()}")
    print(f"- Webinar Registrations: {WebinarRegistration.objects.count()}")
    print(f"- Admission Applications: {AdmissionRegistration.objects.count()}")
    print()
    
    # List available webinars
    print("Available Webinars:")
    webinars = Webinar.objects.all()
    for webinar in webinars:
        registrations = webinar.registrations.count()
        print(f"- {webinar.title} (ID: {webinar.id}) - {registrations} registrations")
    print()
    
    # List available admissions
    print("Available Admission Posts:")
    admissions = AdmissionPost.objects.all()
    for admission in admissions:
        applications = admission.applications.count()
        print(f"- {admission.college_name} (ID: {admission.id}) - {applications} applications")
    print()
    
    # List current registrations
    print("Current Webinar Registrations:")
    registrations = WebinarRegistration.objects.all()
    for reg in registrations:
        print(f"- {reg.user.get_full_name()} ({reg.user.email}) -> {reg.webinar.title} [{reg.status}]")
    
    if not registrations:
        print("- No webinar registrations found")
    print()
    
    # List current applications
    print("Current Admission Applications:")
    applications = AdmissionRegistration.objects.all()
    for app in applications:
        print(f"- {app.user.get_full_name()} ({app.user.email}) -> {app.admission.college_name} [{app.status}]")
    
    if not applications:
        print("- No admission applications found")
    print()
    
    # Test API endpoints
    print("Testing API Endpoints:")
    base_url = "http://localhost:5010"
    
    # Test public webinars endpoint
    try:
        response = requests.get(f"{base_url}/api/admin/webinars/public/")
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Public webinars API: {len(data.get('webinars', []))} webinars")
        else:
            print(f"✗ Public webinars API failed: {response.status_code}")
    except Exception as e:
        print(f"✗ Public webinars API error: {e}")
    
    # Test public admissions endpoint
    try:
        response = requests.get(f"{base_url}/api/admin/admissions/public/")
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Public admissions API: {len(data.get('admissions', []))} admissions")
        else:
            print(f"✗ Public admissions API failed: {response.status_code}")
    except Exception as e:
        print(f"✗ Public admissions API error: {e}")
    
    print("\n=== Test Complete ===")

if __name__ == '__main__':
    test_registration_system()