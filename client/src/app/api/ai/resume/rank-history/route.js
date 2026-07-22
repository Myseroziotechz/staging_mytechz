export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/ai/resume/rank-history — fetch last N ATS rank check scans for the current user
 */
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: scans } = await supabase
    .from('ai_generation_logs')
    .select('id, input_summary, output_summary, created_at, duration_ms')
    .eq('user_id', user.id)
    .eq('action_type', 'rank_check')
    .eq('status', 'success')
    .order('created_at', { ascending: false })
    .limit(5)

  const history = (scans || []).map((scan) => {
    let score = 0
    let source = 'local'
    try {
      const parsed = JSON.parse(scan.output_summary)
      score = parsed.atsScore || 0
      source = parsed.source || 'local'
    } catch {}

    // Extract role from input_summary: "Role: xxx, JD: yes/no, Source: yyy"
    let role = 'General'
    const roleMatch = scan.input_summary?.match(/Role:\s*([^,]+)/)
    if (roleMatch) role = roleMatch[1].trim()

    return {
      id: scan.id,
      score,
      source,
      role,
      date: scan.created_at,
      durationMs: scan.duration_ms,
    }
  })

  return NextResponse.json({ history })
}
