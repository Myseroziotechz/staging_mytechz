#!/usr/bin/env python
"""
Debug SMTP Connection
"""

import os
import sys
import django
from pathlib import Path

# Setup Django
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings
import smtplib
from email.mime.text import MIMEText

def test_smtp_connection():
    """Test direct SMTP connection"""
    
    print("🔧 Testing Direct SMTP Connection...")
    print(f"📧 Host: {settings.EMAIL_HOST}")
    print(f"🔌 Port: {settings.EMAIL_PORT}")
    print(f"👤 User: {settings.EMAIL_HOST_USER}")
    print(f"🔐 Password: {'*' * len(settings.EMAIL_HOST_PASSWORD)}")
    print("-" * 50)
    
    try:
        # Create SMTP connection
        server = smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT)
        server.starttls()  # Enable TLS
        
        print("✅ Connected to Gmail SMTP server")
        
        # Try to login
        server.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
        print("✅ Login successful!")
        
        # Send test email
        msg = MIMEText("Test email from MytechZ SMTP debug")
        msg['Subject'] = 'SMTP Test - MytechZ'
        msg['From'] = settings.EMAIL_HOST_USER
        msg['To'] = settings.EMAIL_HOST_USER
        
        server.send_message(msg)
        print("✅ Test email sent successfully!")
        
        server.quit()
        return True
        
    except smtplib.SMTPAuthenticationError as e:
        print(f"❌ Authentication failed: {e}")
        print("💡 This usually means:")
        print("   • Invalid Gmail App Password")
        print("   • 2FA not enabled on Gmail account")
        print("   • Using regular password instead of App Password")
        return False
        
    except Exception as e:
        print(f"❌ SMTP connection failed: {e}")
        return False

def test_django_email():
    """Test Django email sending"""
    
    print("\n🔧 Testing Django Email System...")
    
    try:
        send_mail(
            subject='Django Test Email - MytechZ',
            message='This is a test email from Django.',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.EMAIL_HOST_USER],
            fail_silently=False,
        )
        print("✅ Django email sent successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Django email failed: {e}")
        return False

if __name__ == "__main__":
    print("🔍 MytechZ SMTP Debug Tool")
    print("=" * 50)
    
    # Test direct SMTP
    smtp_success = test_smtp_connection()
    
    # Test Django email
    django_success = test_django_email()
    
    print("\n" + "=" * 50)
    print("📊 Results:")
    print(f"   SMTP Connection: {'✅ Success' if smtp_success else '❌ Failed'}")
    print(f"   Django Email: {'✅ Success' if django_success else '❌ Failed'}")
    
    if not smtp_success:
        print("\n🔧 To fix authentication issues:")
        print("   1. Go to https://myaccount.google.com/apppasswords")
        print("   2. Generate a new 16-character App Password")
        print("   3. Update .env file with the new password")
        print("   4. Restart Django server")