-- Add self-reported total experience to user_profiles, for Smart Job Search's
-- experience-fit scoring (no experience field existed previously) and the
-- profile "About" section. Follows the exact style of
-- 20260622120000_user_profile_fields.sql.
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS total_experience_years NUMERIC;  -- e.g. 2.5 (years, self-reported)

GRANT UPDATE (total_experience_years)
  ON public.user_profiles TO authenticated;
