-- ============================================================================
-- Migration 6: initialize_session() RPC
-- ============================================================================
-- Called by the Next.js /auth/callback server route after exchangeCodeForSession.
-- Runs as SECURITY DEFINER so the user's session does not need UPDATE rights
-- on user_profiles.role. Does three things:
--
--   1. Checks admin_whitelist on EVERY login and promotes if found.
--   2. Promotes candidate→recruiter when intended_role='recruiter' is passed.
--   3. Stamps last_login_at and returns the final role for redirect.
-- ============================================================================

create or replace function public.initialize_session(p_intended_role text default null)
returns table (
  role                  public.user_role,
  onboarding_completed  boolean,
  is_first_login        boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid          uuid := auth.uid();
  v_current_role public.user_role;
  v_first_login  boolean;
  v_email        citext;
begin
  if v_uid is null then
    raise exception 'initialize_session: not authenticated';
  end if;

  select up.role, (up.last_login_at is null), up.email
    into v_current_role, v_first_login, v_email
  from public.user_profiles up
  where up.id = v_uid;

  if not found then
    raise exception 'initialize_session: profile row missing for %', v_uid;
  end if;

  -- 1. Admin whitelist check — runs on EVERY login, not just first.
  if v_current_role != 'admin'
     and exists (select 1 from public.admin_whitelist where email = v_email)
  then
    update public.user_profiles
       set role = 'admin'
     where id = v_uid;
    v_current_role := 'admin';
  end if;

  -- 2. Recruiter promotion — candidate→recruiter when intended.
  if v_current_role = 'candidate'
     and p_intended_role = 'recruiter'
  then
    update public.user_profiles
       set role = 'recruiter'
     where id = v_uid;
    v_current_role := 'recruiter';
  end if;

  -- 3. Stamp last_login_at.
  update public.user_profiles
     set last_login_at = now()
   where id = v_uid;

  return query
    select v_current_role,
           up.onboarding_completed,
           v_first_login
      from public.user_profiles up
     where up.id = v_uid;
end;
$$;

revoke all on function public.initialize_session(text) from public, anon;
grant execute on function public.initialize_session(text) to authenticated;
