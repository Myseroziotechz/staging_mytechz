import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditorClient from './EditorClient'

export const metadata = {
  title: 'Resume Editor — Build Your Resume | MyTechZ',
  description: 'Build your professional resume with our multi-step editor. Fill in your details, preview in real-time, and download as PDF or DOCX.',
  robots: 'noindex',
}

export default async function EditorPage({ searchParams }) {
  // Auth guard
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?returnTo=/ai-tools/resume-builder/editor')

  const sp = await searchParams
  const template = sp?.template || 'classic'
  const resumeId = sp?.resumeId || null

  return <EditorClient templateSlug={template} resumeId={resumeId} />
}
