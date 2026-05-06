'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { validateJobInput, toJobRow } from '@/lib/jobs/schema'

// Resolve / create a `companies` row by name for this recruiter.
// Returns { id, name, verified } so the caller knows whether the recruiter
// is verified (which decides if their post goes live immediately).
async function resolveCompanyId(supabase, userId) {
  const { data: profile } = await supabase
    .from('recruiter_profiles')
    .select(
      'company_name, industry, company_size, company_website, verification_status'
    )
    .eq('user_id', userId)
    .maybeSingle()
  if (!profile?.company_name)
    return { id: null, name: null, verified: false }
  const verified = profile.verification_status === 'approved'

  const name = profile.company_name.trim()
  // Try existing.
  const { data: existing } = await supabase
    .from('companies')
    .select('id')
    .ilike('name', name)
    .limit(1)
    .maybeSingle()
  if (existing?.id) return { id: existing.id, name, verified }

  // Try create. If the table doesn't exist or insert is blocked by RLS,
  // we silently fall back to denormalized name only.
  try {
    const { data: created } = await supabase
      .from('companies')
      .insert({
        name,
        industry: profile.industry || null,
        size: profile.company_size || null,
        website: profile.company_website || null,
        is_verified: verified,
      })
      .select('id')
      .single()
    if (created?.id) return { id: created.id, name, verified }
  } catch {}
  return { id: null, name, verified }
}

export async function createJobAction(payload) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, errors: { _form: 'Not signed in' } }

  // Verify recruiter role server-side. Defense-in-depth on top of layout guard.
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .single()
  if (!profile || !profile.is_active || profile.role !== 'recruiter')
    return { ok: false, errors: { _form: 'Forbidden' } }

  const v = validateJobInput(payload, { actorRole: 'recruiter' })
  if (!v.ok) return { ok: false, errors: v.errors }

  const company = await resolveCompanyId(supabase, user.id)

  // Verified recruiters publish directly. Unverified posts wait for admin
  // approval — they remain visible on the recruiter's own dashboard.
  const status = company.verified ? 'active' : 'pending_approval'

  const row = toJobRow({
    ...v.data,
    status,
    posted_by: user.id,
    company_id: company.id,
    posted_at: new Date().toISOString(),
  })

  const { data, error } = await supabase
    .from('jobs')
    .insert(row)
    .select('id, slug, category')
    .single()

  if (error) {
    console.warn('[createJobAction] insert failed:', error.message)
    return { ok: false, errors: { _form: error.message } }
  }

  revalidatePath('/recruiter/dashboard')
  revalidatePath('/jobs')
  if (data?.category)
    revalidatePath(`/jobs/${data.category}/${data.slug}`)

  return {
    ok: true,
    job: { ...data, status },
    pending: status !== 'active',
  }
}
