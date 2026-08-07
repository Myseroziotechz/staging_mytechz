'use client'

import { forwardRef } from 'react'
import ResumePreview from '@/components/resume-builder/ResumePreview'

/**
 * Thin adapter over the resume builder's live preview renderer — that
 * component (and the `{{field}}`/`{{#block}}` engine underneath it) has no
 * resume-specific logic, it just renders whatever template + data object
 * it's given. This wrapper only exists so cover-letter editor code reads as
 * cover-letter code (`data` instead of `resumeData`) rather than importing
 * something visibly named "Resume" — the rendering/editing logic itself is
 * not duplicated.
 */
const CoverLetterPreview = forwardRef(function CoverLetterPreview(
  { template, data, className = '', editable = false, onDataChange },
  ref
) {
  return (
    <ResumePreview
      ref={ref}
      template={template}
      resumeData={data}
      className={className}
      editable={editable}
      onDataChange={onDataChange}
    />
  )
})

export default CoverLetterPreview
