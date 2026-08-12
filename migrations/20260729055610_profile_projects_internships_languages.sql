-- ============================================================================
-- Migration: projects / internships / languages tables for the Profile module
-- ============================================================================
-- Applied directly to the live project via Supabase MCP (apply_migration) on
-- 2026-07-29; this file mirrors that change for the repo's history. Verified
-- against live schema inspection first — see notes below.
--
-- Context: the Profile module's earlier migration files in this directory
-- (20260622120000_user_profile_fields.sql,
--  20260623000000_profile_education_projects_internships_languages.sql)
-- describe a `user_education` / `user_projects` / `user_internships` /
-- `user_languages` design that was NEVER applied to the live database. What
-- actually exists in production, applied by hand via the SQL editor at some
-- point, is a single `public.education` table (singular, no `user_` prefix)
-- with integer year/month columns and a numeric cgpa — plus `user_profiles`
-- already carrying `profile_summary` as its About field.
--
-- This migration follows that real precedent rather than the unapplied
-- design: singular table names, integer start/end year & month, and RLS
-- policies in the same per-action style already used by `education`.
--
-- Purely additive — no existing table, column, or row is altered or dropped.
-- ============================================================================

-- ---- projects ----------------------------------------------------------------
create table if not exists public.projects (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.user_profiles(id) on delete cascade,
  title              text not null,
  organization       text not null default '',
  description        text,
  skills_used        text[] not null default '{}',
  project_url        text,
  github_url         text,
  start_month        integer,
  start_year         integer not null,
  end_month          integer,
  end_year           integer,
  currently_working  boolean default false,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

alter table public.projects enable row level security;

create policy projects_select_own on public.projects for select
  to authenticated using (auth.uid() = user_id);
create policy projects_insert_own on public.projects for insert
  to authenticated with check (auth.uid() = user_id);
create policy projects_update_own on public.projects for update
  to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy projects_delete_own on public.projects for delete
  to authenticated using (auth.uid() = user_id);

grant select, insert, update, delete on public.projects to authenticated;

create index if not exists projects_user_updated_idx
  on public.projects (user_id, updated_at desc);

create trigger update_projects_updated_at
  before update on public.projects
  for each row execute function public.update_updated_at_column();

-- ---- internships ---------------------------------------------------------------
create table if not exists public.internships (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.user_profiles(id) on delete cascade,
  company            text not null,
  role               text not null,
  location           text default '',
  employment_type    text default '',
  start_month        integer,
  start_year         integer not null,
  end_month          integer,
  end_year           integer,
  currently_working  boolean default false,
  description        text,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

alter table public.internships enable row level security;

create policy internships_select_own on public.internships for select
  to authenticated using (auth.uid() = user_id);
create policy internships_insert_own on public.internships for insert
  to authenticated with check (auth.uid() = user_id);
create policy internships_update_own on public.internships for update
  to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy internships_delete_own on public.internships for delete
  to authenticated using (auth.uid() = user_id);

grant select, insert, update, delete on public.internships to authenticated;

create index if not exists internships_user_updated_idx
  on public.internships (user_id, updated_at desc);

create trigger update_internships_updated_at
  before update on public.internships
  for each row execute function public.update_updated_at_column();

-- ---- languages ------------------------------------------------------------------
create table if not exists public.languages (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.user_profiles(id) on delete cascade,
  language     text not null,
  proficiency  text not null default 'Beginner'
               check (proficiency in ('Beginner', 'Intermediate', 'Professional', 'Native')),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

alter table public.languages enable row level security;

create policy languages_select_own on public.languages for select
  to authenticated using (auth.uid() = user_id);
create policy languages_insert_own on public.languages for insert
  to authenticated with check (auth.uid() = user_id);
create policy languages_update_own on public.languages for update
  to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy languages_delete_own on public.languages for delete
  to authenticated using (auth.uid() = user_id);

grant select, insert, update, delete on public.languages to authenticated;

create index if not exists languages_user_updated_idx
  on public.languages (user_id, updated_at desc);

-- Defense in depth: the app already rejects case-insensitive duplicate
-- languages client- and server-side; this backs it with a DB constraint.
create unique index if not exists languages_user_language_unique
  on public.languages (user_id, lower(language));

create trigger update_languages_updated_at
  before update on public.languages
  for each row execute function public.update_updated_at_column();

-- ---- education: add the index it was missing (PK only, no user_id index) -------
create index if not exists education_user_updated_idx
  on public.education (user_id, updated_at desc);
