-- ============================================================================
-- jobs — single source of truth for private + government postings
-- ============================================================================

do $$ begin
  create type public.job_category as enum ('private','government');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.job_type as enum ('full_time','part_time','internship','contract','temporary');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.work_mode as enum ('remote','hybrid','onsite');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.apply_mode as enum ('internal','external','email','phone');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.job_status as enum ('draft','pending_approval','active','closed','expired','rejected');
exception when duplicate_object then null; end $$;

create table if not exists public.jobs (
  id                    uuid primary key default gen_random_uuid(),
  short_id              text not null unique default substr(replace(gen_random_uuid()::text, '-', ''), 1, 6),
  slug                  text not null unique,

  title                 text not null,
  description           text not null,
  summary               text,
  category              public.job_category not null,
  job_type              public.job_type not null default 'full_time',
  work_mode             public.work_mode not null default 'onsite',

  company_id            uuid references public.companies(id) on delete set null,
  posted_by             uuid not null references auth.users(id) on delete cascade,

  -- location / GEO
  location_city         text,
  location_state        text,
  location_state_code   text,
  location_country      text default 'India',
  location_country_code text default 'IN',
  geo_lat               numeric(9,6),
  geo_lng               numeric(9,6),
  is_multi_location     boolean not null default false,
  locations             text[] default '{}',

  -- compensation
  salary_min            numeric(12,2),
  salary_max            numeric(12,2),
  salary_currency       text default 'INR',
  salary_period         text default 'year' check (salary_period in ('year','month','hour')),
  is_salary_disclosed   boolean not null default true,

  -- experience & openings
  experience_min        numeric(4,1) default 0,
  experience_max        numeric(4,1),
  openings              int not null default 1,
  openings_filled       int not null default 0,

  -- dates
  posted_at             timestamptz not null default now(),
  job_start_date        date,
  application_deadline  date,

  -- taxonomy
  skills                text[] not null default '{}',
  qualifications        text[] default '{}',
  department            text,
  industry              text,
  benefits              text[] default '{}',

  -- apply
  apply_mode            public.apply_mode not null default 'internal',
  apply_url             text,
  apply_email           text,
  apply_phone           text,

  -- gov-only metadata (jsonb to avoid bloating schema)
  government_meta       jsonb,

  -- moderation
  status                public.job_status not null default 'pending_approval',
  reviewed_by           uuid references auth.users(id) on delete set null,
  reviewed_at           timestamptz,
  rejection_reason      text,

  -- engagement
  views_count           int not null default 0,
  applications_count    int not null default 0,
  is_featured           boolean not null default false,
  is_urgent             boolean not null default false,

  -- SEO / AEO overrides
  meta_title            text,
  meta_description      text,
  og_image_url          text,
  faq                   jsonb,

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  constraint jobs_salary_chk    check (salary_max is null or salary_min is null or salary_max >= salary_min),
  constraint jobs_exp_chk       check (experience_max is null or experience_max >= coalesce(experience_min, 0)),
  constraint jobs_external_chk  check (apply_mode <> 'external' or apply_url   is not null),
  constraint jobs_email_chk     check (apply_mode <> 'email'    or apply_email is not null),
  constraint jobs_phone_chk     check (apply_mode <> 'phone'    or apply_phone is not null)
);

create index if not exists jobs_status_posted_idx on public.jobs (status, posted_at desc);
create index if not exists jobs_category_idx      on public.jobs (category) where status = 'active';
create index if not exists jobs_skills_gin        on public.jobs using gin (skills);
create index if not exists jobs_title_trgm        on public.jobs using gin (title gin_trgm_ops);
create index if not exists jobs_city_idx          on public.jobs (location_city) where status = 'active';
create index if not exists jobs_posted_by_idx     on public.jobs (posted_by);

alter table public.jobs enable row level security;

drop policy if exists jobs_public_read_active on public.jobs;
drop policy if exists jobs_recruiter_own      on public.jobs;
drop policy if exists jobs_admin_all          on public.jobs;

create policy jobs_public_read_active
  on public.jobs for select
  using (status = 'active');

create policy jobs_recruiter_own
  on public.jobs for all
  using (posted_by = auth.uid())
  with check (posted_by = auth.uid());

create policy jobs_admin_all
  on public.jobs for all
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.jobs to anon, authenticated;
grant insert, update, delete on public.jobs to authenticated;

-- updated_at trigger
create or replace function public.jobs_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists jobs_updated_at_trg on public.jobs;
create trigger jobs_updated_at_trg
before update on public.jobs
for each row execute function public.jobs_set_updated_at();
