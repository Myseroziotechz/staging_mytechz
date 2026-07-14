import { createClient } from '@/lib/supabase/server'

const SALARY_BUCKETS = [
  { value: '0-5',   label: '0 – 5 LPA',   min: 0,        max: 500000 },
  { value: '5-10',  label: '5 – 10 LPA',  min: 500000,   max: 1000000 },
  { value: '10-15', label: '10 – 15 LPA', min: 1000000,  max: 1500000 },
  { value: '15-25', label: '15 – 25 LPA', min: 1500000,  max: 2500000 },
  { value: '25+',   label: '25 LPA+',     min: 2500000,  max: Infinity },
]

// Internship pay is shown per month (see formatStipend), so bucket ranges
// are month-scale rather than the LPA buckets used for full-time salaries.
const STIPEND_BUCKETS = [
  { value: '0-5k',   label: '0 – 5K / mo',   min: 0,     max: 5000 },
  { value: '5-10k',  label: '5 – 10K / mo',  min: 5000,  max: 10000 },
  { value: '10-20k', label: '10 – 20K / mo', min: 10000, max: 20000 },
  { value: '20-30k', label: '20 – 30K / mo', min: 20000, max: 30000 },
  { value: '30k+',   label: '30K+ / mo',     min: 30000, max: Infinity },
]

// Canonical department taxonomy shown in the filter regardless of how many
// jobs currently use each one — keeps the list stable as the catalog grows.
const DEPARTMENT_TAXONOMY = [
  'Engineering - Software & QA', 'Sales & Business Development',
  'Customer Success, Service & Operations', 'Healthcare & Life Sciences',
  'Finance & Accounting', 'Production, Manufacturing & Engineering',
  'BFSI, Investments & Trading', 'IT & Information Security',
  'Human Resources', 'Data Science & Analytics',
  'Marketing & Communication', 'Consulting',
  'Food, Beverage & Hospitality', 'Procurement & Supply Chain',
  'Other', 'Construction & Site Engineering',
  'Engineering - Hardware & Networks', 'Teaching & Training',
  'Project & Program Management', 'UX, Design & Architecture',
  'Administration & Facilities', 'Quality Assurance',
  'Research & Development', 'Product Management',
  'Legal & Regulatory', 'Merchandising, Retail & eCommerce',
  'Risk Management & Compliance', 'Content, Editorial & Journalism',
  'Environment Health & Safety', 'Media Production & Entertainment',
  'Strategic & Top Management', 'Security Services',
  'Sports, Fitness & Personal Care', 'Energy & Mining',
  'Aviation & Aerospace', 'CSR & Social Service', 'Shipping & Maritime',
]

const EMPTY_FACETS = {
  department: [], workMode: [], location: [], industry: [],
  education: [], company: [], salary: [], highlight: [],
}

const FACET_SELECT = 'department, work_mode, location_city, industry, qualifications, salary_min, salary_max, salary_period, is_featured, is_urgent, company:companies ( id, name )'

function bump(map, key) {
  if (!key) return
  map.set(key, (map.get(key) || 0) + 1)
}

function toOptions(map) {
  return [...map.entries()]
    .map(([value, count]) => ({ value, label: value, count }))
    .sort((a, b) => b.count - a.count)
}

function buildFacets(data, { buckets, bucketValue }) {
  const department = new Map(DEPARTMENT_TAXONOMY.map((d) => [d, 0]))
  const workMode    = new Map()
  const location    = new Map()
  const industry    = new Map()
  const education   = new Map()
  const companies   = new Map()
  const salary      = new Map(buckets.map((b) => [b.value, 0]))
  let featuredCount = 0
  let urgentCount   = 0

  for (const job of data) {
    bump(department, job.department)
    bump(workMode, job.work_mode)
    bump(location, job.location_city)
    bump(industry, job.industry)
    for (const q of job.qualifications || []) bump(education, q)

    if (job.company?.id) {
      const cur = companies.get(job.company.id) || { name: job.company.name, count: 0 }
      cur.count += 1
      companies.set(job.company.id, cur)
    }

    const value = bucketValue(job)
    if (value != null) {
      const bucket = buckets.find((b) => value >= b.min && value <= b.max)
      if (bucket) salary.set(bucket.value, salary.get(bucket.value) + 1)
    }

    if (job.is_featured) featuredCount += 1
    if (job.is_urgent) urgentCount += 1
  }

  const highlight = []
  if (featuredCount > 0) highlight.push({ value: 'featured', label: 'Featured', count: featuredCount })
  if (urgentCount > 0) highlight.push({ value: 'urgent', label: 'Urgent hiring', count: urgentCount })

  return {
    department: toOptions(department),
    workMode: toOptions(workMode),
    location: toOptions(location),
    industry: toOptions(industry),
    education: toOptions(education),
    company: [...companies.entries()]
      .map(([value, { name, count }]) => ({ value, label: name, count }))
      .sort((a, b) => b.count - a.count),
    salary: buckets
      .map((b) => ({ value: b.value, label: b.label, count: salary.get(b.value) || 0 }))
      .filter((b) => b.count > 0),
    highlight,
  }
}

export async function getPrivateJobFacets() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('jobs')
      .select(FACET_SELECT)
      .eq('status', 'active')
      .eq('category', 'private')
      .limit(2000)

    if (error || !data) {
      console.warn('[getPrivateJobFacets]', error?.message)
      return EMPTY_FACETS
    }

    return buildFacets(data, {
      buckets: SALARY_BUCKETS,
      bucketValue: (job) => job.salary_max ?? job.salary_min,
    })
  } catch (err) {
    console.warn('[getPrivateJobFacets] unexpected:', err?.message)
    return EMPTY_FACETS
  }
}

// Same shape as getPrivateJobFacets, scoped to job_type = 'internship' and
// bucketed by monthly stipend instead of annual salary. Department, work
// mode, location, industry, education, highlights and top companies all
// carry over unchanged — those facets are just as meaningful for internship
// listings as they are for private-sector ones.
export async function getInternshipJobFacets() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('jobs')
      .select(FACET_SELECT)
      .eq('status', 'active')
      .eq('job_type', 'internship')
      .limit(2000)

    if (error || !data) {
      console.warn('[getInternshipJobFacets]', error?.message)
      return EMPTY_FACETS
    }

    return buildFacets(data, {
      buckets: STIPEND_BUCKETS,
      bucketValue: (job) => {
        const raw = job.salary_max ?? job.salary_min
        if (raw == null) return null
        return job.salary_period === 'year' ? Math.round(raw / 12) : raw
      },
    })
  } catch (err) {
    console.warn('[getInternshipJobFacets] unexpected:', err?.message)
    return EMPTY_FACETS
  }
}
