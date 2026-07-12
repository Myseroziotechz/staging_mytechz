# Resume Builder — Implementation (Archived)

## Pages

### `/ai-tools/resume-builder`
Public landing page. Showcases templates, features, FAQs.
File: `app/ai-tools/resume-builder/page.js`

### `/ai-tools/resume-builder/templates`
Template gallery showing all 6 templates with live preview.
File: `app/ai-tools/resume-builder/templates/page.js`

### `/ai-tools/resume-builder/templates/[slug]`
Individual template detail page with full preview.
File: `app/ai-tools/resume-builder/templates/[slug]/page.js`
Client: `app/ai-tools/resume-builder/templates/[slug]/TemplatePreviewClient.jsx`

### `/ai-tools/resume-builder/editor`
Main resume editor (requires login).
File: `app/ai-tools/resume-builder/editor/page.js`
Client: `app/ai-tools/resume-builder/editor/EditorClient.jsx`

### `/ai-tools/resume-builder/my-resumes`
User's saved resumes list (requires login).
File: `app/ai-tools/resume-builder/my-resumes/page.js`
Client: `app/ai-tools/resume-builder/my-resumes/MyResumesClient.jsx`

---

## Components (`components/resume/`)

| File | Purpose |
|---|---|
| `ResumeEditor.jsx` | Main multi-step editor shell, step navigation |
| `AIContentPanel.jsx` | Sliding AI panel for generating section content |
| `VoiceInput.jsx` | Web Speech API voice input for resume fields |
| `TemplateGallery.jsx` | Grid display of all templates |
| `TemplateCard.jsx` | Single template card with preview thumbnail |
| `TemplatePreview.jsx` | Full-size live template preview |
| `ResumeUploader.jsx` | Drag-and-drop file upload for parsing existing resume |
| `steps/BasicsStep.jsx` | Step 1: personal info |
| `steps/SummaryStep.jsx` | Step 2: professional summary with AI |
| `steps/ExperienceStep.jsx` | Step 3: work experience with AI bullet generation |
| `steps/EducationStep.jsx` | Step 4: education |
| `steps/SkillsStep.jsx` | Step 5: skills with AI suggestions |
| `steps/ProjectsStep.jsx` | Step 6: projects |

---

## Templates (`components/resume/templates/`)

| Slug | File | Style |
|---|---|---|
| `classic` | `ClassicTemplate.jsx` | Traditional single-column, serif-ish |
| `modern` | `ModernTemplate.jsx` | Two-column with colored sidebar |
| `professional` | `ProfessionalTemplate.jsx` | Clean corporate single-column |
| `creative` | `CreativeTemplate.jsx` | Bold header, accent colors |
| `minimal` | `MinimalTemplate.jsx` | Ultra-clean, whitespace-heavy |
| `tech` | `TechTemplate.jsx` | Dark-themed, GitHub-inspired |

---

## Library (`lib/resume/`)

| File | Purpose |
|---|---|
| `queries.js` | Supabase CRUD for `resume_documents` table |
| `schema.js` | Zod-like validation schema for resume data shape |
| `templates.js` | Template metadata (name, slug, description, thumbnail) |
| `export-pdf.js` | PDF generation using `pdfkit` |
| `export-docx.js` | DOCX generation using `docx` package |

---

## Data Flow

```
User → ResumeEditor → (step forms) → resume_data object
     → AIContentPanel → POST /api/resume/generate → LLM → content
     → ResumeUploader → POST /api/resume/parse → extracted text
     → Save → POST/PUT /api/resume/[id] → resume_documents
     → Export → POST /api/resume/export → PDF/DOCX download
```
