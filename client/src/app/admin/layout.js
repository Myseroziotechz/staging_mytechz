import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { ensureSessionInitialized } from '@/lib/ensure-session'

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
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
              Admin
            </p>
            <h1 className="text-lg font-bold text-gray-900">MyTechZ Control</h1>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {profile.full_name || 'Admin'}
            </p>
            <p className="text-xs text-gray-500">{profile.email}</p>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
