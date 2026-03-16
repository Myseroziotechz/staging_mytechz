#!/usr/bin/env python3
"""
Test script to verify JWT token validation
"""
import os
import sys
import django
import json
from django.test import Client
from django.contrib.auth import get_user_model

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

User = get_user_model()

def test_token_validation():
    """Test JWT token validation"""
    print("=" * 60)
    print("TESTING JWT TOKEN VALIDATION")
    print("=" * 60)
    
    # Create test client
    client = Client()
    
    # Use existing user
    test_email = "testprofile@example.com"
    test_password = "testpass123"
    
    try:
        user = User.objects.get(email=test_email)
        print(f"Using existing user: {user.email}")
    except User.DoesNotExist:
        user = User.objects.create_user(
            email=test_email,
            password=test_password,
            first_name="Test",
            last_name="Candidate"
        )
        print(f"Created new user: {user.email}")
    
    # Login to get token
    login_response = client.post('/api/auth/login', {
        'email': test_email,
        'password': test_password,
        'role': 'candidate'
    }, content_type='application/json')
    
    if login_response.status_code != 200:
        print(f"Login failed: {login_response.status_code}")
        print(f"Response: {login_response.content.decode()}")
        return False
    
    login_data = json.loads(login_response.content.decode())
    token = login_data.get('token')
    print(f"Login successful, token: {token[:50]}...")
    
    # Test profile GET with token
    get_response = client.get(
        '/api/auth/profile',
        HTTP_AUTHORIZATION=f'Bearer {token}'
    )
    
    print(f"Profile GET response status: {get_response.status_code}")
    if get_response.status_code == 200:
        profile_data = json.loads(get_response.content.decode())
        print(f"Profile data: {profile_data.get('firstName', 'N/A')} {profile_data.get('lastName', 'N/A')}")
        print("✅ Token validation successful!")
        return True
    else:
        print(f"Profile GET failed: {get_response.content.decode()}")
        print("❌ Token validation failed!")
        return False

if __name__ == "__main__":
    success = test_token_validation()
    sys.exit(0 if success else 1)