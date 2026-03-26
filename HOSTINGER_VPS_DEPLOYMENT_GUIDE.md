# 🚀 Hostinger VPS KVM2 Deployment Guide - MytechZ

Complete guide to deploy Django backend + React frontend on Hostinger VPS KVM2.

---

## 📋 Prerequisites

### What You Need:
1. Hostinger VPS KVM2 account
2. Domain name (optional but recommended)
3. SSH access to your VPS
4. Your project files ready

### VPS Specifications (KVM2):
- RAM: 2GB - 8GB
- CPU: 2-4 cores
- Storage: 50GB - 200GB SSD
- OS: Ubuntu 20.04/22.04 LTS (recommended)

---

## 🔧 STEP 1: Initial VPS Setup

### 1.1 Connect to Your VPS via SSH

```bash
# From your local machine (Windows PowerShell or Git Bash)
ssh root@your-vps-ip-address

# Example:
ssh root@123.45.67.89
```

Enter your password when prompted.

### 1.2 Update System Packages

```bash
# Update package list
sudo apt update

# Upgrade installed packages
sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git vim nano ufw
```

### 1.3 Create a New User (Security Best Practice)

```bash
# Create new user
adduser mytechz

# Add to sudo group
usermod -aG sudo mytechz

# Switch to new user
su - mytechz
```

### 1.4 Configure Firewall

```bash
# Enable UFW firewall
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw allow 5010/tcp    # Django (optional, for testing)
sudo ufw enable

# Check status
sudo ufw status
```

---

## 🐍 STEP 2: Install Python & Django Dependencies

### 2.1 Install Python 3.10+

```bash
# Install Python and pip
sudo apt install -y python3 python3-pip python3-venv python3-dev

# Verify installation
python3 --version
pip3 --version
```

### 2.2 Install PostgreSQL (Recommended for Production)

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql

# Inside PostgreSQL shell:
CREATE DATABASE mytechz_db;
CREATE USER mytechz_user WITH PASSWORD 'your_strong_password';
ALTER ROLE mytechz_user SET client_encoding TO 'utf8';
ALTER ROLE mytechz_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE mytechz_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE mytechz_db TO mytechz_user;
\q
```

---

## 📦 STEP 3: Deploy Django Backend

### 3.1 Upload Your Project

**Option A: Using Git (Recommended)**

```bash
# Navigate to home directory
cd ~

# Clone your repository
git clone https://github.com/yourusername/mytechz.git
cd mytechz/backend

# Or if you don't have Git repo, use SCP from local machine:
# scp -r C:\path\to\MytechZ_frontend_dark_theme_fixing_bk_working\backend mytechz@your-vps-ip:~/
```

**Option B: Using FileZilla/WinSCP**
- Connect to your VPS using SFTP
- Upload the `backend` folder to `/home/mytechz/`

### 3.2 Create Virtual Environment

```bash
cd ~/backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip
```

### 3.3 Install Python Dependencies

```bash
# Install requirements
pip install -r requirements.txt

# Install additional production packages
pip install gunicorn psycopg2-binary whitenoise
```

### 3.4 Configure Django Settings

```bash
# Edit settings.py
nano job_portal/settings.py
```

Update these settings:

```python
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

ALLOWED_HOSTS = ['your-domain.com', 'www.your-domain.com', 'your-vps-ip']

# Database - PostgreSQL
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mytechz_db',
        'USER': 'mytechz_user',
        'PASSWORD': 'your_strong_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# WhiteNoise for static files
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Add this
    # ... other middleware
]

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "https://your-domain.com",
    "https://www.your-domain.com",
]

# Security settings
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
```

### 3.5 Run Django Migrations

```bash
# Make migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --noinput
```

### 3.6 Test Django with Gunicorn

```bash
# Test Gunicorn
gunicorn --bind 0.0.0.0:5010 job_portal.wsgi:application

# If it works, press Ctrl+C to stop
```

### 3.7 Create Gunicorn Systemd Service

```bash
# Create service file
sudo nano /etc/systemd/system/gunicorn.service
```

Add this content:

```ini
[Unit]
Description=Gunicorn daemon for MytechZ Django
After=network.target

[Service]
User=mytechz
Group=www-data
WorkingDirectory=/home/mytechz/backend
ExecStart=/home/mytechz/backend/venv/bin/gunicorn \
          --workers 3 \
          --bind unix:/home/mytechz/backend/gunicorn.sock \
          job_portal.wsgi:application

