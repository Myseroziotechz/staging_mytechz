# MyTechZ — AI-Powered Job Portal

**Live:** [https://mytechz.com](https://mytechz.com)

A job portal for tech professionals in India with AI career tools (resume builder, ATS checker, smart job search).

---

## Quick Start

### 1. Clone the repo

```bash
git clone git@github.com:rksamyak/Intern_staging_mytechz.git
cd Intern_staging_mytechz
```

### 2. Setup Frontend (Next.js)

```bash
cd client
npm install
```

Create `.env.local` from the example:

```bash
cp .env.example .env.local
```

Fill in the required keys in `.env.local`:

| Key | Required | Description |
|-----|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server only) |
| `NEXT_PUBLIC_SITE_URL` | Yes | `http://localhost:3000` for dev |
| `NEXT_PUBLIC_DJANGO_API_URL` | Yes | `http://localhost:5010` for dev |
| `GROQ_API_KEY` | Yes | For AI features (free at console.groq.com) |
| `GEMINI_API_KEY` | Optional | Alternative AI provider |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Optional | For contact form emails |

Run the dev server:

```bash
npm run dev
# Opens at http://localhost:3000
```

### 3. Setup Backend (Django)

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 5010
# Runs at http://localhost:5010
```

### 4. Docker (Alternative)

```bash
docker-compose up --build
# Frontend: http://localhost:5173
# Backend:  http://localhost:5010
```

---

## All Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server (hot reload) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, Tailwind CSS v4 |
| Backend | Django, Python |
| Database & Auth | Supabase (PostgreSQL + Auth) |
| AI | Groq (Llama 3.3), Gemini |
| Analytics | Google Analytics, Microsoft Clarity, OpenPanel |
| Deployment | Netlify (frontend), Docker (backend) |

---

## Project Structure

```
staging_mytechz/
├── client/                       # Next.js frontend
│   ├── src/
│   │   ├── app/                  # All pages (file-system routing)
│   │   ├── components/           # Reusable UI components
│   │   └── lib/                  # Utilities, helpers, Supabase clients
│   ├── public/                   # Static assets (images, icons)
│   ├── package.json
│   ├── .env.example              # Environment variable template
│   └── .env.local                # Your local env (not in git)
│
├── backend/                      # Django REST API
│   └── job_portal/
│
├── docker-compose.yml
├── netlify.toml
└── README.md
```

---

## How Pages Are Organized (Route Groups)

Next.js uses **route groups** — folders wrapped in `()` — to share layouts without affecting the URL. This project has **3 route groups**:

```
client/src/app/
│
├── page.js                  # Homepage (/) — uses public Navbar + Footer
│
├── (local)/                 # PUBLIC PAGES — Landing pages anyone can see
│   ├── layout.js            # Smart layout: shows Navbar+Footer for visitors,
│   │                        #   shows Sidebar for logged-in users
│   ├── about/page.js        # /about
│   ├── contact/page.js      # /contact
│   ├── services/page.js     # /services
│   ├── blog/page.js         # /blog
│   ├── blog/[slug]/page.js  # /blog/:slug
│   ├── info/page.js         # /info
│   ├── login/               # /login, /login/user, /login/recruiter
│   ├── jobs/                # All job listing pages
│   │   ├── page.js          # /jobs
│   │   ├── private/         # /jobs/private
│   │   ├── government/      # /jobs/government
│   │   ├── internship/      # /jobs/internship
│   │   ├── ai/              # /jobs/ai
│   │   └── [category]/
│   │       └── [jobSlug]/   # /jobs/:category/:jobSlug (job detail)
│   └── ai-tools/            # AI tools (public landing pages)
│       ├── page.js          # /ai-tools
│       ├── resume-builder/
│       │   ├── page.js      # /ai-tools/resume-builder
│       │   └── templates/   # /ai-tools/resume-builder/templates
│       ├── resume-rank-checker/  # /ai-tools/resume-rank-checker
│       └── smart-job-search/     # /ai-tools/smart-job-search
│
├── (app)/                   # LOGGED-IN PAGES — Requires authentication
│   ├── layout.js            # Always shows Sidebar, redirects to /login if not authenticated
│   ├── dashboard/page.js    # /dashboard — candidate home after login
│   ├── profile/page.js      # /profile
│   ├── my-applications/     # /my-applications
│   ├── saved-jobs/          # /saved-jobs
│   ├── notifications/       # /notifications
│   ├── settings/            # /settings
│   └── ai-tools/            # AI tools (auth-gated features)
│       ├── resume-builder/
│       │   ├── create/      # /ai-tools/resume-builder/create
│       │   ├── editor/[id]/ # /ai-tools/resume-builder/editor/:id
│       │   └── my-resumes/  # /ai-tools/resume-builder/my-resumes
│       └── resume-rank-checker/
│           └── check/       # /ai-tools/resume-rank-checker/check
│
├── admin/                   # ADMIN PANEL — own layout, admin role required
│   ├── layout.js
│   ├── dashboard/           # /admin/dashboard
│   ├── jobs/                # /admin/jobs
│   ├── post-job/            # /admin/post-job
│   ├── users/               # /admin/users
│   ├── recruiters/          # /admin/recruiters
│   ├── whitelist/           # /admin/whitelist
│   ├── applications/        # /admin/applications
│   └── analytics/           # /admin/analytics
│
├── recruiter/               # RECRUITER PANEL — own layout, recruiter role required
│   ├── layout.js
│   ├── dashboard/           # /recruiter/dashboard
│   ├── onboarding/          # /recruiter/onboarding
│   ├── post-job/            # /recruiter/post-job
│   ├── edit-job/[id]/       # /recruiter/edit-job/:id
│   ├── applicants/          # /recruiter/applicants
│   ├── preview/[id]/        # /recruiter/preview/:id
│   └── profile/             # /recruiter/profile
│
├── auth/                    # AUTH ROUTES — handles login callbacks
│   ├── callback/route.js    # OAuth/magic-link callback (server)
│   ├── complete/page.js     # Fallback post-auth redirect (client)
│   ├── error/page.js        # Auth error page
│   └── sign-out/route.js    # Logout
│
└── api/                     # API ROUTES — backend endpoints
    ├── auth/                # Auth helpers
    ├── ai/                  # AI features (chat, resume generation)
    ├── resumes/             # Resume CRUD + export
    ├── contact/             # Contact form
    ├── jobs/                # Job-related APIs
    └── notifications/       # Notification APIs
