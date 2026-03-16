#!/usr/bin/env python3
"""
Test the login API endpoint
"""

import requests
import json

def test_login_api():
    """Test different login API endpoints"""
    
    print("=== Testing Login API Endpoints ===\n")
    
    # Test data
    login_data = {
        'email': 'admin2@test.com',
        'password': 'admin123',
        'role': 'admin'  # Add the role parameter
    }
    
    # Test endpoints to try
    endpoints = [
        'http://localhost:5010/api/auth/login',
        'http://localhost:5010/api/auth/login/',
    ]
    
    for endpoint in endpoints:
        print(f"Testing: {endpoint}")
        try:
            response = requests.post(
                endpoint,
                json=login_data,
                headers={'Content-Type': 'application/json'}
            )
            
            print(f"  Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"  ✓ Success! Token received")
                print(f"  User: {data.get('user', {}).get('email', 'N/A')}")
                print(f"  Role: {data.get('user', {}).get('role', 'N/A')}")
                return True
            else:
                print(f"  ✗ Failed: {response.text[:200]}...")
                
        except Exception as e:
            print(f"  ✗ Error: {e}")
        
        print()
    
    return False

if __name__ == '__main__':
    success = test_login_api()
    if not success:
        print("All login attempts failed. Check server and credentials.")