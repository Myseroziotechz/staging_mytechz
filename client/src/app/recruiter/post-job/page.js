import JobForm from '@/components/jobs/JobForm'
import { createJobAction } from './actions'

export const metadata = {
  title: 'Post a Job | MyTechZ Recruiter',
  description: 'Create a new job posting on MyTechZ',
}

export default function PostJobPage() {
  return <JobForm mode="recruiter" action={createJobAction} />
}
