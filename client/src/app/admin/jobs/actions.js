'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { getAdminClient } from '@/lib/supabase-admin'

const ALLOWED_NEXT_STATUSES = new Set(['active', 'pending_approval', 'closed', 'rejected'])

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Not signed in' }
  const { data } = await supabase
    .from('user_profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .maybeSingle()
  if (!data || !data.is_active || data.role !== 'admin')
    return { ok: false, error: 'Forbidden' }
  return { ok: true, user }
}

export async function adminUpdateJobStatusAction({ jobId, status }) {
  if (!ALLOWED_NEXT_STATUSES.has(status))
    return { ok: false, error: 'Invalid status' }
  const auth = await requireAdmin()
  if (!auth.ok) return auth

  const admin = getAdminClient()
  const updates = { status }
  if (status === 'active') updates.posted_at = new Date().toISOString()
  const { error } = await admin.from('jobs').update(updates).eq('id', jobId)
  if (error) return { ok: false, error: error.message }

  revalidatePath('/admin/jobs')
  revalidatePath('/admin/dashboard')
  revalidatePath('/jobs')
  return { ok: true }
}

export async function adminToggleFeatureAction({ jobId, isFeatured }) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth
  const admin = getAdminClient()
  const { error } = await admin
    .from('jobs')
    .update({ is_featured: !!isFeatured })
    .eq('id', jobId)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/admin/jobs')
  revalidatePath('/jobs')
  return { ok: true }
}

export async function adminDeleteJobAction({ jobId }) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth
  const admin = getAdminClient()
  // Soft-delete: mark closed instead of removing rows.
  const { error } = await admin
    .from('jobs')
    .update({ status: 'closed' })
    .eq('id', jobId)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/admin/jobs')
  revalidatePath('/jobs')
  return { ok: true }
}
