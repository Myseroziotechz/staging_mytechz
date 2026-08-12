-- ============================================================================
-- Migration 2/5: admin_whitelist table
-- ============================================================================
-- Emails listed here are auto-promoted to role='admin' on first sign-in.
-- Readable/writable only by existing admins (for the admin UI CRUD screen)
-- and by the SECURITY DEFINER trigger in migration 4.
-- ============================================================================

create table public.admin_whitelist (
  email       citext primary key,
  added_by    uuid references auth.users(id) on delete set null,
  note        text,
  created_at  timestamptz not null default now()
);

alter table public.admin_whitelist enable row level security;

-- Admins can do everything (read, add, remove).
create policy admin_whitelist_all_admin
  on public.admin_whitelist for all
  using (public.is_admin())
  with check (public.is_admin());

-- Base grants — RLS still gates actual access.
grant select, insert, update, delete on public.admin_whitelist to authenticated;
