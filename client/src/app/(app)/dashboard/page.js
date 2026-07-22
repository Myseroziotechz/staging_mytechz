import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ensureSessionInitialized } from '@/lib/auth/ensure-session'
import JobsDashboardWidget from '@/components/jobs/JobsDashboardWidget'
import SmartSearchBar from '@/components/dashboard/SmartSearchBar'

export const metadata = {
  title: 'Home',
  description: 'Your personalised MyTechZ dashboard.',
  robots: { index: false, follow: false },
}

export default async function CandidateDashboardPage() {
  const session = await ensureSessionInitialized()

  if (!session) redirect('/login?returnTo=/dashboard')

  const { user } = session

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
  const profileFields = [profile?.full_name, profile?.phone, profile?.avatar_url || avatar]
  const filledFields = profileFields.filter(Boolean).length
  const profilePercent = Math.round((filledFields / profileFields.length) * 100)

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : null

  const [{ count: applicationsCount }, { count: savedJobsCount }] = await Promise.all([
    supabase.from('job_applications').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('saved_jobs').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
  ])

  return (
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
          {memberSince && <p className="text-xs text-gray-400 mt-0.5">Member since {memberSince}</p>}
        </div>
      </header>

      {/* Smart Search Bar */}
      <SmartSearchBar placeholder="Search for jobs, tools, pages..." />

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
                <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${profilePercent}%` }} />
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

      {/* Job Tools */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-3">Job Tools</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <ToolCard
            href="/ai-tools/resume-builder"
            icon={resumeIcon}
            title="Resume Builder"
            description="Create ATS-ready resumes for free — no watermarks, no sign-up wall."
            badge="Free"
          />
          <ToolCard
            href="/ai-tools/resume-rank-checker/check"
            icon={chartIcon}
            title="Resume Rank Checker"
            description="Get your ATS score instantly and see exactly what keywords you are missing."
            badge="Free"
          />
          <ToolCard
            href="/ai-tools/smart-job-search"
            icon={aiIcon}
            title="Smart Job Search"
            description="AI-powered job matching that learns your skills and finds the best fits."
            badge="Coming soon"
            badgeColor="gray"
          />
        </div>
      </section>

      {/* Browse Jobs */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-3">Browse Jobs</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <JobCategoryCard href="/jobs/private"    label="Private Jobs" icon={buildingIcon}    color="blue" />
          <JobCategoryCard href="/jobs/government" label="Govt Jobs"    icon={shieldCatIcon}   color="amber" />
          <JobCategoryCard href="/jobs/internship" label="Internships"  icon={academicIcon}    color="emerald" />
          <JobCategoryCard href="/jobs/ai"         label="AI-Matched"   icon={sparkleIcon}     color="purple" />
        </div>
      </section>

      {/* Latest jobs */}
      <JobsDashboardWidget variant="default" limit={4} title="Latest jobs for you" ctaHref="/jobs?tab=ai" ctaLabel="See AI matches" />

      {/* Recent Activity */}
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
          <Link href="/jobs" className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700">
            Browse jobs →
          </Link>
        </div>
      </section>
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

function ToolCard({ href, icon, title, description, badge, badgeColor = 'blue' }) {
  const badgeStyle = badgeColor === 'gray'
    ? 'bg-gray-100 text-gray-500'
    : 'bg-blue-100 text-blue-700'

  return (
    <Link
      href={href}
      className="group bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-sm transition-all flex flex-col gap-3"
    >
      <div className="flex items-start justify-between">
        <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          {icon}
        </span>
        {badge && (
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeStyle}`}>
            {badge}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="mt-1 text-xs text-gray-500 leading-relaxed">{description}</p>
      </div>
    </Link>
  )
}

function JobCategoryCard({ href, label, icon, color }) {
  const colorMap = {
    blue:    { card: 'bg-blue-50 border-blue-100 hover:border-blue-300 hover:bg-blue-100', icon: 'text-blue-600' },
    amber:   { card: 'bg-amber-50 border-amber-100 hover:border-amber-300 hover:bg-amber-100', icon: 'text-amber-600' },
    emerald: { card: 'bg-emerald-50 border-emerald-100 hover:border-emerald-300 hover:bg-emerald-100', icon: 'text-emerald-600' },
    purple:  { card: 'bg-purple-50 border-purple-100 hover:border-purple-300 hover:bg-purple-100', icon: 'text-purple-600' },
  }
  const { card, icon: iconColor } = colorMap[color] || colorMap.blue
  return (
    <Link
      href={href}
      className={`group flex flex-col items-center gap-2 p-4 rounded-xl border transition-all text-center ${card}`}
    >
      <span className={`w-8 h-8 flex items-center justify-center ${iconColor}`}>{icon}</span>
      <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900">{label}</span>
    </Link>
  )
}

// ---- Icons (inline SVG) -----------------------------------------------------

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
const resumeIcon = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m-8 5h10a2 2 0 002-2V7l-5-5H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
)
const chartIcon = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
)
const aiIcon = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
  </svg>
)
const buildingIcon = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3m4-10h2m4 0h2m-6 4h2m4 0h2" />
  </svg>
)
const shieldCatIcon = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)
const academicIcon = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
  </svg>
)
const sparkleIcon = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
  </svg>
)
