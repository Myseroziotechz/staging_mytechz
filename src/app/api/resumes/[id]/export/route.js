export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/resumes/[id]/export — log export action
export async function POST(req, { params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { format } = await req.json()
  const validFormats = ['pdf', 'docx', 'png', 'jpg', 'svg']
  if (!validFormats.includes(format)) {
    return NextResponse.json({ error: `Invalid format. Use: ${validFormats.join(', ')}` }, { status: 400 })
  }

  // Update resume's last export info
  await supabase
    .from('user_resumes')
    .update({
      last_exported_at: new Date().toISOString(),
      last_export_format: format,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  // Log the export action
  await supabase
    .from('ai_generation_logs')
    .insert({
      user_id: user.id,
      resume_id: id,
      action_type: 'export',
      export_format: format,
      status: 'success',
    })

  return NextResponse.json({ success: true })
}
