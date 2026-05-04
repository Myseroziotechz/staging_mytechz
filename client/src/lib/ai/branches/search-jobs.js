import 'server-only'
import { chatJSON, safeParseJSON, isLLMConfigured } from '../llm'
import { scoreJob, reasonFor } from '../score'
import { formatUserContext } from '../context'

const JOB_SELECT = `
  id, slug, title, summary, category, job_type, work_mode,
  location_city, location_state,
  salary_min, salary_max, salary_currency, salary_period, is_salary_disclosed,
  experience_min, experience_max,
  posted_at, application_deadline,
  skills, apply_mode, apply_url,
  status, is_featured, is_urgent,
  company:companies ( id, name, slug, logo_url, is_verified )
`

const EXTRACT_SYSTEM = `Extract job-search filters from the user's message.
Return ONLY this JSON (no prose, no code fences):
{
  "city":     string|null,
  "category": "private"|"government"|null,
  "job_type": "internship"|"full_time"|"part_time"|"contract"|null,
  "work_mode":"remote"|"hybrid"|"onsite"|null,
  "exp_max":  number|null,
  "skills":   string[]|null,
  "salary_min": number|null
}
Rules:
- "internship", "intern" => job_type "internship"
- "remote", "wfh" => work_mode "remote"
- "govt", "government", "psu", "sarkari" => category "government"
- If the user just says "best jobs for me" or similar, return all nulls.
- Numbers in lakhs: "10 LPA" => 1000000.`

function extractFiltersHeuristic(message) {
  const t = message.toLowerCase()
  const out = {
    city: null, category: null, job_type: null,
    work_mode: null, exp_max: null, skills: null, salary_min: null,
  }
  if (/\b(intern|internship|trainee)\b/.test(t)) out.job_type = 'internship'
  if (/\b(remote|wfh|work from home)\b/.test(t)) out.work_mode = 'remote'
  if (/\b(hybrid)\b/.test(t)) out.work_mode = 'hybrid'
  if (/\b(onsite|on-site|in office)\b/.test(t)) out.work_mode = 'onsite'
  if (/\b(govt|government|psu|sarkari)\b/.test(t)) out.category = 'government'
  if (/\b(private|corporate|mnc)\b/.test(t)) out.category = 'private'
  const lpa = t.match(/(\d+(?:\.\d+)?)\s*(lpa|lakhs?|l)\b/)
  if (lpa) out.salary_min = Math.round(parseFloat(lpa[1]) * 100000)
  const exp = t.match(/(\d+)\s*(?:\+)?\s*(?:yrs?|years?)/)
  if (exp) out.exp_max = Number(exp[1])
  return out
}

async function extractFilters(message, userCtx) {
  if (!isLLMConfigured()) return extractFiltersHeuristic(message)
  try {
    const raw = await chatJSON({
      system: EXTRACT_SYSTEM,
      user: `User context (use to resolve vague terms):\n${formatUserContext(userCtx)}\n\nMessage: ${message}`,
      json: true,
      max: 200,
    })
    const parsed = safeParseJSON(raw, null)
    if (parsed && typeof parsed === 'object') return parsed
  } catch (e) {
    console.warn('[ai] extractFilters failed', e.message)
  }
  return extractFiltersHeuristic(message)
}

async function fetchCandidates(supabase, filters, userCtx) {
  let q = supabase.from('jobs').select(JOB_SELECT).eq('status', 'active')
  if (filters.category) q = q.eq('category', filters.category)
  if (filters.city) q = q.ilike('location_city', `%${filters.city}%`)
  if (filters.work_mode) q = q.eq('work_mode', filters.work_mode)
  if (filters.job_type) q = q.eq('job_type', filters.job_type)
  if (filters.exp_max != null) q = q.lte('experience_min', filters.exp_max)
  if (filters.salary_min != null) q = q.gte('salary_min', filters.salary_min)
  if (Array.isArray(filters.skills) && filters.skills.length) {
    q = q.overlaps('skills', filters.skills)
  } else if (userCtx?.skills?.length) {
    q = q.overlaps('skills', userCtx.skills)
  }
  q = q.order('posted_at', { ascending: false }).limit(50)
  const { data, error } = await q
  if (error) {
    console.warn('[ai] candidate query failed', error.message)
    return []
  }
  return data || []
}

