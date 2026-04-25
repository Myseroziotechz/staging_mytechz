import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { ensureSessionInitialized } from '@/lib/ensure-session'

export default async function RecruiterLayout({ children }) {
  const session = await ensureSessionInitialized()

  if (!session) {
    redirect('/login?returnTo=/recruiter/dashboard')
  }

  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role, is_active')
    .eq('id', session.user.id)
    .single()

  if (!profile || !profile.is_active || profile.role !== 'recruiter') {
    redirect('/')
  }

  return children
}
