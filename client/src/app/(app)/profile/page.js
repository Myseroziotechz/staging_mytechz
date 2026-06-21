import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProfileForm from './ProfileForm.jsx'

export const metadata = {
  title: 'My Profile - MyTechZ',
  description: 'Manage your MyTechZ profile — name, skills, and professional details.',
  robots: { index: false, follow: false },
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name, phone, location, headline, linkedin_url, skills, avatar_url, email, role, created_at')
    .eq('id', user.id)
    .single()

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : null

  const displayEmail = profile?.email || user.email
  const initials = (profile?.full_name || displayEmail || 'U')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const avatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || profile?.avatar_url

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-bold flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-white shadow">
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
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 capitalize">
              {profile?.role ?? 'candidate'}
            </span>
            {memberSince && (
              <span className="text-xs text-gray-400">Member since {memberSince}</span>
            )}
          </div>
        </div>
      </div>

      {/* Editable form */}
      <ProfileForm
        defaultValues={{
          full_name:    profile?.full_name    ?? '',
          phone:        profile?.phone        ?? '',
          location:     profile?.location     ?? '',
          headline:     profile?.headline     ?? '',
          linkedin_url: profile?.linkedin_url ?? '',
          skills:       (profile?.skills ?? []).join(', '),
        }}
      />
    </div>
  )
}
