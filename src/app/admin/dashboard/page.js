import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import JobsDashboardWidget from '@/components/jobs/JobsDashboardWidget'
import { getAdminPlatformKPIs } from '@/lib/admin/queries'
import SmartSearchBar from '@/components/dashboard/SmartSearchBar'

export const metadata = {
  title: 'Admin Home',
  description: 'Administer MyTechZ users, recruiters, and platform settings.',
  robots: { index: false, follow: false },
}

async function countRows(supabase, table, column, value) {
  let query = supabase.from(table).select('*', { count: 'exact', head: true })
  if (column && value) query = query.eq(column, value)
  const { count } = await query
  return count ?? 0
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // `_whitelisted` (admin_whitelist row count) is fetched but not shown on
  // any stat card below — kept here rather than dropping the query, in case
  // a "Whitelisted Admins" card was intended; adding one is a UI decision
  // left for a follow-up rather than assumed here.
  const [totalUsers, candidates, recruiters, admins, _whitelisted, platform] = await Promise.all([
    countRows(supabase, 'user_profiles'),
    countRows(supabase, 'user_profiles', 'role', 'candidate'),
    countRows(supabase, 'user_profiles', 'role', 'recruiter'),
    countRows(supabase, 'user_profiles', 'role', 'admin'),
    countRows(supabase, 'admin_whitelist'),
    getAdminPlatformKPIs(),
  ])

  const { data: recentUsers = [] } = await supabase
    .from('user_profiles')
    .select('id, email, role, full_name, created_at, last_login_at, is_active')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: pendingRecruiters = [] } = await supabase
    .from('recruiter_profiles')
    .select('user_id, company_name, industry, verification_status, created_at')
    .eq('verification_status', 'pending')
    .order('created_at', { ascending: false })
    .limit(10)

  const statCards = [
    { label: 'Total Users',  value: totalUsers,  color: 'blue',   icon: usersIcon },
    { label: 'Candidates',   value: candidates,  color: 'green',  icon: candidateIcon },
    { label: 'Recruiters',   value: recruiters,  color: 'amber',  icon: recruiterIcon },
    { label: 'Admins',       value: admins,      color: 'purple', icon: shieldIcon },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">Admin Panel</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Overview</h1>
          <p className="mt-1 text-sm text-gray-500">A snapshot of platform activity.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/post-job"
            className="text-xs font-semibold px-3 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800"
          >
            + Post a card
          </Link>
          <Link
            href="/admin/jobs?status=pending_approval"
            className="text-xs font-semibold px-3 py-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
          >
            {platform.pendingJobs} pending review
          </Link>
        </div>
      </header>

      {/* Smart Search Bar */}
      <SmartSearchBar placeholder="Search users, jobs, emails..." />

      {/* Platform KPIs */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard label="Active jobs"          value={platform.activeJobs}     tone="emerald" href="/admin/jobs?status=active" />
        <KpiCard label="Pending review"       value={platform.pendingJobs}    tone="amber"   href="/admin/jobs?status=pending_approval" />
        <KpiCard label="Applications (total)" value={platform.totalApplicants} tone="blue"   href="/admin/applications" />
        <KpiCard label="This week"            value={platform.weekApplicants} tone="purple"  href="/admin/applications" />
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <AdminActionCard href="/admin/post-job"   icon={editIcon}     label="Post a Card" />
          <AdminActionCard href="/admin/jobs"       icon={briefcaseIcon} label="Jobs" />
          <AdminActionCard href="/admin/whitelist"  icon={mailIcon}     label="Admin Emails" />
          <AdminActionCard href="/admin/users"      icon={usersActionIcon} label="Users" />
          <AdminActionCard href="/admin/recruiters" icon={buildingActionIcon} label="Recruiters" />
          <AdminActionCard href="/admin/analytics" icon={analyticsIcon} label="Analytics" />
        </div>
      </section>

      {/* User stats */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((c) => (
          <div key={c.label} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">{c.label}</p>
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorMap[c.color]}`}>
                {c.icon}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900 tabular-nums">
              {c.value.toLocaleString()}
            </p>
          </div>
        ))}
      </section>

      {/* Category mix */}
      <section className="bg-white border border-gray-200 rounded-2xl p-4">
        <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">
          Active jobs by category
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { k: 'private',     label: 'Private',     tone: 'bg-blue-50 text-blue-700' },
            { k: 'government',  label: 'Government',  tone: 'bg-amber-50 text-amber-700' },
            { k: 'internship',  label: 'Internships', tone: 'bg-emerald-50 text-emerald-700' },
            { k: 'ai',          label: 'AI picks',    tone: 'bg-purple-50 text-purple-700' },
          ].map((c) => (
            <Link
              key={c.k}
              href={`/admin/jobs?category=${c.k}&status=active`}
              className={`px-3 py-2 rounded-lg ${c.tone} hover:opacity-80 flex items-center justify-between`}
            >
              <span className="text-xs font-semibold">{c.label}</span>
              <span className="text-sm font-bold">{platform.byCategory[c.k] || 0}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Pending Recruiter Verifications */}
      {pendingRecruiters.length > 0 && (
        <section className="bg-white border border-amber-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-amber-100 bg-amber-50/50 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="text-sm font-semibold text-gray-900">
              Pending Recruiter Verifications ({pendingRecruiters.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {pendingRecruiters.map((r) => (
              <div key={r.user_id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900">{r.company_name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {r.industry || 'No industry'} · Applied {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-amber-200 bg-amber-50 text-amber-700 text-xs font-medium shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Pending
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Jobs awaiting approval */}
      <JobsDashboardWidget variant="admin" limit={6} ctaHref="/admin/dashboard" ctaLabel="Open queue" />

      {/* Recent Sign-ups */}
      <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Recent Sign-ups</h3>
          <Link href="/admin/users" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
            View all →
          </Link>
        </div>
        {recentUsers.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recentUsers.map((u) => (
              <div key={u.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">{u.full_name || '—'}</p>
                  <p className="text-xs text-gray-500 truncate">{u.email}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <RoleBadge role={u.role} />
                  <span className="text-xs text-gray-400">
                    {new Date(u.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 py-8 text-sm text-gray-500 text-center">No users yet.</div>
        )}
      </section>
    </div>
  )
}

// ---- Sub-components ---------------------------------------------------------

function AdminActionCard({ href, icon, label }) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-1.5 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all text-center"
    >
      <span className="w-7 h-7 flex items-center justify-center text-gray-500 group-hover:text-blue-600 transition-colors">{icon}</span>
      <span className="text-xs font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">{label}</span>
    </Link>
  )
}

const ROLE_BADGE = {
  admin:     'bg-purple-50 text-purple-700 border-purple-200',
  recruiter: 'bg-blue-50 text-blue-700 border-blue-200',
  candidate: 'bg-gray-100 text-gray-700 border-gray-200',
}

function RoleBadge({ role }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${ROLE_BADGE[role] || ROLE_BADGE.candidate}`}>
      {role}
    </span>
  )
}

const colorMap = {
  blue:   'bg-blue-50 text-blue-600',
  green:  'bg-green-50 text-green-600',
  amber:  'bg-amber-50 text-amber-600',
  purple: 'bg-purple-50 text-purple-600',
}

// Quick-action icons
const editIcon = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
)
const briefcaseIcon = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
  </svg>
)
const mailIcon = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)
const usersActionIcon = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-2a4 4 0 100-8 4 4 0 000 8z" />
  </svg>
)
const buildingActionIcon = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3m4-10h2m4 0h2m-6 4h2m4 0h2" />
  </svg>
)
const analyticsIcon = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)

// Stat icons
const usersIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-2a4 4 0 100-8 4 4 0 000 8z" />
  </svg>
)
const candidateIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 14a4 4 0 10-8 0m12 7a8 8 0 10-16 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)
const recruiterIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3m4-10h2m4 0h2m-6 4h2m4 0h2" />
  </svg>
)
const shieldIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

const KPI_TONE = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  amber:   'bg-amber-50 text-amber-700 border-amber-200',
  blue:    'bg-blue-50 text-blue-700 border-blue-200',
  purple:  'bg-purple-50 text-purple-700 border-purple-200',
}

function KpiCard({ label, value, tone = 'blue', href }) {
  const inner = (
    <>
      <p className="text-xs uppercase tracking-wider opacity-70 font-semibold">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </>
  )
  const cls = `block rounded-2xl border p-4 transition hover:opacity-80 ${KPI_TONE[tone] || KPI_TONE.blue}`
  return href ? <Link href={href} className={cls}>{inner}</Link> : <div className={cls}>{inner}</div>
}
