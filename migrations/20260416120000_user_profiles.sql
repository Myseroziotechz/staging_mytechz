-- ============================================================================
-- Migration 1/5: user_role enum + user_profiles table + is_admin() helper
-- ============================================================================
-- Creates the core profile table mirrored 1:1 with auth.users.
-- Role writes are locked down via column grants; inserts happen via the
-- handle_new_user() trigger in migration 4.
-- ============================================================================

create extension if not exists citext;

-- ---- Role enum --------------------------------------------------------------
create type public.user_role as enum ('candidate', 'recruiter', 'admin');

-- ---- user_profiles ----------------------------------------------------------
create table public.user_profiles (
  id                    uuid primary key references auth.users(id) on delete cascade,
  email                 citext not null unique,
  role                  public.user_role not null default 'candidate',
  full_name             text,
  avatar_url            text,
  phone                 text,
  onboarding_completed  boolean not null default false,
  is_active             boolean not null default true,
  last_login_at         timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index user_profiles_role_idx on public.user_profiles (role);
create index user_profiles_active_idx on public.user_profiles (is_active) where is_active = true;

-- ---- updated_at touch trigger (shared across tables) ------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger user_profiles_set_updated_at
  before update on public.user_profiles
  for each row execute function public.set_updated_at();

-- ---- is_admin() helper (used by policies on multiple tables) ----------------
-- SECURITY DEFINER so it bypasses RLS on user_profiles when checking the
-- caller's role — avoids infinite recursion in the policy itself.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_profiles
    where id = auth.uid()
      and role = 'admin'
      and is_active = true
  );
$$;

-- ---- RLS --------------------------------------------------------------------
alter table public.user_profiles enable row level security;

-- Users read their own profile.
create policy user_profiles_select_own
  on public.user_profiles for select
  using (auth.uid() = id);

-- Admins read all profiles.
create policy user_profiles_select_admin
  on public.user_profiles for select
  using (public.is_admin());

-- Users update their own profile (column grants below restrict which columns).
create policy user_profiles_update_own
  on public.user_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Admins full access (needed so admin UI can promote/deactivate users).
create policy user_profiles_all_admin
  on public.user_profiles for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---- Column-level grants ----------------------------------------------------
-- Block direct INSERT — rows are created only via handle_new_user() trigger.
revoke insert on public.user_profiles from anon, authenticated;

-- Users can only update safe columns. `role`, `is_active`, `email`, `id`,
-- timestamps are not grantable — only service role / admin policy can change them.
revoke update on public.user_profiles from anon, authenticated;
grant update (full_name, avatar_url, phone, onboarding_completed, last_login_at)
  on public.user_profiles
  to authenticated;

-- Base select grant (RLS still applies).
grant select on public.user_profiles to authenticated;
