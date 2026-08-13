// Pure, sync, no I/O — no 'server-only' guard needed (unlike
// candidate-profile.js/rank-jobs.js, which do real Supabase reads), and
// leaving it off keeps this file testable under plain vitest.
function jaccard(a, b) {
  if (!a.length || !b.length) return 0
  const A = new Set(a)
  const B = new Set(b)
  let inter = 0
  for (const x of A) if (B.has(x)) inter++
  const uni = A.size + B.size - inter
  return uni ? inter / uni : 0
}

function locationScore(job, ctx) {
  if (!ctx.location) return 0.5 // unknown — neutral, don't punish
  if (job.work_mode === 'remote') return 1
  const j = (job.location_city || '').toLowerCase()
  const u = ctx.location.toLowerCase()
  if (j && u && (u.includes(j) || j.includes(u))) return 1
  if (ctx.preferredLocations?.some((p) => p.toLowerCase() === j)) return 1
  return 0.2
}

/**
 * Hard-requirement dampener: a fresher applying to a role that needs 5+ yrs
 * is not "70% short of a good fit" — it's a near-disqualifier. The dampener
 * multiplies the FINAL composite score, not just the experience sub-score,
 * so strong skill overlap alone can't paper over a senior-role mismatch.
 */
function experienceScore(job, ctx, reqs) {
  if (ctx.experienceYears == null) return { score: 0.5, dampener: 1 }
  const min = reqs.experienceMin ?? 0
  const max = reqs.experienceMax ?? (min + 3)
  if (ctx.experienceYears >= min && ctx.experienceYears <= max) return { score: 1, dampener: 1 }

  const dist = ctx.experienceYears < min ? min - ctx.experienceYears : ctx.experienceYears - max
  const score = Math.max(0, 1 - dist / 5)

  let dampener = 1
  if (ctx.experienceYears < min) {
    const gap = min - ctx.experienceYears
    if (gap >= 4) dampener = 0.5
    else if (gap >= 2) dampener = 0.75
  }
  return { score, dampener }
}

function domainScore(reqs, ctx) {
  if (!reqs.domain || !ctx.domain) return 0.5
  return reqs.domain === ctx.domain ? 1 : 0
}

function workModePrefScore(job, ctx) {
  if (!ctx.workMode) return 0.5
  return job.work_mode === ctx.workMode ? 1 : (job.work_mode === 'remote' ? 0.7 : 0.3)
}

function freshnessScore(postedAt) {
  if (!postedAt) return 0.4
  const days = (Date.now() - new Date(postedAt).getTime()) / 86400000
  if (days <= 3) return 1
  if (days <= 14) return 0.7
  if (days <= 30) return 0.4
  return 0.1
}

function labelFor(percent) {
  if (percent >= 80) return 'Excellent match'
  if (percent >= 60) return 'Strong match'
  if (percent >= 40) return 'Fair match'
  return 'Low match'
}

/** 100% deterministic template strings — no LLM. */
function buildExplanation({ job, matchedSkills, missingSkills, locScore, dampener, percent }) {
  const lines = []
  if (matchedSkills.length) {
    lines.push(
      `You match ${matchedSkills.length} of the required skills: ${matchedSkills.slice(0, 5).join(', ')}${matchedSkills.length > 5 ? '…' : ''}.`,
    )
  } else {
    lines.push("No direct overlap with this job's listed skills yet.")
  }
  if (missingSkills.length) {
    lines.push(`Consider adding: ${missingSkills.slice(0, 3).join(', ')}${missingSkills.length > 3 ? '…' : ''}.`)
  }
  if (locScore === 1 && job.work_mode === 'remote') lines.push('This role is remote-friendly.')
  else if (locScore === 1) lines.push(`Located in ${job.location_city || 'your area'}, matching your preference.`)
  if (dampener < 1) lines.push('This role asks for more experience than you currently have — still worth a look if you\'re ready to stretch.')
  if (percent >= 80) lines.push('This is one of your strongest matches.')
  return lines.join(' ')
}

/**
 * Weights (adapted from a 40/15/15/10/10/5/5 suggestion to what's actually
 * derivable from real data):
 *   skills        0.40 — the strongest, most-derivable signal (real overlap)
 *   experience    0.20 — raised so a fresher-vs-senior-role mismatch can't
 *                        hide behind strong skill overlap; the dampener
 *                        above does the rest of that work
 *   domain        0.15 — role-family alignment, free via ROLE_KEYWORDS_MAP
 *   location      0.15
 *   work-mode pref 0.05 — user_settings.work_mode, real data
 *   freshness     0.05 — tiebreaker
 * "Salary fit" and "education" are intentionally not scored: no candidate
 * salary-expectation field exists anywhere to compare against, and no
 * reliable required-degree field exists on jobs — faking either would be
 * exactly the "never randomly generated" thing this feature must avoid.
 */
export function scoreJobMatch(job, candidateProfile, jobRequirements) {
  const skillOverlap = jaccard(candidateProfile.skills, jobRequirements.requiredSkills)
  const { score: expScore, dampener } = experienceScore(job, candidateProfile, jobRequirements)
  const domScore = domainScore(jobRequirements, candidateProfile)
  const locScore = locationScore(job, candidateProfile)
  const wmScore = workModePrefScore(job, candidateProfile)
  const freshScore = freshnessScore(job.posted_at)

  const raw =
    0.40 * skillOverlap +
    0.20 * expScore +
    0.15 * domScore +
    0.15 * locScore +
    0.05 * wmScore +
    0.05 * freshScore

  const composite = raw * dampener
  const percent = Math.round(Math.min(1, Math.max(0, composite)) * 100)

  const matchedSkills = jobRequirements.requiredSkills.filter((s) => candidateProfile.skills.includes(s))
  const missingSkills = jobRequirements.requiredSkills.filter((s) => !candidateProfile.skills.includes(s))

  return {
    percent,
    label: labelFor(percent),
    breakdown: {
      skills: Math.round(skillOverlap * 100),
      experience: Math.round(expScore * 100),
      domain: Math.round(domScore * 100),
      location: Math.round(locScore * 100),
      workMode: Math.round(wmScore * 100),
      freshness: Math.round(freshScore * 100),
    },
    dampened: dampener < 1,
    matchedSkills,
    missingSkills,
    explanation: buildExplanation({ job, matchedSkills, missingSkills, locScore, dampener, percent }),
  }
}
