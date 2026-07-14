import { createClient } from '@/lib/supabase/server'

const SALARY_BUCKETS = [
  { value: '0-5',   label: '0 – 5 LPA',   min: 0,        max: 500000 },
  { value: '5-10',  label: '5 – 10 LPA',  min: 500000,   max: 1000000 },
  { value: '10-15', label: '10 – 15 LPA', min: 1000000,  max: 1500000 },
  { value: '15-25', label: '15 – 25 LPA', min: 1500000,  max: 2500000 },
  { value: '25+',   label: '25 LPA+',     min: 2500000,  max: Infinity },
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

function bump(map, key) {
  if (!key) return
  map.set(key, (map.get(key) || 0) + 1)
}

function toOptions(map) {
  return [...map.entries()]
    .map(([value, count]) => ({ value, label: value, count }))
    .sort((a, b) => b.count - a.count)
}

export async function getPrivateJobFacets() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('jobs')
      .select('department, work_mode, location_city, industry, qualifications, salary_min, salary_max, is_featured, is_urgent, company:companies ( id, name )')
      .eq('status', 'active')
      .eq('category', 'private')
      .limit(2000)

    if (error || !data) {
      console.warn('[getPrivateJobFacets]', error?.message)
      return EMPTY_FACETS
    }

    const department = new Map(DEPARTMENT_TAXONOMY.map((d) => [d, 0]))
    const workMode    = new Map()
    const location    = new Map()
    const industry    = new Map()
    const education   = new Map()
    const companies   = new Map()
    const salary      = new Map(SALARY_BUCKETS.map((b) => [b.value, 0]))
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

      const salaryValue = job.salary_max ?? job.salary_min
      if (salaryValue != null) {
        const bucket = SALARY_BUCKETS.find((b) => salaryValue >= b.min && salaryValue <= b.max)
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
      salary: SALARY_BUCKETS
        .map((b) => ({ value: b.value, label: b.label, count: salary.get(b.value) || 0 }))
        .filter((b) => b.count > 0),
      highlight,
    }
  } catch (err) {
    console.warn('[getPrivateJobFacets] unexpected:', err?.message)
    return EMPTY_FACETS
  }
}
