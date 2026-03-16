#!/usr/bin/env python3
"""
Test login and then test resume database API
"""
import requests
import json

def test_login_and_resume_api():
    """Test login and then resume database API"""
    
    print("=== Testing Login and Resume Database API ===")
    
    # Test login with a recruiter account
    login_url = "http://localhost:5010/api/auth/login"
    login_data = {
        "email": "recruiter@demo.com",
        "password": "demo123",
        "role": "recruiter"
    }
    
    try:
        print("Testing login...")
        response = requests.post(login_url, json=login_data, timeout=5)
        print(f"Login status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Login successful")
            print(f"Login response: {json.dumps(data, indent=2)}")
            
            # Extract the access token
            access_token = data.get('access') or data.get('tokens', {}).get('access') or data.get('token')
            if access_token:
                print(f"Got access token: {access_token[:20]}...")
                
                # Now test the resume database API with the token
                resume_url = "http://localhost:5010/api/recruiter/resume-database/"
                headers = {'Authorization': f'Bearer {access_token}'}
                
                print(f"\nTesting resume database API with token...")
                resume_response = requests.get(resume_url, headers=headers, timeout=5)
                print(f"Resume API status: {resume_response.status_code}")
                
                if resume_response.status_code == 200:
                    resume_data = resume_response.json()
                    print("✅ Resume database API working!")
                    print(f"Found {len(resume_data.get('candidates', []))} candidates")
                    
                    # Show first candidate as example
                    candidates = resume_data.get('candidates', [])
                    if candidates:
                        first_candidate = candidates[0]
                        print(f"Example candidate: {first_candidate.get('name', 'N/A')}")
                        print(f"Skills: {first_candidate.get('skills', [])}")
                        print(f"Experience: {first_candidate.get('experience', 'N/A')} years")
                else:
                    print(f"❌ Resume API failed: {resume_response.status_code}")
                    print(f"Response: {resume_response.text}")
            else:
                print("❌ No access token in login response")
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(f"Response: {response.text}")
            
            # Try with a different recruiter account
            print("\nTrying with test recruiter account...")
            login_data2 = {
                "email": "test_recruiter@test.com",
                "password": "testpass123",
                "role": "recruiter"
            }
            
            response2 = requests.post(login_url, json=login_data2, timeout=5)
            print(f"Test recruiter login status: {response2.status_code}")
            
            if response2.status_code == 200:
                data2 = response2.json()
                access_token2 = data2.get('access')
                if access_token2:
                    print("✅ Test recruiter login successful")
                    
                    # Test resume API with test recruiter token
                    headers2 = {'Authorization': f'Bearer {access_token2}'}
                    resume_response2 = requests.get(resume_url, headers=headers2, timeout=5)
                    print(f"Resume API with test recruiter: {resume_response2.status_code}")
                    
                    if resume_response2.status_code == 200:
                        resume_data2 = resume_response2.json()
                        print("✅ Resume database API working with test recruiter!")
                        print(f"Found {len(resume_data2.get('candidates', []))} candidates")
            else:
                print(f"❌ Test recruiter login also failed: {response2.status_code}")
                
    except requests.exceptions.RequestException as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_login_and_resume_api()