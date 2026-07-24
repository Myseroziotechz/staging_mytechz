import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import MyResumesClient from './MyResumesClient'

export const metadata = {
  title: 'My Resumes — Resume Builder | MyTechZ',
  description: 'Manage your saved resumes. Edit, duplicate, delete, or export your resumes.',
  robots: 'noindex',
}

export default async function MyResumesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?returnTo=/ai-tools/resume-builder/my-resumes')

  return <MyResumesClient />
}