[Install]
WantedBy=multi-user.target
```

Start and enable the service:

```bash
# Reload systemd
sudo systemctl daemon-reload

# Start Gunicorn
sudo systemctl start gunicorn

# Enable on boot
sudo systemctl enable gunicorn

# Check status
sudo systemctl status gunicorn
```

---

## ⚛️ STEP 4: Deploy React Frontend

### 4.1 Install Node.js & npm

```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### 4.2 Upload Frontend Files

```bash
# Navigate to home directory
cd ~

# If using Git:
# Frontend should be in ~/mytechz/client

# Or upload via SCP from local machine:
# scp -r C:\path\to\MytechZ_frontend_dark_theme_fixing_bk_working\client mytechz@your-vps-ip:~/
```

### 4.3 Configure Environment Variables

```bash
cd ~/client

# Create production environment file
nano .env.production
```

Add this content:

```env
VITE_API_URL=https://api.your-domain.com
VITE_APP_NAME=MytechZ
```

### 4.4 Build React App

```bash
# Install dependencies
npm install

# Build for production
npm run build

# This creates a 'dist' folder with optimized files
```

---

## 🌐 STEP 5: Install & Configure Nginx

### 5.1 Install Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

### 5.2 Configure Nginx for Backend (API)

```bash
# Create backend configuration
sudo nano /etc/nginx/sites-available/mytechz-backend
```

Add this content:

```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    location = /favicon.ico { access_log off; log_not_found off; }
    
    location /static/ {
        alias /home/mytechz/backend/staticfiles/;
    }

    location /media/ {
        alias /home/mytechz/backend/media/;
    }

    location / {
        include proxy_params;
        proxy_pass http://unix:/home/mytechz/backend/gunicorn.sock;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_redirect off;
    }
}
```

### 5.3 Configure Nginx for Frontend

```bash
# Create frontend configuration
sudo nano /etc/nginx/sites-available/mytechz-frontend
```

