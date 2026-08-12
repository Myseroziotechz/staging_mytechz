-- ============================================================================
-- Migration: admin_verify_recruiter() RPC
-- ============================================================================
-- Allows admins to verify or reject recruiter company profiles.
-- Uses SECURITY DEFINER so the admin can update verification_status
-- (which authenticated users cannot update directly via column grants).
-- ============================================================================

create or replace function public.admin_verify_recruiter(
  p_user_id uuid,
  p_status  text,
  p_note    text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'admin_verify_recruiter: not authorized';
  end if;

  if p_status not in ('verified', 'rejected') then
    raise exception 'admin_verify_recruiter: invalid status %', p_status;
  end if;

  update public.recruiter_profiles
     set verification_status = p_status
   where user_id = p_user_id;

  if not found then
    raise exception 'admin_verify_recruiter: recruiter profile not found for %', p_user_id;
  end if;
end;
$$;

revoke all on function public.admin_verify_recruiter(uuid, text, text) from public, anon;
grant execute on function public.admin_verify_recruiter(uuid, text, text) to authenticated;
