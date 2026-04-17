# Project Structure

This is a monorepo with two independent apps: `client/` (Next.js) and `backend/` (Django).

## Top-Level Layout

```
/
├── client/          # Next.js frontend
├── backend/         # Django REST API
├── docker-compose.yml
└── netlify.toml     # Netlify config for frontend deployment
```

> The root directory contains many loose `.md`, `.txt`, and `.bat` files — these are historical notes and deployment scripts, not source code. Ignore them when working on features.

---

## Frontend: `client/`

```
client/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── layout.js         # Root layout (Navbar + Footer)
│   │   ├── page.js           # Home page
│   │   ├── jobs/             # Job listings (private/, government/)
│   │   ├── dashboard/        # Candidate dashboard
│   │   ├── profile/          # Candidate profile
│   │   ├── my-applications/  # Application tracker
│   │   ├── saved-jobs/
│   │   ├── ai-tools/         # AI tools hub + sub-pages
│   │   ├── login/
│   │   ├── auth/             # Supabase auth callbacks
│   │   ├── api/              # Next.js API routes (contact form, auth)
│   │   ├── about/
│   │   ├── contact/
│   │   └── services/
│   ├── components/
│   │   ├── Navbar.jsx        # Global nav with dropdown + auth state
│   │   ├── Footer.jsx
│   │   ├── home/             # Landing page sections
│   │   ├── auth/             # Login form, Google button, magic link
│   │   └── ui/               # Primitive components (Button, Card, Input, LoadingSpinner)
│   └── lib/
│       ├── api.js            # Axios instance pointing to Django backend
│       ├── supabase-browser.js  # Supabase client (browser)
│       ├── supabase-server.js   # Supabase client (server/RSC)
│       └── disposable-domains.js
├── public/                   # Static assets (logo, images)
├── .env.local                # Local env vars (not committed)
└── next.config.mjs
```

### Frontend Conventions
- Pages use the `.js` extension; components use `.jsx`
- `'use client'` directive required for any component using hooks or browser APIs
- Import alias `@/` resolves to `src/` — always use this, never relative `../../`
- Supabase handles all candidate-facing auth; Django JWT is used only for recruiter/admin API calls
- Reusable primitives live in `components/ui/`; page-specific components live alongside their page or in a named subfolder under `components/`

---

## Backend: `backend/`

```
backend/
├── job_portal/          # Django project (settings, root URLs, wsgi/asgi)
├── authentication/      # Custom User model, registration, login, JWT, password reset
├── recruiter/           # RecruiterCompanyProfile, JobPost, JobApplication + views/serializers
├── admissions/          # AdmissionPost registrations
├── admin_management/    # Webinar, AdmissionPost, admin-facing CRUD
├── media/               # Uploaded files (resumes, company docs) — not committed
├── staticfiles/         # Collected static files — not committed
├── manage.py
├── requirements.txt
└── .env                 # Local env vars (not committed)
```

### Backend Conventions
- Each feature is a Django app with its own `models.py`, `serializers.py`, `views.py`, `urls.py`
- App URLs are included in `job_portal/urls.py` under their `/api/<app>/` prefix
- Custom user model is `authentication.User` — always reference via `AUTH_USER_MODEL` or direct import, never `django.contrib.auth.models.User`
- JSON array fields (skills, responsibilities, etc.) are stored as `TextField` with explicit `get_*/set_*` helper methods — not `JSONField`
- `APPEND_SLASH = False`: never add trailing slashes to API endpoint paths
- Migrations live inside each app's `migrations/` folder — always run `makemigrations <app>` scoped to the changed app
