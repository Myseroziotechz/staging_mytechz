# Job/Card Creation & Applicant Tracking — Plan

> **Scope**
> 1. A unified, fast **Create-a-Card** form for the four feed types: `private`,
>    `government`, `internship`, `ai`. Posted from the **Recruiter** and **Admin**
>    dashboards. **Hidden** from the candidate role.
> 2. **Recruiter dashboard** — track applicants for each of *their* jobs.
> 3. **Admin dashboard** — track everything platform-wide, with cross-filters.
> 4. **Export** any tracking view to **CSV / DOCX / PDF**.
>
> **Database**: MyTechz Supabase only (project ref `aiycgmrubisaxknbeaov`).
> Never touch the Supabase-GS project.
> **Stack**: Next.js 16 (App Router), Supabase + RLS, Tailwind v4. No Django.
> **Status**: documentation only — do not implement yet.

---

## 0. TL;DR

- One smart form at `/recruiter/post-job` (and `/admin/post-job`) with a
  **type selector** (Private / Government / Internship / AI). The form
  re-shapes itself to show only the fields that type needs.
- A 3-column **kanban-lite tracker** on each dashboard:
  - Recruiter sees only their `jobs.posted_by = user.id` rows + their applicants.
  - Admin sees all jobs + all applicants with filter chips.
- One **`/api/exports/[scope]`** route streams CSV / DOCX / PDF for any
  list view — driven by the same query shape the page uses.
- Visibility is enforced **twice**: route guard (`requireRecruiter` /
  `requireAdmin`) AND Supabase RLS. Candidates can never reach these pages
  even if they paste the URL.

---

## 1. Roles & access matrix

| Page | Candidate | Recruiter | Admin |
|---|---|---|---|
| `/recruiter/post-job` | ❌ redirect to `/` | ✅ create own | ✅ (read-only preview) |
| `/admin/post-job` | ❌ | ❌ | ✅ create on behalf of any company |
| `/recruiter/dashboard` | ❌ | ✅ own data only | ✅ (read-only) |
| `/admin/dashboard` | ❌ | ❌ | ✅ |
| `/recruiter/applicants` | ❌ | ✅ applicants to own jobs | ✅ |
| `/admin/applications` | ❌ | ❌ | ✅ all applicants |
| Card creation in nav | hidden | "Post a job" button | "Post a job" button |

Guards already exist (`requireRecruiterOnboarded` in
[client/src/lib/recruiter-auth.js](client/src/lib/recruiter-auth.js) and the
admin layout check). The plan reuses both — no new auth concepts.

---

## 2. The "Create a Card" form

### 2.1 Single form, four shapes

One file: [client/src/components/jobs/JobForm.jsx](client/src/components/jobs/JobForm.jsx).
The first field is a **Type selector** (4 cards). The form then:

- **Hides** fields that don't apply (e.g. `salary` for AI feed, `government_meta` for private)
- **Requires** type-specific fields (e.g. internship needs `stipend` + `duration_months`)
- **Validates** server-side via a single Zod schema discriminated on `category` + `job_type`

```
┌──────────── Step 1: What are you posting? ────────────┐
│ ◉ Private job  ○ Government  ○ Internship  ○ AI pick │
└────────────────────────────────────────────────────────┘
┌──────────── Step 2: Basics (always shown) ────────────┐
│ Title*   Location*   Work mode*   Job type*           │
│ Skills (chips, max 10)   Description (markdown)       │
└────────────────────────────────────────────────────────┘
┌──────────── Step 3: Type-specific (conditional) ──────┐
│ Private:    salary range, experience min/max          │
│ Government: notification PDF URL, exam date, age      │
│             limit, vacancies, application_fee, govt   │
│             department                                │
│ Internship: stipend (per month), duration_months,     │
│             ppo_chance %, college_year_filter         │
│ AI:         "AI-curated tag" (admin only) + reason    │
└────────────────────────────────────────────────────────┘
┌──────────── Step 4: Apply config ─────────────────────┐
│ apply_mode: internal | external | email | phone      │
│ Conditional: apply_url / apply_email / apply_phone    │
│ Application deadline   Openings count                 │
└────────────────────────────────────────────────────────┘
┌──────────── Step 5: Preview + Submit ─────────────────┐
│ Live preview of the resulting JobCard (compact)       │
│ Recruiter → status='pending_approval'                 │
│ Admin     → status='active' (or pending if they pick) │
└────────────────────────────────────────────────────────┘
```

