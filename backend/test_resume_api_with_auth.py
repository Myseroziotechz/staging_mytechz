#!/usr/bin/env python3
"""
Test script for the resume database API endpoint with authentication
"""
import os
import sys
import django
import requests
from django.test import Client
from django.urls import reverse

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from authentication.models import User
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

def test_resume_database_with_auth():
    """Test the resume database API endpoint with proper authentication"""
    
    print("=== Resume Database API Test with Authentication ===")
    
    # Get or create a test recruiter
    recruiter, created = User.objects.get_or_create(
        email='test_recruiter@test.com',
        defaults={
            'first_name': 'Test',
            'last_name': 'Recruiter',
            'role': 'recruiter',
            'is_active': True,
            'phone': '1234567890'
        }
    )
    
    if created:
        recruiter.set_password('testpass123')
        recruiter.save()
        print("Created test recruiter")
    else:
        print("Using existing test recruiter")
    
    # Generate JWT token for the recruiter
    refresh = RefreshToken.for_user(recruiter)
    access_token = str(refresh.access_token)
    
    print(f"Generated token for: {recruiter.email}")
    
    # Test the API endpoint using Django's test client
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
    
    try:
        response = client.get('/api/recruiter/resume-database/')
        print(f"Response status: {response.status_code}")
        print(f"Response data: {response.data}")
        
        if response.status_code == 200:
            print("✅ API endpoint is working correctly!")
            candidates = response.data.get('candidates', [])
            print(f"Found {len(candidates)} candidates")
        else:
            print(f"❌ API endpoint returned error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error testing API: {e}")
    
    # Also test with requests library
    try:
        url = "http://localhost:5010/api/recruiter/resume-database/"
        headers = {'Authorization': f'Bearer {access_token}'}
        
        response = requests.get(url, headers=headers, timeout=5)
        print(f"\nRequests library test:")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ External API test successful!")
            print(f"Found {len(data.get('candidates', []))} candidates")
        else:
            print(f"❌ External API test failed: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection error: {e}")
        print("Make sure the Django server is running on localhost:5010")

if __name__ == "__main__":
    test_resume_database_with_auth()