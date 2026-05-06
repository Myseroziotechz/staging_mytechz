import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { SCOPES } from '@/lib/exports/scopes'
import { toCSV } from '@/lib/exports/csv'
import { toPDFBuffer } from '@/lib/exports/pdf'
import { toDOCXBuffer } from '@/lib/exports/docx'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const FORMATS = new Set(['csv', 'pdf', 'docx'])
const MIME = {
  csv: 'text/csv; charset=utf-8',
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

export async function GET(req, ctx) {
  const { scope } = await ctx.params
  const sp = new URL(req.url).searchParams
  const format = (sp.get('format') || 'csv').toLowerCase()

  if (!SCOPES[scope])
    return NextResponse.json({ error: 'Unknown scope' }, { status: 404 })
  if (!FORMATS.has(format))
    return NextResponse.json({ error: 'Unknown format' }, { status: 400 })

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, is_active, email')
    .eq('id', user.id)
    .maybeSingle()
  if (!profile || !profile.is_active)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const def = SCOPES[scope]
  if (!def.allow(profile.role))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let rows
  try {
    rows = await def.fetch({ user, sp, profile })
  } catch (e) {
    console.warn('[export] fetch failed', scope, e?.message)
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 })
  }

  const today = new Date().toISOString().slice(0, 10)
  const filename = `${scope}-${today}.${format}`
  const subtitle = subtitleFromFilters(sp)

  let body
  if (format === 'csv') {
    body = toCSV(rows, def.columns)
  } else if (format === 'pdf') {
    body = await toPDFBuffer({
      title: def.title,
      subtitle,
      rows,
      columns: def.columns,
      actorEmail: profile.email,
    })
  } else if (format === 'docx') {
    body = await toDOCXBuffer({
      title: def.title,
      subtitle,
      rows,
      columns: def.columns,
      actorEmail: profile.email,
    })
  }

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': MIME[format],
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}

function subtitleFromFilters(sp) {
  const skip = new Set(['format'])
  const parts = []
  for (const [k, v] of sp.entries()) {
    if (skip.has(k) || !v) continue
    parts.push(`${k}=${v}`)
  }
  return parts.length ? `Filters: ${parts.join(' · ')}` : ''
}
