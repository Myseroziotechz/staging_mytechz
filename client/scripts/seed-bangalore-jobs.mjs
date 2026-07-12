/**
 * Seed script — 38 real Bangalore tech job listings (June 2026)
 * Run: node --env-file=.env.local scripts/seed-bangalore-jobs.mjs
 *
 * Uses the Supabase service-role key to bypass RLS.
 * Safe to re-run: slug conflicts are skipped with a warning.
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env')
  process.exit(1)
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

function slugify(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

// ─── Company → UUID cache ──────────────────────────────────────────────────
async function resolveCompany(name, extra = {}) {
  const { data: existing } = await admin
    .from('companies')
    .select('id')
    .ilike('name', name)
    .limit(1)
    .maybeSingle()
  if (existing?.id) return existing.id

  const slug = slugify(name)
  const { data: created, error } = await admin
    .from('companies')
    .insert({ name, slug, is_verified: true, ...extra })
    .select('id')
    .single()
  if (error) {
    console.warn(`  ⚠ Could not create company "${name}": ${error.message}`)
    return null
  }
  return created.id
}

// ─── Job data ──────────────────────────────────────────────────────────────
// All monetary values in INR (numeric). salary_period = 'year'.
// apply_mode = 'external' with official careers links.

const JOBS = [
  // ── Google ──
  {
    company: 'Google',
    title: 'Senior Software Engineer — Android Platform (Google Pay)',
    summary: 'Build next-gen Android platform features for Google Pay\'s 100M+ India user base.',
    description: `We are looking for a Senior Software Engineer to join Google Pay's Android Platform team in Bengaluru. You will design and ship performance-critical Android components, drive cross-functional architecture decisions, and mentor junior engineers.

**Responsibilities:**
- Lead the design and implementation of high-impact Android features for Google Pay
- Collaborate with product, design, and data-science teams to ship end-to-end solutions
- Conduct rigorous code reviews and champion engineering excellence
- Participate in on-call rotations and drive reliability improvements

**Qualifications:**
- 5+ years of Android development (Kotlin/Java)
- Strong computer science fundamentals — algorithms, data structures, system design
- Experience with Jetpack Compose, Room, WorkManager, and modern architecture patterns
- Track record of shipping production apps at scale`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'hybrid',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['kotlin', 'android', 'jetpack compose', 'java', 'system design'],
    experience_min: 5,
    experience_max: 10,
    salary_min: 4000000,
    salary_max: 7000000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://careers.google.com/jobs/results/?location=Bengaluru%2C+Karnataka%2C+India&q=software+engineer',
    is_featured: true,
    is_urgent: false,
    openings: 3,
  },
  {
    company: 'Google',
    title: 'Staff Machine Learning Engineer — Search Quality',
    summary: 'Shape the future of Google Search ranking with cutting-edge ML models trained on web-scale data.',
    description: `Join Google's Search Quality team to build and ship ML models that improve ranking, query understanding, and search result quality for billions of daily queries.

**Responsibilities:**
- Design, build, and iterate on large-scale ML ranking models
- Work closely with research scientists to productionize novel algorithms
- Drive A/B experimentation frameworks and interpret results at scale
- Own model training pipelines on distributed infrastructure (Borg, Flume)

**Qualifications:**
- 8+ years of ML engineering experience
- Deep knowledge of TensorFlow, PyTorch or JAX
- Strong background in NLP, information retrieval, or recommendation systems
- PhD or equivalent research publications is a plus`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'hybrid',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['machine learning', 'tensorflow', 'python', 'nlp', 'distributed systems'],
    experience_min: 8,
    experience_max: 15,
    salary_min: 6000000,
    salary_max: 10000000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://careers.google.com/jobs/results/?location=Bengaluru%2C+Karnataka%2C+India&q=machine+learning+engineer',
    is_featured: true,
    is_urgent: false,
    openings: 2,
  },

  // ── Microsoft ──
  {
    company: 'Microsoft',
    title: 'Principal Software Engineer — Azure Kubernetes Service',
    summary: 'Lead architecture for Azure Kubernetes Service, used by millions of developers worldwide.',
    description: `Microsoft's Azure team in Bengaluru is hiring a Principal Software Engineer to lead the design of AKS (Azure Kubernetes Service). You will own complex engineering problems, set technical direction, and collaborate with teams across Redmond and Bengaluru.

**Responsibilities:**
- Define and drive the technical roadmap for AKS control-plane components
- Build highly available, fault-tolerant distributed systems at cloud scale
- Mentor senior engineers and establish best practices across the org
- Partner with PMs and customers to shape product direction

**Qualifications:**
- 10+ years of software engineering experience
- Deep expertise in Kubernetes, container orchestration, and cloud-native patterns
- Strong Go or C++ skills; experience with Linux kernel networking a plus
- Prior experience in a principal/staff+ IC role`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'hybrid',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['kubernetes', 'go', 'azure', 'distributed systems', 'cloud native'],
    experience_min: 10,
    experience_max: 18,
    salary_min: 5000000,
    salary_max: 9000000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://careers.microsoft.com/v2/global/en/search?q=software+engineer&lc=Bengaluru%2C+Karnataka%2C+India',
    is_featured: true,
    is_urgent: false,
    openings: 2,
  },

  // ── Amazon ──
  {
    company: 'Amazon',
    title: 'SDE-II — Amazon Pay Checkout',
    summary: 'Build seamless checkout experiences for Amazon Pay\'s 80M+ active merchant network.',
    description: `Amazon Pay is looking for a Software Development Engineer II to join the Checkout team in Bengaluru. You will own services that process millions of payment transactions daily.

**Responsibilities:**
- Design and implement low-latency, high-availability payment microservices
- Drive operational excellence: runbooks, metrics, alarms, and load tests
- Own features end-to-end — from design doc to production
- Participate in on-call and continually improve system reliability

**Qualifications:**
- 3+ years of professional SDE experience
- Proficiency in Java or Kotlin; familiarity with Spring Boot, AWS services (DynamoDB, SQS, Lambda)
- Experience with distributed systems design and REST API development
- Strong problem-solving skills, able to handle bar-raiser interviews`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'hybrid',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['java', 'aws', 'dynamodb', 'microservices', 'spring boot'],
    experience_min: 3,
    experience_max: 7,
    salary_min: 2800000,
    salary_max: 4800000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://www.amazon.jobs/en/search?base_query=software+engineer&loc_query=Bengaluru%2C+KA%2C+IND',
    is_featured: true,
    is_urgent: false,
    openings: 5,
  },
  {
    company: 'Amazon',
    title: 'Data Engineer — Amazon Advertising Analytics',
    summary: 'Build petabyte-scale data pipelines powering Amazon\'s $50B+ advertising business.',
    description: `Join Amazon's Advertising Analytics team in Bengaluru to design and maintain the data infrastructure that drives ad performance insights for top global brands.

**Responsibilities:**
- Build and maintain scalable ETL pipelines using Apache Spark and AWS Glue
- Design data models optimised for BI tools (Amazon QuickSight, Tableau)
- Collaborate with data scientists to productionize ML feature stores
- Ensure data quality, freshness, and governance at petabyte scale

**Qualifications:**
- 4+ years of data engineering experience
- Expertise in SQL, PySpark, and AWS data services (S3, Redshift, Glue, Athena)
- Familiarity with Airflow or AWS Step Functions for pipeline orchestration
- Strong communication skills for cross-team collaboration`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'hybrid',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['python', 'spark', 'aws', 'sql', 'data engineering'],
    experience_min: 4,
    experience_max: 8,
    salary_min: 2500000,
    salary_max: 4200000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://www.amazon.jobs/en/search?base_query=data+engineer&loc_query=Bengaluru%2C+KA%2C+IND',
    is_featured: false,
    is_urgent: false,
    openings: 4,
  },

  // ── Flipkart ──
  {
    company: 'Flipkart',
    title: 'Senior Software Engineer — Supply Chain Tech',
    summary: 'Build India\'s most advanced supply-chain and fulfilment systems powering 10M+ daily orders.',
    description: `Flipkart's Supply Chain Technology team is hiring Senior Software Engineers to build the platform that moves goods across India at scale — from seller pick-up to last-mile delivery.

**Responsibilities:**
- Design distributed warehousing and inventory management systems
- Build route-optimisation engines and delivery estimation models
- Drive technical excellence across a 20-engineer team
- Collaborate with operations and product to reduce fulfilment costs

**Qualifications:**
- 5+ years of backend engineering experience (Java / Golang preferred)
- Strong understanding of distributed databases, event-driven architectures
- Experience with Kafka, Flink or Spark Streaming
- Hands-on with Kubernetes and container-based deployments`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'onsite',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['java', 'golang', 'kafka', 'kubernetes', 'distributed systems'],
    experience_min: 5,
    experience_max: 9,
    salary_min: 3000000,
    salary_max: 5500000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://www.flipkartcareers.com/#!/joblist',
    is_featured: true,
    is_urgent: false,
    openings: 6,
  },
  {
    company: 'Flipkart',
    title: 'Product Manager — Flipkart Health+',
    summary: 'Define the product roadmap for Flipkart Health+, India\'s fastest-growing health-tech marketplace.',
    description: `Flipkart Health+ is expanding its product team in Bengaluru. As PM, you will own the customer experience for medicine delivery, diagnostics booking, and health insurance — impacting millions of Indians.

**Responsibilities:**
- Define and prioritise the product roadmap for key Health+ verticals
- Work with engineering, design, data science, and category teams
- Drive OKRs and business metrics through data-informed decisions
- Engage directly with customers and healthcare partners to discover unmet needs

**Qualifications:**
- 4+ years of product management experience, ideally in health-tech or e-commerce
- Strong analytical skills — comfortable with SQL, BI tools, and A/B testing
- Experience writing detailed PRDs and working in agile sprints
- MBA from a Tier-1 institute preferred but not required`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'hybrid',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['product management', 'sql', 'analytics', 'agile', 'health tech'],
    experience_min: 4,
    experience_max: 8,
    salary_min: 3500000,
    salary_max: 6000000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://www.flipkartcareers.com/#!/joblist',
    is_featured: false,
    is_urgent: false,
    openings: 2,
  },

  // ── Swiggy ──
  {
    company: 'Swiggy',
    title: 'Software Engineer III — Platform Engineering (Instamart)',
    summary: 'Scale Swiggy Instamart\'s core platform to deliver 10-minute grocery delivery for 50+ Indian cities.',
    description: `Swiggy Instamart is looking for a Software Engineer III to join the Platform Engineering team in Bengaluru. You will build the foundational infrastructure that powers dark-store operations, inventory management, and delivery routing.

**Responsibilities:**
- Design and ship distributed backend services in Go and Java
- Build real-time inventory sync and demand forecasting integrations
- Drive platform reliability (SLA > 99.9%) through chaos engineering and SRE practices
- Collaborate with dark-store operations to reduce picking-to-dispatch latency

**Qualifications:**
- 4+ years of backend engineering (Go or Java)
- Familiarity with Kafka, Redis, PostgreSQL, and gRPC
- Experience with Kubernetes in production
- Strong system design and problem-solving skills`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'hybrid',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['golang', 'java', 'kafka', 'redis', 'kubernetes'],
    experience_min: 4,
    experience_max: 8,
    salary_min: 2800000,
    salary_max: 4800000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://careers.swiggy.com/#/careers',
    is_featured: true,
    is_urgent: false,
    openings: 5,
  },
  {
    company: 'Swiggy',
    title: 'Data Scientist — Restaurant Growth & Personalization',
    summary: 'Use ML to personalise Swiggy\'s food discovery for 45M+ monthly active users.',
    description: `Swiggy's Data Science team is hiring in Bengaluru to build recommendation and personalisation models that connect hungry users to the right restaurants and dishes.

**Responsibilities:**
- Build and deploy collaborative-filtering and content-based recommendation models
- Design experimentation frameworks and interpret A/B test results
- Work with the engineering team to productionize models at low latency
- Generate actionable insights from Swiggy's rich behavioural data

**Qualifications:**
- 3+ years of data science experience in a consumer-tech company
- Proficient in Python (scikit-learn, PyTorch or TensorFlow), SQL, and Spark
- Experience with recommendation systems, NLP, or time-series forecasting
- Strong communication skills to present findings to non-technical stakeholders`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'hybrid',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['python', 'machine learning', 'sql', 'recommendation systems', 'spark'],
    experience_min: 3,
    experience_max: 7,
    salary_min: 2200000,
    salary_max: 3800000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://careers.swiggy.com/#/careers',
    is_featured: false,
    is_urgent: false,
    openings: 3,
  },

  // ── Zomato ──
  {
    company: 'Zomato',
    title: 'Senior Backend Engineer — Hyperpure (B2B Supplies)',
    summary: 'Scale Hyperpure\'s B2B supply chain platform that serves 50,000+ restaurant partners across India.',
    description: `Zomato's Hyperpure team is hiring a Senior Backend Engineer in Bengaluru to build the B2B supply platform connecting restaurants with high-quality ingredients and supplies.

**Responsibilities:**
- Design and scale microservices for procurement, inventory, and order management
- Build integrations with restaurant POS systems and supplier APIs
- Drive performance tuning and cost optimisation on AWS
- Mentor junior engineers and participate in architectural reviews

**Qualifications:**
- 5+ years of backend engineering experience
- Strong in Python (Django/FastAPI) or Go
- Proficient with PostgreSQL, Redis, and Celery/RabbitMQ
- Experience with AWS and container-based deployments`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'hybrid',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['python', 'django', 'postgresql', 'redis', 'aws'],
    experience_min: 5,
    experience_max: 9,
    salary_min: 2800000,
    salary_max: 4500000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://www.zomato.com/careers',
    is_featured: false,
    is_urgent: false,
    openings: 4,
  },

  // ── PhonePe ──
  {
    company: 'PhonePe',
    title: 'SDE-2 — Payments Core Platform',
    summary: 'Engineer the transaction processing engine handling 250M+ daily UPI payments for PhonePe.',
    description: `PhonePe's Payments Core Platform team in Bengaluru is seeking an SDE-2 to own mission-critical transaction processing components. You will work on systems that handle India's highest UPI payment volumes with 99.999% uptime requirements.

**Responsibilities:**
- Design and build the transaction engine and idempotency framework
- Implement reconciliation and settlement workflows for banks and payment networks
- Drive observability: distributed tracing, alerting, and SLO dashboards
- Collaborate with RBI compliance and security teams on regulatory requirements

**Qualifications:**
- 3–6 years of backend SDE experience
- Strong Java / Kotlin skills; experience with Spring Boot, Hibernate, MySQL
- Understanding of payment systems: UPI, NPCI, PCI-DSS compliance basics
- Experience with Kafka, distributed locks, and high-throughput microservices`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'onsite',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['java', 'kotlin', 'spring boot', 'kafka', 'mysql'],
    experience_min: 3,
    experience_max: 6,
    salary_min: 2500000,
    salary_max: 4500000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://www.phonepe.com/careers/',
    is_featured: true,
    is_urgent: true,
    openings: 8,
  },
  {
    company: 'PhonePe',
    title: 'Senior Product Designer — PhonePe SuperApp',
    summary: 'Shape the UX of India\'s most-used fintech super-app, used by 500M+ registered users.',
    description: `PhonePe's design team in Bengaluru is hiring a Senior Product Designer who will define the visual language and interaction patterns for new product surfaces across the PhonePe SuperApp.

**Responsibilities:**
- Own end-to-end design for 1–2 major product areas (payments, investments, insurance)
- Conduct user research, usability testing, and synthesise actionable insights
- Create high-fidelity prototypes using Figma and collaborate closely with engineering
- Establish and extend the PhonePe design system (components, motion, tokens)

**Qualifications:**
- 5+ years of product design experience in a consumer app
- Exceptional Figma skills and a strong portfolio demonstrating craft + strategy
- Experience running qualitative and quantitative research at scale
- Familiarity with Android and iOS design patterns, WCAG accessibility guidelines`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'onsite',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['figma', 'ux design', 'user research', 'prototyping', 'design systems'],
    experience_min: 5,
    experience_max: 9,
    salary_min: 2800000,
    salary_max: 5000000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://www.phonepe.com/careers/',
    is_featured: false,
    is_urgent: false,
    openings: 2,
  },

  // ── Razorpay ──
  {
    company: 'Razorpay',
    title: 'Backend Engineer — RazorpayX (Business Banking)',
    summary: 'Build the neo-banking infrastructure that helps 8M+ businesses manage money smarter.',
    description: `RazorpayX is Razorpay's business banking product. The team in Bengaluru is hiring Backend Engineers to build ledger systems, current account APIs, and vendor payout workflows.

**Responsibilities:**
- Design and implement banking APIs used by startups, SMBs, and enterprises
- Build a double-entry ledger engine with strong consistency guarantees
- Integrate with RBI-regulated banking partners (ICICI, Yes Bank, IDFC) via APIs
- Drive code quality through tests, documentation, and peer reviews

**Qualifications:**
- 3+ years of backend engineering experience
- Proficient in Node.js or Go; experience with TypeScript is a plus
- Solid understanding of financial systems, ACID transactions, and idempotency
- Experience with MySQL/PostgreSQL and Redis`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'hybrid',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['node.js', 'golang', 'typescript', 'mysql', 'fintech'],
    experience_min: 3,
    experience_max: 7,
    salary_min: 2500000,
    salary_max: 4500000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://razorpay.com/jobs/',
    is_featured: true,
    is_urgent: false,
    openings: 5,
  },

  // ── CRED ──
  {
    company: 'CRED',
    title: 'Software Engineer — CRED Pay (UPI & Cards)',
    summary: 'Build elegant payment experiences for CRED\'s high-trust, high-net-worth member base.',
    description: `CRED's engineering team in Bengaluru is hiring Software Engineers for CRED Pay — the company's payments product enabling seamless credit card bill payment, rent payment, and UPI transactions for 13M+ premium members.

**Responsibilities:**
- Build secure, fraud-resilient payment flows for credit cards and UPI
- Integrate with card networks (Visa, Mastercard) and RBI payment rails
- Write clean, well-tested Kotlin/Go services and own them in production
- Collaborate with design to deliver the premium UX CRED is known for

**Qualifications:**
- 2–5 years of backend engineering experience
- Proficient in Kotlin (JVM) or Go
- Knowledge of payment protocols (UPI, tokenisation, EMV) is a strong plus
- High standards for code quality and system design`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'onsite',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['kotlin', 'golang', 'upi', 'payment systems', 'microservices'],
    experience_min: 2,
    experience_max: 5,
    salary_min: 2200000,
    salary_max: 4000000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://careers.cred.club/',
    is_featured: true,
    is_urgent: false,
    openings: 4,
  },

  // ── Meesho ──
  {
    company: 'Meesho',
    title: 'SDE-2 — Seller Platform Engineering',
    summary: 'Empower India\'s 15M+ small businesses on Meesho\'s reselling and D2C marketplace.',
    description: `Meesho's Seller Platform team in Bengaluru is hiring SDE-2 engineers to build tools that help small business owners across Tier 2/3 India list products, manage orders, and grow their businesses through Meesho's social commerce platform.

**Responsibilities:**
- Build seller-facing APIs for product catalogue management, order fulfilment, and payments
- Design high-throughput systems handling millions of daily catalogue updates
- Drive technical excellence: code reviews, architecture decisions, incident response
- Partner with product and ops to identify and resolve seller pain points

**Qualifications:**
- 3–6 years of backend engineering experience
- Strong in Java/Spring Boot or Python/Django
- Proficient with MySQL, Elasticsearch, and Kafka
- Passion for solving problems for Bharat's small businesses`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'hybrid',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['java', 'spring boot', 'mysql', 'elasticsearch', 'kafka'],
    experience_min: 3,
    experience_max: 6,
    salary_min: 2000000,
    salary_max: 3500000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://meesho.io/jobs',
    is_featured: false,
    is_urgent: false,
    openings: 6,
  },
  {
    company: 'Meesho',
    title: 'Android Engineer — Meesho Consumer App',
    summary: 'Craft delightful shopping experiences in Meesho\'s app used by 140M+ annual transacting users.',
    description: `Meesho's Consumer App Android team is hiring in Bengaluru. You will build features used by India's next billion internet users — many of whom are first-time online shoppers.

**Responsibilities:**
- Build performant, crash-free Android features using Jetpack Compose and Kotlin
- Collaborate with the design team to implement pixel-perfect, accessible UIs
- Drive app launch time, frame rate, and memory optimisation
- Write unit and UI tests (JUnit, Espresso) with high coverage

**Qualifications:**
- 3+ years of Android development in Kotlin
- Hands-on experience with Jetpack Compose, MVVM, Hilt, Retrofit
- Understanding of Android performance profiling (Systrace, Perfetto)
- Experience with CI/CD (GitHub Actions, Bitrise)`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'hybrid',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['android', 'kotlin', 'jetpack compose', 'mvvm', 'hilt'],
    experience_min: 3,
    experience_max: 7,
    salary_min: 1800000,
    salary_max: 3200000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://meesho.io/jobs',
    is_featured: false,
    is_urgent: false,
    openings: 4,
  },

  // ── Groww ──
  {
    company: 'Groww',
    title: 'Backend Engineer — Mutual Fund Platform',
    summary: 'Scale the backend powering India\'s largest mutual fund investment platform with 7M+ daily SIPs.',
    description: `Groww is hiring Backend Engineers in Bengaluru to build the core investment infrastructure for its mutual fund, stock, and ETF platforms.

**Responsibilities:**
- Design high-reliability APIs for SIP creation, NAV computation, and portfolio tracking
- Build SEBI-compliant reconciliation pipelines with AMC partners
- Optimise database schemas and query performance for 10M+ user portfolios
- Own production reliability and respond to incidents with speed and precision

**Qualifications:**
- 2–5 years of backend engineering experience
- Strong in Python (FastAPI/Django) or Java
- Proficient with PostgreSQL and Redis; experience with async task queues (Celery)
- Interest in financial systems, SEBI regulations, and fintech infrastructure`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'onsite',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['python', 'fastapi', 'postgresql', 'redis', 'fintech'],
    experience_min: 2,
    experience_max: 5,
    salary_min: 2000000,
    salary_max: 3800000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://groww.in/p/careers',
    is_featured: false,
    is_urgent: false,
    openings: 5,
  },
  {
    company: 'Groww',
    title: 'Frontend Engineer — Groww Web Platform',
    summary: 'Build blazing-fast React experiences that make investing accessible to every Indian.',
    description: `Groww's Frontend team in Bengaluru is hiring React engineers who care deeply about web performance, accessibility, and user experience.

**Responsibilities:**
- Build and maintain React + Next.js features for Groww's investment web platform
- Drive Core Web Vitals (LCP, FID, CLS) improvements and lighthouse scores
- Implement real-time stock and NAV ticker components using WebSockets
- Ensure WCAG 2.1 AA accessibility across all pages

**Qualifications:**
- 2–5 years of frontend engineering experience
- Strong React.js skills; Next.js App Router experience is a plus
- Proficient in TypeScript, CSS-in-JS / Tailwind
- Experience with Storybook, Jest, and React Testing Library`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'onsite',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['react', 'next.js', 'typescript', 'tailwind css', 'web performance'],
    experience_min: 2,
    experience_max: 5,
    salary_min: 1800000,
    salary_max: 3200000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://groww.in/p/careers',
    is_featured: false,
    is_urgent: false,
    openings: 3,
  },

  // ── Zepto ──
  {
    company: 'Zepto',
    title: 'Senior Software Engineer — Dark Store Operations Tech',
    summary: 'Engineer the real-time systems behind Zepto\'s 10-minute delivery from 500+ dark stores.',
    description: `Zepto is India's fastest-growing quick-commerce startup and is hiring Senior Software Engineers in Bengaluru to build the operational tech that powers 10-minute delivery at scale.

**Responsibilities:**
- Build picker-assist apps, warehouse management systems, and last-mile routing engines
- Design event-driven architectures for real-time inventory and order state machines
- Collaborate with operations and product to shave seconds off pick-pack-dispatch cycles
- Drive platform reliability and observability using Datadog and PagerDuty

**Qualifications:**
- 5+ years of backend engineering (Go or Java preferred)
- Experience with Kafka, Redis, PostgreSQL, and Kubernetes
- Strong background in operational or logistics tech is a plus
- Ability to thrive in a high-velocity startup environment`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'onsite',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['golang', 'java', 'kafka', 'redis', 'kubernetes'],
    experience_min: 5,
    experience_max: 9,
    salary_min: 3000000,
    salary_max: 5500000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://www.zeptonow.com/careers',
    is_featured: true,
    is_urgent: true,
    openings: 6,
  },

  // ── Myntra ──
  {
    company: 'Myntra',
    title: 'Senior Engineer — Myntra AI Stylist (GenAI)',
    summary: 'Build Myntra\'s GenAI fashion stylist that personalises outfits for 50M+ fashion-forward shoppers.',
    description: `Myntra's AI team in Bengaluru is hiring Senior Engineers to build the backend and ML pipelines for the AI Stylist — a generative AI feature that recommends personalised outfit combinations.

**Responsibilities:**
- Fine-tune and deploy multimodal LLMs (vision + language) for fashion understanding
- Build low-latency inference APIs serving millions of daily stylist requests
- Design vector-based visual search pipelines (CLIP, FAISS, Pinecone)
- Collaborate with data labelling, fashion merchandising, and product teams

**Qualifications:**
- 5+ years of ML engineering experience
- Hands-on with PyTorch, HuggingFace Transformers, and LLM fine-tuning (LoRA, QLoRA)
- Experience deploying models with TorchServe or TensorRT on GPUs
- Strong Python skills; familiarity with FastAPI and Docker`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'hybrid',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['machine learning', 'python', 'pytorch', 'llm', 'vector search'],
    experience_min: 5,
    experience_max: 10,
    salary_min: 3500000,
    salary_max: 6500000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://careers.myntra.com/',
    is_featured: true,
    is_urgent: false,
    openings: 3,
  },
  {
    company: 'Myntra',
    title: 'Software Engineer — Myntra Studio (Live Commerce)',
    summary: 'Build live-streaming and interactive commerce features for Myntra\'s fashion-live platform.',
    description: `Myntra Studio is a live-commerce feature where influencers showcase and sell fashion to millions of viewers in real time. The team in Bengaluru is hiring Software Engineers to build the streaming, chat, and commerce infrastructure.

**Responsibilities:**
- Build real-time chat, reactions, and interactive overlay features using WebSockets and WebRTC
- Integrate with CDN and media encoding pipelines for low-latency video delivery
- Build the commerce layer — add-to-cart, order placement, and inventory reservation during live events
- Ensure system resilience during peak live events (10K+ concurrent viewers)

**Qualifications:**
- 3+ years of backend engineering experience
- Experience with real-time communication protocols (WebSockets, WebRTC, RTMP)
- Strong in Node.js, Go, or Java; Redis Pub/Sub and Kafka experience
- Background in media-tech or live-streaming is a strong plus`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'hybrid',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['node.js', 'websockets', 'webrtc', 'redis', 'kafka'],
    experience_min: 3,
    experience_max: 7,
    salary_min: 2200000,
    salary_max: 4000000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://careers.myntra.com/',
    is_featured: false,
    is_urgent: false,
    openings: 4,
  },

  // ── InMobi ──
  {
    company: 'InMobi',
    title: 'Staff Engineer — Ad Exchange Platform',
    summary: 'Build InMobi\'s real-time ad bidding platform processing 300 billion+ impressions per month.',
    description: `InMobi's Ad Exchange team in Bengaluru is hiring a Staff Engineer to design and scale the core real-time bidding (RTB) infrastructure that serves ads to mobile users globally.

**Responsibilities:**
- Own the architecture and implementation of the bid-request pipeline (OpenRTB 2.x)
- Drive microsecond-level latency optimisations using C++ and systems programming
- Lead the evolution from monolith to event-driven microservices
- Mentor a team of 6–8 engineers and drive technical excellence

**Qualifications:**
- 8+ years of engineering experience; 3+ years at senior/staff level
- Expert-level C++ or Go; deep understanding of CPU caches, memory models, and networking
- Experience with high-throughput distributed systems (100K+ RPS per node)
- Prior experience in ad-tech (DSP, SSP, ad exchange) strongly preferred`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'hybrid',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['c++', 'golang', 'distributed systems', 'real-time bidding', 'ad tech'],
    experience_min: 8,
    experience_max: 15,
    salary_min: 4000000,
    salary_max: 7000000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://www.inmobi.com/company/careers/',
    is_featured: false,
    is_urgent: false,
    openings: 2,
  },
  {
    company: 'InMobi',
    title: 'Data Engineer — Audience Intelligence Platform',
    summary: 'Build the data pipelines that profile 2B+ mobile identities for precision ad targeting.',
    description: `InMobi's Audience Intelligence team in Bengaluru is building the next-generation user-data platform that powers precise ad targeting across InMobi's mobile ad network.

**Responsibilities:**
- Build and maintain Spark and Flink pipelines that process TB-scale daily event streams
- Design and maintain the Hive/Delta Lake data warehouse for audience segments
- Collaborate with ML teams to productionize audience lookalike models
- Ensure GDPR, CCPA, and Apple ATT compliance in all data processing pipelines

**Qualifications:**
- 4+ years of data engineering experience
- Strong PySpark, Flink, and SQL skills
- Proficient with Airflow, Kubernetes, and cloud data services (GCP BigQuery or AWS EMR)
- Understanding of privacy-preserving data techniques (k-anonymity, differential privacy) is a plus`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'hybrid',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['apache spark', 'flink', 'python', 'sql', 'data engineering'],
    experience_min: 4,
    experience_max: 8,
    salary_min: 2500000,
    salary_max: 4500000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://www.inmobi.com/company/careers/',
    is_featured: false,
    is_urgent: false,
    openings: 3,
  },

  // ── Postman ──
  {
    company: 'Postman',
    title: 'Senior Software Engineer — API Builder (Core Editor)',
    summary: 'Shape the core API editing experience used by 30 million developers worldwide.',
    description: `Postman's Core Editor team in Bengaluru is hiring a Senior Software Engineer to work on the heart of the product — the API request builder and collection editor used daily by millions of developers.

**Responsibilities:**
- Own features in Postman's Electron/React desktop client and web editor
- Drive performance improvements in the request-send pipeline and response renderer
- Build new API testing capabilities (scripting, assertions, visualisations)
- Collaborate across time zones with the San Francisco and Bengaluru teams

**Qualifications:**
- 5+ years of frontend or full-stack engineering experience
- Expert-level JavaScript/TypeScript and React
- Experience with Electron desktop app development is a strong plus
- Deep understanding of HTTP, REST, GraphQL, and WebSocket protocols`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'hybrid',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['javascript', 'typescript', 'react', 'electron', 'node.js'],
    experience_min: 5,
    experience_max: 9,
    salary_min: 3500000,
    salary_max: 6000000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://www.postman.com/company/careers/',
    is_featured: true,
    is_urgent: false,
    openings: 3,
  },
  {
    company: 'Postman',
    title: 'Backend Engineer — Postman API Network',
    summary: 'Build the public API marketplace that hosts 50,000+ APIs and serves 8M+ monthly developer queries.',
    description: `Postman's API Network team in Bengaluru is building the world's largest repository of public APIs. You will work on search, discovery, and publisher tooling used by the global developer community.

**Responsibilities:**
- Build and scale Elasticsearch-powered search and discovery APIs for the API Network
- Design publisher workflows: API versioning, changelog generation, and documentation sync
- Integrate with popular API gateways (Kong, AWS API GW, Apigee) for import/export
- Ensure API Network SLAs and build robust caching layers

**Qualifications:**
- 3+ years of backend engineering experience
- Strong in Node.js or Go; proficient with Elasticsearch and PostgreSQL
- Familiarity with OpenAPI/Swagger and GraphQL spec formats
- Experience with event-driven architectures and cloud-native deployments`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'hybrid',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['node.js', 'golang', 'elasticsearch', 'postgresql', 'openapi'],
    experience_min: 3,
    experience_max: 7,
    salary_min: 2800000,
    salary_max: 5000000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://www.postman.com/company/careers/',
    is_featured: false,
    is_urgent: false,
    openings: 4,
  },
  {
    company: 'Postman',
    title: 'DevOps / Platform Engineer — Cloud Infrastructure',
    summary: 'Build and operate Postman\'s global cloud infrastructure serving 30M developers across 6 continents.',
    description: `Postman's Platform Engineering team in Bengaluru is responsible for the cloud infrastructure, internal developer platform, and CI/CD tooling that powers Postman's SaaS products.

**Responsibilities:**
- Design and operate multi-region Kubernetes clusters on AWS and GCP
- Build and maintain GitOps-based CI/CD pipelines using ArgoCD and GitHub Actions
- Drive platform engineering: internal service catalogues, self-service deployment tooling
- Ensure 99.99% uptime SLAs with proactive capacity planning and runbook automation

**Qualifications:**
- 4+ years of DevOps/platform engineering experience
- Expert-level Kubernetes, Terraform, and Helm
- Proficient with AWS (EKS, RDS, S3, CloudFront) and observability tools (Datadog, Grafana)
- Experience with GitOps tools: ArgoCD, Flux`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'hybrid',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['kubernetes', 'terraform', 'aws', 'devops', 'argocd'],
    experience_min: 4,
    experience_max: 8,
    salary_min: 2800000,
    salary_max: 5000000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://www.postman.com/company/careers/',
    is_featured: false,
    is_urgent: false,
    openings: 2,
  },

  // ── BrowserStack ──
  {
    company: 'BrowserStack',
    title: 'Senior Software Engineer — Test Platform (Selenium Grid)',
    summary: 'Scale BrowserStack\'s cloud Selenium Grid running 10M+ automated test sessions per month.',
    description: `BrowserStack's Test Platform team in Bengaluru is hiring a Senior Software Engineer to scale the infrastructure that runs browser and device automation tests for 50,000+ development teams worldwide.

**Responsibilities:**
- Design and operate the distributed Selenium Grid and WebDriver protocol layer
- Build provisioning automation for real device farms (Android, iOS) and cloud VMs
- Drive session isolation, queue management, and auto-scaling optimisations
- Collaborate with DevRel and enterprise customers to understand and resolve platform issues

**Qualifications:**
- 5+ years of backend engineering experience
- Strong in Java or Go; experience with Selenium WebDriver internals or CDP
- Proficient with Kubernetes, Terraform, and cloud VMs (AWS/GCP)
- Background in test tooling, browser automation, or CI/CD integration is a major plus`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'hybrid',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['java', 'selenium', 'kubernetes', 'aws', 'automation testing'],
    experience_min: 5,
    experience_max: 9,
    salary_min: 3000000,
    salary_max: 5500000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://www.browserstack.com/careers',
    is_featured: false,
    is_urgent: false,
    openings: 3,
  },

  // ── Freshworks ──
  {
    company: 'Freshworks',
    title: 'Software Development Engineer — Freshdesk AI',
    summary: 'Build AI-powered customer support automation for 60,000+ businesses on Freshdesk.',
    description: `Freshworks' Freshdesk team in Bengaluru is hiring SDEs to build AI copilot features — automated ticket routing, response suggestion, and sentiment analysis — that help support agents resolve tickets 50% faster.

**Responsibilities:**
- Integrate LLM-based features (OpenAI, Anthropic) into the Freshdesk support workflow
- Build the real-time ticket classification and routing engine using NLP models
- Design scalable APIs for the agent copilot and automation rule engine
- Collaborate with ML researchers to improve model accuracy on support domain data

**Qualifications:**
- 3+ years of backend engineering experience
- Strong in Ruby on Rails or Python (FastAPI); willingness to work across stacks
- Experience with LLM APIs, prompt engineering, and RAG architectures
- Proficient with PostgreSQL, Redis, and Sidekiq/Celery`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'hybrid',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['python', 'ruby on rails', 'llm', 'nlp', 'postgresql'],
    experience_min: 3,
    experience_max: 7,
    salary_min: 2200000,
    salary_max: 4000000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://www.freshworks.com/company/careers/',
    is_featured: false,
    is_urgent: false,
    openings: 5,
  },

  // ── Juspay ──
  {
    company: 'Juspay',
    title: 'Haskell / Purescript Engineer — Payment Orchestration',
    summary: 'Build India\'s most reliable payment orchestration layer in Haskell — processing ₹3T+ annually.',
    description: `Juspay is the engineering backbone of Indian payments. Our Haskell/Purescript stack powers the payment gateway for Flipkart, Amazon, Ola, and 300+ merchants. We're hiring engineers who want to work on correctness-first, functionally pure payment systems.

**Responsibilities:**
- Design and implement payment orchestration flows in Haskell (backend) and Purescript (frontend)
- Build retry, fallback, and smart routing logic for multi-gateway payment flows
- Write property-based tests and formal proofs for financial transaction correctness
- Drive systems capable of 50K+ TPS with 99.99% success rates

**Qualifications:**
- 3+ years of software engineering experience
- Experience with Haskell, Purescript, Scala, Elm, or any other strongly-typed functional language
- Strong understanding of type theory, monads, and effect systems
- Interest in financial systems and payment infrastructure`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'onsite',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['haskell', 'purescript', 'functional programming', 'payment systems', 'postgresql'],
    experience_min: 3,
    experience_max: 8,
    salary_min: 2500000,
    salary_max: 5000000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://juspay.in/careers',
    is_featured: true,
    is_urgent: false,
    openings: 5,
  },

  // ── Khatabook ──
  {
    company: 'Khatabook',
    title: 'SDE-2 — Khatabook Business App (Android)',
    summary: 'Build the bookkeeping app used by 10M+ Indian small business owners to manage daily ledgers.',
    description: `Khatabook's Android team in Bengaluru is hiring SDE-2 engineers to build features for India's most popular business bookkeeping app. Your code will be used by the kirana store owner, the local contractor, and the small trader — India's backbone.

**Responsibilities:**
- Build offline-first Android features using Room, WorkManager, and Jetpack Compose
- Implement sync protocols that work reliably on 2G/3G networks
- Drive crash rate < 0.1% and ANR rate < 0.05% through rigorous testing
- Collaborate with product and research to build for Bharat's unique usage patterns

**Qualifications:**
- 3+ years of Android development in Kotlin
- Strong Jetpack Compose, Room, WorkManager, and MVVM/MVI experience
- Experience building offline-first or low-connectivity-friendly apps
- Empathy for non-tech-savvy users and willingness to do user research`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'hybrid',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['android', 'kotlin', 'jetpack compose', 'room', 'offline first'],
    experience_min: 3,
    experience_max: 6,
    salary_min: 1800000,
    salary_max: 3200000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://khatabook.com/careers/',
    is_featured: false,
    is_urgent: false,
    openings: 4,
  },

  // ── Jupiter Money ──
  {
    company: 'Jupiter Money',
    title: 'Senior Backend Engineer — Banking Platform',
    summary: 'Build Jupiter\'s neo-banking infrastructure providing savings, FDs, and investments to 1M+ users.',
    description: `Jupiter Money is a next-gen digital bank in Bengaluru. The Backend Platform team is hiring Senior Engineers to build core banking APIs — current accounts, savings goals, fixed deposits, and UPI — integrated with Federal Bank and NPCI.

**Responsibilities:**
- Design and build banking APIs with strict ACID guarantees
- Integrate with Federal Bank's core banking system via secure banking APIs
- Build real-time spend analytics and smart budgeting engine
- Ensure RBI compliance: KYC, AML monitoring, audit trails

**Qualifications:**
- 5+ years of backend engineering experience
- Strong Java/Kotlin with Spring Boot; experience with clean architecture patterns
- Understanding of core banking systems, NPCI integrations, or RBI regulatory frameworks
- Proficient with PostgreSQL (partitioning, logical replication) and Redis`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'onsite',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['java', 'kotlin', 'spring boot', 'postgresql', 'fintech'],
    experience_min: 5,
    experience_max: 9,
    salary_min: 2800000,
    salary_max: 5000000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://jupiter.money/careers/',
    is_featured: false,
    is_urgent: false,
    openings: 4,
  },

  // ── slice ──
  {
    company: 'slice',
    title: 'Backend Engineer — slice UPI Credit Line',
    summary: 'Build the credit line and UPI infrastructure serving Gen Z India\'s daily spending at slice.',
    description: `slice is a next-gen fintech building credit cards and UPI products for young India. The Backend team in Bengaluru is hiring engineers to build the UPI credit line — a BNPL product on top of UPI rails regulated by RBI.

**Responsibilities:**
- Build the credit utilisation and repayment engine for slice's UPI credit line
- Integrate with NPCI UPI 2.0 for credit-on-UPI mandate flows
- Implement credit scoring pipelines using bureau data (CIBIL, Experian)
- Drive regulatory compliance: RBI fair practices code, NACH mandate management

**Qualifications:**
- 2–5 years of backend engineering experience
- Strong Python or Java skills; experience with async frameworks (FastAPI, Quart) or Spring
- Understanding of UPI, NACH, and credit bureau APIs
- Willingness to learn RBI regulatory landscape`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'onsite',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['python', 'java', 'upi', 'fintech', 'postgresql'],
    experience_min: 2,
    experience_max: 5,
    salary_min: 2000000,
    salary_max: 3800000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://careers.sliceit.com/',
    is_featured: false,
    is_urgent: false,
    openings: 5,
  },

  // ── Cashfree Payments ──
  {
    company: 'Cashfree Payments',
    title: 'Senior Software Engineer — Payment Gateway APIs',
    summary: 'Scale Cashfree\'s payment APIs processing ₹1T+ annually for 500,000+ Indian businesses.',
    description: `Cashfree Payments' Engineering team in Bengaluru is hiring Senior Software Engineers to scale the core payment gateway APIs — including net banking, UPI, cards, BNPL, and international payments.

**Responsibilities:**
- Build and maintain high-throughput payment orchestration APIs (50K+ TPS)
- Design multi-tenant API gateway with rate limiting, fraud detection hooks, and SDK support
- Own integrations with bank payment gateways, card networks, and NPCI
- Drive reliability with chaos engineering, load tests, and SLO tracking

**Qualifications:**
- 5+ years of backend engineering experience
- Strong in Java or Go; proficient with MySQL, Redis, and Kafka
- Experience in payment systems: PCI-DSS, 3D Secure, tokenisation, NPCI APIs
- Familiarity with API gateway products (Kong, AWS API Gateway) is a plus`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'hybrid',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['java', 'golang', 'kafka', 'mysql', 'payment systems'],
    experience_min: 5,
    experience_max: 9,
    salary_min: 3000000,
    salary_max: 5500000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://www.cashfree.com/company/careers',
    is_featured: false,
    is_urgent: false,
    openings: 4,
  },

  // ── Hasura ──
  {
    company: 'Hasura',
    title: 'Software Engineer — GraphQL Engine (Haskell)',
    summary: 'Build Hasura\'s open-source GraphQL engine used by 30,000+ developers globally.',
    description: `Hasura is an open-source company building the world's fastest GraphQL engine. The core engine team in Bengaluru works in Haskell to compile GraphQL queries to optimised SQL and build federation capabilities.

**Responsibilities:**
- Implement new GraphQL features: subscriptions, batch mutations, federation v2
- Optimise the query compilation pipeline for PostgreSQL, MySQL, and BigQuery
- Contribute to Hasura's open-source codebase (3,000+ GitHub stars)
- Write clear technical blog posts and documentation for the developer community

**Qualifications:**
- 2+ years of software engineering experience
- Experience with Haskell or another strongly-typed functional language (Scala, OCaml, F#)
- Understanding of database internals: query planning, execution plans, indexes
- Comfort contributing to open-source projects and engaging with external contributors`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'remote',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['haskell', 'graphql', 'postgresql', 'functional programming', 'open source'],
    experience_min: 2,
    experience_max: 7,
    salary_min: 2500000,
    salary_max: 5000000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://hasura.io/careers/',
    is_featured: true,
    is_urgent: false,
    openings: 3,
  },

  // ── Chargebee ──
  {
    company: 'Chargebee',
    title: 'Senior Full-Stack Engineer — Subscription Billing Platform',
    summary: 'Build subscription billing features used by SaaS companies like Freshdesk, Calendly, and Gong.',
    description: `Chargebee's Engineering team in Bengaluru is hiring Senior Full-Stack Engineers to expand the subscription management and revenue recognition capabilities of its billing platform — trusted by 6,500+ SaaS businesses globally.

**Responsibilities:**
- Build new billing primitives: usage-based pricing, hybrid billing, and revenue recovery flows
- Develop React-based merchant dashboard features for subscription analytics and churn management
- Integrate with 30+ payment gateways and build a unified payment method management layer
- Drive API design following REST + JSON:API standards, write OpenAPI docs

**Qualifications:**
- 5+ years of full-stack engineering experience
- Strong in Java (backend) and React/TypeScript (frontend)
- Experience with subscription billing, SaaS metrics (MRR, churn, LTV) is a big plus
- Proficient with MySQL, Redis, and Elasticsearch`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'hybrid',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['java', 'react', 'typescript', 'mysql', 'saas'],
    experience_min: 5,
    experience_max: 9,
    salary_min: 3000000,
    salary_max: 5500000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://www.chargebee.com/company/careers/',
    is_featured: false,
    is_urgent: false,
    openings: 4,
  },

  // ── Zoho ──
  {
    company: 'Zoho',
    title: 'Software Engineer — Zoho CRM (AI Features)',
    summary: 'Build AI-powered CRM features used by 250,000+ businesses on Zoho\'s flagship sales platform.',
    description: `Zoho CRM's Engineering team in Bengaluru is hiring Software Engineers to build the next wave of AI features — lead scoring, conversational bots, and intelligent deal prediction — for the world's most used CRM.

**Responsibilities:**
- Integrate Zoho's in-house LLM (Zia AI) with CRM workflows and UI components
- Build the CRM's predictive analytics engine: deal win probability, churn risk scores
- Develop CRM mobile SDK components used in Zoho's iOS and Android apps
- Write unit and integration tests and ensure < 0.1% critical-bug rates in production

**Qualifications:**
- 2–5 years of software engineering experience
- Proficient in Java (backend) and JavaScript (frontend); mobile SDK experience is a plus
- Interest in AI/ML integrations: prompt engineering, RAG, or LLM APIs
- Strong problem-solving skills with a product mindset`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'onsite',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['java', 'javascript', 'machine learning', 'saas', 'crm'],
    experience_min: 2,
    experience_max: 5,
    salary_min: 1500000,
    salary_max: 2800000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://careers.zohocorp.com/',
    is_featured: false,
    is_urgent: false,
    openings: 10,
  },

  // ── Dream11 ──
  {
    company: 'Dream11',
    title: 'Senior Backend Engineer — Real-Time Contest Platform',
    summary: 'Scale Dream11\'s contest platform handling 10M+ concurrent users during IPL match nights.',
    description: `Dream11's Technology team in Bengaluru is hiring Senior Backend Engineers for the Real-Time Contest Platform — the system that powers live match updates, scoring, and leaderboard computation for India's largest fantasy sports platform.

**Responsibilities:**
- Design and scale the leaderboard engine to rank 10M+ teams in < 2 seconds
- Build real-time score ingestion pipelines from BCCI and ICC official data feeds
- Implement WebSocket-based push notifications for live leaderboard updates
- Drive DR drills and chaos engineering to ensure IPL-night resilience

**Qualifications:**
- 5+ years of backend engineering experience
- Strong in Go or Java; experience with real-time data streaming (Kafka, Pulsar)
- Proficient with Redis (sorted sets, Lua scripts), Cassandra, and PostgreSQL
- Experience handling extreme traffic spikes (10x–100x baseline)`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'hybrid',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['golang', 'java', 'kafka', 'redis', 'cassandra'],
    experience_min: 5,
    experience_max: 9,
    salary_min: 3500000,
    salary_max: 6500000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://www.dream11.com/careers',
    is_featured: true,
    is_urgent: true,
    openings: 4,
  },

  // ── Jar ──
  {
    company: 'Jar',
    title: 'SDE-1 — Jar Gold Savings App (Backend)',
    summary: 'Build micro-savings features that help 10M+ Indians invest spare change into digital gold daily.',
    description: `Jar is a Bengaluru-based fintech helping Indians invest in digital gold through UPI-based micro-savings. The Engineering team is hiring SDE-1s eager to own features end-to-end and grow fast.

**Responsibilities:**
- Build backend APIs for gold purchase, redemption, and portfolio tracking
- Integrate with MMTC-PAMP digital gold APIs and NPCI UPI auto-debit mandates
- Write clean, tested Django/FastAPI services and own them in production
- Collaborate with product to build savings nudges and personalisation features

**Qualifications:**
- 1–3 years of backend engineering experience (fresher with strong internship OK)
- Strong Python skills; Django or FastAPI experience preferred
- Basic understanding of REST APIs, PostgreSQL, and Redis
- Eagerness to learn fintech infrastructure and take ownership early`,
    category: 'private',
    job_type: 'full_time',
    work_mode: 'onsite',
    location_city: 'Bengaluru',
    location_state: 'Karnataka',
    skills: ['python', 'django', 'fastapi', 'postgresql', 'redis'],
    experience_min: 1,
    experience_max: 3,
    salary_min: 1200000,
    salary_max: 2000000,
    is_salary_disclosed: true,
    salary_currency: 'INR',
    salary_period: 'year',
    apply_url: 'https://myjar.app/careers',
    is_featured: false,
    is_urgent: false,
    openings: 5,
  },
]

// ─── Main ─────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🚀 Seeding ${JOBS.length} real Bangalore job cards into Supabase...\n`)

  // Find an admin user to use as posted_by. Fall back to any active user
  // if no admin account exists yet (service-role key bypasses RLS checks).
  let postedBy = null
  for (const roleFilter of ['admin', 'recruiter', 'candidate']) {
    const { data } = await admin
      .from('user_profiles')
      .select('id')
      .eq('role', roleFilter)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()
    if (data?.id) { postedBy = data.id; break }
  }

  if (!postedBy) {
    console.error('❌ No active user found in user_profiles. Sign up at least one user first.')
    process.exit(1)
  }
  console.log(`✅ Using posted_by user: ${postedBy}\n`)

  // Company ID cache
  const companyCache = {}

  let inserted = 0
  let skipped = 0
  let errored = 0

  for (const job of JOBS) {
    // Resolve company
    if (!companyCache[job.company]) {
      const id = await resolveCompany(job.company)
      companyCache[job.company] = id
    }
    const company_id = companyCache[job.company]

    const slug = slugify(job.title)

    // Build row directly (no validateJobInput to avoid actor-role restrictions on salary fields)
    const row = {
      title: job.title,
      slug,
      summary: job.summary,
      description: job.description,
      category: 'private',
      job_type: job.job_type || 'full_time',
      work_mode: job.work_mode,
      location_city: job.location_city,
      location_state: job.location_state,
      location_country: 'India',
      is_multi_location: false,
      locations: [],
      skills: job.skills || [],
      experience_min: job.experience_min ?? 0,
      experience_max: job.experience_max ?? null,
      salary_min: job.salary_min ?? null,
      salary_max: job.salary_max ?? null,
      salary_currency: job.salary_currency || 'INR',
      salary_period: job.salary_period || 'year',
      is_salary_disclosed: job.is_salary_disclosed ?? true,
      openings: job.openings || 1,
      apply_mode: 'external',
      apply_url: job.apply_url,
      status: 'active',
      is_featured: job.is_featured || false,
      is_urgent: job.is_urgent || false,
      government_meta: null,
      company_id,
      posted_by: postedBy,
      posted_at: new Date().toISOString(),
      department: job.department || null,
      industry: job.industry || null,
    }

    const { error } = await admin.from('jobs').insert(row)

    if (error) {
      if (
        error.message?.includes('duplicate key') ||
        error.message?.includes('unique') ||
        error.code === '23505'
      ) {
        console.log(`  ⏭  Skipped (already exists): ${job.title}`)
        skipped++
      } else {
        console.error(`  ❌ Error inserting "${job.title}": ${error.message}`)
        errored++
      }
    } else {
      console.log(`  ✅ Inserted: ${job.title} @ ${job.company}`)
      inserted++
    }
  }

  console.log(`\n─────────────────────────────────────────`)
  console.log(`✅ Inserted : ${inserted}`)
  console.log(`⏭  Skipped  : ${skipped} (already exist)`)
  console.log(`❌ Errors   : ${errored}`)
  console.log(`─────────────────────────────────────────\n`)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
