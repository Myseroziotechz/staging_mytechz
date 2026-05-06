import { getAllJobsForAdmin } from '@/lib/admin/queries'
import AdminJobsTable from '@/components/admin/AdminJobsTable'

export const metadata = {
  title: 'All Jobs | Admin',
  description: 'Review, approve, and manage every job on the platform.',
}

export const dynamic = 'force-dynamic'

export default async function AdminJobsPage({ searchParams }) {
  const sp = (await searchParams) || {}
  const { jobs } = await getAllJobsForAdmin({
    status: sp.status || null,
    category: sp.category || null,
    q: sp.q || null,
    date_from: sp.date_from || null,
    date_to: sp.date_to || null,
  })

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-bold text-slate-900">All jobs</h2>
        <p className="mt-1 text-sm text-slate-500">
          Approve pending posts, feature standouts, and close stale ones.
        </p>
      </header>
      <AdminJobsTable jobs={jobs} />
    </div>
  )
}
