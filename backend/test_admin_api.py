#!/usr/bin/env python3
"""
Test script to check admin API endpoints
"""
import requests
import json

# Configuration
BASE_URL = "http://localhost:5010"
ADMIN_EMAIL = "admin2@test.com"
ADMIN_PASSWORD = "admin123"

def login_admin():
    """Login as admin and get token"""
    login_data = {
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD,
        "role": "admin"
    }
    
    response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
    if response.status_code == 200:
        data = response.json()
        return data.get('token')
    else:
        print(f"Login failed: {response.status_code} - {response.text}")
        return None

def test_endpoint(endpoint, token):
    """Test a specific endpoint"""
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    print(f"\n=== Testing {endpoint} ===")
    try:
        response = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text[:500]}...")
        
        if response.status_code == 200:
            data = response.json()
            if 'webinars' in data:
                print(f"Webinars count: {len(data['webinars'])}")
            elif 'admissions' in data:
                print(f"Admissions count: {len(data['admissions'])}")
            elif 'users' in data:
                print(f"Users count: {len(data['users'])}")
            elif 'jobs' in data:
                print(f"Jobs count: {len(data['jobs'])}")
                
    except Exception as e:
        print(f"Error: {e}")

def main():
    print("Testing Admin API Endpoints...")
    
    # Login first
    token = login_admin()
    if not token:
        print("Failed to login. Exiting.")
        return
    
    print(f"Login successful! Token: {token[:20]}...")
    
    # Test all admin endpoints
    endpoints = [
        "/api/admin/stats/",
        "/api/admin/users/",
        "/api/admin/jobs/",
        "/api/admin/webinars/",
        "/api/admin/admissions/"
    ]
    
    for endpoint in endpoints:
        test_endpoint(endpoint, token)
    
    print("\n=== Testing URL patterns ===")
    # Test without trailing slash
    test_endpoint("/api/admin/webinars", token)
    test_endpoint("/api/admin/admissions", token)

if __name__ == "__main__":
    main()