-- Floating AI Chat — sessions + messages
-- Apply on MyTechz Supabase (project ref: aiycgmrubisaxknbeaov) ONLY.

create table if not exists public.chat_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  ended_at    timestamptz,
  title       text
);

create table if not exists public.chat_messages (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.chat_sessions(id) on delete cascade,
  role        text not null check (role in ('user','assistant','system','tool')),
  content     text not null,
  intent      text,
  job_ids     uuid[] default '{}',
  meta        jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists chat_sessions_user_idx
  on public.chat_sessions (user_id, created_at desc);
create index if not exists chat_messages_session_idx
  on public.chat_messages (session_id, created_at);

alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists chat_sessions_own on public.chat_sessions;
create policy chat_sessions_own on public.chat_sessions for all
  using  (user_id = auth.uid() or user_id is null)
  with check (user_id = auth.uid() or user_id is null);

drop policy if exists chat_messages_own on public.chat_messages;
create policy chat_messages_own on public.chat_messages for all
  using  (exists (select 1 from public.chat_sessions s
                  where s.id = session_id
                    and (s.user_id = auth.uid() or s.user_id is null)))
  with check (exists (select 1 from public.chat_sessions s
                      where s.id = session_id
                        and (s.user_id = auth.uid() or s.user_id is null)));

grant select, insert, update on public.chat_sessions, public.chat_messages
  to anon, authenticated;
