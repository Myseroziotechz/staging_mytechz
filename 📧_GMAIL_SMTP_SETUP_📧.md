# 📧 Gmail SMTP Setup Guide

## **Current Status: CONFIGURED ✅**

The system is now configured to use Gmail SMTP for sending emails. Follow these steps to complete the setup:

## **Step 1: Enable 2-Factor Authentication**

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification**
3. Enable 2-Factor Authentication if not already enabled

## **Step 2: Generate App Password**

1. Go to **Security** → **App passwords**
2. Select **Mail** as the app
3. Select **Other (Custom name)** as the device
4. Enter "MytechZ Django App" as the name
5. Click **Generate**
6. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

## **Step 3: Update Environment Variables**

Edit the file: `backend/.env`

```env
# Replace these values with your actual Gmail credentials:
EMAIL_BACKEND=smtp
EMAIL_HOST_USER=your-actual-email@gmail.com
EMAIL_HOST_PASSWORD=your-16-character-app-password
DEFAULT_FROM_EMAIL=MytechZ <your-actual-email@gmail.com>
```

## **Step 4: Restart the Server**

After updating the `.env` file:

1. Stop the Django server (Ctrl+C)
2. Restart it: `python manage.py runserver 127.0.0.1:5010`

## **Step 5: Test Email Sending**

1. Go to the forgot password page
2. Enter your email address
3. Check your Gmail inbox for the OTP

## **Security Notes**

- ✅ Never commit real credentials to version control
- ✅ Use App Passwords, not your regular Gmail password
- ✅ The `.env` file is already in `.gitignore`
- ✅ Emails are sent securely via TLS encryption

## **Troubleshooting**

### **"Authentication failed" Error**
- Ensure 2FA is enabled on your Google account
- Use App Password, not regular password
- Check that EMAIL_HOST_USER matches the Gmail account

### **"Connection refused" Error**
- Check your internet connection
- Verify Gmail SMTP settings are correct
- Ensure no firewall is blocking port 587

### **Still showing console output**
- Verify EMAIL_BACKEND=smtp in .env file
- Restart Django server after changes
- Check for any syntax errors in .env file

## **Current Configuration**

```python
# Automatically configured in settings.py:
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_TIMEOUT = 30
```

## **Production Deployment**

For production deployment, set these environment variables on your hosting platform:
- `EMAIL_BACKEND=smtp`
- `EMAIL_HOST_USER=your-email@gmail.com`
- `EMAIL_HOST_PASSWORD=your-app-password`
- `DEFAULT_FROM_EMAIL=MytechZ <your-email@gmail.com>`