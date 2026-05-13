// Validation + normalization for the unified JobForm.
// One file, no external deps. Discriminated by `category` + `job_type`.
//
// Rules of thumb:
//   - private:    salary_min/max + experience_min/max required
//   - government: government_meta block (notification_url, exam_date, age_max,
//                 vacancies, application_fee, department) required
//   - internship: stipend (per month) + duration_months required
//   - ai:         admin-only "curation_reason" + a target category to mirror
//
// Returns { ok: true, data } on success or { ok: false, errors } on failure.

const CATEGORIES = new Set(['private', 'government', 'internship', 'ai'])
const JOB_TYPES = new Set([
  'full_time',
  'part_time',
  'internship',
  'contract',
  'temporary',
])
const WORK_MODES = new Set(['remote', 'hybrid', 'onsite'])
const APPLY_MODES = new Set(['internal', 'external', 'email', 'phone'])

function pushErr(errors, key, msg) {
  if (!errors[key]) errors[key] = msg
}

function isEmpty(v) {
  return v == null || v === '' || (Array.isArray(v) && v.length === 0)
}

function num(v) {
  if (v === '' || v == null) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function slugify(s) {
  return (s || '')
    .toString()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

export function validateJobInput(raw, { actorRole = 'recruiter' } = {}) {
  const errors = {}
  const out = {}

  // ── Type discriminator ──
  const category = (raw.category || '').toString().trim()
  if (!CATEGORIES.has(category)) {
    pushErr(errors, 'category', 'Pick a card type')
  }
  out.category = category

  // Recruiters cannot post government or AI cards (admin-only).
  if (
    actorRole === 'recruiter' &&
    (category === 'government' || category === 'ai')
  ) {
    pushErr(errors, 'category', 'This card type is admin-only')
  }

  // ── Always required ──
  out.title = (raw.title || '').toString().trim()
  if (!out.title) pushErr(errors, 'title', 'Title is required')
  if (out.title.length > 140)
    pushErr(errors, 'title', 'Keep title under 140 characters')

  out.summary = (raw.summary || '').toString().trim().slice(0, 280) || null
  out.description = (raw.description || '').toString().trim()
  if (!out.description)
    pushErr(errors, 'description', 'Description is required')

  // job_type: internship category forces job_type=internship.
  let jobType = (raw.job_type || '').toString().trim()
  if (category === 'internship') jobType = 'internship'
  if (!JOB_TYPES.has(jobType)) pushErr(errors, 'job_type', 'Pick a job type')
  out.job_type = jobType

  const workMode = (raw.work_mode || '').toString().trim()
  if (!WORK_MODES.has(workMode))
    pushErr(errors, 'work_mode', 'Pick a work mode')
  out.work_mode = workMode

  // Multi-location support.
  out.is_multi_location = !!raw.is_multi_location
  out.locations = Array.isArray(raw.locations)
    ? raw.locations
        .map((l) => (l || '').toString().trim())
        .filter(Boolean)
    : []

  // Location: required unless remote.
  if (out.is_multi_location) {
    if (out.locations.length === 0)
      pushErr(errors, 'locations', 'Add at least one location')
    // Backfill location_city from first entry for backward compat.
    out.location_city = out.locations[0] || null
  } else {
    out.location_city = (raw.location_city || '').toString().trim() || null
    out.locations = []
  }
  out.location_state = (raw.location_state || '').toString().trim() || null
  out.location_country =
    (raw.location_country || '').toString().trim() || 'India'
  if (
    workMode !== 'remote' &&
    !out.is_multi_location &&
    !out.location_city
  )
    pushErr(errors, 'location_city', 'City is required (unless remote)')

  // Skills: array of strings, max 15, dedupe + lowercase-trim.
  out.skills = Array.isArray(raw.skills)
    ? Array.from(
        new Set(
          raw.skills
            .map((s) => (s || '').toString().trim())
            .filter(Boolean)
        )
      ).slice(0, 15)
    : []

  // Experience (years).
  out.experience_min = num(raw.experience_min) ?? 0
  out.experience_max = num(raw.experience_max)
  if (out.experience_min < 0)
    pushErr(errors, 'experience_min', 'Cannot be negative')
  if (out.experience_max != null && out.experience_max < out.experience_min)
    pushErr(errors, 'experience_max', 'Max must be ≥ min')

  // Openings.
  out.openings = num(raw.openings) ?? 1
  if (out.openings < 1) pushErr(errors, 'openings', 'At least 1')

  // Application deadline (ISO date string).
  out.application_deadline = raw.application_deadline || null
  if (out.application_deadline && isNaN(Date.parse(out.application_deadline)))
    pushErr(errors, 'application_deadline', 'Invalid date')

  // ── Apply config ──
  const applyMode = (raw.apply_mode || 'internal').toString().trim()
  if (!APPLY_MODES.has(applyMode))
    pushErr(errors, 'apply_mode', 'Pick an apply mode')
  out.apply_mode = applyMode

  out.apply_url = (raw.apply_url || '').toString().trim() || null
  out.apply_email = (raw.apply_email || '').toString().trim() || null
  out.apply_phone = (raw.apply_phone || '').toString().trim() || null

  if (applyMode === 'external' && !out.apply_url)
    pushErr(errors, 'apply_url', 'URL required for external apply')
  if (out.apply_url && !/^https?:\/\//i.test(out.apply_url))
    pushErr(errors, 'apply_url', 'Must start with http:// or https://')
  if (applyMode === 'email' && !out.apply_email)
    pushErr(errors, 'apply_email', 'Email required')
  if (out.apply_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(out.apply_email))
    pushErr(errors, 'apply_email', 'Invalid email')
  if (applyMode === 'phone' && !out.apply_phone)
    pushErr(errors, 'apply_phone', 'Phone required')

  // ── Type-specific blocks ──
  if (category === 'private') {
    out.salary_min = num(raw.salary_min)
    out.salary_max = num(raw.salary_max)
    out.salary_currency = (raw.salary_currency || 'INR').toString()
    out.salary_period = (raw.salary_period || 'year').toString()
    out.is_salary_disclosed = !!raw.is_salary_disclosed
    if (
      out.is_salary_disclosed &&
      (out.salary_min == null || out.salary_max == null)
    ) {
      pushErr(errors, 'salary_min', 'Provide a min/max if disclosing salary')
    }
    if (
      out.salary_min != null &&
      out.salary_max != null &&
      out.salary_max < out.salary_min
    ) {
      pushErr(errors, 'salary_max', 'Max must be ≥ min')
    }
    out.government_meta = null
  } else if (category === 'government') {
    const g = raw.government_meta || {}
    out.government_meta = {
      notification_url: (g.notification_url || '').toString().trim() || null,
      exam_date: g.exam_date || null,
      age_max: num(g.age_max),
      vacancies: num(g.vacancies),
      application_fee: num(g.application_fee),
      department: (g.department || '').toString().trim() || null,
    }
    if (!out.government_meta.notification_url)
      pushErr(errors, 'notification_url', 'Notification URL required')
    if (
      out.government_meta.notification_url &&
      !/^https?:\/\//i.test(out.government_meta.notification_url)
    )
      pushErr(errors, 'notification_url', 'Must be a full URL')
    if (!out.government_meta.department)
      pushErr(errors, 'department', 'Department required')
    out.salary_min = num(raw.salary_min)
    out.salary_max = num(raw.salary_max)
    out.salary_currency = 'INR'
    out.salary_period = 'year'
    out.is_salary_disclosed =
      out.salary_min != null || out.salary_max != null
  } else if (category === 'internship') {
    // Stipend per month, stored in salary_min / salary_max with period='month'.
    out.salary_min = num(raw.stipend_min)
    out.salary_max = num(raw.stipend_max)
    out.salary_currency = (raw.salary_currency || 'INR').toString()
    out.salary_period = 'month'
    out.is_salary_disclosed = !!raw.is_salary_disclosed
    out.duration_months = num(raw.duration_months)
    out.ppo_chance = num(raw.ppo_chance)
    if (out.is_salary_disclosed && out.salary_min == null)
      pushErr(errors, 'stipend_min', 'Stipend required (or mark unpaid)')
    if (out.duration_months == null || out.duration_months < 1)
      pushErr(errors, 'duration_months', 'Duration required (months)')
    out.government_meta = null
  } else if (category === 'ai') {
    // AI-curated cards — admin only. Mirror an existing job by id, with a
    // curation reason. The form posts a *new* row with `curation_reason` in
    // the `meta` jsonb so we don't need a schema migration for v1.
    out.curation_reason = (raw.curation_reason || '').toString().trim()
    if (!out.curation_reason)
      pushErr(errors, 'curation_reason', 'Curation reason required')
    out.salary_min = num(raw.salary_min)
    out.salary_max = num(raw.salary_max)
    out.salary_currency = (raw.salary_currency || 'INR').toString()
    out.salary_period = (raw.salary_period || 'year').toString()
    out.is_salary_disclosed = !!raw.is_salary_disclosed
    out.government_meta = null
  }

  // ── Slug + status ──
  out.slug = slugify(out.title) || `job-${Date.now()}`
  // Recruiters always submit pending; admin can choose.
  out.status =
    actorRole === 'admin'
      ? raw.status === 'pending_approval'
        ? 'pending_approval'
        : 'active'
      : 'pending_approval'

  out.is_featured = !!raw.is_featured && actorRole === 'admin'
  out.is_urgent = !!raw.is_urgent

  out.department = (raw.department || '').toString().trim() || null
  out.industry = (raw.industry || '').toString().trim() || null

  if (Object.keys(errors).length) return { ok: false, errors }
  return { ok: true, data: out }
}

// Columns that actually exist on `public.jobs`. Anything else in the form
// payload is folded into description/summary or dropped, so an insert never
// hits "column not found" errors.
const JOB_COLUMNS = new Set([
  'short_id', 'slug', 'title', 'summary', 'description',
  'category', 'job_type', 'work_mode',
  'location_city', 'location_state', 'location_country',
  'locations', 'is_multi_location', 'geo_lat', 'geo_lng',
  'salary_min', 'salary_max', 'salary_currency', 'salary_period',
  'is_salary_disclosed',
  'experience_min', 'experience_max',
  'openings', 'openings_filled',
  'posted_at', 'job_start_date', 'application_deadline',
  'skills', 'qualifications', 'department', 'industry', 'benefits',
  'apply_mode', 'apply_url', 'apply_email', 'apply_phone',
  'government_meta',
  'status', 'is_featured', 'is_urgent',
  'meta_title', 'meta_description', 'og_image_url', 'faq',
  'company_id', 'posted_by',
])

// Take a normalized form payload (output of validateJobInput) and return a
// row that's safe to insert into public.jobs. Form-only fields (like
// duration_months, ppo_chance, curation_reason, company_name) are folded
// into description/summary so the recruiter doesn't lose what they typed.
export function toJobRow(normalized) {
  const row = {}
  const extras = []

  if (normalized.category === 'internship') {
    if (normalized.duration_months)
      extras.push(`**Duration:** ${normalized.duration_months} months`)
    if (normalized.ppo_chance != null && normalized.ppo_chance !== '')
      extras.push(`**PPO chance:** ${normalized.ppo_chance}%`)
  }
  if (normalized.category === 'ai' && normalized.curation_reason) {
    // Surfaced on the card via summary if empty.
    if (!normalized.summary) normalized.summary = normalized.curation_reason
    else extras.push(`**AI pick:** ${normalized.curation_reason}`)
  }
  if (extras.length) {
    const block = '\n\n---\n' + extras.join('  \n')
    normalized.description = (normalized.description || '') + block
  }

  for (const [k, v] of Object.entries(normalized)) {
    if (JOB_COLUMNS.has(k)) row[k] = v
  }
  return row
}

export const FORM_DEFAULTS = {
  category: 'private',
  title: '',
  summary: '',
  description: '',
  job_type: 'full_time',
  work_mode: 'onsite',
  location_city: '',
  location_state: '',
  location_country: 'India',
  is_multi_location: false,
  locations: [],
  skills: [],
  experience_min: 0,
  experience_max: '',
  openings: 1,
  application_deadline: '',
  apply_mode: 'internal',
  apply_url: '',
  apply_email: '',
  apply_phone: '',
  salary_min: '',
  salary_max: '',
  salary_currency: 'INR',
  salary_period: 'year',
  is_salary_disclosed: true,
  stipend_min: '',
  stipend_max: '',
  duration_months: '',
  ppo_chance: '',
  government_meta: {
    notification_url: '',
    exam_date: '',
    age_max: '',
    vacancies: '',
    application_fee: '',
    department: '',
  },
  curation_reason: '',
  department: '',
  industry: '',
  is_featured: false,
  is_urgent: false,
  status: 'active',
}