```

---

## Layout Diagram

```
┌─────────────────────────────────────────────────────────┐
│  Root Layout (app/layout.js)                            │
│  - Fonts, meta tags, analytics, JSON-LD                 │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  (local) Layout — Public Pages                    │  │
│  │                                                   │  │
│  │  Not logged in:  Navbar + Content + Footer        │  │
│  │  Logged in:      Sidebar + Content (AppShell)     │  │
│  │                                                   │  │
│  │  Pages: /, /about, /jobs/*, /ai-tools/*, /login   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  (app) Layout — Auth-Gated Pages                  │  │
│  │                                                   │  │
│  │  Not logged in:  Redirects to /login              │  │
│  │  Logged in:      Sidebar + Content (AppShell)     │  │
│  │                                                   │  │
│  │  Pages: /dashboard, /profile, /saved-jobs, etc.   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────┐  ┌─────────────────────┐    │
│  │  Admin Layout         │  │  Recruiter Layout   │    │
│  │  /admin/*             │  │  /recruiter/*       │    │
│  └───────────────────────┘  └─────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## Login Flow

```
User clicks "Login" or "Get Started"
        │
        ▼
    /login page
        │
        ├── Google OAuth ──► Supabase ──► /auth/callback
        │                                      │
        └── Email OTP ──► Supabase ──► /auth/callback
                                               │
                                               ▼
                                    Exchange code for session
                                               │
                                    Check user_profiles table
                                               │
                              ┌────────────────┼────────────────┐
                              │                │                │
                         New User         Existing User    Admin Whitelist
                              │                │                │
                        Create profile    Read role         Set role=admin
                              │                │                │
                              ▼                ▼                ▼
                     ┌─────────────────────────────────────────────┐
                     │           Redirect based on role            │
                     │                                             │
                     │  candidate ──► /dashboard                   │
                     │  recruiter ──► /recruiter/dashboard         │
                     │                (or /recruiter/onboarding)   │
                     │  admin     ──► /admin/dashboard             │
                     └─────────────────────────────────────────────┘
```

---

## User Roles

| Role | After Login | Access |
|------|-------------|--------|
| **Visitor** | — | Public pages, job listings, AI tools landing pages |
| **Candidate** | `/dashboard` | Dashboard, profile, applications, saved jobs, resume editor |
| **Recruiter** | `/recruiter/dashboard` | Post jobs, manage listings, view applicants |
| **Admin** | `/admin/dashboard` | Full platform management, analytics, user/recruiter management |

---

## Components

```
client/src/components/
├── layout/              # App shell, navbar, footer, sidebar
├── home/                # Homepage sections (hero, how-it-works, etc.)
├── jobs/                # Job cards, listings, filters
├── resume-builder/      # Resume editor, templates, steps
├── rank-checker/        # ATS rank checker components
├── ai/                  # Floating AI chat
├── auth/                # Login forms, OAuth buttons
├── admin/               # Admin panel components
├── recruiter/           # Recruiter panel components
├── dashboard/           # Dashboard widgets (search bar, stats)
├── blog/                # Blog components
├── common/              # Shared components (breadcrumbs, etc.)
├── saved-jobs/          # Saved jobs components
└── ui/                  # Base UI components (buttons, inputs, etc.)
```

---

## API Routes

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/send-otp` | POST | Send email OTP |
| `/api/auth/set-intent` | POST | Store pre-login role intent |
| `/api/auth/switch-role` | POST | Switch user role |
| `/api/ai/chat` | POST | AI chat |
| `/api/ai/resume/parse` | POST | Parse uploaded resume |
| `/api/ai/resume/generate` | POST | AI-generate resume content |
| `/api/ai/resume/autofill` | POST | Auto-fill resume from parsed data |
| `/api/ai/resume/keywords` | POST | Extract keywords |
| `/api/ai/resume/rank-check` | POST | ATS rank check |
| `/api/ai/resume/rank-history` | GET | Past rank checks |
| `/api/ai/resume/rewrite` | POST | AI rewrite resume sections |
| `/api/resumes` | GET/POST | List or create resumes |
| `/api/resumes/[id]` | GET/PUT/DELETE | Single resume CRUD |
| `/api/resumes/[id]/export` | GET | Export to PDF/DOCX |
| `/api/contact` | POST | Contact form |
| `/api/jobs/[jobId]/roadmap` | GET | AI learning roadmap |
| `/api/notifications` | GET/POST | User notifications |
| `/api/admin/analytics` | GET | Admin analytics data |

---

## Git Workflow

**Remotes:**
- `staging_intern` → `git@github.com:rksamyak/Intern_staging_mytechz.git` (fork)
- `origin` → `https://github.com/Myseroziotechz/staging_mytechz.git` (main repo)

**Branch protection on main:** Requires 1 PR approval before merge.

**How to push changes:**

```bash
# 1. Make your changes
# 2. Commit
git add <files>
git commit -m "Your commit message"

# 3. Push to your fork
git push staging_intern <your-branch-name>

# 4. Open PR on GitHub:
#    From: rksamyak/Intern_staging_mytechz:<your-branch>
#    To:   Myseroziotechz/staging_mytechz:main

# 5. Owner reviews and merges
```

---

## Deployment

| Service | Platform | Config |
|---------|----------|--------|
| Frontend | Netlify | `netlify.toml` |
| Backend | Docker / Gunicorn | `docker-compose.yml` |
| Database & Auth | Supabase | Cloud managed |

---

*MyTechZ. All rights reserved.*
