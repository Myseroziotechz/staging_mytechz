#!/usr/bin/env python3
"""
Test public webinars endpoint
"""
import requests

BASE_URL = "http://localhost:5010"

def test_public_webinars():
    """Test public webinars endpoint"""
    print("Testing public webinars endpoint...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/webinars/public")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Success: {data.get('success')}")
            print(f"Total webinars: {data.get('total', 0)}")
            print(f"Webinars count: {len(data.get('webinars', []))}")
            
            if data.get('webinars'):
                print("\nFirst webinar:")
                webinar = data['webinars'][0]
                print(f"  ID: {webinar.get('id')}")
                print(f"  Title: {webinar.get('title')}")
                print(f"  Speaker: {webinar.get('speaker')}")
                print(f"  Date: {webinar.get('date')}")
                print(f"  Active: {webinar.get('is_active')}")
        else:
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"Exception: {e}")

def test_public_admissions():
    """Test public admissions endpoint"""
    print("\nTesting public admissions endpoint...")
    
    try:
        response = requests.get(f"{BASE_URL}/api/admissions/public")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Success: {data.get('success')}")
            print(f"Total admissions: {data.get('total', 0)}")
            print(f"Admissions count: {len(data.get('admissions', []))}")
        else:
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_public_webinars()
    test_public_admissions()