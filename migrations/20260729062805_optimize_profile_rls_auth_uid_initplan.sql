-- ============================================================================
-- Fix "Auth RLS Initialization Plan" performance warning on the profile
-- module's tables: bare auth.uid() in a policy is re-evaluated once per row;
-- wrapping it as (select auth.uid()) lets Postgres evaluate it once per query
-- and cache the result. Same access semantics, no behavior change — this only
-- rewrites how the existing predicate is evaluated.
--
-- Covers education (pre-existing, same anti-pattern) plus projects,
-- internships, languages (created in this session, which copied education's
-- policy style verbatim, including the anti-pattern) — flagged by
-- Supabase's performance advisor immediately after those tables were created.
-- ============================================================================

alter policy education_select_own on public.education
  using ((select auth.uid()) = user_id);
alter policy education_insert_own on public.education
  with check ((select auth.uid()) = user_id);
alter policy education_update_own on public.education
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy education_delete_own on public.education
  using ((select auth.uid()) = user_id);

alter policy projects_select_own on public.projects
  using ((select auth.uid()) = user_id);
alter policy projects_insert_own on public.projects
  with check ((select auth.uid()) = user_id);
alter policy projects_update_own on public.projects
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy projects_delete_own on public.projects
  using ((select auth.uid()) = user_id);

alter policy internships_select_own on public.internships
  using ((select auth.uid()) = user_id);
alter policy internships_insert_own on public.internships
  with check ((select auth.uid()) = user_id);
alter policy internships_update_own on public.internships
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy internships_delete_own on public.internships
  using ((select auth.uid()) = user_id);

alter policy languages_select_own on public.languages
  using ((select auth.uid()) = user_id);
alter policy languages_insert_own on public.languages
  with check ((select auth.uid()) = user_id);
alter policy languages_update_own on public.languages
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
alter policy languages_delete_own on public.languages
  using ((select auth.uid()) = user_id);
