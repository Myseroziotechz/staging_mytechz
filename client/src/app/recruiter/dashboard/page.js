import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { requireRecruiterOnboarded } from '@/lib/recruiter-auth'

export const metadata = {
  title: 'Recruiter Dashboard - MyTechZ',
  description: 'Post jobs, review applicants, and manage your hiring pipeline.',
}

const WORK_MODE_LABEL = {
  office: 'Office',
  hybrid: 'Hybrid',
  remote: 'Remote',
}

export default async function RecruiterDashboardPage() {
  await requireRecruiterOnboarded()

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: profile }, { data: company }] = await Promise.all([
    supabase
      .from('user_profiles')
      .select('full_name, email, created_at')
      .eq('id', user.id)
      .single(),
    supabase
      .from('recruiter_profiles')
      .select(
        'company_name, industry, company_size, head_office_location, work_mode, company_description, company_website, verification_status, created_at'
      )
      .eq('user_id', user.id)
      .single(),
  ])

  const greetingName = profile?.full_name?.split(' ')[0] || 'there'
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : null

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Greeting */}
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500">Welcome back,</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {greetingName}
            </h1>
            {memberSince && (
              <p className="text-xs text-gray-400 mt-0.5">Member since {memberSince}</p>
            )}
          </div>
          <VerificationBadge status={company?.verification_status} />
        </header>

        {/* Company summary */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {company?.company_name || '—'}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {[
                  company?.industry,
                  company?.company_size
                    ? `${company.company_size} employees`
                    : null,
                  company?.head_office_location,
                  company?.work_mode
                    ? WORK_MODE_LABEL[company.work_mode]
                    : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            </div>
            <Link
              href="/recruiter/onboarding"
              className="text-sm font-semibold text-blue-700 hover:text-blue-800 whitespace-nowrap"
            >
              Edit profile
            </Link>
          </div>

          {company?.company_description && (
            <p className="mt-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {company.company_description}
            </p>
          )}

          {company?.company_website && (
            <a
              href={company.company_website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1 text-sm text-blue-700 hover:text-blue-800"
            >
              {company.company_website}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 3h7v7m0-7L10 14m-7 0v7h7" />
              </svg>
            </a>
          )}
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Jobs Posted" value="0" color="blue" />
          <StatCard label="Total Applicants" value="0" color="green" />
          <StatCard label="Active Jobs" value="0" color="amber" />
          <StatCard label="Shortlisted" value="0" color="purple" />
        </section>

        {/* Action cards */}
        <section className="grid sm:grid-cols-2 gap-4">
          <ActionCard
            title="Post a Job"
            description="Create a new job posting and start receiving applications from qualified candidates."
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            }
            badge="Coming soon"
          />
          <ActionCard
            title="View Applicants"
            description="Review candidates who applied to your roles, manage shortlists, and schedule interviews."
            icon={
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-2a4 4 0 100-8 4 4 0 000 8z" />
            }
            badge="Coming soon"
          />
        </section>

        {/* Recent Activity */}
        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900">Hiring Activity</h2>
          <p className="mt-2 text-sm text-gray-500">
            Your recent job posts and applicant activity will appear here.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center py-8 text-gray-400">
            <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-sm font-medium">No activity yet</p>
            <p className="text-xs mt-1">Post your first job to get started</p>
          </div>
        </section>
      </div>
    </div>
  )
}

function VerificationBadge({ status }) {
  const map = {
    pending: {
      label: 'Verification pending',
      cls: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    verified: {
      label: 'Verified',
      cls: 'bg-green-50 text-green-700 border-green-200',
    },
    rejected: {
      label: 'Verification rejected',
      cls: 'bg-red-50 text-red-700 border-red-200',
    },
  }
  const entry = map[status] || map.pending
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${entry.cls}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {entry.label}
    </span>
  )
}

function StatCard({ label, value, color }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
  }
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900 tabular-nums">{value}</p>
    </div>
  )
}

function ActionCard({ title, description, icon, badge }) {
  return (
    <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-6 text-left relative">
      {badge && (
        <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
          {badge}
        </span>
      )}
      <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-500 inline-flex items-center justify-center">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          {icon}
        </svg>
      </div>
      <h3 className="mt-4 text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  )
}
