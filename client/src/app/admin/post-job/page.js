import JobForm from '@/components/jobs/JobForm'
import { adminCreateJobAction } from './actions'

export const metadata = {
  title: 'Create Job Card | Admin Panel',
  description: 'Create global job posts from the admin dashboard',
}

export default function AdminPostJobPage() {
  return <JobForm mode="admin" action={adminCreateJobAction} />
}
