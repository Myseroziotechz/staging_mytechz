export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/cover-letters — list user's cover letters
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('user_cover_letters')
    .select('id, title, template_id, status, created_at, updated_at, last_exported_at, last_export_format, cover_letter_templates(name, slug)')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ coverLetters: data })
}

// POST /api/cover-letters — create a new cover letter, sender_info prefilled
// from the authenticated user's profile (a one-time copy — editing it here
// never writes back to user_profiles).
export async function POST(req) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 })
  }

  const { title, template_id, job_id, sender_info, recipient_info, letter_content } = body

  if (!template_id) {
    return NextResponse.json({ error: 'template_id is required' }, { status: 400 })
  }

  let prefillSender = sender_info
  if (!prefillSender) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('full_name, headline, email, phone, location, linkedin_url, github_url, portfolio_url')
      .eq('id', user.id)
      .maybeSingle()

    prefillSender = {
      fullName: profile?.full_name || '',
      headline: profile?.headline || '',
      email: profile?.email || user.email || '',
      phone: profile?.phone || '',
      location: profile?.location || '',
      linkedin: profile?.linkedin_url || '',
      portfolio: profile?.portfolio_url || profile?.github_url || '',
    }
  }

  const defaultDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  const { data, error } = await supabase
    .from('user_cover_letters')
    .insert({
      user_id: user.id,
      title: title || 'Untitled Cover Letter',
      template_id,
      job_id: job_id || null,
      sender_info: prefillSender,
      recipient_info: recipient_info || { date: defaultDate },
      letter_content: letter_content || { greeting: 'Dear Hiring Manager,', opening: '', body: [''], closing: '', signOff: 'Sincerely,' },
      status: 'draft',
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data.id }, { status: 201 })
}
