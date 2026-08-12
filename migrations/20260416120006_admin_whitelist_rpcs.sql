-- ============================================================================
-- Migration 7: admin whitelist mutation RPCs
-- ============================================================================
-- The admin UI CRUDs admin_whitelist through these SECURITY DEFINER functions
-- instead of direct table writes so we can, in a single atomic call:
--   - enforce is_admin() (defense in depth on top of RLS)
--   - normalize email (lowercase)
--   - immediately promote an already-registered user_profiles row to admin
--     when their email is added (the user_profiles.role column is not
--     grantable to authenticated, so this RPC is the only path).
--
-- Demotion is intentionally NOT automatic on removal: taking someone off the
-- whitelist leaves their current role untouched. Explicit demotion is a
-- separate, future-phase concern.
-- ============================================================================

create or replace function public.admin_add_whitelist(
  p_email text,
  p_note  text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email citext := lower(trim(p_email))::citext;
begin
  if not public.is_admin() then
    raise exception 'admin_add_whitelist: caller is not admin';
  end if;

  if v_email is null or v_email = '' then
    raise exception 'admin_add_whitelist: email is required';
  end if;

  insert into public.admin_whitelist (email, note, added_by)
  values (v_email, nullif(trim(coalesce(p_note, '')), ''), auth.uid())
  on conflict (email) do update
    set note = excluded.note;

  -- Promote existing matching user (if any) without requiring a fresh signup.
  update public.user_profiles
     set role = 'admin'
   where email = v_email
     and role <> 'admin';
end;
$$;

create or replace function public.admin_remove_whitelist(p_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email citext := lower(trim(p_email))::citext;
begin
  if not public.is_admin() then
    raise exception 'admin_remove_whitelist: caller is not admin';
  end if;

  -- Guard against an admin removing their own last pathway in. If the only
  -- remaining whitelist entry IS the caller's email, refuse.
  if (select count(*) from public.admin_whitelist) = 1
     and exists (
       select 1 from public.admin_whitelist w
        join public.user_profiles up on up.email = w.email
       where up.id = auth.uid() and w.email = v_email
     )
  then
    raise exception 'admin_remove_whitelist: cannot remove the last admin email';
  end if;

  delete from public.admin_whitelist where email = v_email;
end;
$$;

revoke all on function public.admin_add_whitelist(text, text) from public, anon;
revoke all on function public.admin_remove_whitelist(text) from public, anon;
grant execute on function public.admin_add_whitelist(text, text) to authenticated;
grant execute on function public.admin_remove_whitelist(text) to authenticated;
