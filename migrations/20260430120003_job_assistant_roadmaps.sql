-- ============================================================================
-- job_assistant_roadmaps — per-job preparation roadmap (cached LLM output)
-- ============================================================================
create table if not exists public.job_assistant_roadmaps (
  id           uuid primary key default gen_random_uuid(),
  job_id       uuid not null references public.jobs(id) on delete cascade,
  user_id      uuid references auth.users(id) on delete cascade,
  roadmap      jsonb not null,
  generated_at timestamptz not null default now(),
  unique (job_id, user_id)
);

create index if not exists jar_job_idx  on public.job_assistant_roadmaps (job_id);
create index if not exists jar_user_idx on public.job_assistant_roadmaps (user_id);

alter table public.job_assistant_roadmaps enable row level security;

drop policy if exists jar_public_read_generic on public.job_assistant_roadmaps;
drop policy if exists jar_own                  on public.job_assistant_roadmaps;

create policy jar_public_read_generic
  on public.job_assistant_roadmaps for select
  using (user_id is null);

create policy jar_own
  on public.job_assistant_roadmaps for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

grant select on public.job_assistant_roadmaps to anon, authenticated;
grant insert, update on public.job_assistant_roadmaps to authenticated;
