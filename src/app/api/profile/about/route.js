import { validateAbout } from '@/app/(app)/profile/lib/validation'
import { ok, fail, requireUser, readJson, fromDbError } from '../_lib/handlers'

/**
 * The About / personal-details block on `user_profiles`.
 *
 *   GET    /api/profile/about
 *   PUT    /api/profile/about     -> update the editable fields
 *   DELETE /api/profile/about     -> clear the optional fields (name is kept)
 *
 * POST is intentionally absent: the profile row is created by application
 * code at signup (see src/lib/auth), so there is never a second one to create.
 *
 * The live `user_profiles` table stores the summary text in a pre-existing
 * `profile_summary` column, not `about`. The API and every JS caller still use
 * `about` — COLUMN_ALIAS is the one place that maps between the two, via
 * PostgREST's `alias:column` select syntax, so nothing above this file needs
 * to know the DB column is named differently.
 */

const EDITABLE = [
  'full_name', 'phone', 'location', 'headline', 'about',
  'linkedin_url', 'github_url', 'portfolio_url', 'total_experience_years',
]

const COLUMN_ALIAS = { about: 'profile_summary' }
const dbColumn = (key) => COLUMN_ALIAS[key] ?? key

const SELECT =
  'id, full_name, phone, location, headline, about:profile_summary, ' +
  'linkedin_url, github_url, portfolio_url, total_experience_years, avatar_url, email, role, created_at, updated_at'

export async function GET() {
  const { supabase, user, response } = await requireUser()
  if (response) return response

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(SELECT)
      .eq('id', user.id)
      .maybeSingle()

    if (error) throw error
    if (!data) return fail('Profile not found.', 404)
    return ok({ profile: data })
  } catch (error) {
    return fromDbError(error)
  }
}

export async function PUT(request) {
  const { supabase, user, response } = await requireUser()
  if (response) return response

  const { body, response: badBody } = await readJson(request)
  if (badBody) return badBody

  const values = {}
  for (const key of EDITABLE) {
    if (key in body) values[key] = typeof body[key] === 'string' ? body[key].trim() : body[key]
  }

  if (Object.keys(values).length === 0) {
    return fail('No editable fields provided.', 400)
  }

  const errors = validateAbout({ full_name: '', ...values })
  // Only surface errors for fields the caller actually sent.
  const relevant = Object.fromEntries(
    Object.entries(errors).filter(([field]) => field in values),
  )
  if (Object.keys(relevant).length) {
    return fail('Please fix the highlighted fields.', 422, { fieldErrors: relevant })
  }

  // Empty optional strings are stored as NULL so they read back as "not set".
  const payload = { updated_at: new Date().toISOString() }
  for (const [key, value] of Object.entries(values)) {
    if (key === 'full_name') {
      payload[dbColumn(key)] = value
    } else if (key === 'total_experience_years') {
      // Numeric column — `0 || null` would wrongly null out "0 years", so
      // this is handled separately from the generic string-optional path.
      payload[dbColumn(key)] = value === '' || value == null ? null : Number(value)
    } else {
      payload[dbColumn(key)] = value || null
    }
  }

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(payload)
      .eq('id', user.id)
      .select(SELECT)
      .maybeSingle()

    if (error) throw error
    if (!data) return fail('Profile not found.', 404)
    return ok({ profile: data })
  } catch (error) {
    return fromDbError(error)
  }
}

export async function DELETE() {
  const { supabase, user, response } = await requireUser()
  if (response) return response

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        phone: null,
        location: null,
        headline: null,
        [dbColumn('about')]: null,
        linkedin_url: null,
        github_url: null,
        portfolio_url: null,
        total_experience_years: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select(SELECT)
      .maybeSingle()

    if (error) throw error
    return ok({ profile: data })
  } catch (error) {
    return fromDbError(error)
  }
}
