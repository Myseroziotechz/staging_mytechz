#!/usr/bin/env python3
"""
Test script for the resume database API endpoint
"""
import os
import sys
import django
import requests

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from authentication.models import User

def test_resume_database_api():
    """Test the resume database API endpoint"""
    
    print("=== Resume Database API Test ===")
    
    # Check if we have any candidates in the database
    candidates = User.objects.filter(role='candidate', is_active=True)
    print(f"Found {candidates.count()} candidates in database")
    
    # Check if we have any recruiters
    recruiters = User.objects.filter(role='recruiter', is_active=True)
    print(f"Found {recruiters.count()} recruiters in database")
    
    if recruiters.exists():
        recruiter = recruiters.first()
        print(f"Test recruiter: {recruiter.email}")
        
        # Test the API endpoint
        try:
            # You would need to get a valid token for this recruiter
            # For now, just test the URL structure
            url = "http://localhost:5010/api/recruiter/resume-database/"
            print(f"API URL: {url}")
            print("Note: You need to test this with a valid authentication token")
            
        except Exception as e:
            print(f"Error testing API: {e}")
    
    # Create some test data if needed
    if not candidates.exists():
        print("No candidates found. You may need to create some test candidates.")
    
    if not recruiters.exists():
        print("No recruiters found. You may need to create some test recruiters.")

if __name__ == "__main__":
    test_resume_database_api()