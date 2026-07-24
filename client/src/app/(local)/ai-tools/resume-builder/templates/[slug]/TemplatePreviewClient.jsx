'use client'

import TemplatePreview from '@/components/resume/TemplatePreview'
import { SAMPLE_RESUME_DATA } from '@/lib/resume/schema'

export default function TemplatePreviewClient({ slug }) {
  return <TemplatePreview slug={slug} data={SAMPLE_RESUME_DATA} scale={0.65} />
}
