-- Add professional profile fields to user_profiles
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS location     TEXT,           -- city, e.g. "Bengaluru"
  ADD COLUMN IF NOT EXISTS headline     TEXT,           -- "Frontend Dev | React" (max 120 chars)
  ADD COLUMN IF NOT EXISTS linkedin_url TEXT,           -- full URL
  ADD COLUMN IF NOT EXISTS skills       TEXT[] DEFAULT '{}';  -- ["React","Node.js"]

GRANT UPDATE (location, headline, linkedin_url, skills)
  ON public.user_profiles TO authenticated;
