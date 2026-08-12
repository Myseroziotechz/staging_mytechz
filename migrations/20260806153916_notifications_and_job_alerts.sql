-- ============================================================================
-- notifications, job_notification_log, job_digest_queue, user_settings.notify_frequency
-- ============================================================================
-- Applied live to the Supabase project via the `apply_migration` MCP tool.
-- This file consolidates that migration for the repo record.
--
-- Root cause this addresses: the in-app notification bell/dropdown/page and
-- all /api/notifications/* routes were already fully built and wired to real
-- queries against `public.notifications`, but that table never existed in
-- the live database — every query silently failed and the routes caught the
-- error and returned an empty list, so the UI always showed "no
-- notifications" despite looking finished.
-- ============================================================================

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null default 'job_alert',
  title text not null,
  body text,
  link text,
  job_id uuid references public.jobs(id) on delete set null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index notifications_user_id_created_at_idx on public.notifications(user_id, created_at desc);
alter table public.notifications enable row level security;

create policy notifications_select_own on public.notifications
  for select using (auth.uid() = user_id);
create policy notifications_update_own on public.notifications
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy notifications_delete_own on public.notifications
  for delete using (auth.uid() = user_id);
-- Deliberately no insert policy for authenticated users — only the
-- service-role admin client (src/lib/notifications/dispatch.js) creates rows.

-- ============================================================================
-- job_notification_log — dedup guard, independent of whether the user later
-- deletes the in-app notification (deleting it must not cause a re-send).
-- ============================================================================
create table public.job_notification_log (
  job_id uuid not null references public.jobs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  channel text not null check (channel in ('in_app','email')),
  created_at timestamptz not null default now(),
  primary key (job_id, user_id, channel)
);
alter table public.job_notification_log enable row level security;
-- No policies — service-role only; RLS just blocks any accidental client access.

-- ============================================================================
-- job_digest_queue — pending items for daily/weekly email digests. In-app
-- notifications are always created immediately regardless of frequency;
-- this table only queues the EMAIL side for batching.
-- ============================================================================
create table public.job_digest_queue (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  created_at timestamptz not null default now(),
  emailed_at timestamptz
);
create index job_digest_queue_pending_idx on public.job_digest_queue(user_id) where emailed_at is null;
alter table public.job_digest_queue enable row level security;
-- No policies — service-role only.

-- ============================================================================
-- user_settings.notify_frequency — Instant / Daily digest / Weekly digest
-- ============================================================================
alter table public.user_settings
  add column notify_frequency text not null default 'instant'
  check (notify_frequency in ('instant','daily','weekly'));
