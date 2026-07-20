'use client'

import { useMemo } from 'react'
import { SAMPLE_RESUME_DATA } from '@/lib/resume/sample-data'

/**
 * Full-size rendered preview of a template using sample data.
 * Used on the template detail page.
 */
export default function TemplateDetailPreview({ htmlTemplate }) {
  const html = useMemo(() => {
    if (!htmlTemplate) return ''
    return renderFull(htmlTemplate, SAMPLE_RESUME_DATA)
  }, [htmlTemplate])

  return <div className="bg-white" dangerouslySetInnerHTML={{ __html: html }} />
}

function renderFull(tmpl, data) {
  let html = tmpl

  if (data.skills?.length) {
    html = html.replace(/\{\{skills_joined\}\}/g, esc(data.skills.join(' · ')))
  } else {
    html = html.replace(/\{\{skills_joined\}\}/g, '')
  }

  html = processBlocks(html, data, 0)

  html = html.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, path) => {
    const val = getVal(data, path)
    if (val == null || val === '') return ''
    return esc(String(val))
  })

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
          if (typeof item === 'string') return content.replace(/\{\{\.\}\}/g, esc(item))
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
