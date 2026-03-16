#!/usr/bin/env python3
"""
Test login with CORS headers like a browser would
"""

import requests
import json

def test_cors_login():
    """Test login with browser-like headers"""
    
    print("=== Testing Login with Browser Headers ===\n")
    
    # Test data
    login_data = {
        'email': 'admin2@test.com',
        'password': 'admin123',
        'role': 'admin'
    }
    
    # Browser-like headers
    headers = {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173',
        'Referer': 'http://localhost:5173/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        response = requests.post(
            'http://localhost:5010/api/auth/login',
            json=login_data,
            headers=headers
        )
        
        print(f"Status: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Success!")
            print(f"User: {data.get('user', {}).get('email', 'N/A')}")
            print(f"Role: {data.get('user', {}).get('role', 'N/A')}")
            print(f"Token: {data.get('token', 'N/A')[:50]}...")
            return True
        else:
            print(f"✗ Failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

if __name__ == '__main__':
    test_cors_login()