-- Add designation column to recruiter_profiles
-- Stores the recruiter's job title / role within their company.

alter table public.recruiter_profiles
  add column if not exists designation text;

-- Allow recruiters to update their own designation
grant update (designation) on public.recruiter_profiles to authenticated;
