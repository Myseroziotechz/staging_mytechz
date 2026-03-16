#!/usr/bin/env python3
"""
Check webinar data discrepancy
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')
django.setup()

from admin_management.models import Webinar
from django.db import connection

print('=== WEBINAR COUNT CHECK ===')
print(f'Total webinars in admin_management.Webinar: {Webinar.objects.count()}')
print(f'Active webinars: {Webinar.objects.filter(is_active=True).count()}')

print('\n=== ALL WEBINARS ===')
for webinar in Webinar.objects.all():
    print(f'ID: {webinar.id}, Title: {webinar.title}, Active: {webinar.is_active}')

print('\n=== DATABASE TABLES CHECK ===')
with connection.cursor() as cursor:
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%webinar%';")
    tables = cursor.fetchall()
    print(f'Tables with webinar: {tables}')
    
    # Check if there are other webinar tables
    for table in tables:
        table_name = table[0]
        cursor.execute(f'SELECT COUNT(*) FROM {table_name}')
        count = cursor.fetchone()[0]
        print(f'{table_name}: {count} records')
        
        # Show sample data
        cursor.execute(f'SELECT * FROM {table_name} LIMIT 3')
        rows = cursor.fetchall()
        cursor.execute(f'PRAGMA table_info({table_name})')
        columns = [col[1] for col in cursor.fetchall()]
        print(f'Sample data from {table_name}:')
        for row in rows:
            print(f'  {dict(zip(columns, row))}')

print('\n=== CHECK OTHER APPS FOR WEBINARS ===')
# Check if there are webinars in other apps
try:
    from django.apps import apps
    for app in apps.get_app_configs():
        for model in app.get_models():
            if 'webinar' in model.__name__.lower():
                print(f'Found webinar model: {app.label}.{model.__name__}')
                print(f'  Count: {model.objects.count()}')
except Exception as e:
    print(f'Error checking other apps: {e}')