-- Phase 2 — Recruiter applicant pipeline
-- Apply on MyTechz Supabase (project ref: aiycgmrubisaxknbeaov) ONLY.
--
-- Adds the missing job_id link, recruiter notes, rating, and a
-- last_status_at timestamp so we can power the kanban + drawer UI.

alter table public.job_applications
  add column if not exists job_id          uuid references public.jobs(id) on delete cascade,
  add column if not exists recruiter_notes text,
  add column if not exists rating          int check (rating between 1 and 5),
  add column if not exists last_status_at  timestamptz default now();

create index if not exists job_applications_job_idx
  on public.job_applications (job_id, status, last_status_at desc);

-- Backfill: try to link rows by matching job_url against jobs table.
-- Safe to re-run; only updates rows where job_id is null.
update public.job_applications a
set    job_id = j.id
from   public.jobs j
where  a.job_id is null
  and  a.job_url is not null
  and  (
    a.job_url like '%' || j.slug || '%'
  );

-- Recruiter visibility: see applicants for jobs you posted.
alter table public.job_applications enable row level security;

drop policy if exists job_apps_recruiter_select on public.job_applications;
create policy job_apps_recruiter_select on public.job_applications
  for select using (
    user_id = auth.uid()  -- candidates see their own
    or exists (
      select 1 from public.jobs j
      where j.id = job_applications.job_id
        and j.posted_by = auth.uid()
    )
    or exists (              -- admins see everything
      select 1 from public.user_profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists job_apps_recruiter_update on public.job_applications;
create policy job_apps_recruiter_update on public.job_applications
  for update using (
    exists (
      select 1 from public.jobs j
      where j.id = job_applications.job_id
        and j.posted_by = auth.uid()
    )
    or exists (
      select 1 from public.user_profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );
