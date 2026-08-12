import { normalizeSkillSet } from './skill-aliases'
import { ROLE_KEYWORDS_MAP } from '@/lib/ai/ats-rule-engine'

const SENIOR_RE = /\b(senior|sr\.?|lead|principal|staff|architect|head of|director)\b/i
const JUNIOR_RE = /\b(junior|jr\.?|entry.?level|associate|graduate|fresher|trainee)\b/i
const INTERN_RE = /\b(intern|internship)\b/i

/**
 * Derives structured requirements from a `jobs` row. The DB has no
 * required-vs-preferred skill split — `job.skills` is one flat array, so it
 * is treated as the required set. Attempting to mine "preferred" skills out
 * of the free-text `qualifications`/`description` fields was considered and
 * rejected: there's no reliable "must-have" vs "nice-to-have" marker in that
 * text, and guessing would produce a false-confidence percentage shown to
 * the user as fact.
 */
export function deriveJobRequirements(job) {
  const requiredSkills = normalizeSkillSet(job.skills || [])

  const title = job.title || ''
  const seniority = INTERN_RE.test(title) ? 'intern'
    : SENIOR_RE.test(title) ? 'senior'
    : JUNIOR_RE.test(title) ? 'junior'
    : 'mid'

  const titleLower = title.toLowerCase()
  let domain = Object.keys(ROLE_KEYWORDS_MAP).find((role) => titleLower.includes(role))
  if (!domain) {
    let best = null
    let bestOverlap = 0
    for (const [role, kws] of Object.entries(ROLE_KEYWORDS_MAP)) {
      const kwSet = normalizeSkillSet(kws)
      const overlap = requiredSkills.filter((s) => kwSet.includes(s)).length
      if (overlap > bestOverlap) {
        bestOverlap = overlap
        best = role
      }
    }
    domain = best
  }

  return {
    requiredSkills,
    domain,
    seniority,
    experienceMin: job.experience_min ?? null,
    experienceMax: job.experience_max ?? null,
  }
}
