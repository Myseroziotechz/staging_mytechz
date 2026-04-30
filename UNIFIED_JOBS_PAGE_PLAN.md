# Unified Jobs Page — Plan, Schema, SEO & Card Spec

> **Database scope:** MyTechz Supabase only — project ref `aiycgmrubisaxknbeaov`.
> Do NOT use the Supabase-GS (Google Studio) project.
> All SQL goes in `client/migrations/` and is applied manually by the user.

---

## 0. TL;DR

- One `/jobs` page with three tabs/dropdown: **Private**, **Government**, **AI Featured Search**.
- One `JobCard` component, visual style mirrors the hero-section job card in [HeroSection.jsx](client/src/components/home/HeroSection.jsx) — extended with **glassmorphism**, **mouse-tilt**, **shimmer-on-hover**, **fade-up entrance**, **pulse on "Apply"**, and full mobile responsiveness.
- Card click → dedicated detail page at `/jobs/[category]/[slug]-[shortId]`. Apply / save state reflected in URL via query params.
- Every detail page is auto-SEO/AEO/GEO optimized: dynamic `<title>`/`<meta>`, `JobPosting` JSON-LD, sitemap, robots, canonical, OG/Twitter, FAQ schema, geo metadata.
- Each detail page exposes an **AI Assistant button** that, on click, generates a per-job preparation roadmap (steps, resources, mock interviews, study plan) — keyed off the job ID, cached in `job_assistant_roadmaps`.
- Apply CTA supports **internal form**, **external website**, **email**, and **phone (`tel:`)** — all driven by `apply_mode` + `apply_url` / `apply_email` / `apply_phone`.
- Same `JobCard` component is reused across the unified `/jobs` page, **user dashboard** (recent / recommended jobs widget), **recruiter dashboard** (own postings with Edit / Close), and **admin dashboard** (approval queue with Approve / Reject) — variant-driven.
- Future-ready hook for an AI chatbot popup that filters cards in place — no schema changes will be needed when we add it.

### Visual upgrade — "premium glass" cards

- Surface: `bg-white/70 backdrop-blur-xl` with a subtle inner border `border border-white/40` and a soft outer glow `shadow-xl shadow-blue-900/10`.
- Hover: lifts (`-translate-y-1`), gains a stronger glow, and reveals a left-edge gradient bar.
- Mouse-tilt: subtle `transform: rotateX/rotateY` based on cursor position (CSS-only via custom properties).
- Shimmer sweep across the card on hover (reuses the hero `bg-gradient-to-r from-transparent via-white/25 to-transparent` trick).
- Skeletons match the same glass surface so loading feels native.
- All animations respect `prefers-reduced-motion` (disabled when user opts out).

---

## 1. Routing

| Route | Purpose |
|---|---|
| `/jobs` | Unified list page. Tab via `?tab=private \| government \| ai` (default `private`) |
| `/jobs/[category]/[jobSlug]` | Job detail page. `category ∈ { private, government }`. `jobSlug = "<title-slug>-<jobs.short_id>"` |
| `/jobs/private`, `/jobs/government` | 308 redirect → `/jobs?tab=...` (preserve old links/SEO) |
| `/sitemap.xml`, `/robots.txt` | Auto-generated, includes every active job |

**Filter / state params** (all URL-synced, shareable, back/forward safe):

```
/jobs?tab=ai
     &q=react+developer
     &loc=bangalore
     &exp_min=2&exp_max=5
     &sal_min=1000000
     &mode=remote
     &type=full_time
     &posted=7d
     &skills=react,node
     &sort=match           # relevance | newest | salary | deadline | match
     &page=2
```

**Detail-page state params** (so applied/saved status survives reload + share):

```
/jobs/private/senior-react-developer-axb12c?applied=1
/jobs/private/senior-react-developer-axb12c?saved=1
/jobs/private/senior-react-developer-axb12c?ref=email_alert_42
```

`applied=1` and `saved=1` are read on mount and reconciled with `job_applications` / `saved_jobs`. `ref=...` is logged for analytics (used by alert emails, AI tab, similar-jobs links).

---

## 2. Card design — exact spec

