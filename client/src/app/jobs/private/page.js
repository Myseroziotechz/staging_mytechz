import { permanentRedirect } from 'next/navigation'

export default function PrivateJobsRedirect() {
  permanentRedirect('/jobs?tab=private')
}
