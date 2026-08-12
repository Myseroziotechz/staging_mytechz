import { ok, fail, requireUser, readJson, fromDbError } from '@/app/api/profile/_lib/handlers'

/**
 * Profile visibility + job preferences + notification preferences, all on
 * the single `user_settings` row (one table, one concern: "this user's
 * configurable preferences", separate from `user_profiles`' public identity
 * data). One row per user, upserted on first save — RLS scopes both the
 * insert and update to the caller's own `user_id`, so this is safe as a
 * direct client-facing route the way `user_profiles` (which gates a
 * security-relevant `role` column) is not.
 *
 *   GET   /api/settings/preferences  -> current row, or defaults if none saved yet
 *   PATCH /api/settings/preferences  -> partial update of any of the fields below
 */

const EDITABLE = [
  'profile_public', 'show_email', 'show_phone', 'searchable',
  'preferred_roles', 'preferred_locations', 'work_mode', 'employment_type',
  'notify_job_alerts', 'notify_application_updates', 'notify_saved_job_reminders',
  'notify_profile_reminders', 'notify_product_updates',
  'email_notifications_enabled', 'in_app_notifications_enabled', 'notify_frequency',
]

const WORK_MODES = ['remote', 'hybrid', 'onsite']
const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'internship', 'contract']
const FREQUENCIES = ['instant', 'daily', 'weekly']

const DEFAULTS = {
  profile_public: true, show_email: false, show_phone: false, searchable: true,
  preferred_roles: [], preferred_locations: [], work_mode: null, employment_type: null,
  notify_job_alerts: true, notify_application_updates: true, notify_saved_job_reminders: true,
  notify_profile_reminders: true, notify_product_updates: false,
  email_notifications_enabled: true, in_app_notifications_enabled: true,
  notify_frequency: 'instant',
}

export async function GET() {
  const { supabase, user, response } = await requireUser()
  if (response) return response

  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select(EDITABLE.join(', '))
      .eq('user_id', user.id)
      .maybeSingle()

    if (error) throw error
    return ok({ settings: data || DEFAULTS })
  } catch (error) {
    return fromDbError(error)
  }
}

function validate(values) {
  const errors = {}
  if ('work_mode' in values && values.work_mode !== null && !WORK_MODES.includes(values.work_mode)) {
    errors.work_mode = `Must be one of: ${WORK_MODES.join(', ')}`
  }
  if ('employment_type' in values && values.employment_type !== null && !EMPLOYMENT_TYPES.includes(values.employment_type)) {
    errors.employment_type = `Must be one of: ${EMPLOYMENT_TYPES.join(', ')}`
  }
  if ('notify_frequency' in values && !FREQUENCIES.includes(values.notify_frequency)) {
    errors.notify_frequency = `Must be one of: ${FREQUENCIES.join(', ')}`
  }
  for (const key of ['preferred_roles', 'preferred_locations']) {
    if (key in values && !Array.isArray(values[key])) {
      errors[key] = 'Must be a list of strings'
    }
  }
  return errors
}

export async function PATCH(request) {
  const { supabase, user, response } = await requireUser()
  if (response) return response

  const { body, response: badBody } = await readJson(request)
  if (badBody) return badBody

  const values = {}
  for (const key of EDITABLE) {
    if (key in body) values[key] = body[key]
  }
  if (Object.keys(values).length === 0) {
    return fail('No editable fields provided.', 400)
  }

  const errors = validate(values)
  if (Object.keys(errors).length) {
    return fail('Please fix the highlighted fields.', 422, { fieldErrors: errors })
  }

  // Arrays of free-text tags — trim, drop empties, cap length so a paste
  // accident can't create an unbounded row.
  for (const key of ['preferred_roles', 'preferred_locations']) {
    if (key in values) {
      values[key] = values[key].map((v) => String(v).trim()).filter(Boolean).slice(0, 20)
    }
  }

  try {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({ user_id: user.id, ...values }, { onConflict: 'user_id' })
      .select(EDITABLE.join(', '))
      .maybeSingle()

    if (error) throw error
    return ok({ settings: data })
  } catch (error) {
    return fromDbError(error)
  }
}
