'use client'

import { forwardRef, useMemo, useCallback, useRef, useEffect } from 'react'

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
    return renderTemplate(template, resumeData || {}, editable)
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

// ────────────────────────────────────────────────────────────────
// Template engine — recursive, handles nested blocks properly
// ────────────────────────────────────────────────────────────────

function renderTemplate(tmpl, data, editable = false) {
  let html = tmpl

  // Pre-compute helpers
  if (data.skills?.length) {
    html = html.replace(/\{\{skills_joined\}\}/g, esc(data.skills.join(' · ')))
  } else {
    html = html.replace(/\{\{skills_joined\}\}/g, '')
  }

  // Process all block tags recursively (multiple passes for nesting)
  html = processBlocks(html, data, editable)

  // Final field substitution
  html = html.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, path) => {
    const val = getNestedValue(data, path)
    if (val === undefined || val === null || val === '') return ''
    if (editable) {
      return `<span contenteditable="true" data-field="${path}" style="outline:none;min-width:20px;display:inline-block;border-bottom:1px dashed transparent;cursor:text;" onfocus="this.style.borderBottomColor='#3b82f6'" onblur="this.style.borderBottomColor='transparent'">${esc(String(val))}</span>`
    }
    return esc(String(val))
  })

  // Clean up any remaining unresolved tags
  html = html.replace(/\{\{[^}]+\}\}/g, '')

  return html
}

/**
 * Recursively process {{#key}}...{{/key}} blocks.
 * Runs up to 5 passes to handle nesting (inner blocks revealed after outer resolves).
 */
function processBlocks(html, data, editable, depth = 0) {
  if (depth > 5) return html

  const blockRegex = /\{\{#(\w+(?:\.\w+)?)\}\}([\s\S]*?)\{\{\/\1\}\}/g
  let changed = false

  const result = html.replace(blockRegex, (match, key, content) => {
    changed = true
    const val = getNestedValue(data, key)

    // Falsy / empty → remove block
    if (val === undefined || val === null || val === false || val === '') return ''
    if (val === 0) return ''
    if (Array.isArray(val) && val.length === 0) return ''

    // Array → iterate
    if (Array.isArray(val)) {
      return val
        .map((item, idx) => {
          if (typeof item === 'string') {
            let itemHtml = content.replace(/\{\{\.\}\}/g, editable
              ? `<span contenteditable="true" data-field="${key}.${idx}" style="outline:none;min-width:20px;display:inline-block;border-bottom:1px dashed transparent;cursor:text;" onfocus="this.style.borderBottomColor='#3b82f6'" onblur="this.style.borderBottomColor='transparent'">${esc(item)}</span>`
              : esc(item)
            )
            return itemHtml
          }
          // Object item — replace fields and process nested blocks
          let itemHtml = content
          // Process nested blocks within this item
          itemHtml = processBlocks(itemHtml, item, editable, depth + 1)
          // Replace {{field}} with item values
          itemHtml = itemHtml.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, fieldPath) => {
            const fieldVal = getNestedValue(item, fieldPath)
            if (fieldVal === undefined || fieldVal === null || fieldVal === '') return ''
            if (editable) {
              return `<span contenteditable="true" data-field="${key}.${idx}.${fieldPath}" style="outline:none;min-width:20px;display:inline-block;border-bottom:1px dashed transparent;cursor:text;" onfocus="this.style.borderBottomColor='#3b82f6'" onblur="this.style.borderBottomColor='transparent'">${esc(String(fieldVal))}</span>`
            }
            return esc(String(fieldVal))
          })
          return itemHtml
        })
        .join('')
    }

    // Truthy scalar (number > 0, true, non-empty string) → show content
    return content
  })

  // If we made replacements, run another pass (nested blocks may now be exposed)
  if (changed) {
    return processBlocks(result, data, editable, depth + 1)
  }

  return result
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

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

function esc(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
