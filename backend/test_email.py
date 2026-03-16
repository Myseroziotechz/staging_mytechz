#!/usr/bin/env python
"""
Email Testing Script for MytechZ
Run this to test Gmail SMTP configuration
"""

import os
import sys
import django
from pathlib import Path

# Add the project directory to Python path
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings
import random
import string

def test_email_configuration():
    """Test the email configuration"""
    
    print("🔧 Testing Email Configuration...")
    print(f"📧 Backend: {settings.EMAIL_BACKEND}")
    print(f"🏠 Host: {getattr(settings, 'EMAIL_HOST', 'Not configured')}")
    print(f"🔌 Port: {getattr(settings, 'EMAIL_PORT', 'Not configured')}")
    print(f"🔐 TLS: {getattr(settings, 'EMAIL_USE_TLS', 'Not configured')}")
    print(f"👤 User: {getattr(settings, 'EMAIL_HOST_USER', 'Not configured')}")
    print(f"📨 From: {getattr(settings, 'DEFAULT_FROM_EMAIL', 'Not configured')}")
    print("-" * 50)
    
    # Check if SMTP is configured
    if 'smtp' not in settings.EMAIL_BACKEND:
        print("⚠️  Console backend detected - emails will show in terminal")
        return True
    
    # Check credentials
    if not getattr(settings, 'EMAIL_HOST_USER', '') or not getattr(settings, 'EMAIL_HOST_PASSWORD', ''):
        print("❌ Email credentials not configured!")
        print("📝 Please update your .env file with Gmail credentials")
        return False
    
    return True

def send_test_email(recipient_email):
    """Send a test email"""
    
    if not test_email_configuration():
        return False
    
    # Generate test OTP
    test_otp = ''.join(random.choices(string.digits, k=4))
    
    subject = 'Test Email - MytechZ SMTP Configuration'
    message = f"""
Hello!

This is a test email to verify that Gmail SMTP is working correctly for MytechZ.

Test OTP: {test_otp}

If you received this email, the configuration is working perfectly!

Best regards,
MytechZ Development Team
    """.strip()
    
    try:
        print(f"📤 Sending test email to: {recipient_email}")
        
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient_email],
            fail_silently=False,
        )
        
        print("✅ Email sent successfully!")
        print(f"📧 Check your inbox at: {recipient_email}")
        return True
        
    except Exception as e:
        print(f"❌ Email sending failed: {str(e)}")
        print("\n🔍 Common issues:")
        print("   • Check Gmail App Password is correct")
        print("   • Ensure 2FA is enabled on Gmail account")
        print("   • Verify internet connection")
        print("   • Check .env file syntax")
        return False

if __name__ == "__main__":
    print("📧 MytechZ Email Testing Script")
    print("=" * 50)
    
    # Get recipient email
    if len(sys.argv) > 1:
        recipient = sys.argv[1]
    else:
        recipient = input("Enter recipient email address: ").strip()
    
    if not recipient:
        print("❌ No email address provided")
        sys.exit(1)
    
    # Validate email format
    if '@' not in recipient or '.' not in recipient:
        print("❌ Invalid email format")
        sys.exit(1)
    
    # Send test email
    success = send_test_email(recipient)
    
    if success:
        print("\n🎉 Gmail SMTP is configured correctly!")
        print("💡 You can now use the forgot password feature")
    else:
        print("\n❌ Gmail SMTP configuration needs attention")
        print("📖 Check the setup guide: 📧_GMAIL_SMTP_SETUP_📧.md")
    
    print("\n" + "=" * 50)