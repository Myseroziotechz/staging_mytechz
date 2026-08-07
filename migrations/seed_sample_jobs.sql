-- ============================================================================
-- Seed: 10 sample jobs (mix of private + government) for local testing.
-- Apply on MyTechz Supabase only (project ref: aiycgmrubisaxknbeaov).
-- ============================================================================
-- HOW posted_by IS RESOLVED (in priority order):
--   1. If a custom GUC `seed.recruiter_uuid` is set in the same session,
--      that UUID is used. To set it from the Supabase SQL editor, run BEFORE
--      this script (in the same query window):
--          set seed.recruiter_uuid = '00000000-0000-0000-0000-000000000000';
--   2. Otherwise the first row from auth.users (oldest first) is used.
--   3. If auth.users is empty AND no override is given, the seed ABORTS with
--      a clear error — without this guard the previous version would silently
--      insert 0 jobs, which is what caused "data inserted but no cards" earlier.
--
-- Safe to re-run: ON CONFLICT DO NOTHING on jobs.slug.
-- Note: this script uses standard SQL only — paste it straight into the
-- Supabase SQL editor (no psql backslash commands).
-- ============================================================================

-- 0. Resolve the recruiter UUID into a temp table so every step can read it.
do $$
declare
  v_user_id uuid;
  v_override text;
begin
  -- pull psql var if provided
  begin
    v_override := current_setting('seed.recruiter_uuid', true);
  exception when others then
    v_override := null;
  end;

  if v_override is not null and v_override <> '' then
    v_user_id := v_override::uuid;
  else
    select id into v_user_id from auth.users order by created_at asc limit 1;
  end if;

  if v_user_id is null then
    raise exception
      E'Seed aborted: no posted_by UUID available.\n'
      '  - auth.users is empty in this Supabase project, AND\n'
      '  - the "seed.recruiter_uuid" setting was not provided.\n'
      'Fix:\n'
      '  Option A — sign up at least one user (recruiter/admin) on the site, then re-run.\n'
      '  Option B — in the Supabase SQL editor, run this in the SAME window before the seed:\n'
      '    set seed.recruiter_uuid = ''<your-uuid>'';';
  end if;

  -- stash for the rest of this script via a temp table
  drop table if exists pg_temp.seed_ctx;
  create temp table pg_temp.seed_ctx (user_id uuid not null);
  insert into pg_temp.seed_ctx values (v_user_id);

  raise notice 'seed: using posted_by = %', v_user_id;
end $$;

