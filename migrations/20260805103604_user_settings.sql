-- ============================================================================
-- user_settings — Settings page (visibility, job preferences, notifications)
-- ============================================================================
-- One row per user, separate from user_profiles (public identity data).
-- Unlike user_profiles, this is pure self-service preference data with no
-- security-relevant fields (no role), so direct client-scoped insert/update
-- under RLS is safe — the Settings API can upsert this row on first save
-- without needing a database trigger the way user_profiles does.
--
-- Applied live to the Supabase project via the `apply_migration` MCP tool as
-- two migrations (`user_settings`, then `user_settings_reuse_existing_updated_at_trigger`
-- to fix a duplicate trigger-function mistake — reuses the pre-existing
-- public.update_updated_at_column() instead). This file consolidates both
-- into the final, correct state for the repo record.
-- ============================================================================

create table public.user_settings (
  user_id                       uuid primary key references auth.users(id) on delete cascade,

  -- Profile visibility
  profile_public                boolean not null default true,
  show_email                    boolean not null default false,
  show_phone                    boolean not null default false,
  searchable                    boolean not null default true,

  -- Job preferences
  preferred_roles               text[] not null default '{}',
  preferred_locations           text[] not null default '{}',
  work_mode                     text check (work_mode in ('remote','hybrid','onsite')),
  employment_type               text check (employment_type in ('full-time','part-time','internship','contract')),

  -- Notification preferences
  notify_job_alerts             boolean not null default true,
  notify_application_updates    boolean not null default true,
  notify_saved_job_reminders    boolean not null default true,
  notify_profile_reminders      boolean not null default true,
  notify_product_updates        boolean not null default false,
  email_notifications_enabled   boolean not null default true,
  in_app_notifications_enabled  boolean not null default true,

  created_at                    timestamptz not null default now(),
  updated_at                    timestamptz not null default now()
);

alter table public.user_settings enable row level security;

create policy user_settings_select_own on public.user_settings
  for select using (auth.uid() = user_id);

create policy user_settings_insert_own on public.user_settings
  for insert with check (auth.uid() = user_id);

create policy user_settings_update_own on public.user_settings
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create trigger user_settings_set_updated_at
  before update on public.user_settings
  for each row execute function public.update_updated_at_column();

-- ============================================================================
-- avatars storage bucket — user-uploaded profile photos
-- ============================================================================
-- Public read (avatars are displayed app-wide, e.g. navbar), path-scoped
-- write: each user may only write to their own `avatars/{user_id}/...` path.
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy avatars_public_read on storage.objects
  for select using (bucket_id = 'avatars');

create policy avatars_insert_own on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy avatars_update_own on storage.objects
  for update using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy avatars_delete_own on storage.objects
  for delete using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
