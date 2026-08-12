# Resume Rank Checker — ATS Architecture

How the ATS (Applicant Tracking System) scoring works in the Resume Rank
Checker feature, in simple words.

## The big picture flow

1. **You give it two things**: your resume (pasted text, or an uploaded
   PDF/DOCX/TXT file) and either a job description or just a target role
   (e.g. "Frontend Developer").
2. **If you uploaded a file**, it's first converted to plain text —
   `POST /api/ai/resume/parse` (`src/app/api/ai/resume/parse/route.js`):
   - PDF → `extractPdfText()` (`src/lib/ai/pdf-text.js`)
   - DOCX/DOC → the `mammoth` library
   - TXT → read as-is
   - If Gemini is configured, it also tries to turn that raw text into
     structured data (contact info, experience, skills, etc.). If not, the
     raw text is kept and used directly.
3. **That resume text + the job description/role gets sent to the scoring
   engine** — `POST /api/ai/resume/rank-check`
   (`src/app/api/ai/resume/rank-check/route.js`).

## How the score is calculated

A **local rule-based engine always runs first** — pure JavaScript, no AI
required (`src/lib/ai/ats-rule-engine.js`, `analyzeResumeATS()`). It computes
4 sub-scores, weighted into one overall ATS score:

| Category | Weight | What it checks |
|---|---|---|
| **Keyword Match** | 40% | Do the important words from the job description (or a hardcoded ~30-keyword list for the target role) actually appear in your resume? |
| **Section Completeness** | 25% | Do you have the sections a resume needs — contact info, summary, experience, education, skills? |
| **Formatting** | 15% | ATS-parsing red flags — excessive special/unicode characters, missing dates, resume way too short or too long |
| **Content Depth** | 20% | Word count in a healthy range (300–800 words optimal), bullet points starting with strong action verbs ("Led", "Built", "Reduced"...), and quantified achievements (numbers/percentages) |

**Keyword matching** is the most involved piece:
- If a job description is given, the engine extracts the most-frequent
  meaningful words/phrases from it (skipping filler words like "the",
  "team", "responsible" via a stop-word list), then checks how many appear
  in the resume.
- If no JD is given, it falls back to a hand-curated keyword list per role.
  10 roles are supported out of the box: software engineer, frontend
  developer, backend developer, data scientist, product manager, devops
  engineer, data analyst, UI/UX designer, mobile developer, cybersecurity —
  plus common aliases (e.g. "SDE" → software engineer, "PM" → product
  manager) resolved via `resolveRole()`.
- Each matched/missing keyword is also classified as a **hard skill** or
  **soft skill**, and missing keywords get a suggested resume section
  (skills / experience / summary) via `detectKeywordSection()`.

## Where AI (Gemini) fits in

The local engine's result is the reliable baseline. **If Gemini is
configured** (`isGeminiConfigured()`), the app also asks it (via
`suggestKeywords()` in `src/lib/ai/gemini.js`) to analyze the same
resume + JD and produce its own overall score and smarter missing-keyword
suggestions. The category breakdown, formatting checklist, and warnings
always come from the local engine regardless — Gemini only replaces the
top-line score and enriches the missing-keyword suggestions.

If Gemini isn't configured, or the call fails for any reason, the feature
still works end-to-end — it silently falls back to 100% local scoring
(`result.source` is `'gemini'` or `'local'` accordingly). Nothing critical
depends on an external AI call staying up.

## What comes back

- Overall `atsScore` (0–100)
- The 4 `categoryScores`
- `missingKeywords` — ranked by importance (JD frequency), each tagged with
  a suggested section and priority (high/medium/low)
- `formattingChecklist` — pass/fail items ATS parsers commonly check
- `warnings` — plain-language issues with a suggested fix
- `tips` — general advice based on the weakest category

## Where it's rendered

`src/components/rank-checker/` — `ScoreGauge`, `CategoryBarChart`,
`KeywordPieChart`, `KeywordFrequencyChart`, `MissingKeywords`,
`FormattingChecklist`, `WarningsPanel`, `SuggestionsList`, `ParsedPreview`,
`ScanHistory`. Every run is logged to `ai_generation_logs`
(`action_type: 'rank_check'`), which backs the scan history view.
