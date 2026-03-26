# 🚀 Deploy MytechZ to Your Hostinger VPS

## Your Server Details:
```
IP Address: 82.29.160.106
Hostname: srv1530567.hstgr.cloud
SSH Username: root
SSH Password: wnN/6g&X&U6Z&VuR
GitHub Repo: https://github.com/Myseroziotechz/mytechz-job-portal
```

---

## 🔥 STEP 1: Connect to Your VPS

Open **PowerShell** on your Windows PC and run:

```powershell
ssh root@82.29.160.106
```

When prompted for password, enter: `wnN/6g&X&U6Z&VuR`

**Note:** Password won't show while typing - this is normal. Just type it and press Enter.

---

## 🔥 STEP 2: Update System & Install Software

Copy and paste these commands one by one:

```bash
# Update system
apt update && apt upgrade -y

# Install all required software
apt install -y curl wget git vim nano ufw python3 python3-pip python3-venv python3-dev build-essential libpq-dev nginx postgresql postgresql-contrib

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify installations
python3 --version
node --version
npm --version
```

---

## 🔥 STEP 3: Configure Firewall

```bash
# Setup firewall
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Check status
ufw status
```

---

## 🔥 STEP 4: Setup PostgreSQL Database

```bash
# Start PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE mytechz_db;
CREATE USER mytechz_user WITH PASSWORD 'MytechZ2024!Secure';
ALTER ROLE mytechz_user SET client_encoding TO 'utf8';
ALTER ROLE mytechz_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE mytechz_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE mytechz_db TO mytechz_user;
\q
EOF

echo "✅ Database created successfully!"
```

**⚠️ SAVE THIS PASSWORD: `MytechZ2024!Secure`**

---

## 🔥 STEP 5: Clone Your GitHub Repository

```bash
# Go to root directory
cd /root

# Clone your repository
git clone https://github.com/Myseroziotechz/mytechz-job-portal.git

# Rename folder for easier access
mv mytechz-job-portal mytechz

# Check if files are there
ls -la mytechz/
```

---

## 🔥 STEP 6: Setup Django Backend

```bash
# Go to backend directory
cd /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install requirements
pip install -r requirements.txt

# Install production packages
pip install gunicorn psycopg2-binary whitenoise

echo "✅ Backend dependencies installed!"
```

---

## 🔥 STEP 7: Configure Django Settings

```bash
# Backup original settings
cp job_portal/settings.py job_portal/settings.py.backup

# Edit settings
nano job_portal/settings.py
```

**Make these changes in the file:**

1. Find `DEBUG = True` and change to:
```python
DEBUG = False
```

2. Find `ALLOWED_HOSTS = []` and change to:
```python
ALLOWED_HOSTS = ['82.29.160.106', 'srv1530567.hstgr.cloud', 'localhost']
```

3. Find the `DATABASES` section and replace with:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mytechz_db',
        'USER': 'mytechz_user',
        'PASSWORD': 'MytechZ2024!Secure',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

4. Find `STATIC_URL` and add below it:
```python
STATIC_ROOT = '/root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend/staticfiles'
MEDIA_ROOT = '/root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend/media'
```

5. Find `MIDDLEWARE = [` and add `'whitenoise.middleware.WhiteNoiseMiddleware',` after `SecurityMiddleware`:
```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Add this line
    # ... rest of middleware
]
```

**Save and exit:**
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

---

## 🔥 STEP 8: Run Django Migrations

```bash
# Make sure you're in backend directory with venv activated
cd /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend
source venv/bin/activate

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (admin account)
python manage.py createsuperuser
# Enter username: admin
# Enter email: admin@mytechz.com
# Enter password: (choose a strong password)

# Collect static files
python manage.py collectstatic --noinput

echo "✅ Django setup complete!"
```

---

## 🔥 STEP 9: Create Gunicorn Service

```bash
# Create systemd service file
cat > /etc/systemd/system/gunicorn.service << 'EOF'
[Unit]
Description=Gunicorn daemon for MytechZ
After=network.target

[Service]
User=root
Group=www-data
WorkingDirectory=/root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend
ExecStart=/root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend/venv/bin/gunicorn \
          --workers 3 \
          --bind unix:/root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend/gunicorn.sock \
          job_portal.wsgi:application

[Install]
WantedBy=multi-user.target
EOF

# Start and enable Gunicorn
systemctl daemon-reload
systemctl start gunicorn
systemctl enable gunicorn

# Check status
systemctl status gunicorn

echo "✅ Gunicorn service started!"
```

Press `q` to exit status view.

---

## 🔥 STEP 10: Build React Frontend

```bash
# Go to client directory
cd /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/client

# Create production environment file
cat > .env.production << 'EOF'
VITE_API_URL=http://82.29.160.106
EOF

# Install dependencies
npm install

# Build for production
npm run build

echo "✅ Frontend built successfully!"
```

This will take 5-10 minutes. Wait for it to complete.

---

## 🔥 STEP 11: Configure Nginx

