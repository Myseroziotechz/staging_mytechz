import Avatar from '@/components/ui/Avatar'

/**
 * Identity banner at the top of the profile — avatar, name, headline, role.
 * Server component: it renders from data the page already fetched, so it adds
 * no client JS and no extra round trip (Avatar itself is a small client
 * component for the broken-image fallback, which Next.js renders fine here).
 */
export default function ProfileHeader({ profile, email, avatar }) {
  const displayName = profile?.full_name?.trim() || email || 'Your Profile'

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-IN', {
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <header className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
      <Avatar src={avatar} name={profile?.full_name || email} size="lg" className="ring-2 ring-white shadow" />

      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-bold text-gray-900 truncate">{displayName}</h1>
        {profile?.headline && (
          <p className="text-sm text-gray-600 truncate">{profile.headline}</p>
        )}
        {email && <p className="text-sm text-gray-500 truncate">{email}</p>}

        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 capitalize">
            {profile?.role ?? 'candidate'}
          </span>
          {profile?.location && (
            <span className="text-xs text-gray-400">{profile.location}</span>
          )}
          {memberSince && (
            <span className="text-xs text-gray-400">Member since {memberSince}</span>
          )}
        </div>
      </div>
    </header>
  )
}
