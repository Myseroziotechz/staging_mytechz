'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

function str(formData, key) {
  const v = formData.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

export async function saveRecruiterPersonalProfile(_prevState, formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Your session has expired — please sign in again.' }
  }

  const full_name   = str(formData, 'full_name')
  const phone       = str(formData, 'phone') || null
  const designation = str(formData, 'designation') || null

  if (!full_name) {
    return { error: 'Full name is required.' }
  }

  // Use admin client (same pattern as saveCompanyProfile) so RLS does not block cross-table updates
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { error: profileError } = await admin
    .from('user_profiles')
    .update({ full_name, phone, updated_at: new Date().toISOString() })
    .eq('id', user.id)

  if (profileError) {
    return { error: `Could not update profile: ${profileError.message}` }
  }

  if (designation !== null) {
    const { error: recError } = await admin
      .from('recruiter_profiles')
      .update({ designation, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)

    if (recError) {
      return { error: `Could not update designation: ${recError.message}` }
    }
  }

  revalidatePath('/recruiter/profile')
  return { ok: true }
}
