import { createClient } from '@/lib/supabase-server'

const JOB_SELECT = `
  id, short_id, slug, title, summary, description, category, job_type, work_mode,
  location_city, location_state, location_country, locations, is_multi_location,
  geo_lat, geo_lng,
  salary_min, salary_max, salary_currency, salary_period, is_salary_disclosed,
  experience_min, experience_max,
  openings, openings_filled,
  posted_at, job_start_date, application_deadline,
  skills, qualifications, department, industry, benefits,
  apply_mode, apply_url, apply_email, apply_phone,
  government_meta,
  status, is_featured, is_urgent,
  views_count, applications_count,
  meta_title, meta_description, og_image_url, faq,
  company:companies ( id, name, slug, logo_url, website, industry, size, is_verified )
`

export async function getJobs(filters = {}) {
  try {
    const supabase = await createClient()
    let q = supabase.from('jobs').select(JOB_SELECT).eq('status', 'active')

    if (filters.category && filters.category !== 'ai') {
      q = q.eq('category', filters.category)
    }
    if (filters.q) {
      q = q.or(`title.ilike.%${filters.q}%,summary.ilike.%${filters.q}%`)
    }
    if (filters.location) {
      q = q.ilike('location_city', `%${filters.location}%`)
    }
    if (filters.work_mode) q = q.eq('work_mode', filters.work_mode)
    if (filters.job_type)  q = q.eq('job_type', filters.job_type)
    if (filters.exclude_internships) q = q.neq('job_type', 'internship')

    const hasNum = (v) => v !== '' && v !== null && v !== undefined && !Number.isNaN(Number(v))
    if (hasNum(filters.exp_min)) q = q.gte('experience_min', Number(filters.exp_min))
    if (hasNum(filters.exp_max)) q = q.lte('experience_max', Number(filters.exp_max))
    if (hasNum(filters.sal_min)) q = q.gte('salary_min',     Number(filters.sal_min))

    if (Array.isArray(filters.skills) && filters.skills.length > 0) {
      q = q.contains('skills', filters.skills)
    }

    const sort = filters.sort || 'newest'
    if (sort === 'salary')   q = q.order('salary_max',    { ascending: false, nullsFirst: false })
    else if (sort === 'deadline') q = q.order('application_deadline', { ascending: true,  nullsFirst: false })
    else                       q = q.order('posted_at', { ascending: false })

    const page    = Math.max(1, Number(filters.page || 1))
    const perPage = Math.min(48, Math.max(6, Number(filters.per_page || 12)))
    const from    = (page - 1) * perPage
    const to      = from + perPage - 1
    q = q.range(from, to)

    const { data, error } = await q
    if (error) {
      console.warn('[getJobs] supabase error:', error.message)
      return { jobs: [], page, perPage, error: error.message }
    }
    return { jobs: data || [], page, perPage, error: null }
  } catch (err) {
    console.warn('[getJobs] unexpected:', err?.message)
    return { jobs: [], page: 1, perPage: 12, error: err?.message }
  }
}

export async function getJobBySlug(category, slug) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('jobs')
      .select(JOB_SELECT)
      .eq('category', category)
      .eq('slug', slug)
      .eq('status', 'active')
      .maybeSingle()
    if (error) {
      console.warn('[getJobBySlug]', error.message)
      return null
    }
    return data
  } catch (err) {
    console.warn('[getJobBySlug] unexpected:', err?.message)
    return null
  }
}

export async function getSimilarJobs(jobId, category, skills = [], limit = 6) {
  try {
    const supabase = await createClient()
    let q = supabase.from('jobs').select(JOB_SELECT)
      .eq('status', 'active').eq('category', category).neq('id', jobId)
    if (skills.length > 0) q = q.overlaps('skills', skills)
    q = q.order('posted_at', { ascending: false }).limit(limit)
    const { data, error } = await q
    if (error) return []
    return data || []
  } catch {
    return []
  }
}

export async function getRecentJobsForWidget(limit = 4, category = null) {
  try {
    const supabase = await createClient()
    let q = supabase.from('jobs').select(JOB_SELECT).eq('status', 'active')
    if (category) q = q.eq('category', category)
    q = q.order('posted_at', { ascending: false }).limit(limit)
    const { data } = await q
    return data || []
  } catch {
    return []
  }
}

export async function getRecruiterJobs(userId) {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('jobs').select(JOB_SELECT)
      .eq('posted_by', userId)
      .order('created_at', { ascending: false })
    return data || []
  } catch {
    return []
  }
}

export async function getAdminPendingJobs(limit = 20) {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('jobs').select(JOB_SELECT)
      .eq('status', 'pending_approval')
      .order('posted_at', { ascending: true })
      .limit(limit)
    return data || []
  } catch {
    return []
  }
}

export async function getAllActiveJobsForSitemap() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('jobs').select('category, slug, updated_at')
      .eq('status', 'active')
      .order('updated_at', { ascending: false })
      .limit(50000)
    return data || []
  } catch {
    return []
  }
}
