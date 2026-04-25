'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { getAdminClient } from '@/lib/supabase-admin'

function str(formData, key) {
  const v = formData.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

async function verifyCallerIsAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const admin = getAdminClient()
  const { data: profile } = await admin
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') return { error: 'Not authorized' }

  return { admin }
}

export async function verifyRecruiter(_prev, formData) {
  const userId = str(formData, 'user_id')
  if (!userId) return { error: 'Missing user ID' }

  const result = await verifyCallerIsAdmin()
  if (result.error) return { error: result.error }

  const { error } = await result.admin
    .from('recruiter_profiles')
    .update({ verification_status: 'verified', updated_at: new Date().toISOString() })
    .eq('user_id', userId)

  if (error) return { error: error.message }

  revalidatePath('/admin/recruiters')
  revalidatePath('/admin/dashboard')
  return { success: 'Recruiter verified' }
}

export async function rejectRecruiter(_prev, formData) {
  const userId = str(formData, 'user_id')
  const reason = str(formData, 'reason')
  if (!userId) return { error: 'Missing user ID' }

  const result = await verifyCallerIsAdmin()
  if (result.error) return { error: result.error }

  const { error } = await result.admin
    .from('recruiter_profiles')
    .update({ verification_status: 'rejected', updated_at: new Date().toISOString() })
    .eq('user_id', userId)

  if (error) return { error: error.message }

  revalidatePath('/admin/recruiters')
  revalidatePath('/admin/dashboard')
  return { success: 'Recruiter rejected' }
}
