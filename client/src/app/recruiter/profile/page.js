import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import RecruiterProfileForm from './RecruiterProfileForm.jsx'

export const metadata = {
  title: 'My Profile - MyTechZ Recruiter',
  description: 'Manage your personal recruiter profile on MyTechZ.',
  robots: { index: false, follow: false },
}

const VERIFICATION_BADGE = {
  verified:   { label: 'Verified',   style: 'bg-green-100 text-green-700' },
  pending:    { label: 'Pending',     style: 'bg-amber-100 text-amber-700' },
  rejected:   { label: 'Rejected',   style: 'bg-red-100 text-red-700' },
}

export default async function RecruiterProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('full_name, phone, email, role, avatar_url, created_at')
    .eq('id', user.id)
    .single()

  const { data: recruiterProfile } = await supabase
    .from('recruiter_profiles')
    .select('designation, company_name, industry, verification_status')
    .eq('user_id', user.id)
    .maybeSingle()

  const memberSince = userProfile?.created_at
    ? new Date(userProfile.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : null

  const displayEmail = userProfile?.email || user.email
  const initials = (userProfile?.full_name || displayEmail || 'R')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const avatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || userProfile?.avatar_url
  const verStatus = recruiterProfile?.verification_status ?? 'pending'
  const badge = VERIFICATION_BADGE[verStatus] ?? VERIFICATION_BADGE.pending

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl font-bold flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-white shadow">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt={initials} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 truncate">{displayEmail}</p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
              Recruiter
            </span>
            {memberSince && (
              <span className="text-xs text-gray-400">Member since {memberSince}</span>
            )}
          </div>
        </div>
      </div>

      {/* Editable personal form */}
      <RecruiterProfileForm
        defaultValues={{
          full_name:   userProfile?.full_name   ?? '',
          phone:       userProfile?.phone       ?? '',
          designation: recruiterProfile?.designation ?? '',
        }}
      />

      {/* Company summary (read-only) */}
      {recruiterProfile?.company_name && (
        <section className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Company Profile</h2>
            <Link
              href="/recruiter/onboarding"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Edit Company Profile →
            </Link>
          </div>

          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex gap-2">
              <span className="text-gray-400 w-24 shrink-0">Company</span>
              <span className="font-medium">{recruiterProfile.company_name}</span>
            </div>
            {recruiterProfile.industry && (
              <div className="flex gap-2">
                <span className="text-gray-400 w-24 shrink-0">Industry</span>
                <span>{recruiterProfile.industry}</span>
              </div>
            )}
            <div className="flex gap-2">
              <span className="text-gray-400 w-24 shrink-0">Status</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${badge.style}`}>
                {badge.label}
              </span>
            </div>
          </div>
        </section>
      )}

      {!recruiterProfile?.company_name && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 text-sm text-amber-800">
            <p className="font-semibold">Company profile incomplete</p>
            <p className="mt-1">Complete your company profile to start posting jobs.</p>
          </div>
          <Link
            href="/recruiter/onboarding"
            className="shrink-0 px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded-xl hover:bg-amber-700 transition-colors"
          >
            Complete Now
          </Link>
        </div>
      )}
    </div>
  )
}
