# MyTechZ — Technology Job Portal & AI Career Tools

**MyTechZ** is a full-stack platform that connects tech professionals with job opportunities across India, and provides AI-powered career tools including a free resume builder, ATS rank checker, and smart job matching.

**Live:** [https://mytechz.com](https://mytechz.com)

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.2.3 | App Router, SSR, SSG |
| React | 19.2.4 | UI framework |
| Tailwind CSS | v4 | Styling |
| Supabase JS | ^2.103.0 | Auth & database client |
| Axios | ^1.15.0 | API requests |
| pdf-parse | ^2.4.5 | PDF resume parsing |
| pdfkit | ^0.18.0 | PDF generation |
| docx | ^9.6.1 | DOCX export |
| mammoth | ^1.12.0 | DOCX import/parsing |
| nodemailer | ^8.0.5 | Email (server-side) |
| Microsoft Clarity | ^1.0.2 | Session analytics |

### Backend
| Technology | Purpose |
|---|---|
| Django / Python | REST API, business logic |
| Gunicorn | WSGI production server |
| SQLite | Development database |
| Supabase | Auth, production database |

### Infrastructure
| Tool | Purpose |
|---|---|
| Docker / Docker Compose | Containerised local development |
| Netlify | Frontend deployment |
| Supabase | Managed backend services |

---

## Project Structure

```
staging_mytechz/
├── client/                          # Next.js 16 frontend (App Router)
│   ├── src/
│   │   ├── app/                     # Pages (file-system routing)
│   │   │   ├── page.js              # Homepage (/)
│   │   │   ├── about/               # About page
│   │   │   ├── contact/             # Contact page
│   │   │   ├── services/            # Services page
│   │   │   ├── jobs/                # Jobs hub
│   │   │   │   ├── page.js          # Jobs landing
│   │   │   │   ├── private/         # Private tech jobs
│   │   │   │   ├── government/      # Government jobs
│   │   │   │   ├── internship/      # Paid internships
│   │   │   │   ├── ai/              # AI-matched jobs
│   │   │   │   └── [category]/
│   │   │   │       └── [jobSlug]/
│   │   │   │           ├── page.js        # Job detail
│   │   │   │           ├── apply/         # Job application
│   │   │   │           └── preparation/   # Interview prep
│   │   │   ├── ai-tools/            # AI tools hub
│   │   │   │   ├── page.js          # AI tools landing
│   │   │   │   ├── resume-builder/
│   │   │   │   │   ├── page.js      # Free resume builder
│   │   │   │   │   ├── editor/      # Resume editor
│   │   │   │   │   ├── my-resumes/  # Saved resumes
│   │   │   │   │   └── templates/
│   │   │   │   │       ├── page.js          # Template gallery
│   │   │   │   │       └── [slug]/          # Template detail
│   │   │   │   ├── resume-rank-checker/
│   │   │   │   │   ├── page.js              # ATS score checker
│   │   │   │   │   └── results/[id]/
│   │   │   │   │       ├── page.js          # ATS results
│   │   │   │   │       └── editor/          # Optimise resume from results
│   │   │   │   └── smart-job-search/        # AI job matching
│   │   │   ├── dashboard/           # User dashboard
│   │   │   ├── profile/             # User profile
│   │   │   ├── my-applications/     # Job applications tracker
│   │   │   ├── saved-jobs/          # Saved jobs
│   │   │   ├── settings/            # Account settings
│   │   │   ├── login/               # Authentication
│   │   │   ├── auth/
│   │   │   │   ├── complete/        # OAuth callback
│   │   │   │   └── error/           # Auth error handling
│   │   │   ├── admin/               # Admin portal (protected)
│   │   │   │   ├── dashboard/
│   │   │   │   ├── applications/
│   │   │   │   ├── jobs/
│   │   │   │   ├── post-job/
│   │   │   │   ├── recruiters/
│   │   │   │   ├── users/
│   │   │   │   └── whitelist/
│   │   │   ├── recruiter/           # Recruiter portal (protected)
│   │   │   │   ├── dashboard/
│   │   │   │   ├── onboarding/
│   │   │   │   ├── post-job/
│   │   │   │   └── applicants/
│   │   │   ├── layout.js            # Root layout
│   │   │   ├── sitemap.js           # Dynamic XML sitemap
│   │   │   └── robots.js            # Robots directives
│   │   └── components/
│   │       ├── Navbar.jsx
│   │       ├── Footer.jsx
│   │       ├── LayoutShell.jsx
│   │       ├── DashboardSidebar.jsx
│   │       ├── NewsletterSubscribe.jsx
│   │       ├── ComingSoon.jsx
│   │       ├── ClarityInit.js
│   │       ├── resume/              # Resume builder components
│   │       │   ├── ResumeEditor.jsx
│   │       │   ├── ResumeUploader.jsx
│   │       │   ├── AIContentPanel.jsx
│   │       │   ├── VoiceInput.jsx
│   │       │   ├── TemplateCard.jsx
│   │       │   ├── TemplateGallery.jsx
│   │       │   ├── TemplatePreview.jsx
│   │       │   ├── steps/
│   │       │   └── templates/
│   │       ├── jobs/                # Job listing components
│   │       │   ├── JobCard.jsx
│   │       │   ├── JobForm.jsx
│   │       │   ├── JobJsonLd.jsx
│   │       │   ├── JobRoadmapView.jsx
│   │       │   ├── JobsListingPage.jsx
│   │       │   ├── JobsDashboardWidget.jsx
│   │       │   ├── JobAssistantPanel.jsx
│   │       │   ├── AiFeaturedJobsPage.jsx
│   │       │   └── SortDropdown.jsx
│   │       ├── admin/
│   │       ├── ai/
│   │       ├── auth/
│   │       ├── common/
│   │       ├── home/
│   │       ├── recruiter/
│   │       ├── saved-jobs/
│   │       └── ui/
│   └── package.json
├── backend/                         # Django backend
│   └── job_portal/                  # Django application
├── docker-compose.yml               # Container orchestration
├── netlify.toml                     # Netlify deployment config
└── README.md
```

---

## Frontend Page Architecture

### Layout Hierarchy

```
layout.js  (Root Layout — wraps every page)
│
├── Navbar.jsx          ← top navigation bar
├── LayoutShell.jsx     ← client shell (auth context, sidebar toggle)
│   └── {page content}
└── Footer.jsx          ← bottom footer
```

GA (G-FXKXL6XP9H) and Microsoft Clarity are injected in the root layout and fire on every page.

---

### Page Tree

```
/  (Homepage — page.js)
│
├── /about
├── /contact
├── /services
│
├── /jobs                                  Jobs Hub
│   ├── /jobs/private                      Private tech jobs
│   ├── /jobs/government                   Government jobs
│   ├── /jobs/internship                   Paid internships
│   ├── /jobs/ai                           AI-matched jobs
│   └── /jobs/[category]/[jobSlug]         Job detail (dynamic)
│       ├── /apply                         Job application form
│       └── /preparation                   Interview prep guide
│
├── /ai-tools                              AI Tools Hub
│   ├── /ai-tools/resume-builder           ★ Primary conversion page
│   │   ├── /templates                     Template gallery
│   │   ├── /templates/[slug]              Template detail
│   │   ├── /editor                        Resume editor (auth-gated)
│   │   └── /my-resumes                    Saved resumes (auth-gated)
│   ├── /ai-tools/resume-rank-checker      ATS score checker
│   │   └── /results/[id]                  ATS results page
│   │       └── /editor                    Optimise resume from results
│   └── /ai-tools/smart-job-search         AI job matching (coming soon)
│
├── /login                                 Authentication entry point
├── /dashboard                             User home (auth-gated)
├── /profile                               User profile (auth-gated)
├── /my-applications                       Applications tracker (auth-gated)
├── /saved-jobs                            Saved jobs (auth-gated)
├── /settings                              Account settings (auth-gated)
│
├── /auth/                                 Auth flow (not user-facing UI)
│   ├── /callback                          OAuth / magic link callback
│   ├── /complete                          Post-auth profile setup (new users)
│   ├── /error                             Auth error display
│   └── /sign-out                          Logout route
│
├── /recruiter/                            Recruiter Portal (own layout.js)
│   ├── /onboarding                        Recruiter registration & verification
│   ├── /dashboard                         Recruiter home
│   ├── /post-job                          Create job listing
│   └── /applicants                        View & filter applicants
│
└── /admin/                                Admin Panel (own layout.js)
    ├── /dashboard
    ├── /jobs
    ├── /post-job
    ├── /recruiters
    ├── /users
    ├── /whitelist
    └── /applications
```

---

### API Routes (`/api/*` — Next.js Route Handlers)

```
/api/auth/send-otp              POST  — send email OTP
/api/auth/set-intent            POST  — store pre-login redirect intent

/api/resume/parse               POST  — extract text from PDF/DOCX upload
/api/resume/generate            POST  — AI-generate resume content (Claude)
/api/resume/export              POST  — export resume to PDF or DOCX
/api/resume/[id]                GET / PUT / DELETE — CRUD a single resume

/api/ats/upload                 POST  — upload resume for ATS analysis
/api/ats/list                   GET   — list user's ATS checks
/api/ats/job-roles              GET   — available job roles for scoring
/api/ats/[id]                   GET   — full ATS result
/api/ats/[id]/status            GET   — polling status (async processing)
/api/ats/[id]/insights          GET   — improvement insights
/api/ats/[id]/keywords          GET   — missing / matched keywords
/api/ats/[id]/sections          GET   — section-by-section breakdown
/api/ats/[id]/quick-fix         POST  — AI quick-fix suggestions
/api/ats/[id]/editor-data       GET   — load resume into editor from ATS
/api/ats/[id]/save-edit         POST  — save edits made via ATS editor

/api/jobs/[jobId]/roadmap       GET   — AI learning roadmap for a job role
/api/ai/chat                    POST  — general AI chat endpoint
/api/skills/suggest             POST  — AI skill tag suggestions

/api/contact                    POST  — contact form submission
/api/exports/[scope]            GET   — data export (admin)
```

---

### User Journey Flow

```
VISITOR (not logged in)
        │
        ▼
   [/]  Homepage
        │
   ┌────┴──────────────────────────────────────┐
   ▼                                            ▼
[/jobs]  Jobs Hub                  [/ai-tools]  AI Tools Hub
   │                                            │
   ├── /jobs/private                            ├── /ai-tools/resume-builder ★
   ├── /jobs/government                         │       │
   ├── /jobs/internship                         │   [Browse Templates]──► /templates/[slug]
   ├── /jobs/ai                                 │       │
   └── /jobs/:cat/:slug  (detail)               │   [Start Building]
               │                                │       │
           [Apply]─────► needs login ◄──────────┘  needs login
                               │
                               ▼
                         [/login]
                               │
                    OTP / OAuth → /auth/callback
                               │
                    new user? → /auth/complete  (profile setup)
                               │
                               ▼
                         [/dashboard]  ← user home after login
                               │
              ┌────────────────┼─────────────────┐
              ▼                ▼                  ▼
       [/profile]   [/my-applications]     [/saved-jobs]
                                                  │
                                         [/ai-tools/resume-builder/editor]
                                         [/ai-tools/resume-builder/my-resumes]
```

---

### Key Architectural Patterns

| Pattern | Detail |
|---|---|
| **Framework** | Next.js 15 App Router — file-system routing |
| **Auth** | Supabase (OTP email + OAuth), cookie-based sessions |
| **Server vs Client** | Pages are Server Components by default; interactive pages have a split `*Client.jsx` file (e.g. `EditorClient.jsx`, `ContactClient.jsx`) |
| **Multiple layouts** | Root layout for public; `/admin` and `/recruiter` each have their own `layout.js` |
| **API layer** | Next.js Route Handlers act as a BFF — proxy to Django backend or call AI directly |
| **Auth-gated routes** | `editor`, `my-resumes`, `dashboard`, `profile`, `settings`, `my-applications`, `saved-jobs` all redirect to `/login?next=...` |
| **Crawler access** | Public pages open to GPTBot, ClaudeBot, PerplexityBot; `/admin`, `/recruiter`, `/api`, `/auth/*`, `/dashboard`, `/profile`, `/settings` blocked in `robots.js` |

---

## Features

### Job Portal
- **Private Tech Jobs** — Curated listings from technology companies
- **Government Jobs** — Central and state government tech roles
- **Paid Internships** — Internship opportunities for students and freshers
- **AI-Matched Jobs** — Personalised job recommendations powered by AI
- **Job Detail Pages** — Full job description, requirements, and application flow
- **Interview Preparation** — Role-specific preparation guides per job listing

### AI Career Tools
- **Free Resume Builder** — Multi-step editor with professional templates, AI content suggestions, voice input, and export to PDF/DOCX
- **ATS Resume Rank Checker** — Upload resume + job description to get an ATS compatibility score and actionable improvement suggestions
- **Smart Job Search** *(coming soon)* — AI-powered job discovery and matching

### User Features
- Authentication via Supabase (email + OAuth)
- Dashboard with application tracking
- Save and manage jobs
- Profile management

### Recruiter Portal
- Recruiter onboarding and verification
- Post and manage job listings
- View and filter applicants

### Admin Portal
- Full user, job, recruiter, and application management
- Whitelist management for recruiter access

---

## Getting Started

### Prerequisites
- Node.js v18+
- Python 3.10+
- Docker (optional, for containerised setup)

### Frontend Setup

```bash
cd client
npm install
npm run dev
# Runs at http://localhost:3000
```

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
# Runs at http://localhost:5010
```

### Docker Setup

```bash
docker-compose up --build
# Frontend: http://localhost:5173
# Backend:  http://localhost:5010
```

---

## Deployment

| Service | Platform | Notes |
|---|---|---|
| Frontend | Netlify | Config in `netlify.toml` |
| Backend | Docker / Gunicorn | `gunicorn job_portal.wsgi:application` |
| Database & Auth | Supabase | Managed cloud service |

---

## SEO & Analytics

- Dynamic XML sitemap at `/sitemap.xml`
- Structured data (JSON-LD): BreadcrumbList, FAQPage, WebApplication, HowTo, Organization, ItemList, SoftwareApplication, Service
- Open Graph and Twitter Card meta tags on all public pages
- Google Analytics (`G-FXKXL6XP9H`)
- Microsoft Clarity for session recording
- AI crawler access enabled (GPTBot, ClaudeBot, PerplexityBot, Applebot)
- Private routes blocked from indexing (`/admin`, `/recruiter`, `/api`, `/auth/`, `/dashboard`, `/profile`, `/settings`)

---

## User Roles

| Role | Access |
|---|---|
| **Visitor** | Public pages, job listings, AI tools |
| **User** | Dashboard, applications, saved jobs, resume builder |
| **Recruiter** | Post jobs, manage listings, view applicants |
| **Admin** | Full platform management |

---

## Contact

- **Website:** [https://mytechz.com](https://mytechz.com)
- **Company:** MyTechZ

---

*Proprietary software — MyTechZ. All rights reserved.*
