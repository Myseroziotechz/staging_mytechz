import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { ensureSessionInitialized } from '@/lib/ensure-session'

// Strict admin-only gate + admin chrome (nav + container).
// Runs on every /admin/* render. Proxy has already ensured a session exists.
const NAV = [
  { href: '/admin/dashboard', label: 'Overview' },
  { href: '/admin/recruiters', label: 'Recruiters' },
  { href: '/admin/whitelist', label: 'Admin Emails' },
  { href: '/admin/users', label: 'Users' },
]

export default async function AdminLayout({ children }) {
  // Ensure the session RPC has run (handles admin whitelist promotion)
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
        <nav className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300 -mb-px transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
