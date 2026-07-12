'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

function str(formData, key) {
  const v = formData.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

export async function saveProfile(_prevState, formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Your session has expired — please sign in again.' }
  }

  const full_name    = str(formData, 'full_name')
  const phone        = str(formData, 'phone') || null
  const location     = str(formData, 'location') || null
  const headline     = str(formData, 'headline') || null
  const linkedin_url = str(formData, 'linkedin_url') || null
  const skillsRaw    = str(formData, 'skills')
  const skills       = skillsRaw
    ? skillsRaw.split(',').map((s) => s.trim()).filter(Boolean)
    : []

  // Validate
  if (!full_name) {
    return { error: 'Full name is required.' }
  }
  if (linkedin_url && !linkedin_url.startsWith('https://linkedin.com') && !linkedin_url.startsWith('https://www.linkedin.com')) {
    return { error: 'LinkedIn URL must start with https://linkedin.com' }
  }
  if (headline && headline.length > 120) {
    return { error: 'Headline must be 120 characters or fewer.' }
  }

  const { error: dbError } = await supabase
    .from('user_profiles')
    .update({
      full_name,
      phone,
      location,
      headline,
      linkedin_url,
      skills,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (dbError) {
    return { error: `Could not save profile: ${dbError.message}` }
  }

  revalidatePath('/profile')
  return { ok: true }
}
