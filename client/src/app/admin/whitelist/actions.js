'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function str(formData, key) {
  const v = formData.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

// Signature matches useActionState: (prevState, formData) => newState.
export async function addAdminEmail(_prev, formData) {
  const email = str(formData, 'email').toLowerCase()
  const note = str(formData, 'note')

  if (!email || !EMAIL_RE.test(email)) {
    return { error: 'Enter a valid email address', values: { email, note } }
  }

  const supabase = await createClient()

  // RPC enforces is_admin() inside — belt & braces with the admin layout guard.
  const { error } = await supabase.rpc('admin_add_whitelist', {
    p_email: email,
    p_note: note || null,
  })

  if (error) {
    return { error: error.message, values: { email, note } }
  }

  revalidatePath('/admin/whitelist')
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/users')
  return { success: `Added ${email}` }
}

export async function removeAdminEmail(_prev, formData) {
  const email = str(formData, 'email').toLowerCase()

  if (!email) {
    return { error: 'Missing email' }
  }

  const supabase = await createClient()

  const { error } = await supabase.rpc('admin_remove_whitelist', {
    p_email: email,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/whitelist')
  revalidatePath('/admin/dashboard')
  return { success: `Removed ${email}` }
}
