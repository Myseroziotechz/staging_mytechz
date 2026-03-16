#!/usr/bin/env python3
"""
Test script to verify profile update functionality
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

def test_profile_update():
    """Test profile update endpoint"""
    print("=" * 60)
    print("TESTING PROFILE UPDATE FUNCTIONALITY")
    print("=" * 60)
    
    # Create test client
    client = Client()
    
    # Create test user
    test_email = "test@example.com"
    test_password = "testpass123"
    
    # Delete existing test user if exists
    User.objects.filter(email=test_email).delete()
    
    # Create new test user
    user = User.objects.create_user(
        email=test_email,
        password=test_password,
        first_name="Test",
        last_name="User"
    )
    print(f"Created test user: {user.email}")
    
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
    print(f"Login successful, token: {token[:20]}...")
    
    # Test profile update with correct field names
    profile_data = {
        'first_name': 'Updated',
        'last_name': 'Name',
        'phone': '1234567890',
        'bio': 'This is a test bio',
        'skills': 'Python, Django, JavaScript',
        'linkedin_url': 'https://linkedin.com/in/test',
        'github_url': 'https://github.com/test',
        'portfolio_url': 'https://test.com'
    }
    
    print(f"Updating profile with data: {profile_data}")
    
    update_response = client.put(
        '/api/auth/profile',
        json.dumps(profile_data),
        content_type='application/json',
        HTTP_AUTHORIZATION=f'Bearer {token}'
    )
    
    print(f"Update response status: {update_response.status_code}")
    print(f"Update response: {update_response.content.decode()}")
    
    if update_response.status_code == 200:
        print("✅ Profile update successful!")
        
        # Verify the update
        user.refresh_from_db()
        print(f"Updated user name: {user.first_name} {user.last_name}")
        print(f"Updated bio: {user.bio}")
        print(f"Updated skills: {user.skills}")
        return True
    else:
        print("❌ Profile update failed!")
        return False

if __name__ == "__main__":
    success = test_profile_update()
    sys.exit(0 if success else 1)