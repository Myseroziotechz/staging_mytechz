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

  const { data: scans, error } = await supabase
    .from('ai_generation_logs')
    .select('id, output_content, created_at')
    .eq('user_id', user.id)
    .eq('action_type', 'rank_check')
    .eq('status', 'success')
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('[rank-history] query failed:', error.message)
    return NextResponse.json({ history: [] })
  }

  const history = (scans || []).map((scan) => ({
    id: scan.id,
    score: scan.output_content?.atsScore ?? 0,
    source: scan.output_content?.source || 'local',
    role: scan.output_content?.targetRole || 'General',
    date: scan.created_at,
  }))

  return NextResponse.json({ history })
}
