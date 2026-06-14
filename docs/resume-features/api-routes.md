# API Routes — Resume & ATS (Archived)

All routes were at `client/src/app/api/`.

## Resume Builder Routes

### `POST /api/resume/parse`
Extracts plain text from an uploaded resume file (PDF, DOCX, TXT).
- Uses `pdf-parse` for PDFs, `mammoth` for DOCX
- Returns `{ text: string }`

### `POST /api/resume/generate`
Generates AI content for a resume section.
- Body: `{ section, context, existingContent }`
- Calls OpenAI/LLM to produce bullet points, summary, etc.
- Returns `{ content: string }`

### `POST /api/resume/export`
Exports a resume as PDF or DOCX download.
- Body: `{ resumeData, templateSlug, format: 'pdf'|'docx' }`
- Uses `pdfkit` for PDF, `docx` package for DOCX
- Returns file stream with appropriate Content-Type

### `GET /api/resume/[id]`
Fetch a single resume document by ID.

### `PUT /api/resume/[id]`
Update resume document fields.

### `DELETE /api/resume/[id]`
Delete a resume document.

---

## ATS Rank Checker Routes

### `POST /api/ats/upload`
Upload a resume file, extract text, run ATS analysis, persist results.
- Accepts multipart/form-data with file + jobRoles[]
- Runs `runAnalysis()` from `lib/ats/engine.js`
- Inserts into `resume_analysis_jobs` + child tables
- Returns `{ analysisId: number }`

### `GET /api/ats/list`
List all analyses for the authenticated user.
- Returns array of `{ id, file_name, ats_score, status, created_at }`

### `GET /api/ats/job-roles`
Returns list of available job roles for keyword matching.
- Source: `lib/ats/keywords.js`

### `GET /api/ats/[id]`
Get full analysis details including scores.

### `GET /api/ats/[id]/insights`
Get AI insights (strengths, weaknesses, suggestions) for an analysis.

### `GET /api/ats/[id]/sections`
Get per-section results (9 sections: contact, summary, experience, education, skills, certifications, projects, achievements, languages).

### `GET /api/ats/[id]/keywords`
Get per-keyword match results.

### `POST /api/ats/[id]/quick-fix`
Generate AI quick-fix suggestions for a specific weakness insight.
- Body: `{ insightId, resumeText }`
- Returns `{ rewrites: string[] }`

### `POST /api/ats/[id]/save-edit`
Save manually edited resume text and re-run ATS scoring.
- Body: `{ editedText }`
- Runs `runAnalysis()` on edited text, updates scores in DB

### `GET /api/ats/[id]/editor-data`
Combined endpoint — returns analysis + sections + keywords + insights in one call (for the editor view).

### `GET /api/ats/[id]/status`
Poll the status of an in-progress analysis (`pending` → `processing` → `completed`|`failed`).

---

## Other Removed Routes

### `POST /api/skills/suggest`
AI-powered skill suggestions based on job role and existing skills.
- Body: `{ role, currentSkills }`
- Returns `{ suggestions: string[] }`

### `GET /api/exports/[scope]`
Export data in CSV/DOCX/PDF format. Scope values were resume-specific.
- `lib/exports/scopes.js` defined allowed scopes and their data fetchers
