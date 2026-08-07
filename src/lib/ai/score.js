import 'server-only'

function lc(s) {
  return (s || '').toString().toLowerCase().trim()
}

export function jaccard(a = [], b = []) {
  if (!a.length || !b.length) return 0
  const A = new Set(a.map(lc))
  const B = new Set(b.map(lc))
  let inter = 0
  for (const x of A) if (B.has(x)) inter++
  const uni = A.size + B.size - inter
  return uni ? inter / uni : 0
}

function locationMatch(jobCity, userLoc) {
  if (!jobCity || !userLoc) return 0
  const j = lc(jobCity)
  const u = lc(userLoc)
  if (!j || !u) return 0
  if (u.includes(j) || j.includes(u)) return 1
  return 0
}

function expFit(jobMin, jobMax, years) {
  if (years == null) return 0.5
  const min = Number(jobMin ?? 0)
  const max = jobMax == null ? min + 10 : Number(jobMax)
  if (years >= min && years <= max) return 1
  const dist = years < min ? min - years : years - max
  return Math.max(0, 1 - dist / 4)
}

function freshness(postedAt) {
  if (!postedAt) return 0.4
  const days = (Date.now() - new Date(postedAt).getTime()) / 86400000
  if (days <= 3) return 1
  if (days <= 14) return 0.7
  if (days <= 30) return 0.4
  return 0.1
}

function featuredSignal(job) {
  return job.is_featured ? 1 : job.is_urgent ? 0.7 : 0
}

function salarySignal(job, _ctx) {
  if (!job.salary_min) return 0.3
  if (job.salary_min >= 1500000) return 1
  if (job.salary_min >= 800000) return 0.8
  if (job.salary_min >= 400000) return 0.6
  return 0.4
}

export function scoreJob(job, ctx) {
  if (!ctx) {
    return 0.3 * freshness(job.posted_at) + 0.2 * featuredSignal(job) + 0.5
  }
  return (
    0.45 * jaccard(job.skills, ctx.skills) +
    0.2 * locationMatch(job.location_city, ctx.location) +
    0.15 * expFit(job.experience_min, job.experience_max, ctx.experienceYears) +
    0.1 * freshness(job.posted_at) +
    0.05 * featuredSignal(job) +
    0.05 * salarySignal(job, ctx)
  )
}

export function reasonFor(job, ctx) {
  if (!ctx?.skills?.length) return null
  const overlap = job.skills?.filter((s) =>
    ctx.skills.some((u) => lc(u) === lc(s))
  )
  if (overlap?.length)
    return `Strong ${overlap.slice(0, 3).join(', ')} overlap`
  if (locationMatch(job.location_city, ctx.location))
    return `In your location (${job.location_city})`
  if (job.work_mode === 'remote') return 'Remote-friendly'
  return null
}
