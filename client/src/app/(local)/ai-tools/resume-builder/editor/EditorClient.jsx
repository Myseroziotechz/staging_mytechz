'use client'

import ResumeEditor from '@/components/resume/ResumeEditor'

export default function EditorClient({ templateSlug, resumeId }) {
  return <ResumeEditor templateSlug={templateSlug} resumeId={resumeId} />
}
