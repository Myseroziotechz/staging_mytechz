'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'

function str(formData, key) {
  const v = formData.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

export async function verifyRecruiter(_prev, formData) {
  const userId = str(formData, 'user_id')
  if (!userId) return { error: 'Missing user ID' }

  const supabase = await createClient()

  const { error } = await supabase.rpc('admin_verify_recruiter', {
    p_user_id: userId,
    p_status: 'verified',
    p_note: null,
  })

  if (error) return { error: error.message }

  revalidatePath('/admin/recruiters')
  revalidatePath('/admin/dashboard')
  return { success: 'Recruiter verified' }
}

export async function rejectRecruiter(_prev, formData) {
  const userId = str(formData, 'user_id')
  const reason = str(formData, 'reason')
  if (!userId) return { error: 'Missing user ID' }

  const supabase = await createClient()

  const { error } = await supabase.rpc('admin_verify_recruiter', {
    p_user_id: userId,
    p_status: 'rejected',
    p_note: reason || null,
  })

  if (error) return { error: error.message }

  revalidatePath('/admin/recruiters')
  revalidatePath('/admin/dashboard')
  return { success: 'Recruiter rejected' }
}
