-- Additive: two new optional profile links, requested for the About section.
-- No existing column, row, or constraint is touched.
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS github_url    TEXT,
  ADD COLUMN IF NOT EXISTS portfolio_url TEXT;

GRANT UPDATE (github_url, portfolio_url) ON public.user_profiles TO authenticated;
