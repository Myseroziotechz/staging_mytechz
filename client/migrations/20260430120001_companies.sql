-- ============================================================================
-- companies — normalized employer profile
-- ============================================================================
create table if not exists public.companies (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  logo_url      text,
  website       text,
  industry      text,
  size          text check (size in ('1-10','11-50','51-200','201-1000','1001-5000','5000+')),
  hq_location   text,
  about         text,
  is_verified   boolean not null default false,
  created_by    uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists companies_name_trgm on public.companies using gin (name gin_trgm_ops);

alter table public.companies enable row level security;

drop policy if exists companies_read_all     on public.companies;
drop policy if exists companies_insert_auth  on public.companies;
drop policy if exists companies_update_own   on public.companies;

create policy companies_read_all
  on public.companies for select
  using (true);

create policy companies_insert_auth
  on public.companies for insert
  with check (auth.uid() is not null);

create policy companies_update_own
  on public.companies for update
  using (created_by = auth.uid() or public.is_admin());

grant select on public.companies to anon, authenticated;
grant insert, update on public.companies to authenticated;
