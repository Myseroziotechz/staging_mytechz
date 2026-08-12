import 'server-only'

// Build a compact USER_CONTEXT string from MyTechz Supabase.
// Resilient to missing tables/columns — every block try/catches independently.
export async function buildUserContext(supabase, userId) {
  if (!userId) return null

  const ctx = {
    name: null,
    role: null,
    location: null,
    experienceYears: null,
    skills: [],
    appliedHistory: [],
    saved: [],
    pastSearches: [],
  }

  // 1. profile
  try {
    const { data } = await supabase
      .from('user_profiles')
      .select('full_name, role, phone, city, state, country')
      .eq('id', userId)
      .maybeSingle()
    if (data) {
      ctx.name = data.full_name || null
      ctx.role = data.role || null
      ctx.location =
        [data.city, data.state].filter(Boolean).join(', ') ||
        data.country ||
        null
    }
  } catch {}

  // 2. resume (latest, primary if a flag exists)
  try {
    const { data } = await supabase
      .from('resumes')
      .select(
        'parsed_skills, total_experience_years, parsed_location, work_history, is_primary, created_at'
      )
      .eq('user_id', userId)
      .order('is_primary', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(1)
    const r = data?.[0]
    if (r) {
      if (Array.isArray(r.parsed_skills))
        ctx.skills = r.parsed_skills.slice(0, 15)
      if (r.total_experience_years != null)
        ctx.experienceYears = Number(r.total_experience_years)
      if (!ctx.location && r.parsed_location) ctx.location = r.parsed_location
    }
  } catch {}

  // 3. recent applications
  try {
    const { data } = await supabase
      .from('job_applications')
      .select('job_title, company_name, status, applied_at')
      .eq('user_id', userId)
      .order('applied_at', { ascending: false })
      .limit(5)
    if (Array.isArray(data)) ctx.appliedHistory = data
  } catch {}

  // 4. saved jobs
  try {
    const { data } = await supabase
      .from('saved_jobs')
      .select('job_title, company_name, saved_at')
      .eq('user_id', userId)
      .order('saved_at', { ascending: false })
      .limit(5)
    if (Array.isArray(data)) ctx.saved = data
  } catch {}

  // 5. past searches (last 5 user turns from chat_messages)
  try {
    const { data: sessions } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)
    const ids = (sessions || []).map((s) => s.id)
    if (ids.length) {
      const { data: msgs } = await supabase
        .from('chat_messages')
        .select('content, created_at, role')
        .in('session_id', ids)
        .eq('role', 'user')
        .order('created_at', { ascending: false })
        .limit(5)
      if (Array.isArray(msgs))
        ctx.pastSearches = msgs.map((m) => m.content).filter(Boolean)
    }
  } catch {}

  return ctx
}

export function formatUserContext(ctx) {
  if (!ctx) return 'ANONYMOUS — user is not signed in.'
  const lines = []
  if (ctx.name) lines.push(`NAME: ${ctx.name}`)
  if (ctx.role) lines.push(`ROLE: ${ctx.role}`)
  if (ctx.location) lines.push(`LOCATION: ${ctx.location}`)
  if (ctx.experienceYears != null)
    lines.push(`EXPERIENCE: ${ctx.experienceYears} years`)
  if (ctx.skills.length) lines.push(`TOP SKILLS: ${ctx.skills.join(', ')}`)
  if (ctx.appliedHistory.length) {
    lines.push('RECENTLY APPLIED:')
    ctx.appliedHistory.forEach((a) => {
      const when = a.applied_at
        ? new Date(a.applied_at).toISOString().slice(0, 10)
        : ''
      lines.push(
        `  - ${a.job_title || 'Untitled'} @ ${a.company_name || 'Unknown'} (${a.status || 'applied'}, ${when})`
      )
    })
  }
  if (ctx.saved.length) {
    lines.push('SAVED:')
    ctx.saved.forEach((s) => {
      const when = s.saved_at
        ? new Date(s.saved_at).toISOString().slice(0, 10)
        : ''
      lines.push(
        `  - ${s.job_title || 'Untitled'} @ ${s.company_name || 'Unknown'} (saved ${when})`
      )
    })
  }
  if (ctx.pastSearches.length) {
    lines.push('RECENT SEARCHES:')
    ctx.pastSearches.forEach((q) => lines.push(`  - "${q.slice(0, 120)}"`))
  }
  return lines.join('\n') || 'NEW USER — no profile data yet.'
}
