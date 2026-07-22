'use client'

import { useMemo } from 'react'

/**
 * ATS Parsing Preview — shows the parsed plain text with highlighted matched/missing keywords.
 * Helps users understand what ATS actually reads from their resume.
 */
export default function ParsedPreview({ resumeText = '', keywords = {} }) {
  const matched = useMemo(() => new Set((keywords.matched || []).map((k) => k.toLowerCase())), [keywords.matched])
  const missing = useMemo(() => new Set((keywords.missing || []).map((k) => k.toLowerCase())), [keywords.missing])

  const highlightedLines = useMemo(() => {
    if (!resumeText) return []
    const lines = resumeText.split('\n')
    return lines.map((line) => highlightLine(line, matched, missing))
  }, [resumeText, matched, missing])

  if (!resumeText) return null

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">What ATS Reads</h3>
      <p className="text-[11px] text-gray-400 mb-4">
        This is the plain text ATS systems extract from your resume.
        <span className="inline-flex items-center gap-1 ml-2">
          <span className="px-1 bg-green-100 text-green-700 rounded text-[10px]">matched</span>
          <span className="px-1 bg-red-100 text-red-600 rounded text-[10px] underline decoration-red-400 decoration-wavy">missing</span>
        </span>
      </p>
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 max-h-[400px] overflow-y-auto font-mono text-xs leading-relaxed">
        {highlightedLines.map((fragments, lineIdx) => (
          <div key={lineIdx} className={`${isSectionHeader(resumeText.split('\n')[lineIdx]) ? 'font-bold text-gray-900 mt-3 mb-1 text-sm' : 'text-gray-700'}`}>
            {fragments.length === 0 ? <br /> : fragments.map((frag, fragIdx) => (
              <span key={fragIdx} className={frag.type === 'matched' ? 'bg-green-100 text-green-800 px-0.5 rounded' : frag.type === 'missing' ? 'bg-red-100 text-red-700 px-0.5 rounded underline decoration-red-400 decoration-wavy' : ''}>
                {frag.text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function isSectionHeader(line) {
  if (!line) return false
  const trimmed = line.trim()
  return /^(summary|objective|profile|experience|employment|work history|education|skills|technologies|tech stack|competencies|projects|certifications|about me|professional summary|technical skills|core competencies)[\s:—\-]*$/i.test(trimmed)
}

/**
 * Highlight a line of text, marking matched and missing keywords.
 * Returns an array of { text, type } fragments.
 */
function highlightLine(line, matchedSet, missingSet) {
  if (!line.trim()) return []

  const lower = line.toLowerCase()
  const allKeywords = [...matchedSet, ...missingSet]

  // Sort keywords by length descending so longer phrases match first
  allKeywords.sort((a, b) => b.length - a.length)

  // Find all keyword positions in this line
  const highlights = []
  for (const kw of allKeywords) {
    let idx = 0
    while ((idx = lower.indexOf(kw, idx)) !== -1) {
      const type = matchedSet.has(kw) ? 'matched' : 'missing'
      highlights.push({ start: idx, end: idx + kw.length, type })
      idx += kw.length
    }
  }

  if (highlights.length === 0) return [{ text: line, type: 'normal' }]

  // Sort by start position, merge overlapping
  highlights.sort((a, b) => a.start - b.start)
  const merged = [highlights[0]]
  for (let i = 1; i < highlights.length; i++) {
    const prev = merged[merged.length - 1]
    if (highlights[i].start < prev.end) {
      // Overlapping — extend if needed, prefer matched
      prev.end = Math.max(prev.end, highlights[i].end)
      if (highlights[i].type === 'matched') prev.type = 'matched'
    } else {
      merged.push(highlights[i])
    }
  }

  // Build fragments
  const fragments = []
  let cursor = 0
  for (const h of merged) {
    if (h.start > cursor) {
      fragments.push({ text: line.slice(cursor, h.start), type: 'normal' })
    }
    fragments.push({ text: line.slice(h.start, h.end), type: h.type })
    cursor = h.end
  }
  if (cursor < line.length) {
    fragments.push({ text: line.slice(cursor), type: 'normal' })
  }

  return fragments
}
