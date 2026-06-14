import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ensureSessionInitialized } from '@/lib/auth/ensure-session'
import AppShell from '@/components/layout/AppShell'
import { ADMIN_NAV } from '@/config/navigation'

export default async function AdminLayout({ children }) {
  const session = await ensureSessionInitialized()

  if (!session) {
    redirect('/login?returnTo=/admin/dashboard')
  }

  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, is_active, full_name, email')
    .eq('id', session.user.id)
    .single()

  if (!profile || !profile.is_active || profile.role !== 'admin') {
    redirect('/')
  }

  return (
    <AppShell user={session.user} navItems={ADMIN_NAV}>
      {children}
    </AppShell>
  )
}