-- 1. Companies (idempotent — DO UPDATE so RETURNING covers re-runs)
with seed_companies as (
  insert into public.companies (name, slug, logo_url, website, industry, size, hq_location, about, is_verified)
  values
    ('Acme Cloud Labs',     'acme-cloud-labs',     null, 'https://acmecloud.example.com',  'IT Services',          '201-1000',  'Bengaluru, IN',  'Cloud-native engineering studio.',                            true),
    ('Northwind Bank',      'northwind-bank',      null, 'https://northwind.example.com',  'BFSI',                 '5000+',     'Mumbai, IN',     'Private retail and corporate bank.',                          true),
    ('Tata Helio',          'tata-helio',          null, 'https://tatahelio.example.com',  'Energy',               '1001-5000', 'Pune, IN',       'Renewable energy and grid infrastructure.',                   true),
    ('Pixel Pioneers',      'pixel-pioneers',      null, 'https://pixelpioneers.example',  'Product / SaaS',       '51-200',    'Hyderabad, IN',  'Design-led B2B SaaS company.',                                false),
    ('UPSC',                'upsc',                null, 'https://upsc.gov.in',            'Government',           '5000+',     'New Delhi, IN',  'Union Public Service Commission.',                            true),
    ('ISRO',                'isro',                null, 'https://isro.gov.in',            'Government / Defence', '5000+',     'Bengaluru, IN',  'Indian Space Research Organisation.',                         true),
    ('SBI',                 'state-bank-of-india', null, 'https://sbi.co.in',              'Government / BFSI',    '5000+',     'Mumbai, IN',     'State Bank of India — public-sector bank.',                   true)
  on conflict (slug) do update set updated_at = now()
  returning id, slug
)
-- 2. Jobs
insert into public.jobs (
  slug, title, description, summary, category, job_type, work_mode,
  company_id, posted_by,
  location_city, location_state, location_state_code, location_country, location_country_code, geo_lat, geo_lng,
  salary_min, salary_max, salary_currency, salary_period, is_salary_disclosed,
  experience_min, experience_max, openings,
  posted_at, application_deadline, job_start_date,
  skills, qualifications, department, industry, benefits,
  apply_mode, apply_url, apply_email, apply_phone,
  government_meta,
  status, is_featured, is_urgent,
  meta_title, meta_description, faq
)
select v.*
from (select user_id from pg_temp.seed_ctx limit 1) ctx,
     (values

  -- 1. Senior React Developer — Acme (private, internal apply, featured)
  ('senior-react-developer-bengaluru-ar0001',
   'Senior React Developer',
   E'We are hiring a Senior React Developer to lead our front-end platform team.\n\nResponsibilities\n- Architect and implement scalable React components.\n- Mentor mid-level engineers and review pull requests.\n- Partner with design and backend on API contracts.\n\nRequirements\n- 4+ years building production React apps.\n- Strong TypeScript, testing, and accessibility fundamentals.\n- Experience with Next.js is a strong plus.',
   'Lead React/Next.js engineering for our developer-tools SaaS — TypeScript, accessibility, mentoring 4 engineers.',
   'private'::public.job_category, 'full_time'::public.job_type, 'hybrid'::public.work_mode,
   (select id from seed_companies where slug = 'acme-cloud-labs'),
   (select user_id from pg_temp.seed_ctx limit 1),
   'Bengaluru', 'Karnataka', 'KA', 'India', 'IN', 12.971599, 77.594566,
   1800000, 2800000, 'INR', 'year', true,
   4, 7, 2,
   now() - interval '2 days', (current_date + 25)::date, (current_date + 45)::date,
   ARRAY['React','TypeScript','Next.js','Tailwind','Jest'],
   ARRAY['B.E. / B.Tech in CS or related','Strong portfolio'],
   'Engineering', 'IT Services',
   ARRAY['Health insurance','Stock options','Learning budget','Flexible hours'],
   'internal'::public.apply_mode, null, null, null,
   null::jsonb,
   'active'::public.job_status, true, false,
   null, null,
   '[{"q":"Is this role remote?","a":"It is hybrid — 3 days a week from our Bengaluru office."},{"q":"Do you sponsor visas?","a":"Not at this time, sorry."}]'::jsonb),

  -- 2. Backend Engineer (Go) — Acme (private, internal, remote)
  ('backend-engineer-go-bengaluru-ar0002',
   'Backend Engineer (Go)',
   E'Build the Go services that power our product.\n\nWhat you will do\n- Design and build microservices in Go.\n- Own observability, performance, and reliability.\n- Pair with the platform team on infra decisions.',
   'Go microservices, gRPC, Postgres. Focus on reliability and observability.',
   'private'::public.job_category, 'full_time'::public.job_type, 'remote'::public.work_mode,
   (select id from seed_companies where slug = 'acme-cloud-labs'),
   (select user_id from pg_temp.seed_ctx limit 1),
   null, null, null, 'India', 'IN', null, null,
   1500000, 2400000, 'INR', 'year', true,
   3, 6, 1,
   now() - interval '5 hours', (current_date + 30)::date, null,
   ARRAY['Go','PostgreSQL','gRPC','Kubernetes','AWS'],
   ARRAY['Any graduate'], 'Engineering', 'IT Services',
   ARRAY['Fully remote','Annual offsite','Health insurance'],
   'internal'::public.apply_mode, null, null, null,
   null::jsonb,
   'active'::public.job_status, false, false,
   null, null, null::jsonb),

  -- 3. Frontend Intern — Pixel Pioneers
  ('frontend-intern-hyderabad-ar0003',
   'Frontend Engineering Intern',
   E'A 6-month paid internship for final-year students passionate about frontend.',
   '6-month paid internship. Build real features with the design team.',
   'private'::public.job_category, 'internship'::public.job_type, 'onsite'::public.work_mode,
   (select id from seed_companies where slug = 'pixel-pioneers'),
   (select user_id from pg_temp.seed_ctx limit 1),
   'Hyderabad', 'Telangana', 'TG', 'India', 'IN', 17.385044, 78.486671,
   25000, 35000, 'INR', 'month', true,
   0, 1, 5,
   now() - interval '1 day', (current_date + 14)::date, null,
   ARRAY['HTML','CSS','JavaScript','React'],
   ARRAY['Pursuing B.E. / B.Tech (final year)'],
   'Design Engineering', 'Product / SaaS',
   ARRAY['Mentorship','Free meals','Conversion to full-time'],
   'internal'::public.apply_mode, null, null, null,
   null::jsonb,
   'active'::public.job_status, false, true,
   null, null, null::jsonb),

  -- 4. UX Designer — Pixel Pioneers (external apply)
  ('senior-ux-designer-remote-ar0004',
   'Senior UX Designer',
   E'Lead UX for our flagship analytics product. Own end-to-end design from research to ship.',
   'Lead UX for our analytics SaaS — research, prototyping, design system ownership.',
   'private'::public.job_category, 'full_time'::public.job_type, 'remote'::public.work_mode,
   (select id from seed_companies where slug = 'pixel-pioneers'),
   (select user_id from pg_temp.seed_ctx limit 1),
   null, null, null, 'India', 'IN', null, null,
   1700000, 2500000, 'INR', 'year', true,
   5, 9, 1,
   now() - interval '3 days', (current_date + 21)::date, null,
   ARRAY['Figma','User Research','Prototyping','Design Systems'],
   ARRAY['Portfolio required'],
   'Design', 'Product / SaaS',
   ARRAY['Remote-first','Equipment stipend','Health insurance'],
   'external'::public.apply_mode, 'https://pixelpioneers.example/careers/ux-designer', null, null,
   null::jsonb,
   'active'::public.job_status, false, false,
   null, null, null::jsonb),

  -- 5. Relationship Manager — Northwind Bank
  ('relationship-manager-mumbai-ar0005',
   'Relationship Manager — Wealth',
   E'Manage HNI client portfolios for our wealth-management arm.\nGrow AUM, advise on cross-sell, ensure compliance.',
   'Manage HNI portfolios, grow AUM, drive cross-sell. Wealth-management track.',
   'private'::public.job_category, 'full_time'::public.job_type, 'onsite'::public.work_mode,
   (select id from seed_companies where slug = 'northwind-bank'),
   (select user_id from pg_temp.seed_ctx limit 1),
   'Mumbai', 'Maharashtra', 'MH', 'India', 'IN', 19.075983, 72.877655,
   1200000, 1900000, 'INR', 'year', true,
   3, 8, 4,
   now() - interval '6 days', (current_date + 18)::date, null,
   ARRAY['Wealth Management','Sales','Banking','Compliance'],
   ARRAY['MBA preferred','NISM certifications'],
   'Wealth', 'BFSI',
   ARRAY['PF','Group health insurance','Performance bonus'],
   'internal'::public.apply_mode, null, null, null,
   null::jsonb,
   'active'::public.job_status, false, false,
   null, null, null::jsonb),

  -- 6. Solar Project Engineer — Tata Helio (email apply)
  ('solar-project-engineer-pune-ar0006',
   'Solar Project Engineer',
   E'Lead site survey, BoQ, and execution of utility-scale solar projects across western India.',
   'Utility-scale solar — site survey, BoQ, execution. Travel ~30%.',
   'private'::public.job_category, 'full_time'::public.job_type, 'hybrid'::public.work_mode,
   (select id from seed_companies where slug = 'tata-helio'),
   (select user_id from pg_temp.seed_ctx limit 1),
   'Pune', 'Maharashtra', 'MH', 'India', 'IN', 18.520430, 73.856743,
   900000, 1500000, 'INR', 'year', true,
   2, 6, 2,
   now() - interval '4 days', (current_date + 28)::date, null,
   ARRAY['Solar Design','AutoCAD','PVsyst','Project Management'],
   ARRAY['B.E. Electrical / Mechanical'],
   'Projects', 'Energy',
   ARRAY['Travel allowance','Health insurance'],
   'email'::public.apply_mode, null, 'careers@tatahelio.example.com', null,
   null::jsonb,
   'active'::public.job_status, false, false,
   null, null, null::jsonb),

  -- 7. Civil Services Examination — UPSC (government)
  ('civil-services-examination-2026-ar0007',
   'Civil Services Examination 2026',
   E'Notification 05/2026.\nApplications invited for IAS, IPS, IFS and allied services.',
   'IAS / IPS / IFS recruitment. Notification 05/2026 — apply on the official portal.',
   'government'::public.job_category, 'full_time'::public.job_type, 'onsite'::public.work_mode,
   (select id from seed_companies where slug = 'upsc'),
   (select user_id from pg_temp.seed_ctx limit 1),
   'New Delhi', 'Delhi', 'DL', 'India', 'IN', 28.613939, 77.209023,
   null, null, 'INR', 'year', false,
   0, null, 1056,
   now() - interval '2 days', (current_date + 30)::date, null,
   ARRAY['General Studies','CSAT','Essay'],
   ARRAY['Bachelor degree from a recognized university'],
   'Civil Services', 'Government',
   ARRAY['Pension','Government quarters'],
   'external'::public.apply_mode, 'https://upsconline.gov.in', null, null,
   '{"organization":"UPSC","notification_number":"05/2026","notification_pdf_url":"https://upsc.gov.in/notification.pdf","exam_date":"2026-08-15","admit_card_date":"2026-07-20","age_min":21,"age_max":32,"age_relaxation":"OBC +3, SC/ST +5","fee_general":100,"fee_reserved":0}'::jsonb,
   'active'::public.job_status, true, false,
   null, null,
   '[{"q":"Who can apply?","a":"Indian citizens aged 21–32 with a recognized bachelor degree."},{"q":"What is the application fee?","a":"₹100 for general; reserved categories are exempt."}]'::jsonb),

  -- 8. Scientist/Engineer SC — ISRO (government)
  ('scientist-engineer-sc-bengaluru-ar0008',
   'Scientist / Engineer ''SC'' — Electronics',
   E'ISRO recruitment for Scientist/Engineer ''SC'' in the Electronics discipline.',
   'Scientist/Engineer SC — Electronics. ISRO Bengaluru. Pay Level 10.',
   'government'::public.job_category, 'full_time'::public.job_type, 'onsite'::public.work_mode,
   (select id from seed_companies where slug = 'isro'),
   (select user_id from pg_temp.seed_ctx limit 1),
   'Bengaluru', 'Karnataka', 'KA', 'India', 'IN', 12.971599, 77.594566,
   816000, 1080000, 'INR', 'year', true,
   0, 3, 25,
   now() - interval '7 days', (current_date + 20)::date, null,
   ARRAY['Electronics','Embedded Systems','Signal Processing'],
   ARRAY['B.E. / B.Tech in ECE / EEE with min 65%'],
   'R&D', 'Defence / Space',
   ARRAY['Government pension','Quarters','Medical'],
   'external'::public.apply_mode, 'https://isro.gov.in/careers', null, null,
   '{"organization":"ISRO","notification_number":"ISRO/HQ/RMT/2026","notification_pdf_url":"https://isro.gov.in/sites/default/files/recruitment.pdf","exam_date":"2026-09-10","age_min":21,"age_max":28,"age_relaxation":"OBC +3, SC/ST +5, PwD +10","fee_general":250,"fee_reserved":0}'::jsonb,
   'active'::public.job_status, true, true,
   null, null, null::jsonb),

  -- 9. Probationary Officer — SBI (government)
  ('sbi-probationary-officer-2026-ar0009',
   'SBI Probationary Officer 2026',
   E'State Bank of India — Probationary Officer recruitment.',
   'SBI PO 2026 — preliminary + main + interview. Apply by 30th May.',
   'government'::public.job_category, 'full_time'::public.job_type, 'onsite'::public.work_mode,
   (select id from seed_companies where slug = 'state-bank-of-india'),
   (select user_id from pg_temp.seed_ctx limit 1),
   'Mumbai', 'Maharashtra', 'MH', 'India', 'IN', 19.075983, 72.877655,
   480000, 720000, 'INR', 'year', true,
   0, null, 2000,
   now() - interval '8 hours', (current_date + 12)::date, null,
   ARRAY['English','Reasoning','Quantitative Aptitude','General Awareness'],
   ARRAY['Bachelor degree in any discipline'],
   'Banking Operations', 'Government / BFSI',
   ARRAY['DA','HRA','Pension','Medical for self & dependents'],
   'external'::public.apply_mode, 'https://sbi.co.in/careers', null, null,
   '{"organization":"SBI","notification_number":"CRPD/PO/2026","notification_pdf_url":"https://sbi.co.in/po-2026.pdf","exam_date":"2026-07-05","age_min":21,"age_max":30,"age_relaxation":"OBC +3, SC/ST +5","fee_general":750,"fee_reserved":125}'::jsonb,
   'active'::public.job_status, false, true,
   null, null, null::jsonb),

  -- 10. Field Sales Executive — Northwind (phone apply)
  ('field-sales-executive-pune-ar0010',
   'Field Sales Executive — Personal Loans',
   E'Drive personal-loan acquisition through field visits and walk-in branches.',
   'Field sales for personal loans. Daily visits, branch tie-ups, monthly targets.',
   'private'::public.job_category, 'full_time'::public.job_type, 'onsite'::public.work_mode,
   (select id from seed_companies where slug = 'northwind-bank'),
   (select user_id from pg_temp.seed_ctx limit 1),
   'Pune', 'Maharashtra', 'MH', 'India', 'IN', 18.520430, 73.856743,
   300000, 450000, 'INR', 'year', true,
   0, 3, 8,
   now() - interval '12 hours', (current_date + 21)::date, null,
   ARRAY['Sales','Communication','Negotiation'],
   ARRAY['Any graduate'],
   'Retail Banking', 'BFSI',
   ARRAY['Incentives','Travel allowance'],
   'phone'::public.apply_mode, null, null, '+91-9876543210',
   null::jsonb,
   'active'::public.job_status, false, false,
   null, null, null::jsonb)

) as v(
  slug, title, description, summary, category, job_type, work_mode,
  company_id, posted_by,
  location_city, location_state, location_state_code, location_country, location_country_code, geo_lat, geo_lng,
  salary_min, salary_max, salary_currency, salary_period, is_salary_disclosed,
  experience_min, experience_max, openings,
  posted_at, application_deadline, job_start_date,
  skills, qualifications, department, industry, benefits,
  apply_mode, apply_url, apply_email, apply_phone,
  government_meta,
  status, is_featured, is_urgent,
  meta_title, meta_description, faq
)
on conflict (slug) do nothing;

-- 3. Verification — print row counts so you can confirm success at a glance.
do $$
declare v_total int; v_active int; v_private int; v_gov int;
begin
  select count(*) into v_total   from public.jobs;
  select count(*) into v_active  from public.jobs where status = 'active';
  select count(*) into v_private from public.jobs where status = 'active' and category = 'private';
  select count(*) into v_gov     from public.jobs where status = 'active' and category = 'government';
  raise notice 'seed: jobs total=%, active=%, private=%, government=%',
    v_total, v_active, v_private, v_gov;
  if v_active = 0 then
    raise warning 'seed: NO ACTIVE JOBS exist after seeding — check the messages above for a posted_by error.';
  end if;
end $$;
