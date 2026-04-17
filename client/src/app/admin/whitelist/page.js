import { createClient } from '@/lib/supabase-server'
import AddAdminEmailForm from '@/components/admin/AddAdminEmailForm'
import RemoveAdminEmailButton from '@/components/admin/RemoveAdminEmailButton'

export const metadata = {
  title: 'Admin Emails - MyTechZ Admin',
}

export default async function AdminWhitelistPage() {
  const supabase = await createClient()

  const { data: entries = [] } = await supabase
    .from('admin_whitelist')
    .select('email, note, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-xl font-bold text-gray-900">Admin Emails</h2>
        <p className="mt-1 text-sm text-gray-500">
          Listed emails are auto-promoted to admin on their next sign-in. Adding
          an email of an existing user promotes them immediately. Removal does
          not demote existing admins.
        </p>
      </header>

      <section className="bg-white border border-gray-200 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Add admin</h3>
        <AddAdminEmailForm />
      </section>

      <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">
            Current whitelist ({entries?.length ?? 0})
          </h3>
        </div>

        {entries && entries.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {entries.map((e) => (
              <li
                key={e.email}
                className="px-5 py-4 flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 break-all">{e.email}</p>
                  {e.note && (
                    <p className="mt-0.5 text-sm text-gray-500">{e.note}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-400">
                    Added {new Date(e.created_at).toLocaleDateString()}
                  </p>
                </div>
                <RemoveAdminEmailButton email={e.email} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-5 py-8 text-sm text-gray-500 text-center">
            No admin emails yet.
          </div>
        )}
      </section>
    </div>
  )
}
