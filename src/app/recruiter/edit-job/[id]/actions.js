'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { validateJobInput, toJobRow } from '@/lib/jobs/schema'

export async function updateJobAction(jobId, payload) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, errors: { _form: 'Not signed in' } }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .single()
  if (!profile || !profile.is_active || profile.role !== 'recruiter')
    return { ok: false, errors: { _form: 'Forbidden' } }

  // Verify ownership and fetch current state.
  const { data: existing } = await supabase
    .from('jobs')
    .select('id, category, slug, status, posted_by')
    .eq('id', jobId)
    .maybeSingle()

  if (!existing) return { ok: false, errors: { _form: 'Job not found' } }
  if (existing.posted_by !== user.id)
    return { ok: false, errors: { _form: 'You can only edit your own jobs' } }
  if (existing.status === 'closed')
    return { ok: false, errors: { _form: 'Closed jobs cannot be edited' } }

  const v = validateJobInput(payload, { actorRole: 'recruiter' })
  if (!v.ok) return { ok: false, errors: v.errors }

  // Preserve existing slug so public URLs never break.
  // Preserve existing status — an edit does not re-trigger approval.
  const row = toJobRow({
    ...v.data,
    slug: existing.slug,
    status: existing.status,
  })

  // Never let an edit overwrite ownership/timestamps.
  delete row.posted_by
  delete row.posted_at

  const { error } = await supabase.from('jobs').update(row).eq('id', jobId)
  if (error) {
    console.warn('[updateJobAction] update failed:', error.message)
    const msg = error.message?.includes('duplicate key') || error.message?.includes('unique')
      ? 'A job with this title already exists. Add the company name, location, or year to make the title unique.'
      : error.message
    return { ok: false, errors: { _form: msg } }
  }

  revalidatePath('/recruiter/dashboard')
  revalidatePath('/jobs')
  revalidatePath(`/jobs/${existing.category}`)
  revalidatePath(`/jobs/${existing.category}/${existing.slug}`)

  return {
    ok: true,
    job: {
      id: jobId,
      category: existing.category,
      slug: existing.slug,
      status: existing.status,
    },
    pending: existing.status !== 'active',
  }
}
