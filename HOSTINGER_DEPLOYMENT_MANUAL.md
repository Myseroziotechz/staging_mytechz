# 📋 Hostinger VPS Deployment - Manual Guide

## PART 1: Information You Need from Hostinger

### ✅ Collect These Details from Your Hostinger Account:

1. **VPS IP Address**
   - Example: `123.45.67.89`
   - Where to find: Hostinger Dashboard → VPS → Your VPS → IP Address

2. **SSH Root Password**
   - Where to find: Hostinger sent this via email when you created VPS
   - Or: Hostinger Dashboard → VPS → Access Details

3. **SSH Port** (usually 22)
   - Where to find: Hostinger Dashboard → VPS → SSH Access

4. **Domain Name** (if you have one)
   - Example: `mytechz.com`
   - Where to find: Your domain registrar or Hostinger Domains

---

## PART 2: Before You Start

### Install These on Your Windows PC:

1. **PuTTY** (for SSH connection)
   - Download: https://www.putty.org/
   - Or use Windows PowerShell (built-in)

2. **WinSCP** (for file transfer)
   - Download: https://winscp.net/

---

## PART 3: Step-by-Step Deployment

### 📝 STEP 1: Connect to Your VPS

**Using PowerShell (Recommended):**

```powershell
# Open PowerShell and type:
ssh root@YOUR_VPS_IP

# Example:
ssh root@123.45.67.89

# Enter password when prompted
```

**Using PuTTY:**
1. Open PuTTY
2. Host Name: `YOUR_VPS_IP`
3. Port: `22`
4. Click "Open"
5. Login as: `root`
6. Enter password

---

### 📝 STEP 2: Update System (Copy-Paste These Commands)

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git vim nano ufw python3 python3-pip python3-venv nginx postgresql postgresql-contrib
```

Wait for installation to complete (5-10 minutes).

---

### 📝 STEP 3: Setup Firewall

```bash
# Configure firewall
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Type 'y' and press Enter when asked
```

---

### 📝 STEP 4: Setup Database

```bash
# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres psql -c "CREATE DATABASE mytechz_db;"
sudo -u postgres psql -c "CREATE USER mytechz_user WITH PASSWORD 'MyStrongPass123!';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE mytechz_db TO mytechz_user;"

# Exit
```

**⚠️ IMPORTANT: Save this password: `MyStrongPass123!`**

---

### 📝 STEP 5: Upload Your Project Files

**Option A: Using WinSCP (Easier)**

1. Open WinSCP
2. New Site:
   - File protocol: `SFTP`
   - Host name: `YOUR_VPS_IP`
   - Port: `22`
   - User name: `root`
   - Password: `YOUR_SSH_PASSWORD`
3. Click "Login"
4. Navigate to `/root/`
5. Upload these folders:
   - `backend` folder → `/root/backend`
   - `client` folder → `/root/client`

**Option B: Using Git**

```bash
# If your code is on GitHub
cd /root
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

---

### 📝 STEP 6: Setup Django Backend

```bash
# Go to backend folder
cd /root/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn psycopg2-binary whitenoise
```

---

### 📝 STEP 7: Configure Django Settings

```bash
# Edit settings file
nano job_portal/settings.py
```

**Find and change these lines:**

1. Find `DEBUG = True` → Change to:
```python
DEBUG = False
```

2. Find `ALLOWED_HOSTS = []` → Change to:
```python
ALLOWED_HOSTS = ['YOUR_VPS_IP', 'your-domain.com', 'www.your-domain.com']
```

3. Find `DATABASES = {` section → Replace with:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mytechz_db',
        'USER': 'mytechz_user',
        'PASSWORD': 'MyStrongPass123!',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

4. Add at the end of file:
```python
STATIC_ROOT = '/root/backend/staticfiles'
```

**Save and exit:**
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

---

### 📝 STEP 8: Run Django Setup

```bash
# Make sure you're in /root/backend with venv activated
cd /root/backend
source venv/bin/activate

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser
# Enter username, email, password when prompted

# Collect static files
python manage.py collectstatic --noinput
```

---

### 📝 STEP 9: Setup Gunicorn Service

```bash
# Create service file
sudo nano /etc/systemd/system/gunicorn.service
```

**Copy-paste this entire content:**

```ini
[Unit]
Description=Gunicorn for MytechZ
After=network.target

[Service]
User=root
Group=www-data
WorkingDirectory=/root/backend
ExecStart=/root/backend/venv/bin/gunicorn --workers 3 --bind unix:/root/backend/gunicorn.sock job_portal.wsgi:application

[Install]
WantedBy=multi-user.target
```

**Save and exit** (Ctrl+X, Y, Enter)

```bash
# Start Gunicorn
sudo systemctl daemon-reload
sudo systemctl start gunicorn
sudo systemctl enable gunicorn

# Check if it's running
sudo systemctl status gunicorn
# Press 'q' to exit
```

---

### 📝 STEP 10: Install Node.js

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version
npm --version
```

---

### 📝 STEP 11: Build React Frontend

```bash
# Go to client folder
cd /root/client

