# Product: MyTechZ Job Portal

MyTechZ is a job portal platform targeting the Indian tech job market. It connects job seekers (candidates) with employers (recruiters) and provides supporting tools and content.

## Core User Roles
- **Candidates** – browse/apply for jobs, manage profile and resume, track applications
- **Recruiters** – post jobs, manage applications, require admin approval before posting
- **Admins** – approve/reject recruiters, manage webinars, admissions posts, and platform content

## Key Features
- Job listings (private sector and government)
- Job application flow with status tracking
- Candidate profile with resume upload
- Recruiter company profile and job posting (gated by admin approval)
- AI tools: Resume Builder, Smart Job Search, Resume Rank Checker (coming soon / placeholder)
- Webinars and admissions posts (admin-managed, publicly visible)
- Authentication via Supabase (Google OAuth + magic link) on the frontend; JWT-based auth on the Django backend for recruiter/admin APIs

## Live Deployment
- Frontend: Netlify / Vercel
- Backend: Render (or Hostinger VPS)
- Database: SQLite (dev), PostgreSQL (production via `dj-database-url`)
