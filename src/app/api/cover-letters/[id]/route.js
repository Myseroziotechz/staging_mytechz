export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const VALID_STATUSES = ['draft', 'completed']

// GET /api/cover-letters/[id] — get single cover letter
export async function GET(req, { params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('user_cover_letters')
    .select('*, cover_letter_templates(id, name, slug, html_css_template)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Cover letter not found' }, { status: 404 })
  return NextResponse.json({ coverLetter: data })
}

// PUT /api/cover-letters/[id] — partial update
export async function PUT(req, { params }) {
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

  const updates = {}
  if (body.title !== undefined) {
    if (typeof body.title !== 'string' || !body.title.trim()) {
      return NextResponse.json({ error: 'Title cannot be empty.' }, { status: 422 })
    }
    updates.title = body.title.trim()
  }
  if (body.sender_info !== undefined) updates.sender_info = body.sender_info
  if (body.recipient_info !== undefined) updates.recipient_info = body.recipient_info
  if (body.letter_content !== undefined) updates.letter_content = body.letter_content
  if (body.template_id !== undefined) updates.template_id = body.template_id
  if (body.job_id !== undefined) updates.job_id = body.job_id
  if (body.status !== undefined) {
    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` }, { status: 422 })
    }
    updates.status = body.status
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No editable fields provided.' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('user_cover_letters')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('id, title, updated_at')
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Cover letter not found' }, { status: 404 })
  return NextResponse.json({ coverLetter: data })
}

// DELETE /api/cover-letters/[id]
export async function DELETE(req, { params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('user_cover_letters')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
