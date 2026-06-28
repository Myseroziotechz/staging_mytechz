// ─────────────────────────────────────────────────────────────────────────────
// Jobs static config — categories, filter options, sort orders
// ─────────────────────────────────────────────────────────────────────────────

export const JOB_CATEGORIES = [
  { slug: 'private',    label: 'Private Jobs',     href: '/jobs/private' },
  { slug: 'government', label: 'Government Jobs',  href: '/jobs/government' },
  { slug: 'internship', label: 'Internships',      href: '/jobs/internship' },
  { slug: 'ai',         label: 'AI-Matched',       href: '/jobs/ai' },
]

export const JOB_SORT_OPTIONS = [
  { value: 'newest',   label: 'Newest First' },
  { value: 'oldest',   label: 'Oldest First' },
  { value: 'salary',   label: 'Highest Salary' },
]

export const JOB_EXPERIENCE_LEVELS = [
  { value: 'fresher',  label: 'Fresher (0–1 yr)' },
  { value: 'junior',   label: 'Junior (1–3 yrs)' },
  { value: 'mid',      label: 'Mid-level (3–6 yrs)' },
  { value: 'senior',   label: 'Senior (6+ yrs)' },
]

export const JOB_WORK_MODES = [
  { value: 'remote',   label: 'Remote' },
  { value: 'hybrid',   label: 'Hybrid' },
  { value: 'onsite',   label: 'On-site' },
]
