-- ============================================================================
-- Certifications table for the Profile module — follows the exact convention
-- established by education/projects/internships/languages: singular table
-- name, integer month/year, per-action RLS policies scoped by
-- (select auth.uid()) = user_id, composite index, updated_at trigger reusing
-- the existing update_updated_at_column() function.
-- ============================================================================

create table if not exists public.certifications (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references public.user_profiles(id) on delete cascade,
  name                  text not null,
  issuing_organization  text not null default '',
  issue_month           integer,
  issue_year            integer not null,
  expiration_month      integer,
  expiration_year       integer,
  does_not_expire       boolean default false,
  credential_id         text,
  credential_url        text,
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

alter table public.certifications enable row level security;

create policy certifications_select_own on public.certifications for select
  to authenticated using ((select auth.uid()) = user_id);
create policy certifications_insert_own on public.certifications for insert
  to authenticated with check ((select auth.uid()) = user_id);
create policy certifications_update_own on public.certifications for update
  to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy certifications_delete_own on public.certifications for delete
  to authenticated using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.certifications to authenticated;

create index if not exists certifications_user_updated_idx
  on public.certifications (user_id, updated_at desc);

create trigger update_certifications_updated_at
  before update on public.certifications
  for each row execute function public.update_updated_at_column();
