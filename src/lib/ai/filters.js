import 'server-only'

// Pure regex-based job-search filter extraction — no LLM call.
// Shared by the AI chat's search-jobs branch and the /jobs/ai page's prompt box.
export function extractFiltersHeuristic(message) {
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
