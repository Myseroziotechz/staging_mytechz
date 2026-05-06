import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Returns up to 10 distinct skill strings from active jobs whose value
// matches the prefix (case-insensitive). Used by JobForm autocomplete as
// a fallback when the static popular list doesn't have a hit.
export async function GET(req) {
  const url = new URL(req.url)
  const q = (url.searchParams.get('q') || '').trim().toLowerCase()
  if (!q) return NextResponse.json({ suggestions: [] })
  if (q.length > 40) return NextResponse.json({ suggestions: [] })

  try {
    const supabase = await createClient()
    // Pull a sample of recent jobs' skills arrays, then match in-memory.
    // Keeps the query simple (no array/jsonb funcs) and is plenty fast for
    // a few hundred latest jobs.
    const { data } = await supabase
      .from('jobs')
      .select('skills')
      .eq('status', 'active')
      .order('posted_at', { ascending: false })
      .limit(400)

    const seen = new Map()
    for (const row of data || []) {
      if (!Array.isArray(row.skills)) continue
      for (const s of row.skills) {
        if (typeof s !== 'string') continue
        const key = s.toLowerCase()
        if (!key.includes(q)) continue
        if (!seen.has(key)) seen.set(key, s)
        if (seen.size >= 10) break
      }
      if (seen.size >= 10) break
    }
    return NextResponse.json({ suggestions: [...seen.values()] })
  } catch {
    return NextResponse.json({ suggestions: [] })
  }
}
