'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

// Single insert/delete toggle used by the bookmark button on job cards and
// the job detail page. Looks up the current state itself (by job_url) rather
// than trusting a client-supplied "was it saved" flag, so a stale card
// (e.g. unsaved elsewhere in another tab) can't desync into a duplicate row
// or a no-op delete — the unique(user_id, job_url) constraint is the last
// line of defense, but this keeps the common path from ever hitting it.
export async function toggleSavedJob(_prev, formData) {
  const jobUrl = formData.get('jobUrl')
  const jobTitle = formData.get('jobTitle')
  const companyName = formData.get('companyName') || null
  if (!jobUrl || !jobTitle) return { error: 'Missing job info' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Please sign in to save jobs.', requiresAuth: true }

  const { data: existing } = await supabase
    .from('saved_jobs')
    .select('id')
    .eq('user_id', user.id)
    .eq('job_url', jobUrl)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase.from('saved_jobs').delete().eq('id', existing.id)
    if (error) return { error: error.message, saved: true }
    revalidatePath('/saved-jobs')
    revalidatePath('/dashboard')
    return { success: true, saved: false }
  }

  const { error } = await supabase.from('saved_jobs').insert({
    user_id: user.id, job_url: jobUrl, job_title: jobTitle, company_name: companyName,
  })
  if (error) {
    // 23505 = unique_violation — another request already saved it (e.g. a
    // double-click race); the end state the user wants (saved) is already
    // true, so treat it as success instead of surfacing a confusing error.
    if (error.code === '23505') {
      revalidatePath('/saved-jobs')
      return { success: true, saved: true }
    }
    return { error: error.message, saved: false }
  }

  revalidatePath('/saved-jobs')
  revalidatePath('/dashboard')
  return { success: true, saved: true }
}

export async function removeSavedJob(_prev, formData) {
  const id = formData.get('id')
  if (!id) return { error: 'Missing job ID' }

  const supabase = await createClient()

  const { error } = await supabase
    .from('saved_jobs')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/saved-jobs')
  revalidatePath('/dashboard')
  return { success: true }
}
