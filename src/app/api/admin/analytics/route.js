export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET /api/admin/analytics?type=overview|jobs-trend|applications-trend|category-distribution|application-status|top-jobs
 * Admin-only analytics endpoints.
 */
export async function GET(req) {
  const supabase = await createClient()

  // Auth: must be logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Auth: must be admin
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'overview'

  try {
    switch (type) {
      case 'overview':
        return NextResponse.json(await getOverview(supabase))
      case 'jobs-trend':
        return NextResponse.json(await getJobsTrend(supabase))
      case 'applications-trend':
        return NextResponse.json(await getApplicationsTrend(supabase))
      case 'category-distribution':
        return NextResponse.json(await getCategoryDistribution(supabase))
      case 'application-status':
        return NextResponse.json(await getApplicationStatus(supabase))
      case 'top-jobs':
        return NextResponse.json(await getTopJobs(supabase))
      default:
        return NextResponse.json({ error: `Unknown analytics type: ${type}` }, { status: 400 })
    }
  } catch (err) {
    console.error('[admin/analytics]', err)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}

// ── Overview ────────────────────────────────────────────────────────────────────

async function getOverview(supabase) {
  async function count(table, eqs = []) {
    let q = supabase.from(table).select('*', { count: 'exact', head: true })
    for (const [k, v] of eqs) q = q.eq(k, v)
    const { count: c } = await q
    return c ?? 0
  }

  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()
  const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString()

  const [
    totalUsers,
    totalJobs,
    activeJobs,
    totalApplications,
    weekApplications,
    monthUsers,
    resumesAnalyzed,
  ] = await Promise.all([
    count('user_profiles'),
    count('jobs'),
    count('jobs', [['status', 'active']]),
    count('job_applications'),
    (async () => {
      const { count: c } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true })
        .gte('applied_at', weekAgo)
      return c ?? 0
    })(),
    (async () => {
      const { count: c } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthAgo)
      return c ?? 0
    })(),
    (async () => {
      const { count: c } = await supabase
        .from('ai_generation_logs')
        .select('*', { count: 'exact', head: true })
        .eq('action_type', 'rank_check')
      return c ?? 0
    })(),
  ])

  return {
    totalUsers,
    totalJobs,
    activeJobs,
    totalApplications,
    weekApplications,
    monthUsers,
    resumesAnalyzed,
  }
}

// ── Jobs Trend (last 12 weeks) ──────────────────────────────────────────────────

async function getJobsTrend(supabase) {
  const weeks = []
  const now = new Date()

  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - (i + 1) * 7)
    const weekEnd = new Date(now)
    weekEnd.setDate(now.getDate() - i * 7)

    const { count } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .gte('posted_at', weekStart.toISOString())
      .lt('posted_at', weekEnd.toISOString())

    weeks.push({
      week: `W${12 - i}`,
      label: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: count ?? 0,
    })
  }

  return { weeks }
}

// ── Applications Trend (last 12 weeks) ──────────────────────────────────────────

async function getApplicationsTrend(supabase) {
  const weeks = []
  const now = new Date()

  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - (i + 1) * 7)
    const weekEnd = new Date(now)
    weekEnd.setDate(now.getDate() - i * 7)

    const { count } = await supabase
      .from('job_applications')
      .select('*', { count: 'exact', head: true })
      .gte('applied_at', weekStart.toISOString())
      .lt('applied_at', weekEnd.toISOString())

    weeks.push({
      week: `W${12 - i}`,
      label: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: count ?? 0,
    })
  }

  return { weeks }
}

// ── Category Distribution ───────────────────────────────────────────────────────

async function getCategoryDistribution(supabase) {
  const categories = ['private', 'government', 'internship', 'ai']
  const distribution = []

  for (const category of categories) {
    const { count } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .eq('category', category)

    distribution.push({ category, count: count ?? 0 })
  }

  return { distribution }
}

// ── Application Status Breakdown ────────────────────────────────────────────────

async function getApplicationStatus(supabase) {
  const statuses = ['applied', 'reviewing', 'interview', 'offered', 'rejected', 'withdrawn']
  const breakdown = []

  for (const status of statuses) {
    const { count } = await supabase
      .from('job_applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', status)

    breakdown.push({ status, count: count ?? 0 })
  }

  return { breakdown }
}

// ── Top Jobs ────────────────────────────────────────────────────────────────────

async function getTopJobs(supabase) {
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title, slug, category, views_count, applications_count, posted_at, status')
    .eq('status', 'active')
    .order('applications_count', { ascending: false })
    .limit(10)

  return { jobs: jobs || [] }
}
