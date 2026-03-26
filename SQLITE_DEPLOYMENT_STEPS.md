# 🚀 MytechZ Deployment - SQLite Version (Simplified)

## ✅ Prerequisites Completed:
- System updated
- Python, Node.js, Nginx installed
- Firewall configured
- You're connected via SSH

---

## 📋 NEXT STEPS - Copy & Paste These Commands

### STEP 1: Clone GitHub Repository

```bash
cd /root
git clone https://github.com/Myseroziotechz/mytechz-job-portal.git
mv mytechz-job-portal mytechz
cd mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend
```

---

### STEP 2: Setup Python Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn
```

---

### STEP 3: Configure Django for Production (SQLite)

```bash
# Backup original settings
cp job_portal/settings.py job_portal/settings.py.backup

# Edit settings file
nano job_portal/settings.py
```

**Make these 3 changes:**

1. Change `DEBUG = True` to:
```python
DEBUG = False
```

2. Change `ALLOWED_HOSTS = [...]` to:
```python
ALLOWED_HOSTS = ['82.29.160.106', 'srv1530567.hstgr.cloud', 'localhost', '127.0.0.1']
```

3. Add after `STATIC_URL = '/static/'`:
```python
STATIC_ROOT = '/root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend/staticfiles'
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

**Note:** SQLite is already configured in settings.py, no database changes needed!

---

### STEP 4: Run Django Setup

```bash
# Make sure you're in backend directory with venv activated
cd /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend
source venv/bin/activate

# Run migrations
python manage.py migrate

# Create admin account
python manage.py createsuperuser
```

**When prompted:**
- Username: `admin`
- Email: `admin@mytechz.com`
- Password: (choose a strong password - you'll need this to login)

```bash
# Collect static files
python manage.py collectstatic --noinput
```

---

### STEP 5: Create Gunicorn Service

```bash
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

systemctl daemon-reload
systemctl start gunicorn
systemctl enable gunicorn
systemctl status gunicorn
```

Press `q` to exit status view.

---

### STEP 6: Build React Frontend

```bash
cd /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/client

# Create production environment file
cat > .env.production << 'EOF'
VITE_API_URL=http://82.29.160.106
EOF

# Install dependencies and build
npm install
npm run build
```

**This takes 5-10 minutes. Wait for completion.**

---

### STEP 7: Configure Nginx

```bash
rm -f /etc/nginx/sites-enabled/default

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

    # Static files
    location /static/ {
        alias /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Media files
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

ln -s /etc/nginx/sites-available/mytechz /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

### STEP 8: Fix Permissions

```bash
chmod -R 755 /root/mytechz
mkdir -p /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend/media
chown -R www-data:www-data /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend/staticfiles
chown -R www-data:www-data /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend/media
chmod 664 /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend/db.sqlite3
```

---

### STEP 9: Restart Services

```bash
systemctl restart gunicorn
systemctl restart nginx
```

---

## 🎉 TEST YOUR WEBSITE!

Open browser and visit:

**Frontend:** http://82.29.160.106  
**Admin Panel:** http://82.29.160.106/admin

---

## 📊 Useful Commands

### View Logs:
```bash
# Backend logs
journalctl -u gunicorn -n 50 -f

# Nginx logs
tail -f /var/log/nginx/error.log
```

### Restart Services:
```bash
systemctl restart gunicorn
systemctl restart nginx
```

### Update Code from GitHub:
```bash
cd /root/mytechz
git pull origin main

# Update backend
cd backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
systemctl restart gunicorn

# Update frontend
cd ../client
npm install
npm run build
systemctl restart nginx
```

---

## 🔧 Troubleshooting

### Check if services are running:
```bash
systemctl status gunicorn
systemctl status nginx
```

### Check Gunicorn socket exists:
```bash
ls -la /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend/gunicorn.sock
```

### Fix database permissions:
```bash
chmod 664 /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend/db.sqlite3
chown www-data:www-data /root/mytechz/MytechZ_frontend_dark_theme_fixing_bk_working/backend/db.sqlite3
```

---

## ✅ Deployment Checklist

- [ ] Clone repository (Step 1)
- [ ] Setup Python venv (Step 2)
- [ ] Configure Django settings (Step 3)
- [ ] Run migrations & create superuser (Step 4)
- [ ] Create Gunicorn service (Step 5)
- [ ] Build React frontend (Step 6)
- [ ] Configure Nginx (Step 7)
- [ ] Fix permissions (Step 8)
- [ ] Test website (Step 9)

---

**Server IP:** 82.29.160.106  
**Database:** SQLite (db.sqlite3)  
**Estimated Time:** 20-30 minutes
