'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'

const ALLOWED_STATUSES = new Set([
  'applied',
  'reviewing',
  'interview',
  'offered',
  'hired',
  'rejected',
])

async function assertOwnsApplication(supabase, applicationId, userId) {
  const { data, error } = await supabase
    .from('job_applications')
    .select('id, job:jobs ( posted_by )')
    .eq('id', applicationId)
    .maybeSingle()
  if (error || !data) return false
  // Admins also pass — checked separately by the caller.
  return data.job?.posted_by === userId
}

async function isAdmin(supabase, userId) {
  const { data } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle()
  return data?.role === 'admin'
}

export async function updateApplicationStatusAction({ applicationId, status }) {
  if (!ALLOWED_STATUSES.has(status))
    return { ok: false, error: 'Invalid status' }
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not signed in' }

  const allowed =
    (await assertOwnsApplication(supabase, applicationId, user.id)) ||
    (await isAdmin(supabase, user.id))
  if (!allowed) return { ok: false, error: 'Forbidden' }

  const { error } = await supabase
    .from('job_applications')
    .update({ status, last_status_at: new Date().toISOString() })
    .eq('id', applicationId)
  if (error) return { ok: false, error: error.message }

  revalidatePath('/recruiter/applicants')
  revalidatePath('/recruiter/dashboard')
  return { ok: true }
}

export async function updateApplicationNotesAction({ applicationId, notes }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not signed in' }

  const allowed =
    (await assertOwnsApplication(supabase, applicationId, user.id)) ||
    (await isAdmin(supabase, user.id))
  if (!allowed) return { ok: false, error: 'Forbidden' }

  const trimmed = (notes || '').toString().slice(0, 2000)
  const { error } = await supabase
    .from('job_applications')
    .update({ recruiter_notes: trimmed })
    .eq('id', applicationId)
  if (error) return { ok: false, error: error.message }

  revalidatePath('/recruiter/applicants')
  return { ok: true }
}

export async function updateApplicationRatingAction({ applicationId, rating }) {
  const r = Number(rating)
  if (!Number.isInteger(r) || r < 1 || r > 5)
    return { ok: false, error: 'Rating must be 1–5' }
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not signed in' }

  const allowed =
    (await assertOwnsApplication(supabase, applicationId, user.id)) ||
    (await isAdmin(supabase, user.id))
  if (!allowed) return { ok: false, error: 'Forbidden' }

  const { error } = await supabase
    .from('job_applications')
    .update({ rating: r })
    .eq('id', applicationId)
  if (error) return { ok: false, error: error.message }

  revalidatePath('/recruiter/applicants')
  return { ok: true }
}
