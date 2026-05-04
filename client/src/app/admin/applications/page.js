import AdminApplicationsTable from '@/components/admin/AdminApplicationsTable'

export const metadata = {
  title: 'Application Logs | Admin Panel',
  description: 'Monitor all candidate applications globally',
}

export default function AdminApplicationsPage() {
  return <AdminApplicationsTable />
}
