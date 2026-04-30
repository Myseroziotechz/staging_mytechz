import { permanentRedirect } from 'next/navigation'

export default function GovernmentJobsRedirect() {
  permanentRedirect('/jobs?tab=government')
}
