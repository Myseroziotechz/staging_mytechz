-- ============================================================
-- Resume Builder — Supabase Migration
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- Table 1: resume_templates
create table if not exists resume_templates (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  slug                text not null unique,
  description         text default '',
  category            text not null default 'general' check (category in ('general','tech','creative','government','academic')),
  preview_image_url   text default '',
  html_css_template   text not null,               -- HTML/CSS with {{placeholders}}
  required_fields     jsonb not null default '[]',  -- ["contact","summary","experience","education","skills"]
  default_sections    jsonb not null default '[]',  -- ordered section list for new resumes
  is_active           boolean default true,
  is_premium          boolean default false,
  sort_order          int default 0,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

create index if not exists rt_active_sort_idx on resume_templates(is_active, sort_order);
create index if not exists rt_slug_idx on resume_templates(slug);

alter table resume_templates enable row level security;

create policy "Anyone can read active templates"
  on resume_templates for select
  using (is_active = true);


-- Table 2: user_resumes
create table if not exists user_resumes (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  template_id       uuid references resume_templates(id) on delete set null,
  title             text not null default 'Untitled Resume',
  resume_data       jsonb not null default '{}',   -- structured: {contact, summary, experience[], education[], skills[], projects[], certifications[], languages[]}
  status            text default 'draft' check (status in ('draft','completed')),
  last_exported_at  timestamptz,
  last_export_format text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

create index if not exists ur_user_updated_idx on user_resumes(user_id, updated_at desc);
create index if not exists ur_template_idx on user_resumes(template_id);

alter table user_resumes enable row level security;

create policy "Users can read own resumes"
  on user_resumes for select
  using (auth.uid() = user_id);

create policy "Users can insert own resumes"
  on user_resumes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own resumes"
  on user_resumes for update
  using (auth.uid() = user_id);

create policy "Users can delete own resumes"
  on user_resumes for delete
  using (auth.uid() = user_id);


-- Table 3: ai_generation_logs
create table if not exists ai_generation_logs (
  id              bigserial primary key,
  user_id         uuid not null references auth.users(id) on delete cascade,
  resume_id       uuid references user_resumes(id) on delete set null,
  action_type     text not null check (action_type in ('generate','parse','rewrite','autofill','suggest_keywords','export')),
  input_summary   text default '',            -- truncated input for debugging
  output_summary  text default '',            -- truncated output
  model_used      text default '',
  tokens_used     int default 0,
  export_format   text,                       -- 'pdf','docx','png','jpg','svg' (only for export actions)
  duration_ms     int default 0,
  status          text default 'success' check (status in ('success','error')),
  error_message   text default '',
  created_at      timestamptz default now()
);

create index if not exists agl_user_created_idx on ai_generation_logs(user_id, created_at desc);
create index if not exists agl_resume_idx on ai_generation_logs(resume_id);
create index if not exists agl_action_idx on ai_generation_logs(action_type);

alter table ai_generation_logs enable row level security;

create policy "Users can read own logs"
  on ai_generation_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert own logs"
  on ai_generation_logs for insert
  with check (auth.uid() = user_id);


-- ============================================================
-- Seed 5 starter templates
-- ============================================================

insert into resume_templates (name, slug, description, category, required_fields, default_sections, sort_order, html_css_template) values

-- 1. Classic
('Classic', 'classic', 'A clean, traditional resume layout that works for any industry. Timeless design with clear section headings.', 'general',
 '["contact","summary","experience","education","skills"]',
 '["contact","summary","experience","education","skills","certifications","projects"]',
 1,
 '<style>
  .resume { font-family: Georgia, "Times New Roman", serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1a1a1a; line-height: 1.5; }
  .resume h1 { font-size: 28px; margin: 0 0 4px; color: #111; }
  .resume .contact-line { font-size: 13px; color: #555; margin-bottom: 20px; }
  .resume h2 { font-size: 16px; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 2px solid #111; padding-bottom: 4px; margin: 24px 0 12px; color: #111; }
  .resume .entry { margin-bottom: 16px; }
  .resume .entry-header { display: flex; justify-content: space-between; align-items: baseline; }
  .resume .entry-title { font-weight: bold; font-size: 15px; }
  .resume .entry-subtitle { font-style: italic; color: #444; font-size: 14px; }
  .resume .entry-date { font-size: 13px; color: #666; white-space: nowrap; }
  .resume ul { margin: 4px 0 0; padding-left: 20px; }
  .resume li { font-size: 14px; margin-bottom: 3px; }
  .resume .skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
  .resume .skill-tag { background: #f0f0f0; padding: 3px 10px; border-radius: 3px; font-size: 13px; }
  .resume .summary { font-size: 14px; color: #333; }
</style>
<div class="resume">
  <h1>{{contact.fullName}}</h1>
  <div class="contact-line">{{contact.email}} {{contact.phone}} {{contact.location}} {{contact.linkedin}}</div>

  {{#summary}}<h2>Professional Summary</h2><p class="summary">{{summary}}</p>{{/summary}}

  {{#experience.length}}<h2>Experience</h2>
  {{#experience}}<div class="entry">
    <div class="entry-header"><span class="entry-title">{{title}}</span><span class="entry-date">{{startDate}} – {{endDate}}</span></div>
    <div class="entry-subtitle">{{company}} · {{location}}</div>
    <ul>{{#bullets}}<li>{{.}}</li>{{/bullets}}</ul>
  </div>{{/experience}}{{/experience.length}}

  {{#education.length}}<h2>Education</h2>
  {{#education}}<div class="entry">
    <div class="entry-header"><span class="entry-title">{{degree}}</span><span class="entry-date">{{year}}</span></div>
    <div class="entry-subtitle">{{institution}} · {{location}}</div>
  </div>{{/education}}{{/education.length}}

  {{#skills.length}}<h2>Skills</h2>
  <div class="skills-list">{{#skills}}<span class="skill-tag">{{.}}</span>{{/skills}}</div>{{/skills.length}}

  {{#certifications.length}}<h2>Certifications</h2>
  <ul>{{#certifications}}<li>{{name}} — {{issuer}} ({{year}})</li>{{/certifications}}</ul>{{/certifications.length}}

  {{#projects.length}}<h2>Projects</h2>
  {{#projects}}<div class="entry">
    <div class="entry-header"><span class="entry-title">{{name}}</span><span class="entry-date">{{date}}</span></div>
    <p style="font-size:14px;margin:4px 0">{{description}}</p>
  </div>{{/projects}}{{/projects.length}}
</div>'),

-- 2. Modern
('Modern', 'modern', 'A contemporary two-column layout with accent colours. Perfect for tech and creative professionals.', 'tech',
 '["contact","summary","experience","education","skills"]',
 '["contact","summary","experience","education","skills","projects","certifications"]',
 2,
 '<style>
  .resume { font-family: "Segoe UI", system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 0; color: #1e293b; line-height: 1.5; }
  .resume .header { background: #1e40af; color: white; padding: 32px 40px; }
  .resume .header h1 { font-size: 30px; margin: 0 0 4px; font-weight: 700; }
  .resume .header .contact-line { font-size: 13px; opacity: 0.9; }
  .resume .body { display: grid; grid-template-columns: 1fr 260px; }
  .resume .main { padding: 24px 32px; }
  .resume .sidebar { background: #f8fafc; padding: 24px; border-left: 1px solid #e2e8f0; }
  .resume h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; color: #1e40af; margin: 20px 0 10px; font-weight: 700; }
  .resume .sidebar h2 { color: #334155; }
  .resume .entry { margin-bottom: 16px; }
  .resume .entry-title { font-weight: 700; font-size: 15px; }
  .resume .entry-meta { font-size: 13px; color: #64748b; margin: 2px 0 4px; }
  .resume ul { margin: 4px 0 0; padding-left: 18px; }
  .resume li { font-size: 14px; margin-bottom: 3px; }
  .resume .skill-tag { display: inline-block; background: #dbeafe; color: #1e40af; padding: 3px 10px; border-radius: 12px; font-size: 12px; margin: 2px 4px 2px 0; }
  .resume .summary { font-size: 14px; color: #475569; }
</style>
<div class="resume">
  <div class="header">
    <h1>{{contact.fullName}}</h1>
    <div class="contact-line">{{contact.email}} · {{contact.phone}} · {{contact.location}}</div>
  </div>
  <div class="body">
    <div class="main">
      {{#summary}}<h2>About</h2><p class="summary">{{summary}}</p>{{/summary}}

      {{#experience.length}}<h2>Experience</h2>
      {{#experience}}<div class="entry">
        <div class="entry-title">{{title}} — {{company}}</div>
        <div class="entry-meta">{{startDate}} – {{endDate}} · {{location}}</div>
        <ul>{{#bullets}}<li>{{.}}</li>{{/bullets}}</ul>
      </div>{{/experience}}{{/experience.length}}

      {{#projects.length}}<h2>Projects</h2>
      {{#projects}}<div class="entry">
        <div class="entry-title">{{name}}</div>
        <p style="font-size:14px;margin:4px 0">{{description}}</p>
      </div>{{/projects}}{{/projects.length}}
    </div>
    <div class="sidebar">
      {{#skills.length}}<h2>Skills</h2>
      <div>{{#skills}}<span class="skill-tag">{{.}}</span>{{/skills}}</div>{{/skills.length}}

      {{#education.length}}<h2>Education</h2>
      {{#education}}<div class="entry">
        <div class="entry-title" style="font-size:14px">{{degree}}</div>
        <div class="entry-meta">{{institution}}<br>{{year}}</div>
      </div>{{/education}}{{/education.length}}

      {{#certifications.length}}<h2>Certifications</h2>
      {{#certifications}}<div style="font-size:13px;margin-bottom:8px">{{name}}<br><span style="color:#64748b">{{issuer}} · {{year}}</span></div>{{/certifications}}{{/certifications.length}}
    </div>
  </div>
</div>'),

-- 3. Minimal
('Minimal', 'minimal', 'Ultra-clean single-column design with plenty of whitespace. Lets your content speak for itself.', 'general',
 '["contact","summary","experience","education","skills"]',
 '["contact","summary","experience","education","skills"]',
 3,
 '<style>
  .resume { font-family: "Inter", system-ui, sans-serif; max-width: 700px; margin: 0 auto; padding: 48px 40px; color: #18181b; line-height: 1.6; }
  .resume h1 { font-size: 24px; font-weight: 600; margin: 0; }
  .resume .contact-line { font-size: 13px; color: #71717a; margin: 4px 0 28px; }
  .resume h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: #a1a1aa; margin: 28px 0 10px; font-weight: 600; }
  .resume .entry { margin-bottom: 14px; }
  .resume .entry-header { display: flex; justify-content: space-between; }
  .resume .entry-title { font-weight: 600; font-size: 14px; }
  .resume .entry-date { font-size: 13px; color: #71717a; }
  .resume .entry-subtitle { font-size: 13px; color: #52525b; }
  .resume ul { margin: 4px 0 0; padding-left: 16px; }
  .resume li { font-size: 13px; margin-bottom: 2px; }
  .resume .skills-list { font-size: 13px; color: #3f3f46; }
  .resume .summary { font-size: 13px; color: #52525b; }
</style>
<div class="resume">
  <h1>{{contact.fullName}}</h1>
  <div class="contact-line">{{contact.email}} · {{contact.phone}} · {{contact.location}}</div>

  {{#summary}}<h2>Summary</h2><p class="summary">{{summary}}</p>{{/summary}}

  {{#experience.length}}<h2>Experience</h2>
  {{#experience}}<div class="entry">
    <div class="entry-header"><span class="entry-title">{{title}} — {{company}}</span><span class="entry-date">{{startDate}} – {{endDate}}</span></div>
    <ul>{{#bullets}}<li>{{.}}</li>{{/bullets}}</ul>
  </div>{{/experience}}{{/experience.length}}

  {{#education.length}}<h2>Education</h2>
  {{#education}}<div class="entry">
    <div class="entry-header"><span class="entry-title">{{degree}}</span><span class="entry-date">{{year}}</span></div>
    <div class="entry-subtitle">{{institution}}</div>
  </div>{{/education}}{{/education.length}}

  {{#skills.length}}<h2>Skills</h2>
  <p class="skills-list">{{skills_joined}}</p>{{/skills.length}}
</div>'),

-- 4. Professional
('Professional', 'professional', 'Structured format with a header accent bar. Ideal for corporate roles, banking, and consulting.', 'general',
 '["contact","summary","experience","education","skills"]',
 '["contact","summary","experience","education","skills","certifications","languages"]',
 4,
 '<style>
  .resume { font-family: "Calibri", "Segoe UI", sans-serif; max-width: 800px; margin: 0 auto; padding: 0; color: #1f2937; line-height: 1.5; }
  .resume .header { border-top: 5px solid #0f766e; padding: 28px 40px; }
  .resume .header h1 { font-size: 26px; margin: 0 0 2px; color: #0f766e; }
  .resume .contact-line { font-size: 13px; color: #6b7280; }
  .resume .content { padding: 0 40px 40px; }
  .resume h2 { font-size: 15px; font-weight: 700; color: #0f766e; border-bottom: 1px solid #d1d5db; padding-bottom: 4px; margin: 22px 0 10px; }
  .resume .entry { margin-bottom: 14px; }
  .resume .entry-header { display: flex; justify-content: space-between; }
  .resume .entry-title { font-weight: 700; font-size: 14px; }
  .resume .entry-subtitle { font-size: 13px; color: #6b7280; }
  .resume .entry-date { font-size: 13px; color: #6b7280; }
  .resume ul { margin: 4px 0 0; padding-left: 18px; }
  .resume li { font-size: 13px; margin-bottom: 3px; }
  .resume .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 24px; font-size: 13px; }
  .resume .summary { font-size: 14px; color: #374151; }
</style>
<div class="resume">
  <div class="header">
    <h1>{{contact.fullName}}</h1>
    <div class="contact-line">{{contact.email}} · {{contact.phone}} · {{contact.location}} {{contact.linkedin}}</div>
  </div>
  <div class="content">
    {{#summary}}<h2>Professional Summary</h2><p class="summary">{{summary}}</p>{{/summary}}

    {{#experience.length}}<h2>Professional Experience</h2>
    {{#experience}}<div class="entry">
      <div class="entry-header"><span class="entry-title">{{title}}</span><span class="entry-date">{{startDate}} – {{endDate}}</span></div>
      <div class="entry-subtitle">{{company}} · {{location}}</div>
      <ul>{{#bullets}}<li>{{.}}</li>{{/bullets}}</ul>
    </div>{{/experience}}{{/experience.length}}

    {{#education.length}}<h2>Education</h2>
    {{#education}}<div class="entry">
      <div class="entry-header"><span class="entry-title">{{degree}}</span><span class="entry-date">{{year}}</span></div>
      <div class="entry-subtitle">{{institution}} · {{location}}</div>
    </div>{{/education}}{{/education.length}}

    {{#skills.length}}<h2>Skills</h2>
    <div class="skills-grid">{{#skills}}<span>• {{.}}</span>{{/skills}}</div>{{/skills.length}}

    {{#certifications.length}}<h2>Certifications</h2>
    <ul>{{#certifications}}<li>{{name}} — {{issuer}} ({{year}})</li>{{/certifications}}</ul>{{/certifications.length}}

    {{#languages.length}}<h2>Languages</h2>
    <ul>{{#languages}}<li>{{name}} — {{proficiency}}</li>{{/languages}}</ul>{{/languages.length}}
  </div>
</div>'),

-- 5. Developer
('Developer', 'developer', 'Built for software engineers. Highlights technical skills, projects, and open-source contributions.', 'tech',
 '["contact","summary","experience","skills","projects"]',
 '["contact","summary","skills","experience","projects","education","certifications"]',
 5,
 '<style>
  .resume { font-family: "JetBrains Mono", "Fira Code", monospace; max-width: 800px; margin: 0 auto; padding: 36px 40px; color: #e2e8f0; background: #0f172a; line-height: 1.6; }
  .resume h1 { font-size: 26px; margin: 0; color: #38bdf8; }
  .resume .contact-line { font-size: 12px; color: #94a3b8; margin: 4px 0 24px; }
  .resume .contact-line a { color: #38bdf8; text-decoration: none; }
  .resume h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: #38bdf8; margin: 24px 0 10px; padding-bottom: 4px; border-bottom: 1px solid #1e293b; }
  .resume .entry { margin-bottom: 14px; }
  .resume .entry-title { font-weight: 700; font-size: 14px; color: #f1f5f9; }
  .resume .entry-meta { font-size: 12px; color: #64748b; margin: 2px 0 4px; }
  .resume ul { margin: 4px 0 0; padding-left: 18px; }
  .resume li { font-size: 13px; margin-bottom: 3px; color: #cbd5e1; }
  .resume .tech-stack { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
  .resume .tech-tag { background: #1e293b; border: 1px solid #334155; color: #38bdf8; padding: 2px 8px; border-radius: 4px; font-size: 11px; }
  .resume .skills-section { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .resume .skill-category { font-size: 13px; }
  .resume .skill-category strong { color: #38bdf8; }
  .resume .summary { font-size: 13px; color: #94a3b8; }
</style>
<div class="resume">
  <h1>{{contact.fullName}}</h1>
  <div class="contact-line">{{contact.email}} · {{contact.phone}} · {{contact.github}} · {{contact.location}}</div>

  {{#summary}}<h2>// Summary</h2><p class="summary">{{summary}}</p>{{/summary}}

  {{#skills.length}}<h2>// Tech Stack</h2>
  <div class="tech-stack">{{#skills}}<span class="tech-tag">{{.}}</span>{{/skills}}</div>{{/skills.length}}

  {{#experience.length}}<h2>// Experience</h2>
  {{#experience}}<div class="entry">
    <div class="entry-title">{{title}} @ {{company}}</div>
    <div class="entry-meta">{{startDate}} – {{endDate}} · {{location}}</div>
    <ul>{{#bullets}}<li>{{.}}</li>{{/bullets}}</ul>
  </div>{{/experience}}{{/experience.length}}

  {{#projects.length}}<h2>// Projects</h2>
  {{#projects}}<div class="entry">
    <div class="entry-title">{{name}}</div>
    <p style="font-size:13px;color:#94a3b8;margin:4px 0">{{description}}</p>
    {{#techStack}}<div class="tech-stack">{{#techStack}}<span class="tech-tag">{{.}}</span>{{/techStack}}</div>{{/techStack}}
  </div>{{/projects}}{{/projects.length}}

  {{#education.length}}<h2>// Education</h2>
  {{#education}}<div class="entry">
    <div class="entry-title" style="font-size:14px">{{degree}}</div>
    <div class="entry-meta">{{institution}} · {{year}}</div>
  </div>{{/education}}{{/education.length}}

  {{#certifications.length}}<h2>// Certifications</h2>
  <ul>{{#certifications}}<li>{{name}} — {{issuer}} ({{year}})</li>{{/certifications}}</ul>{{/certifications.length}}
</div>')

on conflict (slug) do nothing;
