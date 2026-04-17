-- ============================================================================
-- Migration 3/5: recruiter_profiles table
-- ============================================================================
-- Company/recruiter-specific details. Recruiter must complete this before
-- accessing the recruiter dashboard (enforced at application layer via
-- user_profiles.onboarding_completed).
--
-- `verification_status` is seeded for the deferred Phase-2 admin verification
-- flow — the column exists now so no later migration is needed, but no UI
-- currently gates on it.
-- ============================================================================

create table public.recruiter_profiles (
  user_id               uuid primary key references public.user_profiles(id) on delete cascade,
  company_name          text not null,
  company_website       text,
  industry              text,
  company_size          text check (company_size in ('1-10','11-50','51-200','201-500','501-1000','1000+')),
  head_office_location  text,
  work_mode             text check (work_mode in ('office','hybrid','remote')),
  company_description   text,
  gst_or_cin            text,
  verification_status   text not null default 'pending'
                          check (verification_status in ('pending','verified','rejected')),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create trigger recruiter_profiles_set_updated_at
  before update on public.recruiter_profiles
  for each row execute function public.set_updated_at();

-- ---- RLS --------------------------------------------------------------------
alter table public.recruiter_profiles enable row level security;

-- Recruiter reads own row.
create policy recruiter_profiles_select_own
  on public.recruiter_profiles for select
  using (auth.uid() = user_id);

-- Recruiter inserts own row — must actually have role='recruiter'.
create policy recruiter_profiles_insert_own
  on public.recruiter_profiles for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.user_profiles
      where id = auth.uid() and role = 'recruiter'
    )
  );

-- Recruiter updates own row (column grants below restrict verification_status).
create policy recruiter_profiles_update_own
  on public.recruiter_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Admin full access (read all, and verify/reject in Phase 2).
create policy recruiter_profiles_all_admin
  on public.recruiter_profiles for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---- Column grants ----------------------------------------------------------
-- Recruiters cannot set verification_status themselves.
revoke update on public.recruiter_profiles from anon, authenticated;
grant update (
  company_name, company_website, industry, company_size,
  head_office_location, work_mode, company_description, gst_or_cin
) on public.recruiter_profiles to authenticated;

grant select, insert on public.recruiter_profiles to authenticated;