### 2.2 Faster creation — quality-of-life

- **Templates**: a "Save as template" button writes the form to
  `job_templates` (new table). Next time, click a template to pre-fill.
- **Duplicate from existing**: list of recruiter's last 10 jobs in a sidebar.
  One click clones into the form.
- **AI assist** (reuses the chat infra): button "✨ Draft from JD" — paste a
  raw JD, the LLM extracts fields into the form (re-uses
  [client/src/lib/ai/llm.js](client/src/lib/ai/llm.js), JSON mode).
- **Smart defaults**: city / work_mode / company pre-filled from
  `recruiter_profiles`. Skills suggested from a global `skills` lookup table.
- **Autosave to draft** every 5s into `localStorage` keyed by user+template.
- **Bulk import** (admin only): paste a Google Sheet link or upload a CSV →
  preview rows → click "Import all". Uses the same Zod schema per row.

### 2.3 Routes

| Route | Who | Purpose |
|---|---|---|
| `/recruiter/post-job` | recruiter | Create new (single) |
| `/recruiter/post-job/[id]/edit` | recruiter | Edit own draft/active job |
| `/recruiter/post-job/templates` | recruiter | Manage templates |
| `/admin/post-job` | admin | Create on behalf of any verified company |
| `/admin/post-job/import` | admin | Bulk CSV/sheet import |
| `/admin/post-job/[id]/edit` | admin | Edit any job (audit-logged) |

### 2.4 Server actions / API

- `client/src/app/recruiter/post-job/actions.js` — `createJob()`,
  `updateJob()`, `saveTemplate()`, `deleteDraft()`. Uses `createClient`
  (RLS-safe). Inserts into `public.jobs` with `posted_by = user.id`.
- `client/src/app/admin/post-job/actions.js` — same surface but uses the
  service-role client (`getAdminClient()`) and writes an `admin_audit_log`
  row for every mutation.
- `client/src/app/api/jobs/draft-from-jd/route.js` — POST `{ jd: string }` →
  returns `{ title, skills[], experience_min/max, salary_min/max, ... }`.
  Reuses `chatJSON({ json: true })`.

---

## 3. Recruiter dashboard — applicant tracking

> "for the recruiter dashboard there should be tracking of each and every
> user … from the recruiter's perspective"

### 3.1 Layout

```
/recruiter/dashboard
┌──────────── Greeting + verification badge (existing) ─┐
├──────────── Quick stats (NEW) ────────────────────────┤
│  Active jobs · Total applicants · This week · Hires  │
├──────────── My jobs (NEW kanban-lite) ────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│  │ Drafts  │ │ Pending │ │ Active  │ │ Closed  │    │
│  │ ...     │ │ ...     │ │ ...     │ │ ...     │    │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘    │
├──────────── Applicants pipeline (NEW) ────────────────┤
│  Job: [select dropdown ▾]                  [Export ▾] │
│  ┌──────────┬──────────┬──────────┬──────────┐       │
│  │ Applied  │ Reviewed │Interview │ Offered  │  ...  │
│  │  Rita 12 │  Kabir 5 │  Aanya 2 │  -       │       │
│  └──────────┴──────────┴──────────┴──────────┘       │
└────────────────────────────────────────────────────────┘
```

### 3.2 Data model — `job_applications` extension

Existing columns: `id, user_id, job_url, job_title, company_name, status,
applied_at`. We add (migration):

```sql
alter table public.job_applications
  add column if not exists job_id          uuid references public.jobs(id) on delete cascade,
  add column if not exists recruiter_notes text,
  add column if not exists rating          int check (rating between 1 and 5),
  add column if not exists last_status_at  timestamptz default now();

create index if not exists job_applications_job_idx
  on public.job_applications (job_id, status, last_status_at desc);
```

