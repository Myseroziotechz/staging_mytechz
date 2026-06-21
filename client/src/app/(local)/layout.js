/**
 * (local) layout — Auth-aware.
 *
 * - Logged-in users  → AppShell with sidebar (correct nav per role)
 * - Public users     → Navbar + Footer
 *
 * Pages: homepage, about, services, login, jobs/*, ai-tools/*, contact
 */
import { createClient } from '@/lib/supabase/server'
import AppShell from '@/components/layout/AppShell'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FloatingAIChat from '@/components/ai/FloatingAIChat'
import { getNavForRole } from '@/lib/auth/get-role-nav'

export default async function LocalLayout({ children }) {
  let user = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data?.user ?? null
  } catch {
    // ignore — e.g. during static generation
  }

  // Public (not logged in) — render with public navbar + footer
  if (!user) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
        <FloatingAIChat />
      </>
    )
  }

  // Authenticated — fetch role and render with app shell + sidebar
  const supabase = await createClient()
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
