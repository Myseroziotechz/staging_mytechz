-- ============================================================================
-- Migration: Profile section tables for Education, Projects, Internships, Languages
-- ============================================================================
-- Create tables needed by the Profile module sections.
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================================

-- ---- user_education ---------------------------------------------------------
create table if not exists public.user_education (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users(id) on delete cascade,
  degree             text not null default '',
  institution        text not null default '',
  field_of_study     text default '',
  start_month        text default '',
  start_year         text default '',
  end_month          text default '',
  end_year           text default '',
  currently_studying boolean not null default false,
  cgpa               text default '',
  description        text default '',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists user_education_user_idx on public.user_education (user_id);

alter table public.user_education enable row level security;

drop policy if exists user_education_select_own on public.user_education;
drop policy if exists user_education_insert_own on public.user_education;
drop policy if exists user_education_update_own on public.user_education;
drop policy if exists user_education_delete_own on public.user_education;

create policy user_education_select_own on public.user_education for select
  using (auth.uid() = user_id);
create policy user_education_insert_own on public.user_education for insert
  with check (auth.uid() = user_id);
create policy user_education_update_own on public.user_education for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy user_education_delete_own on public.user_education for delete
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.user_education to authenticated;

-- ---- user_projects ----------------------------------------------------------
create table if not exists public.user_projects (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  title             text not null default '',
  organization      text default '',
  description       text default '',
  skills_used       text default '',
  project_url       text default '',
  github_url        text default '',
  start_month       text default '',
  start_year        text default '',
  end_month         text default '',
  end_year          text default '',
  currently_working boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists user_projects_user_idx on public.user_projects (user_id);

alter table public.user_projects enable row level security;

drop policy if exists user_projects_select_own on public.user_projects;
drop policy if exists user_projects_insert_own on public.user_projects;
drop policy if exists user_projects_update_own on public.user_projects;
drop policy if exists user_projects_delete_own on public.user_projects;

create policy user_projects_select_own on public.user_projects for select
  using (auth.uid() = user_id);
create policy user_projects_insert_own on public.user_projects for insert
  with check (auth.uid() = user_id);
create policy user_projects_update_own on public.user_projects for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy user_projects_delete_own on public.user_projects for delete
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.user_projects to authenticated;

-- ---- user_internships -------------------------------------------------------
create table if not exists public.user_internships (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  company           text not null default '',
  role              text not null default '',
  location          text default '',
  employment_type   text default '',
  start_month       text default '',
  start_year        text default '',
  end_month         text default '',
  end_year          text default '',
  currently_working boolean not null default false,
  description       text default '',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists user_internships_user_idx on public.user_internships (user_id);

alter table public.user_internships enable row level security;

drop policy if exists user_internships_select_own on public.user_internships;
drop policy if exists user_internships_insert_own on public.user_internships;
drop policy if exists user_internships_update_own on public.user_internships;
drop policy if exists user_internships_delete_own on public.user_internships;

create policy user_internships_select_own on public.user_internships for select
  using (auth.uid() = user_id);
create policy user_internships_insert_own on public.user_internships for insert
  with check (auth.uid() = user_id);
create policy user_internships_update_own on public.user_internships for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy user_internships_delete_own on public.user_internships for delete
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.user_internships to authenticated;

-- ---- user_languages ---------------------------------------------------------
create table if not exists public.user_languages (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  language    text not null default '',
  proficiency text not null default 'Beginner' check (proficiency in ('Beginner', 'Intermediate', 'Professional', 'Native')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists user_languages_user_idx on public.user_languages (user_id);

alter table public.user_languages enable row level security;

drop policy if exists user_languages_select_own on public.user_languages;
drop policy if exists user_languages_insert_own on public.user_languages;
drop policy if exists user_languages_update_own on public.user_languages;
drop policy if exists user_languages_delete_own on public.user_languages;

create policy user_languages_select_own on public.user_languages for select
  using (auth.uid() = user_id);
create policy user_languages_insert_own on public.user_languages for insert
  with check (auth.uid() = user_id);
create policy user_languages_update_own on public.user_languages for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy user_languages_delete_own on public.user_languages for delete
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.user_languages to authenticated;
