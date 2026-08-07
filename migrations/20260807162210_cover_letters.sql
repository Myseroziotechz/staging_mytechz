-- ============================================================================
-- Cover Letter Builder — cover_letter_templates, user_cover_letters
-- ============================================================================
-- Applied live to the Supabase project via the `apply_migration` MCP tool.
-- Mirrors the user_resumes / resume_templates pattern: a public-read template
-- table and an owner-only document table. Structured recipient/job/letter
-- fields live as jsonb sub-objects (sender_info, recipient_info,
-- letter_content) — same convention resume_data already uses for `contact`
-- rather than flat columns — so the shape can evolve without a migration.
-- ============================================================================

create table public.cover_letter_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  category text not null default 'general',
  preview_image_url text not null default '',
  html_css_template text not null,
  is_active boolean not null default true,
  is_premium boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.cover_letter_templates enable row level security;
create policy "Anyone can read active cover letter templates" on public.cover_letter_templates
  for select using (is_active = true);

create table public.user_cover_letters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id uuid references public.cover_letter_templates(id) on delete set null,
  job_id uuid references public.jobs(id) on delete set null,
  title text not null default 'Untitled Cover Letter',
  -- {fullName, headline, email, phone, location, linkedin, portfolio}
  sender_info jsonb not null default '{}'::jsonb,
  -- {hiringManagerName, hiringManagerTitle, companyName, companyLocation, jobTitle, jobRef, date}
  recipient_info jsonb not null default '{}'::jsonb,
  -- {greeting, opening, body: [paragraph, ...], closing, signOff, jobDescription, keySkills: []}
  letter_content jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft','completed')),
  last_exported_at timestamptz,
  last_export_format text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index user_cover_letters_user_id_idx on public.user_cover_letters(user_id, updated_at desc);
alter table public.user_cover_letters enable row level security;

create policy "Users can read own cover letters" on public.user_cover_letters
  for select using (auth.uid() = user_id);
create policy "Users can insert own cover letters" on public.user_cover_letters
  for insert with check (auth.uid() = user_id);
create policy "Users can update own cover letters" on public.user_cover_letters
  for update using (auth.uid() = user_id);
create policy "Users can delete own cover letters" on public.user_cover_letters
  for delete using (auth.uid() = user_id);

-- Reuses the existing public.update_updated_at_column() trigger function
-- (already used by user_settings) rather than defining a new one.
create trigger user_cover_letters_set_updated_at before update on public.user_cover_letters
  for each row execute function public.update_updated_at_column();

-- Seed 3 templates (Classic / Modern / Minimal), visually paired with their
-- resume-template namesakes (same fonts/accent colors) so the two builders
-- feel like one family. Full html_css_template content applied live — see
-- the cover_letter_templates table for the current source of truth; this
-- file documents the schema/policies, not a byte-for-byte template mirror.
