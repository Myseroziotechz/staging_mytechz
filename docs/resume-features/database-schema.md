# Database Schema — Resume & ATS Tables (Archived)

These tables were dropped from the MyTechZ Supabase database in June 2026.

## Tables Dropped

### 1. `resume_documents`
Resume builder documents (one row per saved resume).

```sql
create table resume_documents (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  title         text not null default 'Untitled Resume',
  template_slug text not null default 'classic',
  resume_data   jsonb not null default '{}',
  status        text default 'draft',
  is_primary    boolean default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
-- RLS: users can only access their own rows
```

**resume_data JSONB shape:**
```json
{
  "basics": { "name": "", "email": "", "phone": "", "location": "", "linkedin": "", "github": "" },
  "summary": "",
  "experience": [{ "company": "", "role": "", "start": "", "end": "", "current": false, "bullets": [] }],
  "education": [{ "institution": "", "degree": "", "field": "", "start": "", "end": "" }],
  "skills": [],
  "projects": [{ "name": "", "description": "", "url": "", "bullets": [] }]
}
```

---

### 2. `resume_analysis_jobs`
Parent table for ATS analysis runs.

```sql
create table resume_analysis_jobs (
  id                      bigserial primary key,
  user_id                 uuid not null references auth.users(id) on delete cascade,
  file_name               text not null,
  file_path               text,
  file_type               text not null check (file_type in ('pdf','docx','doc','txt')),
  file_size_bytes         int,
  extracted_text          text default '',
  selected_job_roles      jsonb default '[]',
  detected_job_role       text default '',
  ats_score               numeric(5,2) default 0,
  keyword_score           numeric(5,2) default 0,
  section_score           numeric(5,2) default 0,
  format_score            numeric(5,2) default 0,
  action_verb_score       numeric(5,2) default 0,
  quantification_score    numeric(5,2) default 0,
  readability_score       numeric(5,2) default 0,
  total_keywords_found    int default 0,
  total_keywords_expected int default 0,
  total_sections_present  smallint default 0,
  total_sections_expected smallint default 9,
  edited_text             text,
  edited_ats_score        numeric(5,2),
  last_edited_at          timestamptz,
  status                  text default 'completed' check (status in ('pending','processing','completed','failed')),
  error_message           text default '',
  created_at              timestamptz default now(),
  completed_at            timestamptz,
  updated_at              timestamptz default now()
);
create index raj_user_created_idx on resume_analysis_jobs(user_id, created_at desc);
create index raj_status_idx        on resume_analysis_jobs(status);
-- RLS: users can CRUD their own rows
```

---

### 3. `resume_section_results`
Section-level analysis results (9 sections per analysis).

```sql
create table resume_section_results (
  id             bigserial primary key,
  analysis_id    bigint not null references resume_analysis_jobs(id) on delete cascade,
  section_name   text not null check (section_name in (
                   'contact','summary','experience','education',
                   'skills','certifications','projects','achievements','languages'
                 )),
  is_present     boolean default false,
  strength_score numeric(5,2) default 0,
  word_count     int default 0,
  char_count     int default 0,
  bullet_count   smallint default 0,
  feedback       text default '',
  char_start     int,
  char_end       int,
  created_at     timestamptz default now(),
  unique (analysis_id, section_name)
);
create index rsr_analysis_idx on resume_section_results(analysis_id);
-- RLS: users access via parent analysis ownership
```

---

### 4. `resume_keyword_results`
Per-keyword match results for each analysis.

```sql
create table resume_keyword_results (
  id               bigserial primary key,
  analysis_id      bigint not null references resume_analysis_jobs(id) on delete cascade,
  keyword          text not null,
  keyword_type     text not null check (keyword_type in (
                     'hard_skill','soft_skill','tool','action_verb','industry_term','certification'
                   )),
  job_role_context text default '',
  is_present       boolean default false,
  frequency        smallint default 0,
  importance_level text default 'required' check (importance_level in ('required','preferred','bonus')),
  importance_score numeric(5,2) default 0,
  found_in_sections jsonb default '[]',
  context_snippet  text default '',
  char_positions   jsonb default '[]',
  created_at       timestamptz default now()
);
create index rkr_analysis_present_idx on resume_keyword_results(analysis_id, is_present);
create index rkr_analysis_type_idx    on resume_keyword_results(analysis_id, keyword_type);
-- RLS: users access via parent analysis ownership
```

---

### 5. `resume_insights`
AI-generated insights (strengths, weaknesses, suggestions) per analysis.

```sql
create table resume_insights (
  id             bigserial primary key,
  analysis_id    bigint not null references resume_analysis_jobs(id) on delete cascade,
  insight_type   text not null check (insight_type in ('strength','weakness','suggestion')),
  category       text default '' check (category in (
                   '','keyword','format','section','content',
                   'quantification','action_verb','length','readability'
                 )),
  title          text not null,
  description    text default '',
  suggestion     text default '',
  ai_rewrites    jsonb default '[]',
  priority       smallint default 2,
  section_name   text default '',
  char_start     int,
  char_end       int,
  highlight_color text default '' check (highlight_color in ('','red','amber','blue','green')),
  created_at     timestamptz default now()
);
create index ri_analysis_type_idx     on resume_insights(analysis_id, insight_type);
create index ri_analysis_priority_idx on resume_insights(analysis_id, priority desc);
-- RLS: users access via parent analysis ownership
```

---

## Storage Bucket (if created)

Bucket name: `resume-analyses`
Access: Private (user can only read/write their own folder `{user_id}/filename`)

---

## Drop SQL (for reference)

```sql
drop table if exists resume_insights           cascade;
drop table if exists resume_keyword_results    cascade;
drop table if exists resume_section_results    cascade;
drop table if exists resume_analysis_jobs      cascade;
drop table if exists resume_documents          cascade;
delete from storage.objects where bucket_id = 'resume-analyses';
delete from storage.buckets where id = 'resume-analyses';
```
