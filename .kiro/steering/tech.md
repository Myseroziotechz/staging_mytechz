# Tech Stack

## Frontend (`client/`)
- **Framework**: Next.js 16 (App Router) with React 19
- **Styling**: Tailwind CSS v4 — utility-first, no component library
- **Fonts**: Geist Sans + Geist Mono (via `next/font/google`)
- **Auth**: Supabase (`@supabase/ssr`) — Google OAuth and magic link
- **HTTP client**: Axios (`src/lib/api.js`) — pre-configured with Django base URL
- **Email**: Nodemailer (used in Next.js API routes for contact form)
- **Path alias**: `@/` maps to `src/`

## Backend (`backend/`)
- **Framework**: Django 4.2 + Django REST Framework 3.14
- **Auth**: JWT via `djangorestframework-simplejwt` (1-day access, 7-day refresh tokens)
- **CORS**: `django-cors-headers`
- **Config**: `python-decouple` for env vars
- **Static files**: WhiteNoise
- **Database**: SQLite (dev) / PostgreSQL via `dj-database-url` (prod)
- **File uploads**: Pillow, served from `media/` in dev
- **Server**: Gunicorn (production)
- **Custom user model**: `authentication.User` (email-based, no username)

## Environment Variables

### Frontend (`client/.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_DJANGO_API_URL=http://localhost:5010
NEXT_PUBLIC_SITE_URL=http://localhost:3000
BLOCK_DISPOSABLE_EMAILS=true
```

### Backend (`backend/.env`)
Key vars: `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, `DATABASE_URL`, `CORS_ALLOWED_ORIGINS`, `EMAIL_BACKEND`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`

## Common Commands

### Frontend
```bash
cd client
npm install          # install dependencies
npm run dev          # dev server on http://localhost:3000
npm run build        # production build
npm run lint         # ESLint
```

### Backend
```bash
cd backend
pip install -r requirements.txt   # install dependencies
python manage.py migrate          # run migrations
python manage.py runserver 5010   # dev server on port 5010
python manage.py createsuperuser  # create admin user
python manage.py collectstatic    # collect static files (for prod)
```

## API Conventions
- All backend API routes are prefixed with `/api/`
- `APPEND_SLASH = False` — do not add trailing slashes to API URLs
- Authentication: `Authorization: Bearer <token>` header
- Default pagination: 20 items per page
- JSON-only responses (no browsable API in production)
