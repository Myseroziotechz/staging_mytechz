export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const VALID_FORMATS = ['pdf', 'docx']

// POST /api/cover-letters/[id]/export — log export action
export async function POST(req, { params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 })
  }

  const { format } = body
  if (!VALID_FORMATS.includes(format)) {
    return NextResponse.json({ error: `Invalid format. Use: ${VALID_FORMATS.join(', ')}` }, { status: 400 })
  }

  const { error } = await supabase
    .from('user_cover_letters')
    .update({ last_exported_at: new Date().toISOString(), last_export_format: format })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
