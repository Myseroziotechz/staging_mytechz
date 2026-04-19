-- ============================================================================
-- Migration: saved_jobs + job_applications tables for candidate tracking
-- ============================================================================
-- Lightweight Supabase-side tables for tracking saved jobs and applications.
-- These work independently of the Django backend models and power the
-- candidate dashboard stats + /my-applications and /saved-jobs pages.
-- ============================================================================

-- ---- saved_jobs -------------------------------------------------------------
create table public.saved_jobs (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid not null references auth.users(id) on delete cascade,
  job_url      text not null,
  job_title    text not null,
  company_name text,
  saved_at     timestamptz not null default now(),
  unique(user_id, job_url)
);

create index saved_jobs_user_idx on public.saved_jobs (user_id);

alter table public.saved_jobs enable row level security;

create policy saved_jobs_own
  on public.saved_jobs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, delete on public.saved_jobs to authenticated;

-- ---- job_applications -------------------------------------------------------
create table public.job_applications (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid not null references auth.users(id) on delete cascade,
  job_url      text not null,
  job_title    text not null,
  company_name text,
  status       text not null default 'applied'
                 check (status in ('applied','reviewing','interview','offered','rejected')),
  applied_at   timestamptz not null default now(),
  unique(user_id, job_url)
);

create index job_applications_user_idx on public.job_applications (user_id);

alter table public.job_applications enable row level security;

create policy job_applications_own
  on public.job_applications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Admin can read all applications for platform analytics.
create policy job_applications_admin_read
  on public.job_applications for select
  using (public.is_admin());

grant select, insert, update on public.job_applications to authenticated;
