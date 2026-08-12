-- ============================================================================
-- Migration 4/5: handle_new_user() trigger on auth.users
-- ============================================================================
-- Runs AFTER INSERT on auth.users (fired by Supabase when a new user signs up
-- via OAuth, magic link, password, etc.). Creates the matching user_profiles
-- row and assigns the correct role:
--
--   1. 'admin'     if email is in admin_whitelist
--   2. 'recruiter' if raw_user_meta_data.intended_role = 'recruiter'
--                  (set by the login page when the "Recruiter" toggle is on)
--   3. 'candidate' otherwise (default)
--
-- SECURITY DEFINER → runs as the function owner (postgres), which bypasses
-- RLS so it can insert into user_profiles and read admin_whitelist.
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role       public.user_role;
  v_intent     text;
  v_full_name  text;
  v_avatar     text;
begin
  -- 1. Admin whitelist wins over anything the client sent.
  if exists (select 1 from public.admin_whitelist where email = new.email) then
    v_role := 'admin';
  else
    v_intent := new.raw_user_meta_data ->> 'intended_role';
    if v_intent = 'recruiter' then
      v_role := 'recruiter';
    else
      v_role := 'candidate';
    end if;
  end if;

  -- Best-effort name/avatar from OAuth provider claims.
  v_full_name := coalesce(
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name',
    null
  );
  v_avatar := new.raw_user_meta_data ->> 'avatar_url';

  insert into public.user_profiles (id, email, role, full_name, avatar_url)
  values (new.id, new.email, v_role, v_full_name, v_avatar)
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Attach to auth.users. Drop any prior version to keep migration idempotent.
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
