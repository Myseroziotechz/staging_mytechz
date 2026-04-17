import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'

export const metadata = {
  title: 'Admin Overview - MyTechZ',
  description: 'Administer MyTechZ users, recruiters, and platform settings.',
}

async function countWhere(supabase, query) {
  const { count } = await query.select('*', { count: 'exact', head: true })
  return count ?? 0
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [totalUsers, candidates, recruiters, admins, whitelisted] = await Promise.all([
    countWhere(supabase, supabase.from('user_profiles')),
    countWhere(supabase, supabase.from('user_profiles').eq('role', 'candidate')),
    countWhere(supabase, supabase.from('user_profiles').eq('role', 'recruiter')),
    countWhere(supabase, supabase.from('user_profiles').eq('role', 'admin')),
    countWhere(supabase, supabase.from('admin_whitelist')),
  ])

  const cards = [
    { label: 'Total users', value: totalUsers },
    { label: 'Candidates', value: candidates },
    { label: 'Recruiters', value: recruiters },
    { label: 'Admins', value: admins },
  ]

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900">Overview</h2>
        <p className="mt-1 text-sm text-gray-500">
          A snapshot of platform activity.
        </p>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white border border-gray-200 rounded-xl p-5"
          >
            <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
              {c.label}
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900 tabular-nums">
              {c.value.toLocaleString()}
            </p>
          </div>
        ))}
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/admin/whitelist"
          className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-600 hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">
              Admin Emails
            </h3>
            <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {whitelisted}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Add or remove emails that are auto-promoted to admin on sign-in.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 group-hover:text-blue-800">
            Manage whitelist
            <span aria-hidden="true">→</span>
          </span>
        </Link>

        <Link
          href="/admin/users"
          className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-600 hover:shadow-sm transition-all"
        >
          <h3 className="text-base font-semibold text-gray-900">Users</h3>
          <p className="mt-2 text-sm text-gray-500">
            Browse every user on the platform and their role.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 group-hover:text-blue-800">
            View users
            <span aria-hidden="true">→</span>
          </span>
        </Link>
      </section>
    </div>
  )
}
