export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { requireUser, fail } from '@/app/api/profile/_lib/handlers'

// GET /api/settings/export-data — download the caller's own data as JSON.
export async function GET() {
  const { supabase, user, response } = await requireUser()
  if (response) return response

  try {
    const [{ data: profile }, { data: settings }, { data: resumes }] = await Promise.all([
      supabase.from('user_profiles').select('*').eq('id', user.id).maybeSingle(),
      supabase.from('user_settings').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('user_resumes').select('id, title, template_id, status, created_at, updated_at').eq('user_id', user.id),
    ])

    const payload = {
      exported_at: new Date().toISOString(),
      account: { id: user.id, email: user.email, created_at: user.created_at },
      profile: profile || null,
      settings: settings || null,
      resumes: resumes || [],
    }

    return new NextResponse(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="mytechz-data-export.json"',
      },
    })
  } catch (err) {
    console.error('[settings/export-data] failed:', err)
    return fail('Could not prepare your data export. Please try again.', 500)
  }
}
