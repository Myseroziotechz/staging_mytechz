# Resume Rank Checker (ATS Analyzer) — Implementation (Archived)

## Pages

### `/ai-tools/resume-rank-checker`
Public landing page. Upload widget, feature explainer, FAQ.
File: `app/ai-tools/resume-rank-checker/page.js`
Component: `app/ai-tools/resume-rank-checker/_components/UploadWidget.jsx`

### `/ai-tools/resume-rank-checker/results/[id]`
Full analysis results — overall score, section breakdown, keyword matches, insights.
File: `app/ai-tools/resume-rank-checker/results/[id]/page.js`

### `/ai-tools/resume-rank-checker/results/[id]/editor`
Side-by-side resume text editor with live re-scoring.
File: `app/ai-tools/resume-rank-checker/results/[id]/editor/page.js`

---

## ATS Engine (`lib/ats/engine.js`)

Pure JavaScript analysis engine — no ML dependencies.

### Scoring Weights

| Component | Weight |
|---|---|
| Keyword match | 35% |
| Section detection | 25% |
| Format check | 15% |
| Action verbs | 10% |
| Quantification | 10% |
| Readability | 5% |

### Functions

| Function | Description |
|---|---|
| `detectSections(text)` | Finds 9 resume sections via regex patterns |
| `scoreSection(name, data)` | Scores each section on content quality |
| `matchKeywords(text, keywords)` | Matches job-role keywords against resume text |
| `scoreActionVerbs(text)` | Checks if bullet points start with strong action verbs |
| `scoreQuantification(text)` | Counts quantified achievements (%, $, numbers) |
| `scoreFormat(text)` | Checks length, email, phone presence |
| `scoreReadability(text)` | Average sentence length check |
| `computeAtsScore(scores)` | Weighted composite score |
| `generateInsights(...)` | Produces strength/weakness/suggestion objects |
| `runAnalysis(text, keywords)` | Main entry — runs full pipeline, returns all data |

### Sections Detected
`contact`, `summary`, `experience`, `education`, `skills`, `certifications`, `projects`, `achievements`, `languages`

---

## Keyword Library (`lib/ats/keywords.js`)

Job-role-specific keyword sets. Each role has:
- `required` keywords (35% weight in scoring)
- `preferred` keywords (25% weight)
- `bonus` keywords (10% weight)

Keyword types: `hard_skill`, `soft_skill`, `tool`, `action_verb`, `industry_term`, `certification`

---

## Analysis Flow

```
User uploads file → POST /api/ats/upload
  → Extract text (pdf-parse / mammoth)
  → runAnalysis(text, keywords)
  → Insert resume_analysis_jobs row
  → Insert resume_section_results rows (9)
  → Insert resume_keyword_results rows (N per role)
  → Insert resume_insights rows
  → Return { analysisId }

User views results → GET /api/ats/[id]/editor-data
  → Returns scores + sections + keywords + insights in one call

User edits text → POST /api/ats/[id]/save-edit
  → Re-run runAnalysis on edited text
  → Update scores in DB
  → Return new scores

User requests quick fix → POST /api/ats/[id]/quick-fix
  → LLM generates 3 rewritten bullet alternatives
  → Return { rewrites: string[] }
```
