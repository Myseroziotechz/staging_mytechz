import AdminApplicationsTable from '@/components/admin/AdminApplicationsTable'
import { getAllApplicationsForAdmin } from '@/lib/admin/queries'

export const metadata = {
  title: 'Applications | Admin',
  description: 'Monitor every candidate application across the platform',
}

export const dynamic = 'force-dynamic'

export default async function AdminApplicationsPage({ searchParams }) {
  const sp = (await searchParams) || {}
  const { applications } = await getAllApplicationsForAdmin({
    status: sp.status || null,
    job_id: sp.job_id || null,
    date_from: sp.date_from || null,
    date_to: sp.date_to || null,
  })

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-xl font-bold text-slate-900">Applications</h2>
        <p className="mt-1 text-sm text-slate-500">
          Every candidate application across the platform — filter and review.
        </p>
      </header>
      <AdminApplicationsTable applications={applications} />
    </div>
  )
}
