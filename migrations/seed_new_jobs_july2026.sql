-- ============================================================================
-- Seed: 65 new jobs (Private + Government + Internships) — July 2026
-- Safe to re-run: ON CONFLICT DO NOTHING on slug.
-- ============================================================================

-- 0. Resolve the recruiter UUID
do $$
declare
  v_user_id uuid;
  v_override text;
begin
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
    raise exception 'Seed aborted: no posted_by UUID. Sign up a user or set seed.recruiter_uuid.';
  end if;

  drop table if exists pg_temp.seed_ctx;
  create temp table pg_temp.seed_ctx (user_id uuid not null);
  insert into pg_temp.seed_ctx values (v_user_id);
  raise notice 'seed: using posted_by = %', v_user_id;
end $$;

-- 1. Ensure enum values exist (safe if already added)
do $$
begin
  begin alter type public.job_category add value if not exists 'internship'; exception when others then null; end;
  begin alter type public.job_category add value if not exists 'ai'; exception when others then null; end;
end $$;

-- 2. Companies (idempotent)
with seed_companies as (
  insert into public.companies (name, slug, logo_url, website, industry, size, hq_location, about, is_verified)
  values
    ('Google India',       'google-india',       null, 'https://careers.google.com', 'Technology',     '5000+',    'Bengaluru, IN', 'Global tech leader — Search, Cloud, AI.',            true),
    ('Microsoft India',    'microsoft-india',     null, 'https://careers.microsoft.com', 'Technology',  '5000+',    'Hyderabad, IN', 'Enterprise software, Azure cloud, AI.',               true),
    ('Amazon India',       'amazon-india',        null, 'https://amazon.jobs',       'E-commerce / Tech', '5000+', 'Bengaluru, IN', 'E-commerce, AWS, logistics.',                         true),
    ('Flipkart',           'flipkart',            null, 'https://flipkart.com',      'E-commerce',    '5000+',    'Bengaluru, IN', 'India largest e-commerce marketplace.',                true),
    ('Razorpay',           'razorpay',            null, 'https://razorpay.com',      'Fintech',       '1001-5000','Bengaluru, IN', 'Payment gateway and financial services.',              true),
    ('PhonePe',            'phonepe',             null, 'https://phonepe.com',       'Fintech',       '5000+',    'Bengaluru, IN', 'India leading UPI payments platform.',                 true),
    ('CRED',               'cred',                null, 'https://cred.club',         'Fintech',       '201-1000', 'Bengaluru, IN', 'Premium credit card rewards platform.',                true),
    ('Swiggy',             'swiggy',              null, 'https://swiggy.com',        'Food Tech',     '5000+',    'Bengaluru, IN', 'Food delivery and quick commerce.',                    true),
    ('Zomato',             'zomato',              null, 'https://zomato.com',        'Food Tech',     '5000+',    'Gurgaon, IN',   'Food delivery, dining, and quick commerce.',           true),
    ('Meesho',             'meesho',              null, 'https://meesho.com',        'E-commerce',    '1001-5000','Bengaluru, IN', 'Social commerce platform for small businesses.',       true),
    ('Groww',              'groww',               null, 'https://groww.in',          'Fintech',       '1001-5000','Bengaluru, IN', 'Investment platform — stocks, MFs, FDs.',              true),
    ('Zerodha',            'zerodha',             null, 'https://zerodha.com',       'Fintech',       '201-1000', 'Bengaluru, IN', 'India largest retail stockbroker.',                    true),
    ('TCS',                'tcs',                 null, 'https://tcs.com',           'IT Services',   '5000+',    'Mumbai, IN',    'Tata Consultancy Services — global IT leader.',       true),
    ('Infosys',            'infosys',             null, 'https://infosys.com',       'IT Services',   '5000+',    'Bengaluru, IN', 'Global IT consulting and services.',                   true),
    ('Wipro',              'wipro',               null, 'https://wipro.com',         'IT Services',   '5000+',    'Bengaluru, IN', 'Global IT, consulting, and business services.',        true),
    ('HCLTech',            'hcltech',             null, 'https://hcltech.com',       'IT Services',   '5000+',    'Noida, IN',     'Global technology company.',                           true),
    ('Paytm',              'paytm',               null, 'https://paytm.com',         'Fintech',       '5000+',    'Noida, IN',     'Digital payments and financial services.',             true),
    ('Salesforce India',   'salesforce-india',     null, 'https://salesforce.com',   'Technology',    '5000+',    'Hyderabad, IN', 'Global CRM and enterprise cloud.',                     true),
    ('Deloitte India',     'deloitte-india',       null, 'https://deloitte.com',     'Consulting',    '5000+',    'Mumbai, IN',    'Big Four — audit, consulting, advisory.',              true),
    ('Accenture India',    'accenture-india',      null, 'https://accenture.com',    'IT Services',   '5000+',    'Chennai, IN',   'Global consulting and IT services.',                   true),
    ('Ola',                'ola',                 null, 'https://olacabs.com',       'Mobility',      '1001-5000','Bengaluru, IN', 'Ride-hailing and electric vehicles.',                  true),
    ('Nykaa',              'nykaa',               null, 'https://nykaa.com',         'E-commerce',    '1001-5000','Mumbai, IN',    'Beauty and fashion e-commerce.',                       true),
    ('Jio Platforms',      'jio-platforms',        null, 'https://jio.com',          'Telecom',       '5000+',    'Mumbai, IN',    'India largest telecom and digital services.',          true),
    ('Adobe India',        'adobe-india',          null, 'https://adobe.com',        'Technology',    '5000+',    'Noida, IN',     'Creative and document cloud software.',                true),
    ('Goldman Sachs India','goldman-sachs-india',  null, 'https://goldmansachs.com', 'BFSI',         '5000+',    'Bengaluru, IN', 'Global investment banking and securities.',            true),
    ('Bosch India',        'bosch-india',          null, 'https://bosch.in',         'Manufacturing', '5000+',    'Bengaluru, IN', 'Auto components, IoT, engineering.',                   true),
    ('upGrad',             'upgrad',               null, 'https://upgrad.com',       'EdTech',        '1001-5000','Mumbai, IN',    'Online higher education platform.',                    true),
    ('CoinDCX',            'coindcx',              null, 'https://coindcx.com',      'Crypto / Fintech','51-200', 'Mumbai, IN',    'India leading crypto exchange.',                       true),
    ('SSC',                'ssc',                  null, 'https://ssc.gov.in',       'Government',    '5000+',    'New Delhi, IN', 'Staff Selection Commission.',                          true),
    ('IBPS',               'ibps',                 null, 'https://ibps.in',          'Government',    '5000+',    'Mumbai, IN',    'Institute of Banking Personnel Selection.',            true),
    ('RBI',                'rbi',                  null, 'https://rbi.org.in',       'Government / BFSI','5000+', 'Mumbai, IN',    'Reserve Bank of India — central bank.',                true),
    ('RRB',                'rrb',                  null, 'https://rrbcdg.gov.in',    'Government',    '5000+',    'New Delhi, IN', 'Railway Recruitment Board.',                           true),
    ('DRDO',               'drdo',                 null, 'https://drdo.gov.in',      'Government / Defence','5000+','New Delhi, IN','Defence Research and Development Organisation.',      true),
    ('Indian Army',        'indian-army',          null, 'https://joinindianarmy.nic.in','Government / Defence','5000+','New Delhi, IN','Indian Armed Forces — Army.',                     true),
    ('Indian Navy',        'indian-navy',          null, 'https://joinindiannavy.gov.in','Government / Defence','5000+','New Delhi, IN','Indian Armed Forces — Navy.',                     true),
    ('Indian Air Force',   'indian-air-force',     null, 'https://indianairforce.nic.in','Government / Defence','5000+','New Delhi, IN','Indian Armed Forces — Air Force.',                true),
    ('KVS',                'kvs',                  null, 'https://kvsangathan.nic.in','Government / Education','5000+','New Delhi, IN','Kendriya Vidyalaya Sangathan.',                   true),
    ('NVS',                'nvs',                  null, 'https://navodaya.gov.in',  'Government / Education','5000+','New Delhi, IN','Navodaya Vidyalaya Samiti.',                       true),
    ('NTPC',               'ntpc',                 null, 'https://ntpc.co.in',       'Government / PSU','5000+',  'New Delhi, IN', 'India largest power generation company.',              true),
    ('ONGC',               'ongc',                 null, 'https://ongcindia.com',    'Government / PSU','5000+',  'New Delhi, IN', 'Oil and Natural Gas Corporation.',                     true),
    ('IOCL',               'iocl',                 null, 'https://iocl.com',         'Government / PSU','5000+',  'New Delhi, IN', 'Indian Oil Corporation Limited.',                      true),
    ('BHEL',               'bhel',                 null, 'https://bhel.com',         'Government / PSU','5000+',  'New Delhi, IN', 'Bharat Heavy Electricals Limited.',                    true),
    ('State PSC',          'state-psc',            null, 'https://uppsc.up.nic.in',  'Government',    '5000+',    'Lucknow, IN',  'State Public Service Commissions.',                    true),
    ('CBSE',               'cbse',                 null, 'https://cbse.gov.in',      'Government / Education','5000+','New Delhi, IN','Central Board of Secondary Education.',             true),
    ('Dunzo',              'dunzo',                null, 'https://dunzo.com',        'Quick Commerce', '201-1000','Bengaluru, IN', 'Quick commerce and hyperlocal delivery.',              true),
    ('Tata Group',         'tata-group',           null, 'https://tata.com',         'Conglomerate',  '5000+',    'Mumbai, IN',    'India largest conglomerate.',                          true)
  on conflict (slug) do update set updated_at = now()
  returning id, slug
)
-- =========================================================================
-- 3A. PRIVATE JOBS (22 jobs)
-- =========================================================================
insert into public.jobs (
  slug, title, description, summary, category, job_type, work_mode,
  company_id, posted_by,
  location_city, location_state, location_state_code, location_country, location_country_code,
  salary_min, salary_max, salary_currency, salary_period, is_salary_disclosed,
  experience_min, experience_max, openings,
  posted_at, application_deadline,
  skills, qualifications, department, industry, benefits,
  apply_mode, apply_url, apply_email, apply_phone,
  government_meta, status, is_featured, is_urgent,
  meta_title, meta_description, faq
)
select v.*
from (values

  -- P1. Senior AI/ML Engineer — Google
  ('senior-ai-ml-engineer-bengaluru-g001',
   'Senior AI/ML Engineer',
   E'Design and deploy large-scale AI/ML models for Google Cloud and Search products.\n\nResponsibilities\n- Build and fine-tune LLM architectures for production use.\n- Design ML pipelines using TensorFlow and JAX.\n- Collaborate with research teams on cutting-edge AI systems.\n\nRequirements\n- 3+ years in ML/AI with production deployments.\n- Strong Python, deep learning frameworks, and MLOps experience.',
   'Build large-scale AI/ML models for Google Cloud and Search — LLMs, TensorFlow, MLOps.',
   'private'::public.job_category, 'full_time'::public.job_type, 'hybrid'::public.work_mode,
   (select id from public.companies where slug = 'google-india'), (select user_id from pg_temp.seed_ctx limit 1),
   'Bengaluru', 'Karnataka', 'KA', 'India', 'IN',
   3500000, 7500000, 'INR', 'year', true,
   3, 8, 3,
   now() - interval '1 day', (current_date + 30)::date,
   ARRAY['Python','TensorFlow','PyTorch','LLMs','NLP','Deep Learning','MLOps','Cloud AI'],
   ARRAY['B.Tech/M.Tech in CS/AI/ML'], 'AI Research', 'Technology',
   ARRAY['Health insurance','RSUs','Free meals','Gym','Learning budget'],
   'external'::public.apply_mode, 'https://careers.google.com', null, null,
   null::jsonb, 'active'::public.job_status, true, false, null, null, null::jsonb),

  -- P2. Full Stack Developer (SDE-2) — Microsoft
  ('full-stack-developer-sde2-hyderabad-m001',
   'Full Stack Developer (SDE-2)',
   E'Build enterprise-grade applications on Azure cloud platform.\n\nWhat you will do\n- Develop features for Microsoft 365 and Teams.\n- Work with React, Node.js, and C#/.NET.\n- Collaborate with cross-functional teams globally.\n\nRequirements\n- 2+ years full-stack development experience.\n- Proficiency in TypeScript and system design.',
   'Build enterprise apps for Microsoft 365 and Teams — React, Node.js, Azure, TypeScript.',
   'private'::public.job_category, 'full_time'::public.job_type, 'hybrid'::public.work_mode,
   (select id from public.companies where slug = 'microsoft-india'), (select user_id from pg_temp.seed_ctx limit 1),
   'Hyderabad', 'Telangana', 'TG', 'India', 'IN',
   2500000, 5500000, 'INR', 'year', true,
   2, 6, 5,
   now() - interval '2 days', (current_date + 28)::date,
   ARRAY['React','Node.js','TypeScript','Azure','C#','.NET','System Design','SQL'],
   ARRAY['B.Tech in CS or related'], 'Engineering', 'Technology',
   ARRAY['Health insurance','RSUs','Annual bonus','Flexible hours'],
   'external'::public.apply_mode, 'https://careers.microsoft.com', null, null,
   null::jsonb, 'active'::public.job_status, true, false, null, null, null::jsonb),

  -- P3. Cloud Solutions Architect — AWS
  ('cloud-solutions-architect-gurgaon-a001',
   'Cloud Solutions Architect',
   E'Design cloud-native architectures for enterprise clients migrating to AWS.\n\nResponsibilities\n- Lead technical workshops and architecture reviews.\n- Guide mission-critical workload migrations.\n- Work with Kubernetes, Terraform, and serverless.\n\nRequirements\n- 4+ years cloud architecture experience.\n- AWS certifications preferred.',
   'Design cloud-native architectures for enterprise AWS migrations — Kubernetes, Terraform, serverless.',
   'private'::public.job_category, 'full_time'::public.job_type, 'hybrid'::public.work_mode,
   (select id from public.companies where slug = 'amazon-india'), (select user_id from pg_temp.seed_ctx limit 1),
   'Gurgaon', 'Haryana', 'HR', 'India', 'IN',
   3000000, 6500000, 'INR', 'year', true,
   4, 10, 2,
   now() - interval '3 days', (current_date + 25)::date,
   ARRAY['AWS','Kubernetes','Docker','Terraform','Python','Microservices','Serverless','CI/CD'],
   ARRAY['B.Tech in CS','AWS certifications preferred'], 'Cloud Architecture', 'Technology',
   ARRAY['Health insurance','RSUs','Relocation support'],
   'external'::public.apply_mode, 'https://amazon.jobs', null, null,
   null::jsonb, 'active'::public.job_status, false, false, null, null, null::jsonb),

  -- P4. DevOps Engineer — Flipkart
  ('devops-engineer-bengaluru-f001',
   'DevOps Engineer',
   E'Manage and scale Flipkart infrastructure serving 500M+ users.\n\nWhat you will do\n- Build robust CI/CD pipelines.\n- Ensure 99.99% uptime during high-traffic sale events.\n- Manage Kubernetes clusters at scale.\n\nRequirements\n- 2+ years DevOps/SRE experience.\n- Strong Kubernetes, Docker, and cloud skills.',
   'Scale Flipkart infrastructure for 500M+ users — Kubernetes, CI/CD, 99.99% uptime.',
   'private'::public.job_category, 'full_time'::public.job_type, 'hybrid'::public.work_mode,
   (select id from public.companies where slug = 'flipkart'), (select user_id from pg_temp.seed_ctx limit 1),
   'Bengaluru', 'Karnataka', 'KA', 'India', 'IN',
   1800000, 3500000, 'INR', 'year', true,
   2, 6, 3,
   now() - interval '1 day', (current_date + 21)::date,
   ARRAY['Kubernetes','Docker','Jenkins','Terraform','AWS','Linux','Python','Prometheus'],
   ARRAY['B.Tech in CS or related'], 'Platform Engineering', 'E-commerce',
   ARRAY['Health insurance','ESOPs','Free meals','Flexible hours'],
   'external'::public.apply_mode, 'https://flipkart.com/careers', null, null,
   null::jsonb, 'active'::public.job_status, false, false, null, null, null::jsonb),

  -- P5. Backend Engineer (Payments) — Razorpay
  ('backend-engineer-payments-bengaluru-r001',
   'Backend Engineer (Payments)',
   E'Build and scale payment processing systems handling millions of daily transactions.\n\nWhat you will do\n- Design high-throughput, low-latency distributed systems.\n- Own microservices powering India digital payments.\n- Work with Go, Java, Kafka, and PostgreSQL.\n\nRequirements\n- 2+ years backend development.\n- Experience with distributed systems.',
   'Build payment systems handling millions of daily txns — Go, Java, Kafka, PostgreSQL.',
   'private'::public.job_category, 'full_time'::public.job_type, 'hybrid'::public.work_mode,
   (select id from public.companies where slug = 'razorpay'), (select user_id from pg_temp.seed_ctx limit 1),
   'Bengaluru', 'Karnataka', 'KA', 'India', 'IN',
   2000000, 4200000, 'INR', 'year', true,
   2, 5, 4,
   now() - interval '4 hours', (current_date + 25)::date,
   ARRAY['Go','Java','Microservices','PostgreSQL','Redis','Kafka','System Design','API Design'],
   ARRAY['B.Tech in CS or related'], 'Payments Engineering', 'Fintech',
   ARRAY['Health insurance','ESOPs','Learning budget','Gym membership'],
   'internal'::public.apply_mode, null, null, null,
   null::jsonb, 'active'::public.job_status, false, true, null, null, null::jsonb),

  -- P6. Data Scientist — PhonePe
  ('data-scientist-bengaluru-pp001',
   'Data Scientist',
   E'Drive data-driven decision-making for PhonePe 500M+ user base.\n\nWhat you will do\n- Build predictive models for fraud detection and user engagement.\n- Run A/B tests and optimize transaction flows.\n- Work with Spark, Python, and ML frameworks.\n\nRequirements\n- 2+ years in data science with production ML.\n- Strong stats and SQL fundamentals.',
   'Build ML models for fraud detection and user engagement — Python, Spark, 500M+ users.',
   'private'::public.job_category, 'full_time'::public.job_type, 'hybrid'::public.work_mode,
   (select id from public.companies where slug = 'phonepe'), (select user_id from pg_temp.seed_ctx limit 1),
   'Bengaluru', 'Karnataka', 'KA', 'India', 'IN',
   1800000, 4000000, 'INR', 'year', true,
   2, 5, 2,
   now() - interval '2 days', (current_date + 22)::date,
   ARRAY['Python','SQL','Machine Learning','Statistics','A/B Testing','Spark','Pandas','Tableau'],
   ARRAY['B.Tech/M.Tech in CS/Stats/Math'], 'Data Science', 'Fintech',
   ARRAY['Health insurance','ESOPs','Free meals','Wellness program'],
   'internal'::public.apply_mode, null, null, null,
   null::jsonb, 'active'::public.job_status, false, false, null, null, null::jsonb),

  -- P7. Cybersecurity Analyst — TCS
  ('cybersecurity-analyst-mumbai-tcs001',
   'Cybersecurity Analyst',
   E'Monitor and protect enterprise client infrastructure from cyber threats.\n\nResponsibilities\n- Conduct vulnerability assessments and penetration testing.\n- Lead incident response for Fortune 500 clients.\n- Work with SIEM tools and SOC operations.\n\nRequirements\n- 1+ years in cybersecurity or SOC.\n- CISSP or CEH certification preferred.',
   'Protect Fortune 500 client infrastructure — SIEM, penetration testing, incident response.',
   'private'::public.job_category, 'full_time'::public.job_type, 'hybrid'::public.work_mode,
   (select id from public.companies where slug = 'tcs'), (select user_id from pg_temp.seed_ctx limit 1),
   'Mumbai', 'Maharashtra', 'MH', 'India', 'IN',
   800000, 1800000, 'INR', 'year', true,
   1, 5, 6,
   now() - interval '3 days', (current_date + 30)::date,
   ARRAY['SIEM','Network Security','Penetration Testing','SOC','Firewalls','Incident Response'],
   ARRAY['B.Tech in CS/IT','CISSP or CEH preferred'], 'Cybersecurity', 'IT Services',
   ARRAY['Health insurance','PF','Annual bonus','Training budget'],
   'internal'::public.apply_mode, null, null, null,
   null::jsonb, 'active'::public.job_status, false, false, null, null, null::jsonb),

  -- P8. SDE-1 — Infosys
  ('software-developer-sde1-pune-inf001',
   'Software Development Engineer (SDE-1)',
   E'Develop enterprise applications for global clients in BFSI and retail.\n\nWhat you will do\n- Build and maintain Java/Spring Boot applications.\n- Write REST APIs and integrate with databases.\n- Participate in agile sprints and code reviews.\n\nRequirements\n- 0-2 years experience.\n- Strong Java and data structures fundamentals.',
   'Build enterprise Java/Spring Boot apps for BFSI and retail clients — REST APIs, Agile.',
   'private'::public.job_category, 'full_time'::public.job_type, 'onsite'::public.work_mode,
   (select id from public.companies where slug = 'infosys'), (select user_id from pg_temp.seed_ctx limit 1),
   'Pune', 'Maharashtra', 'MH', 'India', 'IN',
   600000, 1200000, 'INR', 'year', true,
   0, 2, 15,
   now() - interval '5 days', (current_date + 35)::date,
   ARRAY['Java','Spring Boot','REST APIs','MySQL','Git','Agile','Data Structures'],
   ARRAY['B.Tech in CS/IT'], 'Engineering', 'IT Services',
   ARRAY['Health insurance','PF','Training program','Relocation support'],
   'internal'::public.apply_mode, null, null, null,
   null::jsonb, 'active'::public.job_status, false, false, null, null, null::jsonb),

  -- P9. Generative AI Engineer — CRED
  ('generative-ai-engineer-bengaluru-cr001',
   'Generative AI Engineer',
   E'Build AI-powered features for CRED premium fintech platform.\n\nWhat you will do\n- Design and deploy RAG pipelines and LLM applications.\n- Build personalized financial recommendation systems.\n- Work with LangChain, vector databases, and OpenAI APIs.\n\nRequirements\n- 2+ years in AI/ML with GenAI focus.\n- Experience with LLMs and prompt engineering.',
   'Build GenAI features for CRED — RAG, LangChain, LLMs, personalized finance recommendations.',
   'private'::public.job_category, 'full_time'::public.job_type, 'hybrid'::public.work_mode,
   (select id from public.companies where slug = 'cred'), (select user_id from pg_temp.seed_ctx limit 1),
   'Bengaluru', 'Karnataka', 'KA', 'India', 'IN',
   2500000, 5500000, 'INR', 'year', true,
   2, 5, 2,
   now() - interval '6 hours', (current_date + 20)::date,
   ARRAY['Python','LLMs','RAG','LangChain','OpenAI API','Vector Databases','NLP','Prompt Engineering'],
   ARRAY['B.Tech/M.Tech in CS/AI'], 'AI Engineering', 'Fintech',
   ARRAY['Health insurance','ESOPs','Learning budget','Free meals'],
   'internal'::public.apply_mode, null, null, null,
   null::jsonb, 'active'::public.job_status, true, true, null, null, null::jsonb),

  -- P10. Product Manager — Swiggy
  ('product-manager-bengaluru-sw001',
   'Product Manager — Quick Commerce',
   E'Lead product strategy for Swiggy quick commerce vertical.\n\nWhat you will do\n- Define roadmap and prioritize features.\n- Run experiments and drive growth metrics.\n- Collaborate with engineering, design, and ops teams.\n\nRequirements\n- 3+ years as PM in consumer tech.\n- Strong analytical and communication skills.',
   'Lead quick-commerce product strategy — roadmap, A/B tests, growth metrics.',
   'private'::public.job_category, 'full_time'::public.job_type, 'hybrid'::public.work_mode,
   (select id from public.companies where slug = 'swiggy'), (select user_id from pg_temp.seed_ctx limit 1),
   'Bengaluru', 'Karnataka', 'KA', 'India', 'IN',
   2200000, 4500000, 'INR', 'year', true,
   3, 7, 2,
   now() - interval '2 days', (current_date + 24)::date,
   ARRAY['Product Strategy','Analytics','SQL','A/B Testing','Agile','User Research','PRDs'],
   ARRAY['MBA or B.Tech with PM experience'], 'Product', 'Food Tech',
   ARRAY['Health insurance','ESOPs','Free Swiggy credits','Flexible hours'],
   'internal'::public.apply_mode, null, null, null,
   null::jsonb, 'active'::public.job_status, false, false, null, null, null::jsonb),

  -- P11. Frontend Engineer (React) — Meesho
  ('frontend-engineer-react-bengaluru-me001',
   'Frontend Engineer (React)',
   E'Build performant mobile-first web experiences for 150M+ users.\n\nWhat you will do\n- Optimize page load times for Tier 2/3 city users.\n- Build conversion funnels and improve UX.\n- Work with React, Next.js, and TypeScript.\n\nRequirements\n- 2+ years React development.\n- Performance optimization experience.',
   'Build mobile-first React/Next.js apps for 150M+ users — performance, conversion optimization.',
   'private'::public.job_category, 'full_time'::public.job_type, 'hybrid'::public.work_mode,
   (select id from public.companies where slug = 'meesho'), (select user_id from pg_temp.seed_ctx limit 1),
   'Bengaluru', 'Karnataka', 'KA', 'India', 'IN',
   1500000, 3000000, 'INR', 'year', true,
   2, 5, 3,
   now() - interval '1 day', (current_date + 28)::date,
   ARRAY['React','JavaScript','TypeScript','Next.js','CSS','Performance Optimization','Redux'],
   ARRAY['B.Tech in CS or related'], 'Frontend Engineering', 'E-commerce',
   ARRAY['Health insurance','ESOPs','Free meals','Learning budget'],
   'internal'::public.apply_mode, null, null, null,
   null::jsonb, 'active'::public.job_status, false, false, null, null, null::jsonb),

  -- P12. Quantitative Analyst — Zerodha
  ('quantitative-analyst-bengaluru-z001',
   'Quantitative Analyst',
   E'Develop quantitative models for India largest retail stockbroker.\n\nWhat you will do\n- Analyze trading patterns for 15M+ investors.\n- Build risk management frameworks.\n- Develop time series and statistical models.\n\nRequirements\n- 1+ years in quant finance or data science.\n- Strong stats and financial markets knowledge.',
   'Build quant models for Zerodha — trading analytics, risk modeling, 15M+ investors.',
   'private'::public.job_category, 'full_time'::public.job_type, 'onsite'::public.work_mode,
   (select id from public.companies where slug = 'zerodha'), (select user_id from pg_temp.seed_ctx limit 1),
   'Bengaluru', 'Karnataka', 'KA', 'India', 'IN',
   1500000, 3500000, 'INR', 'year', true,
   1, 4, 2,
   now() - interval '4 days', (current_date + 26)::date,
   ARRAY['Python','Statistics','Financial Markets','SQL','Machine Learning','R','Time Series Analysis'],
   ARRAY['B.Tech/M.Tech in CS/Math/Stats'], 'Quant Research', 'Fintech',
   ARRAY['Health insurance','Profit sharing','Learning budget'],
   'internal'::public.apply_mode, null, null, null,
   null::jsonb, 'active'::public.job_status, false, false, null, null, null::jsonb),

  -- P13. Growth Marketing Manager — Groww
  ('growth-marketing-manager-bengaluru-gr001',
   'Growth Marketing Manager',
   E'Drive user acquisition and retention for Groww investment platform.\n\nWhat you will do\n- Plan multi-channel marketing campaigns.\n- Optimize Google Ads and social media spend.\n- Analyze funnel metrics and improve conversion.\n\nRequirements\n- 3+ years in growth/digital marketing.\n- Experience with performance marketing tools.',
   'Drive user acquisition — Google Ads, social media, content strategy, funnel optimization.',
   'private'::public.job_category, 'full_time'::public.job_type, 'hybrid'::public.work_mode,
   (select id from public.companies where slug = 'groww'), (select user_id from pg_temp.seed_ctx limit 1),
   'Bengaluru', 'Karnataka', 'KA', 'India', 'IN',
   1500000, 3000000, 'INR', 'year', true,
   3, 6, 2,
   now() - interval '3 days', (current_date + 22)::date,
   ARRAY['Digital Marketing','Google Ads','Facebook Ads','SEO','Analytics','Content Strategy','CRM'],
   ARRAY['MBA Marketing or equivalent'], 'Marketing', 'Fintech',
   ARRAY['Health insurance','ESOPs','Flexible hours'],
   'internal'::public.apply_mode, null, null, null,
   null::jsonb, 'active'::public.job_status, false, false, null, null, null::jsonb),

  -- P14. SRE — Zomato
  ('site-reliability-engineer-gurgaon-zm001',
   'Site Reliability Engineer (SRE)',
   E'Ensure reliability of Zomato food delivery and quick-commerce infrastructure.\n\nWhat you will do\n- Manage systems handling millions of daily orders.\n- Build monitoring and alerting systems.\n- Ensure strict SLA requirements during peak hours.\n\nRequirements\n- 3+ years in SRE/DevOps.\n- Strong distributed systems knowledge.',
   'SRE for Zomato — millions of daily orders, monitoring, SLA management, peak-hour reliability.',
   'private'::public.job_category, 'full_time'::public.job_type, 'hybrid'::public.work_mode,
   (select id from public.companies where slug = 'zomato'), (select user_id from pg_temp.seed_ctx limit 1),
   'Gurgaon', 'Haryana', 'HR', 'India', 'IN',
   2000000, 4000000, 'INR', 'year', true,
   3, 7, 2,
   now() - interval '1 day', (current_date + 21)::date,
   ARRAY['Go','Python','Kubernetes','AWS','Terraform','Monitoring','Linux','Distributed Systems'],
   ARRAY['B.Tech in CS or related'], 'Platform Engineering', 'Food Tech',
   ARRAY['Health insurance','ESOPs','Free Zomato credits','Gym'],
   'internal'::public.apply_mode, null, null, null,
   null::jsonb, 'active'::public.job_status, false, false, null, null, null::jsonb),

  -- P15. Data Engineer — Wipro
  ('data-engineer-hyderabad-wi001',
   'Data Engineer',
   E'Design and build data pipelines for enterprise clients.\n\nWhat you will do\n- Process terabytes of data for analytics and ML workflows.\n- Work with Spark, Airflow, and cloud data warehouses.\n- Build ETL pipelines for healthcare and banking clients.\n\nRequirements\n- 1+ years data engineering experience.\n- Strong SQL, Python, and big data skills.',
   'Build data pipelines — Spark, Airflow, Snowflake, ETL for healthcare and banking clients.',
   'private'::public.job_category, 'full_time'::public.job_type, 'hybrid'::public.work_mode,
   (select id from public.companies where slug = 'wipro'), (select user_id from pg_temp.seed_ctx limit 1),
   'Hyderabad', 'Telangana', 'TG', 'India', 'IN',
   800000, 2000000, 'INR', 'year', true,
   1, 4, 5,
   now() - interval '5 days', (current_date + 30)::date,
   ARRAY['Python','SQL','Spark','Airflow','AWS','ETL','Data Warehousing','Snowflake'],
   ARRAY['B.Tech in CS/IT'], 'Data Engineering', 'IT Services',
   ARRAY['Health insurance','PF','Annual bonus','Training'],
   'internal'::public.apply_mode, null, null, null,
   null::jsonb, 'active'::public.job_status, false, false, null, null, null::jsonb),

  -- P16. UI/UX Designer — Paytm
  ('ui-ux-designer-noida-pt001',
   'UI/UX Designer',
   E'Design intuitive experiences for Paytm suite of financial products.\n\nWhat you will do\n- Create design systems for payments, banking, and insurance.\n- Conduct user research and usability testing.\n- Work across 350M+ user touchpoints.\n\nRequirements\n- 2+ years UI/UX design experience.\n- Strong Figma and prototyping skills.',
   'Design experiences for 350M+ users — payments, banking, insurance. Figma, design systems.',
   'private'::public.job_category, 'full_time'::public.job_type, 'hybrid'::public.work_mode,
   (select id from public.companies where slug = 'paytm'), (select user_id from pg_temp.seed_ctx limit 1),
   'Noida', 'Uttar Pradesh', 'UP', 'India', 'IN',
   1000000, 2200000, 'INR', 'year', true,
   2, 5, 2,
   now() - interval '2 days', (current_date + 25)::date,
   ARRAY['Figma','User Research','Wireframing','Prototyping','Design Systems','Accessibility'],
   ARRAY['B.Des/M.Des or portfolio'], 'Design', 'Fintech',
   ARRAY['Health insurance','ESOPs','Free meals'],
   'internal'::public.apply_mode, null, null, null,
   null::jsonb, 'active'::public.job_status, false, false, null, null, null::jsonb),

  -- P17. SAP Consultant — Accenture
  ('sap-consultant-chennai-acc001',
   'SAP S/4HANA Consultant',
   E'Lead SAP S/4HANA implementations for enterprise clients.\n\nWhat you will do\n- Provide functional and technical ERP consulting.\n- Lead data migration and integration projects.\n- Guide organizations through digital transformation.\n\nRequirements\n- 3+ years SAP experience.\n- S/4HANA certification preferred.',
   'Lead SAP S/4HANA implementations — ERP consulting, data migration, digital transformation.',
   'private'::public.job_category, 'full_time'::public.job_type, 'hybrid'::public.work_mode,
   (select id from public.companies where slug = 'accenture-india'), (select user_id from pg_temp.seed_ctx limit 1),
   'Chennai', 'Tamil Nadu', 'TN', 'India', 'IN',
   1000000, 2500000, 'INR', 'year', true,
   3, 8, 4,
   now() - interval '6 days', (current_date + 28)::date,
   ARRAY['SAP S/4HANA','ABAP','SAP FICO','ERP','Integration','Data Migration','Consulting'],
   ARRAY['B.Tech/MBA','SAP certification preferred'], 'Consulting', 'IT Services',
   ARRAY['Health insurance','PF','Annual bonus','International travel'],
   'internal'::public.apply_mode, null, null, null,
   null::jsonb, 'active'::public.job_status, false, false, null, null, null::jsonb),

  -- P18. HR Business Partner — HCLTech
  ('hr-business-partner-noida-hcl001',
   'HR Business Partner',
   E'Partner with business leaders to align HR strategies with organizational goals.\n\nWhat you will do\n- Drive talent acquisition and retention programs.\n- Lead workforce planning for 200K+ employee base.\n- Design employee engagement and performance management initiatives.\n\nRequirements\n- 5+ years in HR with HRBP experience.\n- Strong people analytics and labor law knowledge.',
   'HRBP for 200K+ workforce — talent strategy, workforce planning, employee engagement.',
   'private'::public.job_category, 'full_time'::public.job_type, 'onsite'::public.work_mode,
   (select id from public.companies where slug = 'hcltech'), (select user_id from pg_temp.seed_ctx limit 1),
   'Noida', 'Uttar Pradesh', 'UP', 'India', 'IN',
   1200000, 2200000, 'INR', 'year', true,
   5, 10, 2,
   now() - interval '4 days', (current_date + 20)::date,
   ARRAY['HR Strategy','Talent Management','Employee Relations','HRIS','Performance Management'],
   ARRAY['MBA HR'], 'Human Resources', 'IT Services',
   ARRAY['Health insurance','PF','Annual bonus','Employee discounts'],
   'internal'::public.apply_mode, null, null, null,
   null::jsonb, 'active'::public.job_status, false, false, null, null, null::jsonb),

  -- P19. Enterprise Sales Manager — Salesforce
  ('enterprise-sales-manager-mumbai-sf001',
   'Sales Manager — Enterprise',
   E'Drive enterprise CRM sales across India BFSI and manufacturing sectors.\n\nWhat you will do\n- Manage end-to-end sales cycles for mid-market and large accounts.\n- Build pipeline and close deals for Salesforce CRM suite.\n- Present solutions to C-level executives.\n\nRequirements\n- 4+ years enterprise SaaS sales.\n- Strong solution selling and negotiation skills.',
   'Enterprise Salesforce CRM sales — BFSI and manufacturing, C-level presentations, deal closing.',
   'private'::public.job_category, 'full_time'::public.job_type, 'hybrid'::public.work_mode,
   (select id from public.companies where slug = 'salesforce-india'), (select user_id from pg_temp.seed_ctx limit 1),
   'Mumbai', 'Maharashtra', 'MH', 'India', 'IN',
   1800000, 3500000, 'INR', 'year', true,
   4, 8, 3,
   now() - interval '3 days', (current_date + 30)::date,
   ARRAY['Enterprise Sales','CRM','Solution Selling','Negotiation','Account Management','SaaS'],
   ARRAY['MBA preferred'], 'Sales', 'Technology',
   ARRAY['Health insurance','Commission','RSUs','Travel allowance'],
   'internal'::public.apply_mode, null, null, null,
   null::jsonb, 'active'::public.job_status, false, false, null, null, null::jsonb),

  -- P20. Financial Analyst — Deloitte
  ('financial-analyst-mumbai-dl001',
   'Financial Analyst',
   E'Perform financial analysis and valuation for M&A advisory engagements.\n\nWhat you will do\n- Build financial models and DCF valuations.\n- Support audit and due diligence engagements.\n- Prepare client-facing presentations and reports.\n\nRequirements\n- 1+ years in finance/consulting.\n- Strong Excel, financial modeling, and accounting.',
   'Financial modeling, valuation, M&A advisory — Excel, Power BI, GAAP/IFRS.',
   'private'::public.job_category, 'full_time'::public.job_type, 'hybrid'::public.work_mode,
   (select id from public.companies where slug = 'deloitte-india'), (select user_id from pg_temp.seed_ctx limit 1),
   'Mumbai', 'Maharashtra', 'MH', 'India', 'IN',
   800000, 1800000, 'INR', 'year', true,
   1, 4, 5,
   now() - interval '2 days', (current_date + 22)::date,
   ARRAY['Financial Modeling','Excel','Valuation','Accounting','SQL','Power BI','Risk Analysis'],
   ARRAY['CA/CFA/MBA Finance'], 'Advisory', 'Consulting',
   ARRAY['Health insurance','Performance bonus','Learning budget','Travel'],
   'internal'::public.apply_mode, null, null, null,
   null::jsonb, 'active'::public.job_status, false, false, null, null, null::jsonb),

  -- P21. Android Developer — Ola
  ('android-developer-bengaluru-ola001',
   'Mobile App Developer (Android)',
   E'Build and optimize Ola rider and driver Android apps.\n\nWhat you will do\n- Work on location-based services and real-time tracking.\n- Optimize app performance for low-end devices.\n- Integrate payment systems and maps APIs.\n\nRequirements\n- 2+ years Android development.\n- Strong Kotlin and Jetpack Compose skills.',
   'Build Ola Android apps — location services, real-time tracking, Kotlin, Jetpack Compose.',
   'private'::public.job_category, 'full_time'::public.job_type, 'hybrid'::public.work_mode,
   (select id from public.companies where slug = 'ola'), (select user_id from pg_temp.seed_ctx limit 1),
   'Bengaluru', 'Karnataka', 'KA', 'India', 'IN',
   1400000, 2800000, 'INR', 'year', true,
   2, 5, 3,
   now() - interval '1 day', (current_date + 24)::date,
   ARRAY['Kotlin','Android SDK','Jetpack Compose','MVVM','REST APIs','Firebase','Git'],
   ARRAY['B.Tech in CS or related'], 'Mobile Engineering', 'Mobility',
   ARRAY['Health insurance','ESOPs','Free Ola rides','Learning budget'],
   'internal'::public.apply_mode, null, null, null,
   null::jsonb, 'active'::public.job_status, false, false, null, null, null::jsonb),

  -- P22. Operations Manager — Amazon
  ('operations-manager-delhi-amz001',
   'Operations Manager — Fulfilment',
   E'Manage Amazon fulfilment center operations.\n\nWhat you will do\n- Optimize delivery speed and reduce costs.\n- Lead teams of 100+ associates.\n- Drive continuous process improvement using Lean and Six Sigma.\n\nRequirements\n- 3+ years operations/supply chain experience.\n- Strong leadership and data analysis skills.',
   'Manage fulfilment center ops — Lean, Six Sigma, 100+ team, delivery optimization.',
   'private'::public.job_category, 'full_time'::public.job_type, 'onsite'::public.work_mode,
   (select id from public.companies where slug = 'amazon-india'), (select user_id from pg_temp.seed_ctx limit 1),
   'New Delhi', 'Delhi', 'DL', 'India', 'IN',
   1200000, 2500000, 'INR', 'year', true,
   3, 7, 4,
   now() - interval '5 days', (current_date + 30)::date,
   ARRAY['Supply Chain','Logistics','Lean Management','Data Analysis','Team Leadership','Six Sigma'],
   ARRAY['MBA/B.Tech with ops experience'], 'Operations', 'E-commerce',
   ARRAY['Health insurance','RSUs','Relocation support','PF'],
   'external'::public.apply_mode, 'https://amazon.jobs', null, null,
   null::jsonb, 'active'::public.job_status, false, false, null, null, null::jsonb)

) as v(
  slug, title, description, summary, category, job_type, work_mode,
  company_id, posted_by,
  location_city, location_state, location_state_code, location_country, location_country_code,
  salary_min, salary_max, salary_currency, salary_period, is_salary_disclosed,
  experience_min, experience_max, openings,
  posted_at, application_deadline,
  skills, qualifications, department, industry, benefits,
  apply_mode, apply_url, apply_email, apply_phone,
  government_meta, status, is_featured, is_urgent,
  meta_title, meta_description, faq
)
on conflict (slug) do nothing;
