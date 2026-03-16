#!/usr/bin/env python3
"""
Simple API test using requests
"""
import requests
import json

def test_api_endpoint():
    """Test the resume database API endpoint"""
    
    print("=== Testing Resume Database API ===")
    
    # First, let's test if the server is running
    try:
        response = requests.get("http://localhost:5010/api/jobs/public", timeout=5)
        print(f"Server status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Backend server is running")
        else:
            print("❌ Backend server issue")
            return
    except requests.exceptions.RequestException as e:
        print(f"❌ Cannot connect to backend server: {e}")
        return
    
    # Test the resume database endpoint without authentication
    try:
        url = "http://localhost:5010/api/recruiter/resume-database/"
        response = requests.get(url, timeout=5)
        print(f"\nResume database endpoint test:")
        print(f"URL: {url}")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 401:
            print("✅ Endpoint exists and requires authentication (expected)")
        elif response.status_code == 404:
            print("❌ Endpoint not found - URL routing issue")
        elif response.status_code == 200:
            print("✅ Endpoint accessible (unexpected without auth)")
        else:
            print(f"❌ Unexpected status code: {response.status_code}")
            
        print(f"Response: {response.text[:200]}...")
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error testing endpoint: {e}")

if __name__ == "__main__":
    test_api_endpoint()