The new `job_id` link enables fast "all applicants for THIS job" queries
without text-matching. Backfill where possible from `job_url`.

### 3.3 Applicant detail drawer

Click a row → right-side drawer shows:

- Candidate basics (name, email, phone — if `user_profiles.is_visible`)
- Resume preview (PDF iframe + parsed skills chips)
- Application history (all jobs they've applied to within this company)
- Notes textarea (saves to `recruiter_notes`)
- Status changer (Applied → Reviewed → Interview → Offered / Rejected)
- Star rating (1-5)
- Action: "Schedule interview" (just opens mailto: for v1)

### 3.4 Recruiter RLS

```sql
-- Recruiters see applicants ONLY for jobs they posted.
create policy job_apps_recruiter_select on public.job_applications
  for select using (
    exists (
      select 1 from public.jobs j
      where j.id = job_applications.job_id
        and j.posted_by = auth.uid()
    )
    or user_id = auth.uid()  -- candidates still see their own
  );

create policy job_apps_recruiter_update on public.job_applications
  for update using (
    exists (
      select 1 from public.jobs j
      where j.id = job_applications.job_id
        and j.posted_by = auth.uid()
    )
  );
```

---

## 4. Admin dashboard — platform-wide tracking

> "for the admin dashboard it should be a list of all the perspectives so
> that it will be an easier and faster way to access and take a report"

### 4.1 Sections

```
/admin/dashboard            → Stat overview (existing, expand)
/admin/users                → All users with filters + export (existing)
/admin/recruiters           → All recruiters w/ verification queue (existing)
/admin/applications  (NEW)  → Every application across the platform
/admin/jobs          (NEW)  → All jobs (any status) with bulk actions
/admin/reports       (NEW)  → Saved report builder (filters → export)
```

### 4.2 `/admin/applications` master table

Columns: candidate · job · company · category · status · applied_at ·
recruiter (who posted) · last_status_at · rating.

Filters (URL-driven so they're shareable):
- `?category=private|government|internship|ai`
- `?status=applied|reviewed|interview|offered|rejected`
- `?date_from=…&date_to=…`
- `?recruiter_id=…`
- `?company_id=…`
- `?q=` free-text on candidate name / job title

Top-right buttons: **Export CSV** · **Export DOCX** · **Export PDF**.

### 4.3 Audit log

New table `admin_audit_log` records every admin write
(`actor_id, action, target_table, target_id, diff jsonb, created_at`).
Surfaced at `/admin/audit` (read-only).

---

## 5. Export module (CSV / DOCX / PDF)

### 5.1 One route, three formats

```
GET /api/exports/[scope]?format=csv|docx|pdf&<filters>
```

`scope` is one of:
- `applications` — all `job_applications` (admin) or own jobs' (recruiter)
- `jobs` — `public.jobs` rows
- `users` — `user_profiles` (admin only)
- `recruiters` — `recruiter_profiles` joined to `user_profiles`

The route:
1. Resolves the role guard (admin vs recruiter scope).
2. Reuses the **same query builder** the page list uses (single source of
   truth — refactor list page to import the builder).
3. Streams the result as the requested format.

### 5.2 Libraries

| Format | Library | Why |
|---|---|---|
| CSV | none — hand-rolled with `Papa.unparse` shim or native string build | No deps; safe with quoting |
| PDF | [`pdfkit`](https://pdfkit.org) (server-side, streams) | Mature, no headless Chrome |
| DOCX | [`docx`](https://www.npmjs.com/package/docx) | Pure JS, streams to Buffer |

All three run on **Node runtime** (`export const runtime = 'nodejs'`) inside
the export route. No Edge — these libraries need Node APIs.

### 5.3 Templating

Each scope has a templates file:
```
client/src/lib/exports/templates/
  applications-pdf.js      ← PDFKit doc factory
  applications-docx.js     ← docx Document factory
  applications-csv.js      ← header + row mapper
  jobs-…js
  users-…js
```

PDFs include a header (MyTechZ logo + report title + filter summary +
generated_at + actor email), a table, and a footer with page numbers.

### 5.4 Big-export safety

- Hard cap **10,000 rows** per export (warn the user, ask to refine).
- Stream rows page-by-page from Supabase (`.range()`) so we don't load it
  all into memory.
- Set `Content-Disposition: attachment; filename="applications-2026-05-05.csv"`
  with date stamp.
- Log every export to `admin_audit_log` (who exported what, with which
  filters, how many rows).

### 5.5 UI

A reusable `<ExportMenu />` dropdown component sits top-right on every
trackable list page:

```
[Export ▾]
 ├─ Download CSV  (.csv)
 ├─ Download DOCX (.docx)
 └─ Download PDF  (.pdf)
```

Clicks build a URL with the page's current filters and trigger a download
via a hidden `<a download>`.

---

## 6. Database — migrations

```
client/migrations/
  20260506000000_job_form_extras.sql      ← government_meta, internship_meta JSONB
  20260506000100_job_templates.sql        ← per-recruiter templates
  20260506000200_applications_link.sql    ← job_id, notes, rating, last_status_at
  20260506000300_admin_audit_log.sql      ← write log
  20260506000400_rls_recruiter_apps.sql   ← recruiter visibility policies
```

### 6.1 `job_templates`

```sql
create table public.job_templates (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  payload     jsonb not null,         -- the JobForm state, ready to spread
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
alter table public.job_templates enable row level security;
create policy job_templates_own on public.job_templates for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
```

### 6.2 `admin_audit_log`

```sql
create table public.admin_audit_log (
  id           uuid primary key default gen_random_uuid(),
  actor_id     uuid references auth.users(id) on delete set null,
  action       text not null,         -- 'job.create', 'job.update', 'export.applications', ...
  target_table text,
  target_id    uuid,
  diff         jsonb,                 -- before / after when applicable
  ip           text,
  created_at   timestamptz default now()
);
alter table public.admin_audit_log enable row level security;
create policy audit_admin_only on public.admin_audit_log for select
  using (exists (select 1 from public.user_profiles
                 where id = auth.uid() and role = 'admin'));
```

(No insert policy — only the service-role client writes this table.)

---

## 7. File layout (new + changed)

```
client/src/
  app/
    recruiter/
      dashboard/page.js                ← extend: stats + kanban-lite + tracker
      post-job/
        page.js                        ← refactor → uses <JobForm />
        actions.js                     ← createJob, updateJob, saveTemplate
        templates/page.js              ← NEW manage templates
        [id]/edit/page.js              ← NEW
      applicants/
        page.js                        ← refactor: pipeline + drawer
    admin/
      dashboard/page.js                ← extend: KPI strip + recent activity
      post-job/
        page.js                        ← uses <JobForm /> in admin mode
        actions.js                     ← service-role + audit log
        import/page.js                 ← NEW bulk import
        [id]/edit/page.js              ← NEW
      jobs/page.js                     ← NEW master jobs table
      applications/page.js             ← extend: filters + export menu
      reports/page.js                  ← NEW saved report builder
      audit/page.js                    ← NEW read-only audit feed
    api/
      exports/[scope]/route.js         ← NEW CSV/DOCX/PDF endpoint
      jobs/draft-from-jd/route.js      ← NEW LLM JD → JobForm fields
  components/
    jobs/
      JobForm.jsx                      ← NEW unified create form
      JobFormStep1Type.jsx
      JobFormStep2Basics.jsx
      JobFormStep3Specific.jsx
      JobFormStep4Apply.jsx
      JobFormPreview.jsx
      JobsKanban.jsx                   ← NEW per-status columns
      ApplicantDrawer.jsx              ← NEW right-side drawer
      ApplicantPipeline.jsx            ← NEW kanban for one job's applicants
    common/
      ExportMenu.jsx                   ← NEW CSV/DOCX/PDF dropdown
      DataTable.jsx                    ← NEW reusable table w/ sort + pagination
      FilterChips.jsx                  ← NEW URL-driven filter bar
  lib/
    jobs/
      schema.js                        ← NEW Zod schemas (per-type discriminated)
      builders.js                      ← NEW shared list-query builders
    exports/
      run.js                           ← NEW orchestrator (scope → query → format)
      csv.js
      pdf.js                           ← PDFKit wrapper
      docx.js                          ← docx wrapper
      templates/
        applications-pdf.js
        applications-docx.js
        applications-csv.js
        jobs-…
        users-…
        recruiters-…
client/migrations/
  20260506000000_job_form_extras.sql
  20260506000100_job_templates.sql
  20260506000200_applications_link.sql
  20260506000300_admin_audit_log.sql
  20260506000400_rls_recruiter_apps.sql
```

---

## 8. Phased delivery

### Phase 1 — Unified JobForm (≈2 days)
- Zod schemas (`lib/jobs/schema.js`) for the 4 types.
- `JobForm.jsx` + step components.
- Wire to `/recruiter/post-job` with server action `createJob()`.
- Smoke test: post one of each type and see them appear under their feed.

### Phase 2 — Recruiter applicant pipeline (≈2 days)
- Migration `20260506000200_applications_link.sql`.
- `JobsKanban` + `ApplicantPipeline` + `ApplicantDrawer`.
- Status changer + notes + rating server actions.
- RLS migration so recruiters see only their applicants.

### Phase 3 — Admin master views (≈2 days)
- `/admin/jobs`, `/admin/applications` upgrade with filters + DataTable.
- KPI strip on `/admin/dashboard` (active jobs, applicants today, hires this week).
- `admin_audit_log` migration.

### Phase 4 — Export module (≈2 days)
- Add `pdfkit` + `docx` dependencies.
- `/api/exports/[scope]` route + the four templates.
- `<ExportMenu />` on every trackable list page.

### Phase 5 — Quality of life (≈1.5 days)
- Templates + duplicate-from-existing in JobForm.
- "Draft from JD" LLM helper.
- Bulk CSV import (admin).

### Phase 6 — Reports + audit feed (≈1 day)
- `/admin/reports` saved-filter builder (saves filters to a small table,
  user can re-run + re-export).
- `/admin/audit` viewer.

---

## 9. Security checklist

- [ ] `requireRecruiterOnboarded()` on every recruiter route.
- [ ] `requireAdmin()` (existing layout guard) on every admin route.
- [ ] **Hide** post-job nav entries for `role = 'candidate'` in
      `Navbar.jsx` and `DashboardSidebar.jsx`.
- [ ] RLS policies on every new table (templates, audit, etc).
- [ ] Service-role client (`getAdminClient()`) used only inside admin
      server actions and the export route — never imported into a client
      component.
- [ ] Zod validation server-side (do **not** trust the client to enforce
      type-specific required fields).
- [ ] Export route hard-caps row count + writes to audit log.
- [ ] PDF/DOCX generators escape user-supplied strings (PDFKit handles by
      default; double-check cell text).
- [ ] CSV cells starting with `=`, `+`, `-`, `@` are prefixed with `'` to
      block CSV-injection in Excel/Sheets.

---

## 10. Things deliberately deferred

- **Approval workflow** for recruiter-posted jobs beyond the existing
  `pending_approval` flag — Phase 7 adds an admin "review queue" tab.
- **Applicant messaging in-app** — Phase 7. v1 uses mailto: links.
- **Real-time updates** (Supabase Realtime) on the kanban — nice but not
  required; pull-to-refresh + invalidate-on-mutation is fine for v1.
- **Saved reports scheduling** (email a weekly PDF) — Phase 8.
- **Charts** beyond the simple KPI strip — Phase 8 (recharts when needed).

---

## 11. Open questions for you

1. **AI feed posting** — should recruiters be able to post into the AI
   category, or is that admin-only (curation)? Plan currently assumes
   **admin-only** for `category='ai'`.
2. **Government posts** — usually scraped from official sites. Do you want
   recruiters to post these at all, or only admin?
3. **Export PII** — should candidate phone/email be hidden in CSV/PDF
   exports unless the candidate has opted in (`is_visible` flag on
   `user_profiles`)?
4. **Bulk import** — Google Sheets URL or just CSV upload? Sheets needs
   OAuth; CSV is simpler.
5. **Templates** — recruiter-only, or company-wide (shareable across
   recruiters in the same `company_id`)?

Answer those and the plan is ready to ship.
