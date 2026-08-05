import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SettingsPageClient from './SettingsPageClient'

export const metadata = {
  title: 'Settings',
  description: 'Manage your MyTechZ account, preferences, and privacy.',
  robots: { index: false, follow: false },
}

const SETTINGS_DEFAULTS = {
  profile_public: true, show_email: false, show_phone: false, searchable: true,
  preferred_roles: [], preferred_locations: [], work_mode: null, employment_type: null,
  notify_job_alerts: true, notify_application_updates: true, notify_saved_job_reminders: true,
  notify_profile_reminders: true, notify_product_updates: false,
  email_notifications_enabled: true, in_app_notifications_enabled: true,
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?returnTo=/settings')

  const [{ data: profile }, { data: settings }] = await Promise.all([
    supabase
      .from('user_profiles')
      .select('full_name, phone, location, headline, avatar_url')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle(),
  ])

  const avatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || profile?.avatar_url || null

  return (
    <SettingsPageClient
      email={user.email}
      profile={{ ...profile, avatar_url: avatar }}
      settings={settings || SETTINGS_DEFAULTS}
      providers={user.app_metadata?.providers || (user.app_metadata?.provider ? [user.app_metadata.provider] : ['email'])}
      lastSignInAt={user.last_sign_in_at}
    />
  )
}
