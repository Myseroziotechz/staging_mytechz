# 🚀 MytechZ Hostinger VPS Deployment Guide (SQLite)

## 📌 Server Info:
- IP: 82.29.160.106
- Hostname: srv1530567.hstgr.cloud
- GitHub: https://github.com/Myseroziotechz/mytechz-job-portal

---

## ✅ CHANGES MADE TO LOCAL CODE:

1. **Backend settings.py** - Now supports environment variables:
   - `DEBUG` - Can be set via .env file
   - `ALLOWED_HOSTS` - Configurable for production
   - `CORS_ALLOWED_ORIGINS` - Production-ready

2. **Backend .env.production** - Created with production settings

3. **Client .env.production** - Updated to point to VPS IP

---

## 📤 STEP 1: Push Changes to GitHub

Run these commands in your **local Windows terminal** (Git Bash or PowerShell):

```bash
cd MytechZ_frontend_dark_theme_fixing_bk_working

git add .
git commit -m "Configure for Hostinger VPS deployment with SQLite"
git push origin main
```

---

## 🖥️ STEP 2: Deploy on VPS

**In your SSH terminal** (you're already connected), run:

```bash
# Navigate to correct directory
cd /root/mytechz-job-portal/backend

# Setup Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn

# Copy production environment file
cp .env.production .env

# Run Django setup
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic --noinput
```

**When creating superuser:**
- Username: `admin`
- Email: `admin@mytechz.com`
- Password: (choose a strong password)

---

## 🔧 STEP 3: Create Gunicorn Service

```bash
cat > /etc/systemd/system/gunicorn.service << 'EOF'
[Unit]
Description=Gunicorn daemon for MytechZ
After=network.target

[Service]
User=root
Group=www-data
WorkingDirectory=/root/mytechz-job-portal/backend
Environment="PATH=/root/mytechz-job-portal/backend/venv/bin"
ExecStart=/root/mytechz-job-portal/backend/venv/bin/gunicorn \
          --workers 3 \
          --bind unix:/root/mytechz-job-portal/backend/gunicorn.sock \
          job_portal.wsgi:application

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl start gunicorn
systemctl enable gunicorn
systemctl status gunicorn
```

Press `q` to exit status.

---

## 🎨 STEP 4: Build React Frontend

```bash
cd /root/mytechz-job-portal/client

# Install dependencies
npm install

# Build for production
npm run build
```

**This takes 5-10 minutes.**

---

## 🌐 STEP 5: Configure Nginx

```bash
rm -f /etc/nginx/sites-enabled/default

cat > /etc/nginx/sites-available/mytechz << 'EOF'
server {
    listen 80;
    server_name 82.29.160.106 srv1530567.hstgr.cloud;

    client_max_body_size 100M;

    # Frontend - React App
    location / {
        root /root/mytechz-job-portal/client/dist;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache";
    }

    # Backend API
    location /api/ {
        proxy_pass http://unix:/root/mytechz-job-portal/backend/gunicorn.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django Admin
    location /admin/ {
        proxy_pass http://unix:/root/mytechz-job-portal/backend/gunicorn.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files
    location /static/ {
        alias /root/mytechz-job-portal/backend/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Media files
    location /media/ {
        alias /root/mytechz-job-portal/backend/media/;
        expires 30d;
        add_header Cache-Control "public";
    }

    # Frontend assets
    location /assets/ {
        alias /root/mytechz-job-portal/client/dist/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

ln -s /etc/nginx/sites-available/mytechz /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## 🔐 STEP 6: Fix Permissions

```bash
chmod -R 755 /root/mytechz-job-portal
mkdir -p /root/mytechz-job-portal/backend/media
chown -R www-data:www-data /root/mytechz-job-portal/backend/staticfiles
chown -R www-data:www-data /root/mytechz-job-portal/backend/media
chmod 664 /root/mytechz-job-portal/backend/db.sqlite3
chown www-data:www-data /root/mytechz-job-portal/backend/db.sqlite3
```

---

## ✅ STEP 7: Final Restart

```bash
systemctl restart gunicorn
systemctl restart nginx
```

---

## 🎉 TEST YOUR WEBSITE!

Open browser:

**Frontend:** http://82.29.160.106  
**Admin Panel:** http://82.29.160.106/admin

---

## 📊 Useful Commands

### View Logs:
```bash
journalctl -u gunicorn -n 50 -f
tail -f /var/log/nginx/error.log
```

### Restart Services:
```bash
systemctl restart gunicorn nginx
```

### Update from GitHub:
```bash
cd /root/mytechz-job-portal
git pull origin main

# Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
systemctl restart gunicorn

# Frontend
cd ../client
npm install
npm run build
systemctl restart nginx
```

---

## 🔧 Troubleshooting

### Check Services:
```bash
systemctl status gunicorn
systemctl status nginx
```

### Check Socket:
```bash
ls -la /root/mytechz-job-portal/backend/gunicorn.sock
```

### Fix Database Permissions:
```bash
chmod 664 /root/mytechz-job-portal/backend/db.sqlite3
chown www-data:www-data /root/mytechz-job-portal/backend/db.sqlite3
systemctl restart gunicorn
```

---

**Database:** SQLite (simple, no PostgreSQL needed)  
**Estimated Time:** 20-30 minutes
