import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { ensureSessionInitialized } from '@/lib/ensure-session'

export const metadata = {
  title: 'Dashboard - MyTechZ',
  description: 'Your personalised MyTechZ dashboard.',
}

export default async function CandidateDashboardPage() {
  // ensureSessionInitialized() calls the RPC if it hasn't run yet.
  // This is the safety net — if /auth/callback didn't execute the RPC
  // (e.g. OAuth redirect went to wrong domain), this catches it here.
  const session = await ensureSessionInitialized()

  if (!session) redirect('/login?returnTo=/dashboard')

  const { user } = session

  // Redirect non-candidates to their correct dashboard USING the
  // role returned by ensureSessionInitialized (which may have just
  // been promoted by the RPC).
  if (session.role === 'admin') redirect('/admin/dashboard')
  if (session.role === 'recruiter') {
    redirect(session.onboardingCompleted ? '/recruiter/dashboard' : '/recruiter/onboarding')
  }

  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, full_name, email, avatar_url, phone, onboarding_completed, created_at, last_login_at')
    .eq('id', user.id)
    .single()

  const greetingName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'
  const meta = user?.user_metadata || {}
  const avatar = meta.avatar_url || meta.picture || profile?.avatar_url

  // Calculate profile completion
  const profileFields = [
    profile?.full_name,
    profile?.phone,
    profile?.avatar_url || avatar,
  ]
  const filledFields = profileFields.filter(Boolean).length
  const profilePercent = Math.round((filledFields / profileFields.length) * 100)

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : null

  // Fetch real stats from Supabase
  const [{ count: applicationsCount }, { count: savedJobsCount }] = await Promise.all([
    supabase
      .from('job_applications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase
      .from('saved_jobs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
  ])

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Greeting Header */}
        <header className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg font-semibold flex items-center justify-center shrink-0 ring-2 ring-white shadow">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt={greetingName} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            ) : (
              <span>
                {(profile?.full_name || user?.email || 'U')
                  .split(' ')
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500">Welcome back,</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{greetingName}</h1>
            {memberSince && (
              <p className="text-xs text-gray-400 mt-0.5">Member since {memberSince}</p>
            )}
          </div>
        </header>

        {/* Profile Completion Banner */}
        {profilePercent < 100 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">Complete your profile</h3>
              <p className="text-sm text-gray-600 mt-1">
                A complete profile helps recruiters find you and improves your job matches.
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${profilePercent}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-blue-700">{profilePercent}%</span>
              </div>
            </div>
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shrink-0"
            >
              Update Profile
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        )}

        {/* Quick Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Applications" value={String(applicationsCount ?? 0)} icon={docIcon} color="blue" />
          <StatCard label="Saved Jobs" value={String(savedJobsCount ?? 0)} icon={bookmarkIcon} color="amber" />
          <StatCard label="Profile Views" value="—" icon={eyeIcon} color="green" />
          <StatCard label="Interviews" value="—" icon={calendarIcon} color="purple" />
        </section>

        {/* Quick Actions */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActionCard
            href="/jobs/private"
            title="Browse Private Jobs"
            description="Explore opportunities in top private companies across India."
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.193 23.193 0 0112 15c-3.183 0-6.22-.644-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0h2a2 2 0 012 2v6M8 6H6a2 2 0 00-2 2v6" />
            }
          />
          <ActionCard
            href="/jobs/government"
            title="Government Jobs"
            description="Find secure careers in the public sector with great benefits."
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 7l-9-5 9 5 9-5-9 5zm0-7v7" />
            }
          />
          <ActionCard
            href="/ai-tools"
            title="AI Career Tools"
            description="Build resumes, match jobs, and check your resume score with AI."
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a2.25 2.25 0 01-1.591.659H9.061a2.25 2.25 0 01-1.591-.659L5 14.5m14 0V17a2 2 0 01-2 2H7a2 2 0 01-2-2v-2.5" />
            }
          />
        </section>

        {/* Recent Activity Placeholder */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <p className="mt-2 text-sm text-gray-500">
            Your recent job applications and activity will appear here.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center py-8 text-gray-400">
            <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium">No activity yet</p>
            <p className="text-xs mt-1">Start by browsing and applying to jobs</p>
            <Link
              href="/jobs/private"
              className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Browse jobs →
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

// ---- Sub-components ---------------------------------------------------------

function StatCard({ label, value, icon, color }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  }
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </span>
        <div>
          <p className="text-2xl font-bold text-gray-900 tabular-nums">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  )
}

function ActionCard({ href, title, description, icon }) {
  return (
    <Link
      href={href}
      className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-sm transition-all"
    >
      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 inline-flex items-center justify-center group-hover:bg-blue-100 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
      <h3 className="mt-4 text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
        Explore <span aria-hidden="true">→</span>
      </span>
    </Link>
  )
}

// ---- Stat icons (inline SVG) ------------------------------------------------
const docIcon = (
  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m-8 5h10a2 2 0 002-2V7l-5-5H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
)
const bookmarkIcon = (
  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z" />
  </svg>
)
const eyeIcon = (
  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)
const calendarIcon = (
  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)
