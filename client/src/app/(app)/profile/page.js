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
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id, full_name, phone, location, headline, about, linkedin_url, avatar_url, email, role, created_at')
    .eq('id', user.id)
    .maybeSingle()

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