# Create production environment file
nano .env.production
```

**Add this line:**
```
VITE_API_URL=http://YOUR_VPS_IP
```

Replace `YOUR_VPS_IP` with your actual IP.

**Save and exit** (Ctrl+X, Y, Enter)

```bash
# Install dependencies and build
npm install
npm run build
```

Wait 5-10 minutes for build to complete.

---

### 📝 STEP 12: Configure Nginx

```bash
# Remove default config
sudo rm /etc/nginx/sites-enabled/default

# Create new config
sudo nano /etc/nginx/sites-available/mytechz
```

**Copy-paste this entire content:**

```nginx
server {
    listen 80;
    server_name YOUR_VPS_IP your-domain.com www.your-domain.com;

    # Frontend
    location / {
        root /root/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://unix:/root/backend/gunicorn.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Django Admin
    location /admin/ {
        proxy_pass http://unix:/root/backend/gunicorn.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Static files
    location /static/ {
        alias /root/backend/staticfiles/;
    }

    # Media files
    location /media/ {
        alias /root/backend/media/;
    }
}
```

**Replace `YOUR_VPS_IP` with your actual IP**

**Save and exit** (Ctrl+X, Y, Enter)

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/mytechz /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# If test is OK, restart Nginx
sudo systemctl restart nginx
```

---

### 📝 STEP 13: Fix Permissions

```bash
# Give Nginx access to files
sudo chmod -R 755 /root/backend
sudo chmod -R 755 /root/client
sudo chown -R www-data:www-data /root/backend/staticfiles
sudo chown -R www-data:www-data /root/backend/media
```

---

### 📝 STEP 14: Test Your Website

Open your browser and visit:

1. **Frontend**: `http://YOUR_VPS_IP`
2. **Admin Panel**: `http://YOUR_VPS_IP/admin`

If you see your website, **SUCCESS!** 🎉

---

## PART 4: Setup Domain (Optional)

### If You Have a Domain Name:

**Step 1: Configure DNS**

Go to your domain registrar (Namecheap, GoDaddy, etc.) and add:

```
Type: A Record
Name: @
Value: YOUR_VPS_IP
TTL: 3600

Type: A Record
Name: www
Value: YOUR_VPS_IP
TTL: 3600
```

Wait 30 minutes for DNS to propagate.

**Step 2: Install SSL Certificate**

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow prompts and enter your email
```

Now visit: `https://your-domain.com` 🔒

---

## PART 5: Useful Commands

### Restart Services:
```bash
# Restart Django
sudo systemctl restart gunicorn

# Restart Nginx
sudo systemctl restart nginx

# Restart Database
sudo systemctl restart postgresql
```

### View Logs:
```bash
# Django logs
sudo journalctl -u gunicorn -n 50

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Update Your Code:
```bash
# Backend
cd /root/backend
source venv/bin/activate
git pull  # if using git
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart gunicorn

# Frontend
cd /root/client
git pull  # if using git
npm install
npm run build
sudo systemctl restart nginx
```

---

## PART 6: Troubleshooting

### Problem: Can't connect to VPS
- Check if VPS is running in Hostinger dashboard
- Verify IP address is correct
- Check if firewall allows SSH (port 22)

### Problem: Website shows 502 Bad Gateway
```bash
# Check Gunicorn status
sudo systemctl status gunicorn

# Restart Gunicorn
sudo systemctl restart gunicorn
```

### Problem: Static files not loading
```bash
# Recollect static files
cd /root/backend
source venv/bin/activate
python manage.py collectstatic --noinput
sudo systemctl restart nginx
```

### Problem: Database connection error
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql
```

---

## 📞 Quick Reference

### Your Details (Fill This Out):

```
VPS IP Address: ___________________
SSH Password: _____________________
Database Password: MyStrongPass123!
Domain Name: ______________________
Admin Username: ___________________
Admin Password: ___________________
```

### Access URLs:

```
Frontend: http://YOUR_VPS_IP
Admin Panel: http://YOUR_VPS_IP/admin
API: http://YOUR_VPS_IP/api/
```

---

## ✅ Deployment Checklist

- [ ] Collected VPS IP and SSH password from Hostinger
- [ ] Connected to VPS via SSH
- [ ] Updated system packages
- [ ] Installed Python, Node.js, PostgreSQL, Nginx
- [ ] Created database and user
- [ ] Uploaded project files (backend + client)
- [ ] Configured Django settings
- [ ] Ran migrations and created superuser
- [ ] Setup Gunicorn service
- [ ] Built React frontend
- [ ] Configured Nginx
- [ ] Fixed file permissions
- [ ] Tested website in browser
- [ ] (Optional) Configured domain DNS
- [ ] (Optional) Installed SSL certificate

---

## 🎉 You're Done!

Your MytechZ job portal is now live!

**Need help?** Check the troubleshooting section or review the logs.

---

**Created**: March 24, 2026  
**Difficulty**: Beginner-Friendly  
**Time Required**: 1-2 hours
