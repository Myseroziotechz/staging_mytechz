-- ============================================================================
-- Migration 6: initialize_session() RPC
-- ============================================================================
-- Called by the Next.js auth callback after exchangeCodeForSession. Does three
-- things inside a single SECURITY DEFINER call so the user's session does not
-- need UPDATE rights on user_profiles.role:
--
--   1. If this is the user's first login (last_login_at IS NULL) AND the login
--      page passed intended_role='recruiter' AND current role is 'candidate',
--      promote them to recruiter. Admin role is never touched — admin_whitelist
--      is the only path to admin.
--   2. Stamp last_login_at = now() so subsequent logins skip the promotion
--      branch (prevents cookie-based role changes on return visits).
--   3. Return the final role + onboarding_completed so the callback can
--      redirect correctly without a second round-trip.
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
begin
  if v_uid is null then
    raise exception 'initialize_session: not authenticated';
  end if;

  select up.role, (up.last_login_at is null)
    into v_current_role, v_first_login
  from public.user_profiles up
  where up.id = v_uid;

  if not found then
    raise exception 'initialize_session: profile row missing for %', v_uid;
  end if;

  -- Promote candidate→recruiter only on the very first login.
  if v_first_login
     and v_current_role = 'candidate'
     and p_intended_role = 'recruiter'
  then
    update public.user_profiles
       set role = 'recruiter'
     where id = v_uid;
    v_current_role := 'recruiter';
  end if;

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
