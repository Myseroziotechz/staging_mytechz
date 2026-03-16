#!/usr/bin/env python3
"""
Test forgot password functionality
"""
import requests
import json

BASE_URL = "http://localhost:5010"

def test_forgot_password():
    """Test forgot password endpoint"""
    print("Testing forgot password functionality...")
    
    # Test with existing user email
    test_email = "admin2@test.com"  # We know this user exists
    
    print(f"\n1. Testing forgot password for: {test_email}")
    try:
        response = requests.post(f"{BASE_URL}/api/auth/forgot-password", 
                               json={"email": test_email})
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print("✅ Forgot password request successful!")
                # Extract OTP from development message
                message = data.get('message', '')
                if 'For development:' in message:
                    otp = message.split('For development: ')[-1].strip()
                    print(f"OTP for testing: {otp}")
                    return otp
            else:
                print("❌ Forgot password request failed")
        else:
            print(f"❌ HTTP Error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    return None

def test_reset_password(email, otp):
    """Test reset password endpoint"""
    print(f"\n2. Testing password reset with OTP: {otp}")
    
    try:
        response = requests.post(f"{BASE_URL}/api/auth/reset-password", 
                               json={
                                   "email": email,
                                   "otp": otp,
                                   "newPassword": "newpassword123"
                               })
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print("✅ Password reset successful!")
                return True
            else:
                print("❌ Password reset failed")
        else:
            print(f"❌ HTTP Error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")
    
    return False

def test_invalid_cases():
    """Test invalid cases"""
    print("\n3. Testing invalid cases...")
    
    # Test with non-existent email
    print("Testing with non-existent email...")
    try:
        response = requests.post(f"{BASE_URL}/api/auth/forgot-password", 
                               json={"email": "nonexistent@test.com"})
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Exception: {e}")
    
    # Test with invalid OTP
    print("\nTesting with invalid OTP...")
    try:
        response = requests.post(f"{BASE_URL}/api/auth/reset-password", 
                               json={
                                   "email": "admin2@test.com",
                                   "otp": "9999",
                                   "newPassword": "newpassword123"
                               })
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    # Test forgot password
    otp = test_forgot_password()
    
    if otp:
        # Test reset password
        success = test_reset_password("admin2@test.com", otp)
        
        if success:
            print("\n✅ All tests passed! Forgot password functionality is working.")
        else:
            print("\n❌ Password reset test failed.")
    else:
        print("\n❌ Forgot password test failed.")
    
    # Test invalid cases
    test_invalid_cases()
    
    print("\n=== Test Complete ===")