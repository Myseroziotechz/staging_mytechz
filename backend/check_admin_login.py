#!/usr/bin/env python3
"""
Script to check admin login credentials and fix any issues
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

from authentication.models import User
from django.contrib.auth import authenticate

def check_admin_login():
    """Check and fix admin login issues"""
    
    print("=== Admin Login Diagnostic ===\n")
    
    # Check if admin user exists
    try:
        admin_user = User.objects.get(email='admin2@test.com')
        print(f"✓ Admin user found: {admin_user.email}")
        print(f"  - Name: {admin_user.get_full_name()}")
        print(f"  - Role: {admin_user.role}")
        print(f"  - Active: {admin_user.is_active}")
        print(f"  - Staff: {admin_user.is_staff}")
        print(f"  - Superuser: {admin_user.is_superuser}")
    except User.DoesNotExist:
        print("✗ Admin user not found! Creating new admin user...")
        admin_user = User.objects.create_user(
            email='admin2@test.com',
            first_name='Admin',
            last_name='User',
            role='admin',
            phone='1234567890'
        )
        admin_user.set_password('admin123')
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.save()
        print(f"✓ Created new admin user: {admin_user.email}")
    
    # Test password authentication
    print(f"\nTesting password authentication...")
    auth_user = authenticate(username='admin2@test.com', password='admin123')
    if auth_user:
        print("✓ Password authentication successful")
    else:
        print("✗ Password authentication failed! Resetting password...")
        admin_user.set_password('admin123')
        admin_user.save()
        print("✓ Password reset to 'admin123'")
        
        # Test again
        auth_user = authenticate(username='admin2@test.com', password='admin123')
        if auth_user:
            print("✓ Password authentication now working")
        else:
            print("✗ Still having authentication issues")
    
    # Test API login
    print(f"\nTesting API login...")
    try:
        response = requests.post('http://localhost:5010/api/auth/login/', {
            'email': 'admin2@test.com',
            'password': 'admin123'
        })
        
        print(f"API Response Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print("✓ API login successful")
            print(f"  - Access token received: {data.get('access', 'N/A')[:50]}...")
            print(f"  - User role: {data.get('user', {}).get('role', 'N/A')}")
        else:
            print("✗ API login failed")
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"✗ API login error: {e}")
    
    # List all admin users
    print(f"\nAll admin users in system:")
    admin_users = User.objects.filter(role='admin')
    for user in admin_users:
        print(f"  - {user.email} ({user.get_full_name()}) - Active: {user.is_active}")
    
    print(f"\n=== Diagnostic Complete ===")
    print(f"Try logging in with: admin2@test.com / admin123")

if __name__ == '__main__':
    check_admin_login()