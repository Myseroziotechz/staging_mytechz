/**
 * Shared resume template engine — recursive `{{field}}` / `{{#block}}` renderer.
 *
 * Previously duplicated near-identically across ResumePreview.jsx,
 * TemplatePreviewThumb.jsx, and TemplateDetailPreview.jsx. One copy now, so
 * the editor, template-gallery thumbnails, and template detail page always
 * render a given template identically.
 */

export function renderResumeTemplate(tmpl, data, { editable = false } = {}) {
  if (!tmpl) return ''
  let html = tmpl
  data = data || {}

  if (data.skills?.length) {
    html = html.replace(/\{\{skills_joined\}\}/g, esc(data.skills.join(' · ')))
  } else {
    html = html.replace(/\{\{skills_joined\}\}/g, '')
  }

  html = processBlocks(html, data, editable)

  html = html.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, path) => {
    const val = getNestedValue(data, path)
    if (val === undefined || val === null || val === '') return ''
    if (editable) return editableSpan(path, String(val))
    return esc(String(val))
  })

  html = html.replace(/\{\{[^}]+\}\}/g, '')

  return html
}

function processBlocks(html, data, editable, depth = 0) {
  if (depth > 5) return html

  const blockRegex = /\{\{#(\w+(?:\.\w+)?)\}\}([\s\S]*?)\{\{\/\1\}\}/g
  let changed = false

  const result = html.replace(blockRegex, (match, key, content) => {
    changed = true
    const val = getNestedValue(data, key)

    if (val === undefined || val === null || val === false || val === '') return ''
    if (val === 0) return ''
    if (Array.isArray(val) && val.length === 0) return ''

    if (Array.isArray(val)) {
      return val
        .map((item, idx) => {
          if (typeof item === 'string') {
            return content.replace(/\{\{\.\}\}/g, editable ? editableSpan(`${key}.${idx}`, item) : esc(item))
          }
          let itemHtml = content
          itemHtml = processBlocks(itemHtml, item, editable, depth + 1)
          itemHtml = itemHtml.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, fieldPath) => {
            const fieldVal = getNestedValue(item, fieldPath)
            if (fieldVal === undefined || fieldVal === null || fieldVal === '') return ''
            if (editable) return editableSpan(`${key}.${idx}.${fieldPath}`, String(fieldVal))
            return esc(String(fieldVal))
          })
          return itemHtml
        })
        .join('')
    }

    return content
  })

  if (changed) return processBlocks(result, data, editable, depth + 1)
  return result
}

function editableSpan(path, text) {
  return `<span contenteditable="true" data-field="${path}" style="outline:none;min-width:20px;display:inline-block;border-bottom:1px dashed transparent;cursor:text;" onfocus="this.style.borderBottomColor='#3b82f6'" onblur="this.style.borderBottomColor='transparent'">${esc(text)}</span>`
}

export function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

export function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