**Reuse the hero card** in [HeroSection.jsx:179-204](client/src/components/home/HeroSection.jsx#L179-L204) as the visual contract. Tokens lifted from hero so the page feels native:

| Token | Value |
|---|---|
| Page background | `bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50` |
| Card surface | `bg-white rounded-2xl border border-slate-100 shadow-xl shadow-blue-900/10` |
| Card hover | `hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-blue-900/15 transition` |
| Logo tile | `w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold` |
| Primary text | `text-slate-900 font-semibold` |
| Secondary text | `text-slate-500` / `text-slate-600` |
| Skill chips | `text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600` |
| "New" / status pill | `bg-emerald-50 text-emerald-600` |
| Featured pill | `bg-amber-50 text-amber-700` (matches hero amber accent) |
| Match-score badge | `bg-blue-50 text-blue-700` (e.g. `87% match`) |
| Primary CTA | `bg-blue-700 hover:bg-blue-800 text-white rounded-xl` |
| Save (bookmark) | outline icon → fills `text-amber-500` when saved |
| Salary line | `text-sm font-semibold text-slate-900` |

**Layout (minimal — for the list view):**

```
┌──────────────────────────────────────────────────┐
│  [Logo] Title                       [New] [♥]    │
│         Company · Location                       │
│                                                  │
│  💼 Full-time   🏠 Remote   ⏱ 3+ yrs            │
│                                                  │
│  [React] [Node.js] [AWS] +2 more                 │
│                                                  │
│  ₹18–28 LPA          Posted 2d · ⏰ 5d left     │
│                                                  │
│  ──────────────────────────────────────────────  │
│  [Apply Now]   [View Details →]    87% match     │
└──────────────────────────────────────────────────┘
```

Only what's listed above shows on the card. Everything else (description, full skill list, requirements, JD body, recruiter info, similar jobs) lives on the detail page. This keeps the card scannable and chatbot-popup-friendly later.

**Card variants** — same component, prop-driven:
- `default` — list page
- `compact` — chatbot popup, dashboard widget, sidebar
- `featured` — adds amber gradient ring + "Featured" pill
- `recruiter` — adds Edit / Close / View applicants (used in `/recruiter/dashboard`)
- `admin` — adds Approve / Reject (used in `/admin/dashboard` queue)
- `mini` — even smaller, for navbar dropdown / saved-jobs sidebar

**Mobile responsiveness:**
- 1 column < 640px, 2 cols 640-1023px, 3 cols ≥ 1024px (grid auto).
- Filters collapse into a bottom-sheet drawer on mobile (`<Dialog>` with slide-up, scroll-locked).
- Tabs collapse into a `<select>` dropdown < 640px (matches user's "dropdown" requirement).
- Sticky search bar at top of mobile list view.
- Tap targets ≥ 44px on all interactive elements; haptic-style press feedback via `active:scale-[0.98]`.

**Click target:** the entire card is a `<Link href="/jobs/[category]/[slug]">` wrapper; `Apply` and `Save` buttons use `e.stopPropagation()` so they don't trigger navigation.

---

## 3. Detail page

Route: `/jobs/[category]/[jobSlug]` — Server Component, fetched at request time, statically cached per slug for 5 minutes (`revalidate = 300`) with on-demand revalidation when the recruiter edits the job.

**Sections (top → bottom):**
1. Sticky header: title + company + location + Apply/Save buttons.
2. Quick facts strip: experience, salary, mode, type, openings, deadline, posted date.
3. About the role (description, formatted Markdown).
4. Requirements & responsibilities.
5. Skills, qualifications, benefits.
6. Government meta block (only when `category=government`): organization, notification number, exam date, age limits, fees, official notification PDF link.
7. About the company (logo, size, industry, link to all jobs at company).
8. **AI section (gated behind login)**: match score, matched-skills chips, missing-skills chips, 2-bullet "Why you match".
9. Similar jobs (vector kNN, top 6).
10. FAQ (auto-generated → also rendered as `FAQPage` JSON-LD; see §5).
11. Apply CTA + share row.

**Apply behavior** (driven by `apply_mode`):
- `internal` → modal form, on success inserts into `job_applications`, page reloads with `?applied=1`, button toggles to "Applied ✓ View status".
- `external` → opens `apply_url` in a new tab, records an outbound-click row in `job_applications` so dashboards stay coherent.
- `email` → `mailto:apply_email` with prefilled subject/body.
- `phone` → `tel:apply_phone` link with confirmation.

**Per-job AI Assistant button:**
- Button labeled **"Prepare for this role"** (sparkle icon) sits beside Apply.
- On click, opens a slide-over panel that shows a roadmap keyed off `jobs.id`:
  1. Skill gap analysis (matched / missing skills vs the JD).
  2. Week-by-week study plan (LLM-generated, cached).
  3. Recommended resources (docs, courses, projects).
  4. Mock-interview question pack.
  5. Resume tailoring tips for this JD.
  6. Final checklist before applying.
- Stored in `job_assistant_roadmaps` (§6.9). First click triggers generation; subsequent clicks read from cache. Re-generate option (rate-limited).
- Available to logged-in candidates only. Shows "Sign in to unlock" CTA otherwise.

---

## 4. AI / chatbot future hook (designed in now, built later)

Architecture so it slots in with **zero schema change**:

- All filters live in a single `JobFilters` object (URL-encoded).
- The chatbot will produce that exact same `JobFilters` object from natural language. So the chatbot is just another *input* into the existing query layer.
- The popup will reuse `JobCard` with `variant="compact"`. No fork.
- Conversation state lives in `chat_sessions` + `chat_messages` (tables in §6.7) — added now so we don't have to migrate later.
- A server endpoint `POST /api/jobs/search` accepts `{ filters, query, userId }` and returns `{ jobs, appliedFilters, suggestedFilters }`. Both the page UI and the future chatbot hit the same endpoint.

This means: when we add the chatbot, the *only* new code is the chat UI + a thin LLM-to-filters parser. Everything else is already there.

---

## 5. SEO / AEO / GEO — full coverage

A job board lives or dies on this. Implemented in three layers.

### 5.1 Per-page SEO (auto, derived from `jobs` row)

`app/jobs/[category]/[jobSlug]/page.js` exports `generateMetadata`:

```js
export async function generateMetadata({ params }) {
  const job = await getJobBySlug(params.category, params.jobSlug)
  if (!job) return { title: 'Job not found' }

  const title = `${job.title} at ${job.company_name} – ${job.location_city || 'India'} | MyTechz`
  const description = stripMarkdown(job.description).slice(0, 155)

  return {
    title,
    description,
    alternates: {
      canonical: `https://mytechz.in/jobs/${params.category}/${params.jobSlug}`,
    },
    openGraph: {
      title, description,
      type: 'website',
      url: `https://mytechz.in/jobs/${params.category}/${params.jobSlug}`,
      images: [{ url: job.og_image_url || generateOgImageUrl(job) }],
    },
    twitter: { card: 'summary_large_image', title, description },
    robots: job.status === 'active'
      ? { index: true, follow: true }
      : { index: false, follow: false },
    other: {
      // GEO hints (see 5.4)
      'geo.region': job.location_country_code || 'IN',
      'geo.placename': job.location_city || '',
      'geo.position': job.geo_lat && job.geo_lng ? `${job.geo_lat};${job.geo_lng}` : '',
      'ICBM': job.geo_lat && job.geo_lng ? `${job.geo_lat}, ${job.geo_lng}` : '',
    },
  }
}
```

### 5.2 Structured data — `JobPosting` JSON-LD (mandatory for Google Jobs)

Injected via `<script type="application/ld+json">` on every detail page:

```json
{
  "@context": "https://schema.org/",
  "@type": "JobPosting",
  "title": "Senior React Developer",
  "description": "<full HTML description>",
  "identifier": { "@type": "PropertyValue", "name": "MyTechz", "value": "<jobs.short_id>" },
  "datePosted": "2026-04-30",
  "validThrough": "2026-05-30T23:59",
  "employmentType": "FULL_TIME",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Acme Corp",
    "sameAs": "https://acme.example",
    "logo": "https://cdn.mytechz.in/logos/acme.png"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Bengaluru",
      "addressRegion": "KA",
      "postalCode": "560001",
      "addressCountry": "IN"
    }
  },
  "jobLocationType": "TELECOMMUTE",          // when remote
  "applicantLocationRequirements": { "@type": "Country", "name": "IN" },
  "baseSalary": {
    "@type": "MonetaryAmount",
    "currency": "INR",
    "value": { "@type": "QuantitativeValue", "minValue": 1800000, "maxValue": 2800000, "unitText": "YEAR" }
  },
  "directApply": true,
  "experienceRequirements": {
    "@type": "OccupationalExperienceRequirements",
    "monthsOfExperience": 36
  },
  "qualifications": "B.E. / B.Tech in CS or related",
  "skills": "React, Node.js, AWS"
}
```

The `validThrough` is `application_deadline`; if null, default to `posted_at + 30 days`.

Also emit:
- `BreadcrumbList` (Home › Jobs › Private › Senior React Developer).
- `FAQPage` for the FAQ block (AEO — answer-engine optimization; AI assistants pick this up).
- `Organization` site-wide (in root layout).

### 5.3 AEO — Answer Engine Optimization

To get cited by ChatGPT / Perplexity / Gemini / Google AI Overviews:

- **Auto-generate a FAQ** per job (cached): "What is the salary for X?", "Is X remote?", "What experience is needed for X at Acme?". Render as visible HTML *and* `FAQPage` JSON-LD.
- **Concise summary block** at the very top of the description (~50 words, plain text). Answer engines lift these.
- **Stable canonical URLs** with semantic slugs (`senior-react-developer-axb12c`) — answer engines cite slugs, not query strings.
- **Citations file** `/.well-known/ai.txt` declaring crawl permissions for AI bots.
- **Sitemap** lists all active jobs with `<lastmod>` and `<priority>`.
- **No content cloaking** — same HTML to bots and users.
- **Author / publisher byline** on detail page → matched by `Organization` schema.

### 5.4 GEO — Geographic / location SEO

- Slug includes city when available: `senior-react-developer-bengaluru-axb12c`.
- `jobs` row stores `geo_lat`, `geo_lng`, `location_country_code`, `location_state_code` (added in §6.2) → fed into JSON-LD `PostalAddress` and `geo.*` meta tags.
- Per-city landing pages future-ready: `/jobs/in/[city]` (not built yet, but `jobs.location_city` is indexed so it's a drop-in).
- `hreflang="en-IN"` in root layout; add additional locales later via `alternates.languages`.
- Submit `IndexNow` ping to Bing/Yandex on job insert/update for faster indexation.
- Submit Google Indexing API ping for `JobPosting` insert/update (Google's preferred path for jobs).

### 5.5 Robots & sitemaps

- `app/robots.js` (Next dynamic): allow all, disallow `/admin`, `/recruiter`, `/api`, `/auth/*`, `/my-applications`, `/saved-jobs`, `/dashboard`, `/profile`, `/settings`. Reference the sitemap.
- `app/sitemap.js` (Next dynamic): static routes + every `jobs` row where `status='active'`. Split into `sitemap-jobs.xml` (one per 50k jobs).
- `app/jobs/[category]/[jobSlug]/opengraph-image.js` to generate per-job OG images (1200×630 with title + company + salary + logo).

### 5.6 Indexation hygiene

| State | Behavior |
|---|---|
| `status='active'` | Indexable, in sitemap, JSON-LD emitted |
| `status='closed' \| 'expired'` | `<meta name="robots" content="noindex, follow">`, removed from sitemap, JSON-LD `validThrough` left so Google can de-list, soft 404 avoided |
| `status='draft' \| 'pending_approval' \| 'rejected'` | 404 to public, 200 only for `posted_by` and admin |

A weekly cron (`/api/cron/expire-jobs`) flips `status` to `expired` once `application_deadline` passes and pings Google Indexing API for removal.

---

## 6. Schema (SQL) — additions to MyTechz Supabase

> Apply in order. Each block = one timestamped file under `client/migrations/`.

Common preamble (run once):

```sql
create extension if not exists pg_trgm;
create extension if not exists vector;
create extension if not exists unaccent;
```

### 6.1 `companies`

```sql
-- 20260430120000_companies.sql
create table public.companies (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  logo_url      text,
  website       text,
  industry      text,
  size          text check (size in ('1-10','11-50','51-200','201-1000','1001-5000','5000+')),
  hq_location   text,
  about         text,
  is_verified   boolean not null default false,
  created_by    uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index companies_name_trgm on public.companies using gin (name gin_trgm_ops);

alter table public.companies enable row level security;
create policy companies_read_all       on public.companies for select using (true);
create policy companies_insert_auth    on public.companies for insert with check (auth.uid() is not null);
create policy companies_update_own     on public.companies for update using (created_by = auth.uid() or public.is_admin());

grant select on public.companies to anon, authenticated;
grant insert, update on public.companies to authenticated;
```

### 6.2 `jobs` (single table for private + government)

```sql
-- 20260430120001_jobs.sql
create type public.job_category as enum ('private','government');
create type public.job_type     as enum ('full_time','part_time','internship','contract','temporary');
create type public.work_mode    as enum ('remote','hybrid','onsite');
create type public.apply_mode   as enum ('internal','external','email','phone');
create type public.job_status   as enum ('draft','pending_approval','active','closed','expired','rejected');

create table public.jobs (
  id                    uuid primary key default gen_random_uuid(),
  short_id              text not null unique default substr(replace(gen_random_uuid()::text, '-', ''), 1, 6),
  slug                  text not null unique,           -- "senior-react-developer-bengaluru-axb12c"

  title                 text not null,
  description           text not null,                  -- Markdown
  summary               text,                           -- ~50-word AEO summary, auto-generated
  category              public.job_category not null,
  job_type              public.job_type not null default 'full_time',
  work_mode             public.work_mode not null default 'onsite',

  company_id            uuid references public.companies(id) on delete set null,
  posted_by             uuid not null references auth.users(id) on delete cascade,

  -- location (GEO)
  location_city         text,
  location_state        text,
  location_state_code   text,
  location_country      text default 'India',
  location_country_code text default 'IN',
  geo_lat               numeric(9,6),
  geo_lng               numeric(9,6),
  is_multi_location     boolean not null default false,
  locations             text[] default '{}',

  -- compensation
  salary_min            numeric(12,2),
  salary_max            numeric(12,2),
  salary_currency       text default 'INR',
  salary_period         text default 'year' check (salary_period in ('year','month','hour')),
  is_salary_disclosed   boolean not null default true,

  -- experience & openings
  experience_min        numeric(4,1) default 0,
  experience_max        numeric(4,1),
  openings              int not null default 1,
  openings_filled       int not null default 0,

  -- dates
  posted_at             timestamptz not null default now(),
  job_start_date        date,
  application_deadline  date,

  -- taxonomy
  skills                text[] not null default '{}',
  qualifications        text[] default '{}',
  department            text,
  industry              text,
  benefits              text[] default '{}',

  -- apply
  apply_mode            public.apply_mode not null default 'internal',
  apply_url             text,
  apply_email           text,
  apply_phone           text,

  -- gov-only
  government_meta       jsonb,

  -- moderation
  status                public.job_status not null default 'pending_approval',
  reviewed_by           uuid references auth.users(id) on delete set null,
  reviewed_at           timestamptz,
  rejection_reason      text,

  -- engagement
  views_count           int not null default 0,
  applications_count    int not null default 0,
  is_featured           boolean not null default false,
  is_urgent             boolean not null default false,

  -- SEO / AEO
  meta_title            text,                           -- override; else generated
  meta_description      text,                           -- override; else first 155 chars of summary
  og_image_url          text,                           -- override; else generated by /opengraph-image
  faq                   jsonb,                          -- [{ q, a }, ...] auto-generated, cached

  -- AI
  embedding             vector(1536),

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  constraint jobs_salary_chk     check (salary_max is null or salary_min is null or salary_max >= salary_min),
  constraint jobs_exp_chk        check (experience_max is null or experience_max >= coalesce(experience_min,0)),
  constraint jobs_external_chk   check (apply_mode <> 'external' or apply_url is not null)
);

create index jobs_status_posted_idx on public.jobs (status, posted_at desc);
create index jobs_category_idx      on public.jobs (category) where status = 'active';
create index jobs_skills_gin        on public.jobs using gin (skills);
create index jobs_title_trgm        on public.jobs using gin (title gin_trgm_ops);
create index jobs_city_idx          on public.jobs (location_city) where status = 'active';
create index jobs_posted_by_idx     on public.jobs (posted_by);
create index jobs_embedding_idx     on public.jobs using ivfflat (embedding vector_cosine_ops) with (lists = 100);

alter table public.jobs enable row level security;
create policy jobs_public_read_active on public.jobs for select using (status = 'active');
create policy jobs_recruiter_own      on public.jobs for all    using (posted_by = auth.uid()) with check (posted_by = auth.uid());
create policy jobs_admin_all          on public.jobs for all    using (public.is_admin())      with check (public.is_admin());

grant select on public.jobs to anon, authenticated;
grant insert, update, delete on public.jobs to authenticated;
```

### 6.3 `skills` + `job_skills`

```sql
-- 20260430120002_job_skills.sql
create table public.skills (
  id      uuid primary key default gen_random_uuid(),
  name    text not null unique,
  slug    text not null unique,
  aliases text[] default '{}'
);

create table public.job_skills (
  job_id   uuid not null references public.jobs(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  primary key (job_id, skill_id)
);

create index job_skills_skill_idx on public.job_skills (skill_id);

alter table public.skills     enable row level security;
alter table public.job_skills enable row level security;
create policy skills_read_all     on public.skills     for select using (true);
create policy job_skills_read_all on public.job_skills for select using (true);
create policy skills_admin_write  on public.skills     for all    using (public.is_admin()) with check (public.is_admin());
create policy job_skills_recruiter on public.job_skills for all
  using     (exists (select 1 from public.jobs j where j.id = job_id and (j.posted_by = auth.uid() or public.is_admin())))
  with check(exists (select 1 from public.jobs j where j.id = job_id and (j.posted_by = auth.uid() or public.is_admin())));

grant select on public.skills, public.job_skills to anon, authenticated;
grant insert, delete on public.job_skills to authenticated;
```

### 6.4 `resumes`

```sql
-- 20260430120003_resumes.sql
create table public.resumes (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references auth.users(id) on delete cascade,
  file_url               text not null,
  file_name              text,
  is_primary             boolean not null default true,

  parsed_name            text,
  parsed_email           text,
  parsed_phone           text,
  parsed_location        text,
  total_experience_years numeric(4,1),
  skills                 text[] default '{}',
  education              jsonb,
  work_history           jsonb,
  raw_text               text,

  embedding              vector(1536),

  uploaded_at            timestamptz not null default now(),
  parsed_at              timestamptz
);

create unique index resumes_one_primary_per_user on public.resumes (user_id) where is_primary;
create index resumes_user_idx      on public.resumes (user_id);
create index resumes_embedding_idx on public.resumes using ivfflat (embedding vector_cosine_ops) with (lists = 100);

alter table public.resumes enable row level security;
create policy resumes_own on public.resumes for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy resumes_recruiter_via_application on public.resumes for select
  using (exists (
    select 1 from public.job_applications a
    join public.jobs j on j.id = a.job_id
    where a.user_id = resumes.user_id and j.posted_by = auth.uid()
  ));

grant select, insert, update, delete on public.resumes to authenticated;
```

### 6.5 `job_match_scores`

```sql
-- 20260430120004_job_match_scores.sql
create table public.job_match_scores (
  user_id     uuid not null references auth.users(id) on delete cascade,
  job_id      uuid not null references public.jobs(id) on delete cascade,
  score       numeric(5,4) not null,
  reasons     jsonb,                                -- { matched_skills, missing_skills, summary }
  computed_at timestamptz not null default now(),
  primary key (user_id, job_id)
);

create index jms_user_score_idx on public.job_match_scores (user_id, score desc);

alter table public.job_match_scores enable row level security;
create policy jms_own_read on public.job_match_scores for select using (user_id = auth.uid());

grant select on public.job_match_scores to authenticated;
-- writes happen via service-role only.
```

### 6.6 `saved_searches`

```sql
-- 20260430120005_saved_searches.sql
create table public.saved_searches (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  filters     jsonb not null,
  alert_email boolean not null default false,
  last_run_at timestamptz,
  created_at  timestamptz not null default now()
);

create index saved_searches_user_idx on public.saved_searches (user_id);

alter table public.saved_searches enable row level security;
create policy saved_searches_own on public.saved_searches for all using (user_id = auth.uid()) with check (user_id = auth.uid());

grant select, insert, update, delete on public.saved_searches to authenticated;
```

### 6.7 `chat_sessions` + `chat_messages` (future chatbot — added now)

```sql
-- 20260430120006_chat.sql
create table public.chat_sessions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade,   -- nullable: guests too
  created_at timestamptz not null default now(),
  ended_at   timestamptz
);

create table public.chat_messages (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.chat_sessions(id) on delete cascade,
  role        text not null check (role in ('user','assistant','system','tool')),
  content     text not null,
  filters     jsonb,                       -- structured filters the assistant produced
  job_ids     uuid[] default '{}',         -- jobs surfaced in the reply
  created_at  timestamptz not null default now()
);

create index chat_messages_session_idx on public.chat_messages (session_id, created_at);

alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
create policy chat_sessions_own on public.chat_sessions for all
  using (user_id = auth.uid() or user_id is null) with check (user_id = auth.uid() or user_id is null);
create policy chat_messages_own on public.chat_messages for all
  using (exists (select 1 from public.chat_sessions s where s.id = session_id and (s.user_id = auth.uid() or s.user_id is null)))
  with check (exists (select 1 from public.chat_sessions s where s.id = session_id and (s.user_id = auth.uid() or s.user_id is null)));

grant select, insert, update on public.chat_sessions, public.chat_messages to anon, authenticated;
```

### 6.8 `job_assistant_roadmaps`

```sql
-- 20260430120008_job_assistant_roadmaps.sql
create table public.job_assistant_roadmaps (
  id           uuid primary key default gen_random_uuid(),
  job_id       uuid not null references public.jobs(id) on delete cascade,
  user_id      uuid references auth.users(id) on delete cascade,  -- nullable: generic per-job roadmap
  roadmap      jsonb not null,                                     -- { skills_gap, weeks, resources, questions, resume_tips, checklist }
  generated_at timestamptz not null default now(),
  unique (job_id, user_id)
);

create index jar_job_idx  on public.job_assistant_roadmaps (job_id);
create index jar_user_idx on public.job_assistant_roadmaps (user_id);

alter table public.job_assistant_roadmaps enable row level security;

-- generic per-job roadmap (user_id null) is public-readable
create policy jar_public_read_generic on public.job_assistant_roadmaps for select
  using (user_id is null);
-- personal roadmap visible to owner
create policy jar_own on public.job_assistant_roadmaps for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

grant select on public.job_assistant_roadmaps to anon, authenticated;
grant insert, update on public.job_assistant_roadmaps to authenticated;
```

### 6.9 Link existing `job_applications` to `jobs`

```sql
-- 20260430120007_link_job_applications.sql
alter table public.job_applications
  add column if not exists job_id uuid references public.jobs(id) on delete set null;

create index if not exists job_applications_job_idx on public.job_applications (job_id);

create or replace function public.bump_job_applications_count()
returns trigger language plpgsql as $$
begin
  if (tg_op = 'INSERT' and new.job_id is not null) then
    update public.jobs set applications_count = applications_count + 1 where id = new.job_id;
  elsif (tg_op = 'DELETE' and old.job_id is not null) then
    update public.jobs set applications_count = greatest(applications_count - 1, 0) where id = old.job_id;
  end if;
  return null;
end $$;

create trigger job_applications_count_trg
after insert or delete on public.job_applications
for each row execute function public.bump_job_applications_count();
```

---

## 7. Component tree

```
src/components/jobs/
  JobsPage.jsx              ← only smart component on /jobs
  JobsTabs.jsx              ← Private | Government | AI Featured
  JobsSearchBar.jsx         ← keyword + location + (AI tab) NL prompt
  JobsFilters.jsx           ← shared facet sidebar
  AIFiltersPanel.jsx        ← extra: resume picker, "match >= X%", "for you"
  ActiveFilterChips.jsx
  JobsSortDropdown.jsx
  JobCardGrid.jsx           ← grid + skeletons + empty + pagination
  JobCard.jsx               ← presentation, variant-aware (default|compact|featured|recruiter|admin)
  JobCardSkeleton.jsx
  ApplyButton.jsx           ← reuses APPLY_BUTTON_STATE_FEATURE.md logic
  SaveJobButton.jsx
  MatchScoreBadge.jsx
  ResumeUploadCTA.jsx
  ChatbotJobsPopup.jsx      ← STUB now, wired later — already imports JobCard

src/components/jobs/detail/
  JobDetailHeader.jsx
  JobQuickFacts.jsx
  JobDescription.jsx
  GovernmentMetaBlock.jsx
  CompanyAboutBlock.jsx
  JobAIInsightBlock.jsx
  SimilarJobs.jsx
  JobFAQ.jsx
  JobApplyModal.jsx
  JobJsonLd.jsx             ← emits JobPosting + Breadcrumb + FAQ
```

---

## 8. Role / RLS matrix

| Action | Candidate | Recruiter | Admin |
|---|---|---|---|
| Read active jobs | ✅ | ✅ + own drafts | ✅ all |
| Create job | ❌ | ✅ → `pending_approval` | ✅ → `active` |
| Edit / close own | ❌ | ✅ | ✅ any |
| Approve / reject | ❌ | ❌ | ✅ |
| Apply | ✅ | ❌ | ❌ |
| Save | ✅ | ❌ | ❌ |
| Read resumes | own only | only of applicants to their jobs | all |
| Read match scores | own only | ❌ | (service role) |
| Read chat history | own session | ❌ | ❌ |

All enforced via RLS in §6.

---

## 9. Implementation order (precise)

1. Run extensions: `pg_trgm`, `vector`, `unaccent`.
2. Apply migrations 6.1 → 6.8 to MyTechz Supabase (`aiycgmrubisaxknbeaov`).
3. Add `lib/jobs/queries.js` — `getJobs(filters)`, `getJobBySlug(category, slug)`, `getSimilarJobs(jobId)`, `getMatchScore(userId, jobId)`. Single source of truth.
4. Build `JobCard` + skeleton + grid using mock data; visual parity with hero card.
5. Build `JobsPage` with tabs + URL-synced filters; wire to `getJobs`.
6. Add `app/jobs/[category]/[jobSlug]/page.js` server component with `generateMetadata` + `JobJsonLd`.
7. Add `app/sitemap.js` + `app/robots.js` + `app/jobs/[category]/[jobSlug]/opengraph-image.js`.
8. Wire Save / Apply to existing `saved_jobs` / `job_applications`; reflect state via URL params.
9. Recruiter post-job form → defaults to `pending_approval`.
10. Admin approval queue (mirror recruiter-verify pattern).
11. Resume upload + parser → `resumes` row + embedding.
12. Match-score worker (server-only) → `job_match_scores`.
13. AI tab uses `job_match_scores` to rank.
14. Auto-generate `summary` + `faq` on job insert/update via edge function.
15. IndexNow + Google Indexing API pings on job insert/update/expire.
16. Cron `/api/cron/expire-jobs` — flips status, pings de-list.
17. Chatbot popup (stub to live): reuse `JobCard`, hits the same `/api/jobs/search`.

---

## 10. Open decisions before coding

- **Embedding model** — `text-embedding-3-small` (1536) recommended; once chosen, never change without re-embedding.
- **Resume parser** — start with LLM extraction; swap for affinda only if cost forces it.
- **Match-score refresh** — on resume update (top 200 jobs) + on new job insert (active resumes, batched edge function).
- **Government apply flow** — almost always `apply_mode='external'`; confirm before forcing internal.
- **Old routes** — 308 redirect (preserves SEO juice), do not delete.
- **OG image generation** — Next 16 dynamic OG via `opengraph-image.js`; cached at the edge.
- **`mytechz.in` vs `mytechz.com`** — confirm canonical host before hardcoding in metadata.

---

## 11. What this plan deliberately does NOT do

- No writes to Supabase-GS / Google Studio.
- No edits to existing `saved_jobs`, `user_profiles`, `recruiter_profiles`, `admin_whitelist`.
- No code yet — schema, components, SEO/AEO/GEO contract only. Implementation starts after approval.
