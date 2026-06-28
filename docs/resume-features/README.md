# Resume Features — Archived Documentation

## Status: Removed (June 2026)

The resume builder and ATS rank checker features were removed from the MyTechZ platform to focus the product on core job discovery, job applications, and recruiter tools.

## Features That Were Removed

| Feature | Description |
|---|---|
| **Free Resume Builder** | Multi-step resume editor with 6 templates (Classic, Modern, Professional, Creative, Minimal, Tech), AI content generation, voice input, PDF/DOCX export |
| **Resume Rank Checker (ATS)** | Upload a resume (PDF/DOCX/TXT), select job roles, get ATS score with keyword analysis, section scoring, and AI insights |
| **Resume AI Chat Branch** | Floating AI assistant branch for resume-specific questions |

## Files Removed

### Pages (app/)
- `app/ai-tools/resume-builder/` — full builder flow
- `app/ai-tools/resume-rank-checker/` — ATS upload + results + editor

### API Routes (app/api/)
- `app/api/resume/parse/` — PDF/DOCX text extraction
- `app/api/resume/generate/` — AI content generation per section
- `app/api/resume/export/` — PDF/DOCX download
- `app/api/resume/[id]/` — CRUD for resume documents
- `app/api/ats/upload/` — Upload and trigger analysis
- `app/api/ats/list/` — List user's analyses
- `app/api/ats/job-roles/` — Fetch available job roles for keyword matching
- `app/api/ats/[id]/` — Get analysis details
- `app/api/ats/[id]/insights/` — Get AI insights
- `app/api/ats/[id]/sections/` — Get section results
- `app/api/ats/[id]/keywords/` — Get keyword results
- `app/api/ats/[id]/quick-fix/` — AI quick-fix suggestions
- `app/api/ats/[id]/save-edit/` — Save edited resume text and re-score
- `app/api/ats/[id]/editor-data/` — Get combined data for editor view
- `app/api/ats/[id]/status/` — Poll analysis status
- `app/api/skills/suggest/` — AI skill suggestions
- `app/api/exports/[scope]/` — Export data (resume/ATS)

### Components (components/)
- `components/resume/` — all resume UI components

### Library (lib/)
- `lib/resume/` — resume queries, schema, templates, export
- `lib/ats/` — ATS engine, keyword matching
- `lib/exports/` — CSV/DOCX/PDF export utilities
- `lib/ai/branches/resume.js` — AI chat resume branch

### NPM Packages Removed
- `pdf-parse` — PDF text extraction
- `pdfkit` — PDF generation
- `docx` — DOCX generation
- `mammoth` — DOCX reading

## Database Tables Dropped
See `database-schema.md` for the full SQL.

- `resume_insights`
- `resume_keyword_results`
- `resume_section_results`
- `resume_analysis_jobs`
- `resume_documents`
- Storage bucket: `resume-analyses`

## Detailed Docs
- [Database Schema](./database-schema.md)
- [API Routes](./api-routes.md)
- [Resume Builder](./resume-builder.md)
- [Resume Rank Checker](./resume-rank-checker.md)
