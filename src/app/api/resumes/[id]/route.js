export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/resumes/[id] — get single resume
export async function GET(req, { params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('user_resumes')
    .select('*, resume_templates(id, name, slug, html_css_template, required_fields, default_sections, preview_image_url)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
  return NextResponse.json({ resume: data })
}

// PUT /api/resumes/[id] — update resume
export async function PUT(req, { params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const updates = {}
  if (body.title !== undefined) updates.title = body.title
  if (body.resume_data !== undefined) updates.resume_data = body.resume_data
  if (body.status !== undefined) updates.status = body.status
  if (body.template_id !== undefined) updates.template_id = body.template_id
  updates.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('user_resumes')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select('id, updated_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
  return NextResponse.json({ resume: data })
}

// DELETE /api/resumes/[id] — delete resume
export async function DELETE(req, { params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('user_resumes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
