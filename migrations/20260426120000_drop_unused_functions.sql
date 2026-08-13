-- ============================================================================
-- Drop unused Supabase functions
-- ============================================================================
-- These functions have been moved to server-side code (Next.js server actions
-- using the admin Supabase client) or are no longer needed.
--
-- Functions KEPT (still required in DB):
--   - set_updated_at()       → trigger on user_profiles + recruiter_profiles
--   - is_admin()             → used by RLS policies
--   - handle_new_user()      → trigger on auth.users
-- ============================================================================

-- 1. initialize_session — logic is now in ensure-session.js + callback/route.js
DROP FUNCTION IF EXISTS public.initialize_session(text);

-- 2. admin_add_whitelist — logic moved to /admin/whitelist/actions.js
DROP FUNCTION IF EXISTS public.admin_add_whitelist(text, text);

-- 3. admin_remove_whitelist — logic moved to /admin/whitelist/actions.js
DROP FUNCTION IF EXISTS public.admin_remove_whitelist(text);

-- 4. admin_verify_recruiter — logic moved to /admin/recruiters/actions.js
DROP FUNCTION IF EXISTS public.admin_verify_recruiter(uuid, text, text);

-- 5. ci_test — empty/unused test function, safe to remove
DROP FUNCTION IF EXISTS public.ci_test();
