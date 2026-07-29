import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProfileForm from './ProfileForm.jsx'
import ProfileHeader from './components/ProfileHeader'

export const metadata = {
  title: 'My Profile',
  description: 'Manage your MyTechZ profile — your summary, education, projects and skills.',
  robots: { index: false, follow: false },
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // maybeSingle, not single: a user whose profile row hasn't been created yet
  // should still see the page (with empty sections) rather than a thrown error.
  //
  // `about:profile_summary` — the DB column is profile_summary, not about (see
  // src/app/api/profile/about/route.js's COLUMN_ALIAS). Selecting a literal
  // `about` column here silently failed the whole query: PostgREST rejects a
  // select naming a column that doesn't exist, `error` was never checked, and
  // `profile` came back null — so the server-rendered page never actually had
  // the user's name, headline, or any other detail on first load, even though
  // AboutSection's own client-side fetch (which does alias it) papered over
  // it milliseconds later.
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select(
      'id, full_name, phone, location, headline, about:profile_summary, ' +
      'linkedin_url, github_url, portfolio_url, avatar_url, email, role, created_at',
    )
    .eq('id', user.id)
    .maybeSingle()

  if (profileError) {
    console.error('[profile] failed to load user_profiles row:', profileError)
  }

  const avatar =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    profile?.avatar_url ||
    null

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-10">
      <ProfileHeader
        profile={profile}
        email={profile?.email || user.email}
        avatar={avatar}
      />
      <ProfileForm userId={user.id} profile={profile} />
    </div>
  )
}
