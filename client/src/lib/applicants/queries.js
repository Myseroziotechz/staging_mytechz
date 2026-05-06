import { createClient } from '@/lib/supabase-server'

const APP_SELECT = `
  id, job_id, user_id, job_url, job_title, company_name,
  status, applied_at, last_status_at, recruiter_notes, rating,
  job:jobs ( id, slug, title, category, status, posted_by ),
  candidate:user_profiles!job_applications_user_id_fkey (
    id, full_name, email, phone, avatar_url
  )
`

// Fallback when the FK join name differs in this schema.
const APP_SELECT_NO_CANDIDATE = `
  id, job_id, user_id, job_url, job_title, company_name,
  status, applied_at, last_status_at, recruiter_notes, rating,
  job:jobs ( id, slug, title, category, status, posted_by )
`

async function fetchWithFallback(supabase, builderFn) {
  let q = builderFn(APP_SELECT)
  let { data, error } = await q
  if (!error) return { data: data || [], error: null }
  // FK alias missing — retry without the candidate join.
  q = builderFn(APP_SELECT_NO_CANDIDATE)
  ;({ data, error } = await q)
  return { data: data || [], error }
}

// Applications for jobs the recruiter posted.
export async function getRecruiterApplicants(userId, { jobId = null } = {}) {
  if (!userId) return { applicants: [], error: 'no user' }
  const supabase = await createClient()

  // Get the recruiter's job ids (filtered by jobId if provided).
  let jq = supabase.from('jobs').select('id').eq('posted_by', userId)
  if (jobId) jq = jq.eq('id', jobId)
  const { data: jobs, error: jerr } = await jq
  if (jerr) return { applicants: [], error: jerr.message }
  const ids = (jobs || []).map((j) => j.id)
  if (ids.length === 0) return { applicants: [], error: null }

  const { data, error } = await fetchWithFallback(supabase, (sel) =>
    supabase
      .from('job_applications')
      .select(sel)
      .in('job_id', ids)
      .order('applied_at', { ascending: false })
      .limit(500)
  )
  return { applicants: data, error: error?.message || null }
}

// Lightweight job list for the recruiter dropdown filter on the page.
export async function getRecruiterJobsLite(userId) {
  if (!userId) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from('jobs')
    .select('id, title, slug, category, status, posted_at')
    .eq('posted_by', userId)
    .order('posted_at', { ascending: false })
    .limit(100)
  return data || []
}

export async function getRecruiterApplicantStats(userId) {
  const { applicants } = await getRecruiterApplicants(userId)
  const byStatus = {}
  let weekCount = 0
  const weekAgo = Date.now() - 7 * 86400000
  for (const a of applicants) {
    byStatus[a.status] = (byStatus[a.status] || 0) + 1
    if (a.applied_at && new Date(a.applied_at).getTime() >= weekAgo)
      weekCount++
  }
  return { total: applicants.length, byStatus, weekCount }
}
