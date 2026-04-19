'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const ALLOWED_COMPANY_SIZES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1000+',
]
const ALLOWED_WORK_MODES = ['office', 'hybrid', 'remote']

function str(formData, key) {
  const v = formData.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

function isValidUrl(value) {
  if (!value) return true
  try {
    const u = new URL(value)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

// Signature matches useActionState: (prevState, formData) => newState.
// On success this redirects; on failure it returns { error, fieldErrors }
// which the form renders next to each input.
export async function saveCompanyProfile(_prevState, formData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Your session has expired — please sign in again.' }
  }

  // Extract + normalize.
  const company_name = str(formData, 'company_name')
  const company_website = str(formData, 'company_website') || null
  const industry = str(formData, 'industry')
  const company_size = str(formData, 'company_size')
  const head_office_location = str(formData, 'head_office_location')
  const work_mode = str(formData, 'work_mode')
  const company_description = str(formData, 'company_description')
  const gst_or_cin = str(formData, 'gst_or_cin') || null

  // Validate.
  const fieldErrors = {}
  if (!company_name) fieldErrors.company_name = 'Required'
  if (!industry) fieldErrors.industry = 'Required'
  if (!ALLOWED_COMPANY_SIZES.includes(company_size))
    fieldErrors.company_size = 'Pick a company size'
  if (!head_office_location) fieldErrors.head_office_location = 'Required'
  if (!ALLOWED_WORK_MODES.includes(work_mode))
    fieldErrors.work_mode = 'Pick a work mode'
  if (!company_description || company_description.length < 50)
    fieldErrors.company_description = 'At least 50 characters'
  if (!isValidUrl(company_website))
    fieldErrors.company_website = 'Must be a valid http(s) URL'

  if (Object.keys(fieldErrors).length > 0) {
    return {
      error: 'Please correct the highlighted fields.',
      fieldErrors,
      // Echo submitted values so the form can repaint without losing input.
      values: {
        company_name,
        company_website: company_website ?? '',
        industry,
        company_size,
        head_office_location,
        work_mode,
        company_description,
        gst_or_cin: gst_or_cin ?? '',
      },
    }
  }

  // Use admin client to bypass RLS — the anon-key client's session may not
  // have the recruiter role visible to PostgREST yet.
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Upsert company row.
  const { error: upsertError } = await admin
    .from('recruiter_profiles')
    .upsert(
      {
        user_id: user.id,
        company_name,
        company_website,
        industry,
        company_size,
        head_office_location,
        work_mode,
        company_description,
        gst_or_cin,
      },
      { onConflict: 'user_id' }
    )

  if (upsertError) {
    return { error: `Could not save company profile: ${upsertError.message}` }
  }

  // Flip onboarding_completed.
  const { error: flagError } = await admin
    .from('user_profiles')
    .update({ onboarding_completed: true })
    .eq('id', user.id)

  if (flagError) {
    return {
      error: `Saved company, but could not complete onboarding: ${flagError.message}`,
    }
  }

  // Bust any cached recruiter pages so dashboard shows fresh data.
  revalidatePath('/recruiter', 'layout')
  redirect('/recruiter/dashboard')
}
