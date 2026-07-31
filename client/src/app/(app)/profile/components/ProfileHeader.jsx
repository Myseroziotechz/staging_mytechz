import { initialsFrom } from '../lib/format'

/**
 * Identity banner at the top of the profile — avatar, name, headline, role.
 * Server component: it renders from data the page already fetched, so it adds
 * no client JS and no extra round trip.
 */
export default function ProfileHeader({ profile, email, avatar }) {
  const displayName = profile?.full_name?.trim() || email || 'Your Profile'
  const initials = initialsFrom(profile?.full_name || email)

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-IN', {
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <header className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-bold flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-white shadow">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatar}
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        ) : (
          <span aria-hidden="true">{initials}</span>
        )}
      </div>

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
