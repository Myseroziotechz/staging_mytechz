-- ============================================================
-- ATS Resume Analyzer — Supabase Migration
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- Table 1: resume_analysis_jobs
create table if not exists resume_analysis_jobs (
  id                      bigserial primary key,
  user_id                 uuid not null references auth.users(id) on delete cascade,

  file_name               text not null,
  file_path               text,                          -- Supabase Storage path
  file_type               text not null check (file_type in ('pdf','docx','doc','txt')),
  file_size_bytes         int,

  extracted_text          text default '',
  selected_job_roles      jsonb default '[]',            -- ["Software Engineer"]
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

create index if not exists raj_user_created_idx on resume_analysis_jobs(user_id, created_at desc);
create index if not exists raj_status_idx        on resume_analysis_jobs(status);

-- RLS
alter table resume_analysis_jobs enable row level security;

create policy "Users can read own analyses"
  on resume_analysis_jobs for select
  using (auth.uid() = user_id);

create policy "Users can insert own analyses"
  on resume_analysis_jobs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own analyses"
  on resume_analysis_jobs for update
  using (auth.uid() = user_id);

create policy "Users can delete own analyses"
  on resume_analysis_jobs for delete
  using (auth.uid() = user_id);


-- Table 2: resume_section_results
create table if not exists resume_section_results (
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

create index if not exists rsr_analysis_idx on resume_section_results(analysis_id);

alter table resume_section_results enable row level security;
create policy "Users access own section results"
  on resume_section_results for all
  using (
    analysis_id in (
      select id from resume_analysis_jobs where user_id = auth.uid()
    )
  );


-- Table 3: resume_keyword_results
create table if not exists resume_keyword_results (
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

create index if not exists rkr_analysis_present_idx on resume_keyword_results(analysis_id, is_present);
create index if not exists rkr_analysis_type_idx    on resume_keyword_results(analysis_id, keyword_type);

alter table resume_keyword_results enable row level security;
create policy "Users access own keyword results"
  on resume_keyword_results for all
  using (
    analysis_id in (
      select id from resume_analysis_jobs where user_id = auth.uid()
    )
  );


-- Table 4: resume_insights
create table if not exists resume_insights (
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

create index if not exists ri_analysis_type_idx     on resume_insights(analysis_id, insight_type);
create index if not exists ri_analysis_priority_idx on resume_insights(analysis_id, priority desc);

alter table resume_insights enable row level security;
create policy "Users access own insights"
  on resume_insights for all
  using (
    analysis_id in (
      select id from resume_analysis_jobs where user_id = auth.uid()
    )
  );


-- ============================================================
-- Storage bucket for uploaded resume files
-- Run in Supabase Dashboard → Storage → New Bucket
-- Or via this SQL (requires storage extension):
-- ============================================================
-- insert into storage.buckets (id, name, public)
-- values ('resume-analyses', 'resume-analyses', false)
-- on conflict do nothing;

-- Storage RLS (if using Supabase Storage):
-- create policy "Users upload own resumes"
--   on storage.objects for insert
--   with check (bucket_id = 'resume-analyses' and auth.uid()::text = (storage.foldername(name))[1]);
-- create policy "Users read own resumes"
--   on storage.objects for select
--   using (bucket_id = 'resume-analyses' and auth.uid()::text = (storage.foldername(name))[1]);
