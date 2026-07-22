'use client'

import { useMemo } from 'react'
import { SAMPLE_RESUME_DATA } from '@/lib/resume/sample-data'

/**
 * Renders a scaled-down thumbnail preview of a resume template
 * using sample data. Used in the template gallery cards.
 */
export default function TemplatePreviewThumb({ htmlTemplate }) {
  const html = useMemo(() => {
    if (!htmlTemplate) return ''
    return renderForThumb(htmlTemplate, SAMPLE_RESUME_DATA)
  }, [htmlTemplate])

  return (
    <div className="w-full h-full relative overflow-hidden bg-white">
      {/* Scale the full-size template down to fit the card */}
      <div
        className="absolute top-0 left-0 origin-top-left bg-white"
        style={{
          width: '800px',
          transform: 'scale(0.35)',
          transformOrigin: 'top left',
        }}
      >
        <div className="bg-white" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  )
}

/**
 * Simplified renderer for thumbnails (no contenteditable, no interactivity).
 */
function renderForThumb(tmpl, data) {
  let html = tmpl

  // skills_joined
  if (data.skills?.length) {
    html = html.replace(/\{\{skills_joined\}\}/g, esc(data.skills.join(' · ')))
  } else {
    html = html.replace(/\{\{skills_joined\}\}/g, '')
  }

  // Process blocks recursively
  html = processBlocks(html, data, 0)

  // Final field substitution
  html = html.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, path) => {
    const val = getVal(data, path)
    if (val === undefined || val === null || val === '') return ''
    return esc(String(val))
  })

  // Clean up remaining tags
  html = html.replace(/\{\{[^}]+\}\}/g, '')

  return html
}

function processBlocks(html, data, depth) {
  if (depth > 5) return html

  const re = /\{\{#(\w+(?:\.\w+)?)\}\}([\s\S]*?)\{\{\/\1\}\}/g
  let changed = false

  const result = html.replace(re, (_, key, content) => {
    changed = true
    const val = getVal(data, key)

    if (!val || (Array.isArray(val) && val.length === 0) || val === 0) return ''

    if (Array.isArray(val)) {
      return val
        .map((item) => {
          if (typeof item === 'string') {
            return content.replace(/\{\{\.\}\}/g, esc(item))
          }
          let out = processBlocks(content, item, depth + 1)
          out = out.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, fp) => {
            const fv = getVal(item, fp)
            return fv == null || fv === '' ? '' : esc(String(fv))
          })
          return out
        })
        .join('')
    }

    return content
  })

  if (changed) return processBlocks(result, data, depth + 1)
  return result
}

function getVal(obj, path) {
  return path.split('.').reduce((a, k) => a?.[k], obj)
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
