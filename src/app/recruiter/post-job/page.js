import JobForm from '@/components/jobs/JobForm'
import { createJobAction } from './actions'

export const metadata = {
  title: 'Post a Job',
  description: 'Create a new job posting on MyTechZ',
  robots: { index: false, follow: false },
}

export default function PostJobPage() {
  return <JobForm mode="recruiter" action={createJobAction} />
}
