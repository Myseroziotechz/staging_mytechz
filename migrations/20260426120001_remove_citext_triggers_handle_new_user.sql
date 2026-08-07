-- ============================================================================
-- Remove citext extension, set_updated_at trigger, handle_new_user trigger
-- ============================================================================
-- After this migration, only is_admin() remains as a DB function.
-- All other logic is now handled in application code.
-- ============================================================================

-- Step 1: Drop triggers FIRST (they depend on the functions)
DROP TRIGGER IF EXISTS user_profiles_set_updated_at ON public.user_profiles;
DROP TRIGGER IF EXISTS recruiter_profiles_set_updated_at ON public.recruiter_profiles;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 2: Drop the trigger functions
DROP FUNCTION IF EXISTS public.set_updated_at();
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 3: Convert citext columns to text (removes citext dependency)
ALTER TABLE public.user_profiles ALTER COLUMN email TYPE text USING email::text;
ALTER TABLE public.admin_whitelist ALTER COLUMN email TYPE text USING email::text;

-- Step 4: Drop the citext extension (removes all ~40 citext functions)
DROP EXTENSION IF EXISTS citext;
