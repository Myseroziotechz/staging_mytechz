'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { getAdminClient } from '@/lib/supabase-admin'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function str(formData, key) {
  const v = formData.get(key)
  return typeof v === 'string' ? v.trim() : ''
}

export async function addAdminEmail(_prev, formData) {
  const email = str(formData, 'email').toLowerCase()
  const note = str(formData, 'note')

  if (!email || !EMAIL_RE.test(email)) {
    return { error: 'Enter a valid email address', values: { email, note } }
  }

  // Verify the caller is an admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const admin = getAdminClient()

  const { data: callerProfile } = await admin
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!callerProfile || callerProfile.role !== 'admin') {
    return { error: 'Not authorized' }
  }

  // Upsert into admin_whitelist
  const { error: insertErr } = await admin
    .from('admin_whitelist')
    .upsert(
      { email, note: note || null, added_by: user.id },
      { onConflict: 'email' }
    )

  if (insertErr) return { error: insertErr.message, values: { email, note } }

  // Promote existing user to admin if they already have a profile
  await admin
    .from('user_profiles')
    .update({ role: 'admin', updated_at: new Date().toISOString() })
    .eq('email', email)
    .neq('role', 'admin')

  revalidatePath('/admin/whitelist')
  revalidatePath('/admin/dashboard')
  revalidatePath('/admin/users')
  return { success: `Added ${email}` }
}

export async function removeAdminEmail(_prev, formData) {
  const email = str(formData, 'email').toLowerCase()

  if (!email) return { error: 'Missing email' }

  // Verify the caller is an admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const admin = getAdminClient()

  const { data: callerProfile } = await admin
    .from('user_profiles')
    .select('role, email')
    .eq('id', user.id)
    .single()

  if (!callerProfile || callerProfile.role !== 'admin') {
    return { error: 'Not authorized' }
  }

  // Self-lockout guard: refuse if this is the last whitelist entry and it's the caller's own email
  const { count } = await admin
    .from('admin_whitelist')
    .select('*', { count: 'exact', head: true })

  if (count === 1) {
    const { data: lastEntry } = await admin
      .from('admin_whitelist')
      .select('email')
      .single()

    if (lastEntry && lastEntry.email.toLowerCase() === callerProfile.email.toLowerCase()) {
      return { error: 'Cannot remove the last admin email' }
    }
  }

  // Delete from whitelist
  const { error: deleteErr } = await admin
    .from('admin_whitelist')
    .delete()
    .eq('email', email)

  if (deleteErr) return { error: deleteErr.message }

  revalidatePath('/admin/whitelist')
  revalidatePath('/admin/dashboard')
  return { success: `Removed ${email}` }
}