```bash
# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Create MytechZ configuration
cat > /etc/nginx/sites-available/mytechz << 'EOF'
server {
    listen 80;
    server_name 82.29.160.106 srv1530567.hstgr.cloud;

    client_max_body_size 100M;

    # Frontend - React App
    location / {
        root /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/client/dist;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    # Backend API
    location /api/ {
        proxy_pass http://unix:/root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend/gunicorn.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django Admin
    location /admin/ {
        proxy_pass http://unix:/root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend/gunicorn.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files (CSS, JS, Images)
    location /static/ {
        alias /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Media files (User uploads)
    location /media/ {
        alias /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend/media/;
        expires 30d;
        add_header Cache-Control "public";
    }

    # Frontend assets
    location /assets/ {
        alias /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/client/dist/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/mytechz /etc/nginx/sites-enabled/

# Test Nginx configuration
nginx -t

# If test passes, restart Nginx
systemctl restart nginx

echo "✅ Nginx configured and started!"
```

---

## 🔥 STEP 12: Fix Permissions

```bash
# Set correct permissions
chmod -R 755 /root/mytechz
chown -R www-data:www-data /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend/staticfiles
chown -R www-data:www-data /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend/media

# Create media directory if it doesn't exist
mkdir -p /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend/media
chown -R www-data:www-data /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend/media

echo "✅ Permissions set correctly!"
```

---

## 🔥 STEP 13: Restart All Services

```bash
# Restart everything
systemctl restart gunicorn
systemctl restart nginx
systemctl restart postgresql

# Check all services are running
systemctl status gunicorn --no-pager
systemctl status nginx --no-pager
systemctl status postgresql --no-pager

echo "✅ All services restarted!"
```

---

## 🎉 STEP 14: Test Your Website!

Open your browser and visit:

### **Frontend:**
```
http://82.29.160.106
```

### **Admin Panel:**
```
http://82.29.160.106/admin
```

Login with the superuser credentials you created in Step 8.

---

## 📊 Useful Commands for Later

### View Logs:
```bash
# Django/Gunicorn logs
journalctl -u gunicorn -n 50 -f

# Nginx error logs
tail -f /var/log/nginx/error.log

# Nginx access logs
tail -f /var/log/nginx/access.log
```

### Restart Services:
```bash
# Restart Django backend
systemctl restart gunicorn

# Restart web server
systemctl restart nginx

# Restart database
systemctl restart postgresql
```

### Update Your Code:
```bash
# Pull latest changes from GitHub
cd /root/mytechz
git pull origin main

# Update backend
cd /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
systemctl restart gunicorn

# Update frontend
cd /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/client
npm install
npm run build
systemctl restart nginx
```

---

## 🔧 Troubleshooting

### Problem: Can't see website
```bash
# Check if services are running
systemctl status gunicorn
systemctl status nginx

# Check Nginx configuration
nginx -t

# Restart services
systemctl restart gunicorn nginx
```

### Problem: 502 Bad Gateway
```bash
# Check Gunicorn logs
journalctl -u gunicorn -n 100

# Check if socket file exists
ls -la /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend/gunicorn.sock

# Restart Gunicorn
systemctl restart gunicorn
```

### Problem: Static files not loading
```bash
# Recollect static files
cd /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend
source venv/bin/activate
python manage.py collectstatic --noinput

# Fix permissions
chown -R www-data:www-data /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend/staticfiles

# Restart Nginx
systemctl restart nginx
```

### Problem: Database connection error
```bash
# Check PostgreSQL is running
systemctl status postgresql

# Test database connection
sudo -u postgres psql -d mytechz_db -U mytechz_user

# If it asks for password, enter: MytechZ2024!Secure
```

---

## 📝 Your Deployment Info

```
Server IP: 82.29.160.106
Hostname: srv1530567.hstgr.cloud
Database Name: mytechz_db
Database User: mytechz_user
Database Password: MytechZ2024!Secure

Frontend URL: http://82.29.160.106
Admin Panel: http://82.29.160.106/admin
API Endpoint: http://82.29.160.106/api/

Project Location: /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/
Backend: /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend
Frontend: /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/client
```

---

## ✅ Deployment Checklist

- [ ] Connected to VPS via SSH
- [ ] Updated system and installed software
- [ ] Configured firewall
- [ ] Created PostgreSQL database
- [ ] Cloned GitHub repository
- [ ] Setup Python virtual environment
- [ ] Configured Django settings
- [ ] Ran migrations and created superuser
- [ ] Created Gunicorn service
- [ ] Built React frontend
- [ ] Configured Nginx
- [ ] Fixed file permissions
- [ ] Tested website in browser

---

## 🎉 Success!

Your MytechZ job portal is now live at:
**http://82.29.160.106**

Admin panel: **http://82.29.160.106/admin**

---

**Deployment Date**: March 24, 2026  
**Estimated Time**: 30-60 minutes  
**Difficulty**: Beginner-Friendly
