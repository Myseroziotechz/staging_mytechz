import { createClient } from '@/lib/supabase-server'
import RecruiterVerifyButton from '@/components/admin/RecruiterVerifyButton'
import RecruiterRejectButton from '@/components/admin/RecruiterRejectButton'

export const metadata = {
  title: 'Recruiters - MyTechZ Admin',
}

const STATUS_BADGE = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  verified: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
}

export default async function AdminRecruitersPage() {
  const supabase = await createClient()

  // Join recruiter_profiles with user_profiles to get name/email.
  const { data: recruiters = [] } = await supabase
    .from('recruiter_profiles')
    .select(`
      user_id,
      company_name,
      industry,
      company_size,
      verification_status,
      created_at,
      user_profiles!inner ( full_name, email )
    `)
    .order('created_at', { ascending: false })

  const pending = recruiters.filter((r) => r.verification_status === 'pending')
  const verified = recruiters.filter((r) => r.verification_status === 'verified')
  const rejected = recruiters.filter((r) => r.verification_status === 'rejected')

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-xl font-bold text-gray-900">Recruiters</h2>
        <p className="mt-1 text-sm text-gray-500">
          Review and verify recruiter company profiles. Verified recruiters can post jobs.
        </p>
        <div className="mt-3 flex gap-2">
          <CountBadge label="Pending" count={pending.length} cls="bg-amber-50 text-amber-700" />
          <CountBadge label="Verified" count={verified.length} cls="bg-green-50 text-green-700" />
          <CountBadge label="Rejected" count={rejected.length} cls="bg-red-50 text-red-700" />
        </div>
      </header>

      {/* Pending section — highlight */}
      {pending.length > 0 && (
        <Section title="Pending Verification" border="border-amber-200" bg="bg-amber-50/30">
          {pending.map((r) => (
            <RecruiterRow key={r.user_id} recruiter={r} showActions />
          ))}
        </Section>
      )}

      {/* All recruiters */}
      <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">
            All Recruiters ({recruiters.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Company</th>
                <th className="px-5 py-3 font-semibold">Contact</th>
                <th className="px-5 py-3 font-semibold">Industry</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recruiters.length > 0 ? (
                recruiters.map((r) => (
                  <tr key={r.user_id}>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-gray-900">{r.company_name}</div>
                      {r.company_size && (
                        <div className="text-xs text-gray-500 mt-0.5">{r.company_size} employees</div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-gray-900">{r.user_profiles?.full_name || '—'}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{r.user_profiles?.email}</div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-700">{r.industry || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${STATUS_BADGE[r.verification_status] || STATUS_BADGE.pending}`}>
                        {r.verification_status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {r.verification_status === 'pending' ? (
                        <div className="flex gap-2">
                          <RecruiterVerifyButton userId={r.user_id} />
                          <RecruiterRejectButton userId={r.user_id} />
                        </div>
                      ) : r.verification_status === 'rejected' ? (
                        <RecruiterVerifyButton userId={r.user_id} />
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-500">
                    No recruiters yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function CountBadge({ label, count, cls }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {label}: {count}
    </span>
  )
}

function Section({ title, border, bg, children }) {
  return (
    <section className={`border ${border} rounded-2xl overflow-hidden ${bg}`}>
      <div className={`px-5 py-3.5 border-b ${border} flex items-center gap-2`}>
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="divide-y divide-gray-100 bg-white">{children}</div>
    </section>
  )
}

function RecruiterRow({ recruiter: r, showActions }) {
  return (
    <div className="px-5 py-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="font-medium text-gray-900">{r.company_name}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {r.user_profiles?.full_name || r.user_profiles?.email}
          {r.industry ? ` · ${r.industry}` : ''}
          {' · Applied '}
          {new Date(r.created_at).toLocaleDateString()}
        </p>
      </div>
      {showActions && (
        <div className="flex gap-2 shrink-0">
          <RecruiterVerifyButton userId={r.user_id} />
          <RecruiterRejectButton userId={r.user_id} />
        </div>
      )}
    </div>
  )
}
