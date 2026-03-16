#!/usr/bin/env python3
"""
Gmail SMTP Setup Script for MytechZ
This script helps you configure Gmail SMTP quickly
"""

import os
import re
from pathlib import Path

def setup_gmail_smtp():
    """Interactive Gmail SMTP setup"""
    
    print("📧 Gmail SMTP Setup for MytechZ")
    print("=" * 50)
    print()
    
    # Get current directory
    backend_dir = Path(__file__).parent / "MytechZ_frontend_dark_theme_fixing_bk_working" / "backend"
    env_file = backend_dir / ".env"
    
    print(f"📁 Backend directory: {backend_dir}")
    print(f"📄 Environment file: {env_file}")
    print()
    
    # Check if .env exists
    if not env_file.exists():
        print("❌ .env file not found!")
        return False
    
    print("🔧 Current Configuration:")
    print("-" * 30)
    
    # Read current .env
    with open(env_file, 'r') as f:
        content = f.read()
    
    # Show current email settings
    lines = content.split('\n')
    for line in lines:
        if line.startswith('EMAIL_'):
            print(f"   {line}")
    
    print()
    print("📝 To enable Gmail SMTP, you need:")
    print("   1. Gmail account with 2FA enabled")
    print("   2. Gmail App Password (16 characters)")
    print()
    
    # Get user input
    email = input("Enter your Gmail address: ").strip()
    if not email or '@gmail.com' not in email:
        print("❌ Please enter a valid Gmail address")
        return False
    
    app_password = input("Enter your Gmail App Password (16 chars): ").strip()
    if not app_password or len(app_password.replace(' ', '')) != 16:
        print("❌ App Password should be 16 characters")
        print("💡 Generate one at: https://myaccount.google.com/apppasswords")
        return False
    
    # Clean app password (remove spaces)
    app_password = app_password.replace(' ', '')
    
    print()
    print("🔄 Updating configuration...")
    
    # Update .env file
    new_content = content
    
    # Update or add email settings
    replacements = {
        'EMAIL_BACKEND=console': 'EMAIL_BACKEND=smtp',
        'EMAIL_HOST_USER=your-email@gmail.com': f'EMAIL_HOST_USER={email}',
        'EMAIL_HOST_PASSWORD=your-app-password': f'EMAIL_HOST_PASSWORD={app_password}',
        'DEFAULT_FROM_EMAIL=MytechZ <your-email@gmail.com>': f'DEFAULT_FROM_EMAIL=MytechZ <{email}>'
    }
    
    for old, new in replacements.items():
        if old in new_content:
            new_content = new_content.replace(old, new)
    
    # Write updated content
    with open(env_file, 'w') as f:
        f.write(new_content)
    
    print("✅ Configuration updated!")
    print()
    print("🔄 Next steps:")
    print("   1. Restart the Django server")
    print("   2. Test the forgot password feature")
    print("   3. Check your Gmail inbox")
    print()
    print("🧪 Test command:")
    print(f"   cd backend && python test_email.py {email}")
    
    return True

def show_instructions():
    """Show detailed setup instructions"""
    
    print()
    print("📖 Detailed Setup Instructions:")
    print("=" * 50)
    print()
    print("1. **Enable 2-Factor Authentication**")
    print("   • Go to: https://myaccount.google.com/security")
    print("   • Enable 2-Step Verification")
    print()
    print("2. **Generate App Password**")
    print("   • Go to: https://myaccount.google.com/apppasswords")
    print("   • Select 'Mail' and 'Other (Custom name)'")
    print("   • Enter 'MytechZ' as the name")
    print("   • Copy the 16-character password")
    print()
    print("3. **Run This Script**")
    print("   • python setup_gmail.py")
    print("   • Enter your Gmail and App Password")
    print()
    print("4. **Restart Server**")
    print("   • Stop Django server (Ctrl+C)")
    print("   • Start: python manage.py runserver 127.0.0.1:5010")
    print()

if __name__ == "__main__":
    try:
        success = setup_gmail_smtp()
        if not success:
            show_instructions()
    except KeyboardInterrupt:
        print("\n\n❌ Setup cancelled")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        show_instructions()