async function fetchFallback(supabase, filters) {
  // No skill-overlap, broad fallback if the filtered query returned nothing.
  let q = supabase.from('jobs').select(JOB_SELECT).eq('status', 'active')
  if (filters.category) q = q.eq('category', filters.category)
  if (filters.job_type) q = q.eq('job_type', filters.job_type)
  q = q.order('posted_at', { ascending: false }).limit(20)
  const { data } = await q
  return data || []
}

const RERANK_SYSTEM = `You are MyTechZ's job-matching assistant.
Given USER_CONTEXT and a list of candidate jobs (id + summary), pick the best 3-6
for this user, ranked. Return ONLY this JSON:
{
  "reply":  "<= 50 words, second person, mention 1-2 reasons for the top pick>",
  "jobIds": ["<id-1>", "<id-2>", "<id-3>"]
}
The jobIds MUST be a subset of the candidate ids. Do not invent ids.`

function compactJob(j) {
  const sal = j.salary_min ? ` ~${Math.round(j.salary_min / 100000)}L` : ''
  const loc = j.location_city || (j.work_mode === 'remote' ? 'Remote' : '')
  const skills = (j.skills || []).slice(0, 5).join('/')
  return `${j.id} | ${j.title} @ ${j.company?.name || 'Unknown'} | ${loc} | ${j.job_type}/${j.work_mode}${sal} | ${skills}`
}

async function llmRerank(top, userCtx) {
  if (!isLLMConfigured() || top.length === 0)
    return { reply: defaultReply(top, userCtx), jobIds: top.slice(0, 5).map((j) => j.id) }
  try {
    const raw = await chatJSON({
      system: RERANK_SYSTEM,
      user: `USER_CONTEXT:\n${formatUserContext(userCtx)}\n\nCANDIDATES:\n${top.map(compactJob).join('\n')}`,
      json: true,
      max: 350,
      smart: true,
    })
    const parsed = safeParseJSON(raw, null)
    if (parsed && Array.isArray(parsed.jobIds)) {
      const allowed = new Set(top.map((t) => t.id))
      const ids = parsed.jobIds.filter((id) => allowed.has(id)).slice(0, 6)
      if (ids.length)
        return { reply: parsed.reply || defaultReply(top, userCtx), jobIds: ids }
    }
  } catch (e) {
    console.warn('[ai] rerank failed', e.message)
  }
  return { reply: defaultReply(top, userCtx), jobIds: top.slice(0, 5).map((j) => j.id) }
}

function defaultReply(top, ctx) {
  if (!top.length) return "I couldn't find matches just now. Try widening filters or different keywords."
  const t = top[0]
  const who = ctx?.name?.split(' ')[0] || 'there'
  const skill = t.skills?.[0]
  return skill
    ? `Hey ${who} — top pick is "${t.title}" at ${t.company?.name || 'a verified employer'} (${skill} match). ${top.length - 1} more below.`
    : `Hey ${who} — found ${top.length} matches. Top pick: "${t.title}".`
}

function buildSuggestions(filters, jobs) {
  const out = []
  if (filters.work_mode !== 'remote') out.push('Show only remote')
  if (filters.job_type !== 'internship') out.push('Just internships')
  if (!filters.category) out.push('Show government jobs')
  if (jobs.some((j) => j.salary_min >= 1500000))
    out.push('Filter ≥ 15 LPA')
  return out.slice(0, 4)
}

export async function searchJobsBranch(supabase, { message, userCtx }) {
  const filters = await extractFilters(message, userCtx)

  let candidates = await fetchCandidates(supabase, filters, userCtx)
  if (candidates.length === 0) candidates = await fetchFallback(supabase, filters)

  const scored = candidates
    .map((j) => ({ job: j, s: scoreJob(j, userCtx) }))
    .filter((x) => x.s >= 0.15)
    .sort((a, b) => b.s - a.s)
    .slice(0, 8)

  const top = scored.map((x) => x.job)
  const { reply, jobIds } = await llmRerank(top, userCtx)

  const idOrder = new Map(jobIds.map((id, i) => [id, i]))
  const final = top
    .filter((j) => idOrder.has(j.id))
    .sort((a, b) => idOrder.get(a.id) - idOrder.get(b.id))
    .map((j) => ({
      ...j,
      _matchScore: Math.round(
        ((scored.find((x) => x.job.id === j.id)?.s || 0) * 100)
      ),
      _reason: reasonFor(j, userCtx),
    }))

  return {
    reply,
    jobs: final,
    suggestions: buildSuggestions(filters, final),
    meta: { candidate_count: candidates.length, filters },
  }
}
