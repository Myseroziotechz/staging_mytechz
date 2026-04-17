import { createClient } from '@/lib/supabase-server'

export const metadata = {
  title: 'Users - MyTechZ Admin',
}

const ROLE_BADGE = {
  admin: 'bg-purple-50 text-purple-700 border-purple-200',
  recruiter: 'bg-blue-50 text-blue-700 border-blue-200',
  candidate: 'bg-gray-100 text-gray-700 border-gray-200',
}

// Read-only Phase 5 list. 200 most recent. Pagination/search come later.
const PAGE_LIMIT = 200

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: users = [] } = await supabase
    .from('user_profiles')
    .select(
      'id, email, role, full_name, onboarding_completed, is_active, last_login_at, created_at'
    )
    .order('created_at', { ascending: false })
    .limit(PAGE_LIMIT)

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-bold text-gray-900">Users</h2>
        <p className="mt-1 text-sm text-gray-500">
          The {PAGE_LIMIT} most recently created profiles.
        </p>
      </header>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Onboarded</th>
                <th className="px-4 py-3 font-semibold">Last login</th>
                <th className="px-4 py-3 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users && users.length > 0 ? (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className={!u.is_active ? 'opacity-50' : undefined}
                  >
                    <td className="px-4 py-3 align-top">
                      <div className="font-medium text-gray-900">
                        {u.full_name || '—'}
                      </div>
                      <div className="text-gray-500 text-xs mt-0.5 break-all">
                        {u.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${
                          ROLE_BADGE[u.role] || ROLE_BADGE.candidate
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top text-gray-700">
                      {u.role === 'recruiter'
                        ? u.onboarding_completed
                          ? 'Yes'
                          : 'No'
                        : '—'}
                    </td>
                    <td className="px-4 py-3 align-top text-gray-700">
                      {u.last_login_at
                        ? new Date(u.last_login_at).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-4 py-3 align-top text-gray-700">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No users yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
