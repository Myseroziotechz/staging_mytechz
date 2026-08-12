// `user_settings.employment_type` uses hyphenated values ('full-time') while
// `jobs.job_type` uses underscored values ('full_time') — the two tables
// were built at different times with different enum conventions. Bridge them
// here rather than changing either live schema.
const EMPLOYMENT_TYPE_TO_JOB_TYPE = {
  'full-time': 'full_time',
  'part-time': 'part_time',
  internship: 'internship',
  contract: 'contract',
}

function includesCaseInsensitive(haystack, needle) {
  return String(haystack || '').toLowerCase().includes(String(needle).toLowerCase())
}

/**
 * Whether a candidate should be notified about a newly-published job, given
 * their profile role and `user_settings` row (which may be defaults if
 * they've never visited Settings — that's fine, `notify_job_alerts` defaults
 * to `true` and is the explicit, always-off-able opt-in for the whole
 * category; role/location/mode/type are optional refinements on top of it).
 */
export function isEligibleForJob({ job, profile, settings }) {
  if (!profile || profile.role !== 'candidate') return false
  if (!settings?.notify_job_alerts) return false

  if (settings.work_mode && job.work_mode && settings.work_mode !== job.work_mode) {
    return false
  }

  if (settings.employment_type) {
    const wantedJobType = EMPLOYMENT_TYPE_TO_JOB_TYPE[settings.employment_type]
    if (wantedJobType && job.job_type && wantedJobType !== job.job_type) return false
  }

  const locations = settings.preferred_locations || []
  if (locations.length > 0) {
    const matchesLocation = locations.some((loc) => {
      if (loc.toLowerCase() === 'remote') return job.work_mode === 'remote'
      return (
        includesCaseInsensitive(job.location_city, loc) ||
        includesCaseInsensitive(job.location_state, loc)
      )
    })
    if (!matchesLocation) return false
  }

  const roles = settings.preferred_roles || []
  if (roles.length > 0) {
    const matchesRole = roles.some((role) => includesCaseInsensitive(job.title, role))
    if (!matchesRole) return false
  }

  return true
}
