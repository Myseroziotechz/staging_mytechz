export function formatSalary(job) {
  if (!job) return null
  if (job.is_salary_disclosed === false) return 'Not disclosed'
  const { salary_min, salary_max, salary_currency = 'INR', salary_period = 'year' } = job
  if (!salary_min && !salary_max) return null
  const sym = salary_currency === 'INR' ? '₹' : salary_currency + ' '
  const fmt = (n) => {
    if (n == null) return ''
    if (salary_currency === 'INR') {
      if (n >= 1e7)  return `${(n / 1e7).toFixed(n % 1e7 === 0 ? 0 : 1)} Cr`
      if (n >= 1e5)  return `${(n / 1e5).toFixed(n % 1e5 === 0 ? 0 : 1)} L`
      return `${(n / 1000).toFixed(0)}K`
    }
    return n.toLocaleString()
  }
  const period = salary_period === 'year' ? 'yr' : salary_period === 'month' ? 'mo' : 'hr'
  if (salary_min && salary_max) return `${sym}${fmt(salary_min)} – ${sym}${fmt(salary_max)} / ${period}`
  return `${sym}${fmt(salary_min ?? salary_max)} / ${period}`
}

export function formatLocation(job) {
  if (!job) return ''
  if (job.work_mode === 'remote') return 'Remote'
  if (job.is_multi_location && job.locations?.length) return job.locations.slice(0, 2).join(' · ') + (job.locations.length > 2 ? ` +${job.locations.length - 2}` : '')
  return [job.location_city, job.location_state].filter(Boolean).join(', ') || job.location_country || ''
}

export function formatExperience(job) {
  if (!job) return ''
  const min = Number(job.experience_min ?? 0)
  const max = job.experience_max != null ? Number(job.experience_max) : null
  if (min === 0 && max == null) return 'Any experience'
  if (min === 0 && max != null) return `0 – ${max} yrs`
  if (max == null) return `${min}+ yrs`
  return `${min} – ${max} yrs`
}

export function formatPostedAgo(iso) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60000)
  if (mins < 1)    return 'Just now'
  if (mins < 60)   return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24)  return `${hours}h ago`
  const days  = Math.floor(hours / 24)
  if (days < 30)   return `${days}d ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(months / 12)}y ago`
}

export function formatDeadline(iso) {
  if (!iso) return null
  const days = Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000)
  if (days < 0)   return { text: 'Expired',          urgent: true,  expired: true }
  if (days === 0) return { text: 'Closes today',     urgent: true }
  if (days <= 3)  return { text: `${days}d left`,    urgent: true }
  if (days <= 14) return { text: `${days}d left`,    urgent: false }
  return { text: `Closes ${new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`, urgent: false }
}

export function jobTypeLabel(t) {
  return ({
    full_time: 'Full-time', part_time: 'Part-time', internship: 'Internship',
    contract: 'Contract', temporary: 'Temporary',
  })[t] || t
}

export function workModeLabel(m) {
  return ({ remote: 'Remote', hybrid: 'Hybrid', onsite: 'On-site' })[m] || m
}

export function jobUrl(job) {
  return `/jobs/${job.category}/${job.slug}`
}

export function applyHref(job) {
  if (!job) return null
  if (job.apply_mode === 'external' && job.apply_url) return job.apply_url
  if (job.apply_mode === 'email'    && job.apply_email)
    return `mailto:${job.apply_email}?subject=${encodeURIComponent(`Application: ${job.title}`)}`
  if (job.apply_mode === 'phone'    && job.apply_phone) return `tel:${job.apply_phone}`
  return null
}

export function companyInitials(name = '') {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(s => s[0]?.toUpperCase()).join('') || '–'
}

// Stipend formatter for internships — same numbers as salary, but always per-month + "Stipend".
export function formatStipend(job) {
  if (!job) return null
  if (job.is_salary_disclosed === false) return 'Unpaid / not disclosed'
  const min = job.salary_min, max = job.salary_max
  if (!min && !max) return null
  // If salary_period is 'year', convert to monthly for display.
  const toMonthly = (n) => job.salary_period === 'year' ? Math.round(n / 12) : n
  const fmt = (n) => {
    if (n == null) return ''
    const m = toMonthly(n)
    if (m >= 100000) return `${(m / 100000).toFixed(1)}L`
    if (m >= 1000)   return `${(m / 1000).toFixed(0)}K`
    return `${m}`
  }
  const sym = (job.salary_currency === 'INR' ? '₹' : (job.salary_currency || '') + ' ')
  if (min && max) return `${sym}${fmt(min)} – ${sym}${fmt(max)} / mo`
  return `${sym}${fmt(min ?? max)} / mo`
}

// Government meta accessor for cards.
export function govMeta(job) {
  return job?.government_meta || {}
}