Add this content:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    root /home/mytechz/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /static/ {
        alias /home/mytechz/client/dist/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /assets/ {
        alias /home/mytechz/client/dist/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
```

### 5.4 Enable Sites

```bash
# Enable backend
sudo ln -s /etc/nginx/sites-available/mytechz-backend /etc/nginx/sites-enabled/

# Enable frontend
sudo ln -s /etc/nginx/sites-available/mytechz-frontend /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 🔒 STEP 6: Install SSL Certificate (HTTPS)

### 6.1 Install Certbot

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx
```

### 6.2 Obtain SSL Certificates

```bash
# For frontend domain
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# For backend API domain
sudo certbot --nginx -d api.your-domain.com

# Follow the prompts and enter your email
```

### 6.3 Auto-Renewal Setup

```bash
# Test auto-renewal
sudo certbot renew --dry-run

# Certbot automatically sets up a cron job for renewal
```

---

## 🗄️ STEP 7: Configure Domain DNS

### In Your Domain Registrar (e.g., Namecheap, GoDaddy):

Add these DNS records:

```
Type    Name    Value               TTL
A       @       your-vps-ip         3600
A       www     your-vps-ip         3600
A       api     your-vps-ip         3600
```

Wait 5-30 minutes for DNS propagation.

---

## 🔄 STEP 8: Setup Automatic Deployment (Optional)

### 8.1 Create Deployment Script

```bash
# Create deployment script
nano ~/deploy.sh
```

Add this content:

```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Backend deployment
echo "📦 Updating backend..."
cd ~/backend
git pull origin main
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart gunicorn

# Frontend deployment
echo "⚛️ Updating frontend..."
cd ~/client
git pull origin main
npm install
npm run build

echo "✅ Deployment complete!"
sudo systemctl reload nginx
```

Make it executable:

```bash
chmod +x ~/deploy.sh
```

### 8.2 Run Deployment

```bash
# Run deployment script
~/deploy.sh
```

---

## 📊 STEP 9: Monitoring & Maintenance

### 9.1 Check Service Status

```bash
# Check Gunicorn
sudo systemctl status gunicorn

# Check Nginx
sudo systemctl status nginx

# Check PostgreSQL
sudo systemctl status postgresql
```

### 9.2 View Logs

```bash
# Gunicorn logs
sudo journalctl -u gunicorn -f

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Django logs (if configured)
tail -f ~/backend/logs/django.log
```

### 9.3 Restart Services

```bash
# Restart Gunicorn
sudo systemctl restart gunicorn

# Restart Nginx
sudo systemctl restart nginx

# Restart PostgreSQL
sudo systemctl restart postgresql
```

---

## 🛠️ STEP 10: Performance Optimization

### 10.1 Enable Nginx Caching

```bash
sudo nano /etc/nginx/nginx.conf
```

Add inside `http` block:

```nginx
# Cache settings
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m use_temp_path=off;
```

### 10.2 Optimize PostgreSQL

```bash
sudo nano /etc/postgresql/14/main/postgresql.conf
```

Adjust these settings based on your RAM:

```conf
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 2621kB
min_wal_size = 1GB
max_wal_size = 4GB
```

Restart PostgreSQL:

```bash
sudo systemctl restart postgresql
```

---

## 🔐 STEP 11: Security Hardening

### 11.1 Disable Root Login

```bash
sudo nano /etc/ssh/sshd_config
```

Change:

```conf
PermitRootLogin no
PasswordAuthentication no  # Use SSH keys only
```

Restart SSH:

```bash
sudo systemctl restart sshd
```

### 11.2 Install Fail2Ban

```bash
# Install Fail2Ban
sudo apt install -y fail2ban

# Start and enable
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

### 11.3 Setup Automatic Updates

```bash
# Install unattended-upgrades
sudo apt install -y unattended-upgrades

# Enable automatic updates
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## 📝 STEP 12: Backup Strategy

### 12.1 Database Backup Script

```bash
# Create backup script
nano ~/backup-db.sh
```

Add:

```bash
#!/bin/bash
BACKUP_DIR="/home/mytechz/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup PostgreSQL
pg_dump -U mytechz_user mytechz_db > $BACKUP_DIR/db_backup_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "db_backup_*.sql" -mtime +7 -delete

echo "Backup completed: db_backup_$DATE.sql"
```

Make executable:

```bash
chmod +x ~/backup-db.sh
```

### 12.2 Setup Cron Job for Daily Backups

```bash
# Edit crontab
crontab -e
```

Add:

```cron
# Daily database backup at 2 AM
0 2 * * * /home/mytechz/backup-db.sh
```

---

## ✅ STEP 13: Verification Checklist

### Test Your Deployment:

- [ ] Frontend loads: `https://your-domain.com`
- [ ] Backend API works: `https://api.your-domain.com/admin`
- [ ] SSL certificate is valid (green padlock)
- [ ] All pages load correctly
- [ ] Forms submit successfully
- [ ] File uploads work
- [ ] Database connections work
- [ ] Static files load (CSS, JS, images)
- [ ] Mobile responsive design works

### Check Services:

```bash
# All services should be active
sudo systemctl status gunicorn
sudo systemctl status nginx
sudo systemctl status postgresql
```

---

## 🚨 Troubleshooting

### Issue: 502 Bad Gateway

```bash
# Check Gunicorn status
sudo systemctl status gunicorn

# Check Gunicorn logs
sudo journalctl -u gunicorn -n 50

# Restart Gunicorn
sudo systemctl restart gunicorn
```

### Issue: Static Files Not Loading

```bash
# Collect static files again
cd ~/backend
source venv/bin/activate
python manage.py collectstatic --noinput

# Check Nginx permissions
sudo chown -R mytechz:www-data ~/backend/staticfiles
sudo chmod -R 755 ~/backend/staticfiles
```

### Issue: Database Connection Error

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test database connection
sudo -u postgres psql -d mytechz_db -U mytechz_user
```

### Issue: Permission Denied

```bash
# Fix ownership
sudo chown -R mytechz:www-data ~/backend
sudo chown -R mytechz:www-data ~/client

# Fix permissions
sudo chmod -R 755 ~/backend
sudo chmod -R 755 ~/client
```

---

## 📞 Quick Commands Reference

```bash
# Restart all services
sudo systemctl restart gunicorn nginx postgresql

# View all logs
sudo journalctl -u gunicorn -f
sudo tail -f /var/log/nginx/error.log

# Update application
cd ~/backend && git pull && source venv/bin/activate && pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput && sudo systemctl restart gunicorn

cd ~/client && git pull && npm install && npm run build && sudo systemctl reload nginx

# Check disk space
df -h

# Check memory usage
free -h

# Check running processes
htop
```

---

## 🎉 Congratulations!

Your MytechZ application is now live on Hostinger VPS KVM2!

**Access your application:**
- Frontend: `https://your-domain.com`
- Backend Admin: `https://api.your-domain.com/admin`
- API: `https://api.your-domain.com/api/`

---

**Created**: March 24, 2026  
**Version**: 1.0.0  
**Support**: For issues, check logs and troubleshooting section
