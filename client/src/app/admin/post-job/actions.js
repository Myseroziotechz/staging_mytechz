'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { getAdminClient } from '@/lib/supabase-admin'
import { validateJobInput, toJobRow } from '@/lib/jobs/schema'

export async function adminCreateJobAction(payload) {
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
  if (!profile || !profile.is_active || profile.role !== 'admin')
    return { ok: false, errors: { _form: 'Forbidden' } }

  const v = validateJobInput(payload, { actorRole: 'admin' })
  if (!v.ok) return { ok: false, errors: v.errors }

  const admin = getAdminClient()

  // Optional company by name passed from form.
  let company_id = null
  let company_name = (payload.company_name || '').toString().trim() || null
  if (company_name) {
    try {
      const { data: existing } = await admin
        .from('companies')
        .select('id')
        .ilike('name', company_name)
        .limit(1)
        .maybeSingle()
      if (existing?.id) company_id = existing.id
      else {
        const { data: created } = await admin
          .from('companies')
          .insert({ name: company_name, is_verified: true })
          .select('id')
          .single()
        if (created?.id) company_id = created.id
      }
    } catch {}
  }

  const row = toJobRow({
    ...v.data,
    posted_by: user.id,
    company_id,
    posted_at: new Date().toISOString(),
  })

  const { data, error } = await admin
    .from('jobs')
    .insert(row)
    .select('id, slug, category')
    .single()

  if (error) {
    console.warn('[adminCreateJobAction] insert failed:', error.message)
    return { ok: false, errors: { _form: error.message } }
  }

  revalidatePath('/admin/dashboard')
  revalidatePath('/jobs')
  if (data?.category)
    revalidatePath(`/jobs/${data.category}/${data.slug}`)
  return { ok: true, job: data, pending: row.status !== 'active' }
}
