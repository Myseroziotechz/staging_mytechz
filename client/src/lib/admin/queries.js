import { createClient } from '@/lib/supabase-server'

const ADMIN_JOB_SELECT = `
  id, slug, title, summary, category, job_type, work_mode,
  location_city, status, is_featured, is_urgent,
  posted_at, application_deadline, applications_count, views_count,
  posted_by,
  company:companies ( id, name, logo_url, is_verified )
`

const VALID_STATUS = new Set([
  'active',
  'pending_approval',
  'closed',
  'draft',
  'rejected',
])
const VALID_CATEGORY = new Set(['private', 'government', 'internship', 'ai'])

export async function getAllJobsForAdmin(filters = {}) {
  const supabase = await createClient()
  let q = supabase.from('jobs').select(ADMIN_JOB_SELECT)

  if (filters.status && VALID_STATUS.has(filters.status))
    q = q.eq('status', filters.status)
  if (filters.category && VALID_CATEGORY.has(filters.category))
    q = q.eq('category', filters.category)
  if (filters.q) {
    const safe = filters.q.replace(/[%_]/g, ' ')
    q = q.or(`title.ilike.%${safe}%,summary.ilike.%${safe}%`)
  }
  if (filters.date_from) q = q.gte('posted_at', filters.date_from)
  if (filters.date_to) q = q.lte('posted_at', filters.date_to)

  q = q.order('posted_at', { ascending: false }).limit(200)
  const { data, error } = await q
  if (error) {
    console.warn('[getAllJobsForAdmin]', error.message)
    return { jobs: [], error: error.message }
  }
  return { jobs: data || [], error: null }
}

const ADMIN_APP_SELECT = `
  id, job_id, user_id, job_title, company_name, status,
  applied_at, last_status_at, recruiter_notes, rating,
  job:jobs ( id, slug, title, category, posted_by ),
  candidate:user_profiles!job_applications_user_id_fkey (
    id, full_name, email, phone, avatar_url
  )
`
const ADMIN_APP_SELECT_NO_CAND = ADMIN_APP_SELECT.replace(
  /,\s*candidate:user_profiles[^)]+\)\s*\)\s*/,
  ''
).replace(/,\s*$/, '')

export async function getAllApplicationsForAdmin(filters = {}) {
  const supabase = await createClient()

  async function run(sel) {
    let q = supabase.from('job_applications').select(sel)
    if (filters.status) q = q.eq('status', filters.status)
    if (filters.job_id) q = q.eq('job_id', filters.job_id)
    if (filters.date_from) q = q.gte('applied_at', filters.date_from)
    if (filters.date_to) q = q.lte('applied_at', filters.date_to)
    return q.order('applied_at', { ascending: false }).limit(500)
  }

  let { data, error } = await run(ADMIN_APP_SELECT)
  if (error) {
    ;({ data, error } = await run(ADMIN_APP_SELECT_NO_CAND))
  }
  return { applications: data || [], error: error?.message || null }
}

export async function getAdminPlatformKPIs() {
  const supabase = await createClient()
  async function count(table, eqs = []) {
    let q = supabase.from(table).select('*', { count: 'exact', head: true })
    for (const [k, v] of eqs) q = q.eq(k, v)
    const { count: c } = await q
    return c ?? 0
  }
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()

  const [
    activeJobs,
    pendingJobs,
    totalApplicants,
    weekApplicants,
    privateCount,
    govCount,
    internCount,
    aiCount,
  ] = await Promise.all([
    count('jobs', [['status', 'active']]),
    count('jobs', [['status', 'pending_approval']]),
    count('job_applications'),
    (async () => {
      const { count: c } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true })
        .gte('applied_at', weekAgo)
      return c ?? 0
    })(),
    count('jobs', [['status', 'active'], ['category', 'private']]),
    count('jobs', [['status', 'active'], ['category', 'government']]),
    count('jobs', [['status', 'active'], ['category', 'internship']]),
    count('jobs', [['status', 'active'], ['category', 'ai']]),
  ])

  return {
    activeJobs,
    pendingJobs,
    totalApplicants,
    weekApplicants,
    byCategory: {
      private: privateCount,
      government: govCount,
      internship: internCount,
      ai: aiCount,
    },
  }
}
