import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/layout/AppShell'
import { getNavForRole } from '@/lib/auth/get-role-nav'

export default async function AppLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch role so sidebar/navbar always matches who is logged in
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role ?? 'candidate'
  const { nav, homeHref } = getNavForRole(role)

  return (
    <AppShell user={user} navItems={nav} role={role} homeHref={homeHref}>
      {children}
    </AppShell>
  )
}
