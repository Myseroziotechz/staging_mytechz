export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/resumes — list user's resumes
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('user_resumes')
    .select('id, title, template_id, status, created_at, updated_at, last_exported_at, last_export_format, resume_templates(name, slug, preview_image_url)')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ resumes: data })
}

// POST /api/resumes — create a new resume
export async function POST(req) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, template_id, resume_data } = body

  if (!template_id) {
    return NextResponse.json({ error: 'template_id is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('user_resumes')
    .insert({
      user_id: user.id,
      title: title || 'Untitled Resume',
      template_id,
      resume_data: resume_data || {},
      status: 'draft',
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data.id }, { status: 201 })
}
