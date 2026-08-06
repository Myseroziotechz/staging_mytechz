'use client'

import { forwardRef, useMemo, useCallback, useRef, useEffect } from 'react'
import { renderResumeTemplate } from '@/lib/resume/render-template'

/**
 * Live HTML preview renderer for resume templates.
 * Supports inline contenteditable editing when onDataChange is provided.
 */
const ResumePreview = forwardRef(function ResumePreview(
  { template, resumeData, className = '', editable = false, onDataChange },
  ref
) {
  const innerRef = useRef(null)
  const combinedRef = useCallback(
    (node) => {
      innerRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )

  const html = useMemo(() => {
    if (!template)
      return '<p style="color:#999;text-align:center;padding:40px">Select a template to preview</p>'
    return renderResumeTemplate(template, resumeData || {}, { editable })
  }, [template, resumeData, editable])

  // Handle contenteditable blur → sync back to data
  useEffect(() => {
    if (!editable || !onDataChange || !innerRef.current) return

    function handleBlur(e) {
      const el = e.target
      const path = el.getAttribute('data-field')
      if (!path) return

      const newValue = el.innerText.trim()
      const updated = deepClone(resumeData)
      setNestedValue(updated, path, newValue)
      onDataChange(updated)
    }

    const container = innerRef.current
    container.addEventListener('blur', handleBlur, true)
    return () => container.removeEventListener('blur', handleBlur, true)
  }, [editable, onDataChange, resumeData])

  return (
    <div
      ref={combinedRef}
      className={`bg-white shadow-lg ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
})

export default ResumePreview

function setNestedValue(obj, path, value) {
  const keys = path.split('.')
  let current = obj
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]
    const nextKey = keys[i + 1]
    if (current[k] === undefined) {
      current[k] = /^\d+$/.test(nextKey) ? [] : {}
    }
    current = current[k]
  }
  current[keys[keys.length - 1]] = value
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}
