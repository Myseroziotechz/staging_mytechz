/**
 * Computes safe page-break Y-coordinates for slicing a tall rendered resume
 * into A4-sized PDF pages without cutting through the middle of any text.
 *
 * The naive approach (just slice every `pageHeightPx`) can cut a heading,
 * bullet, or name in half. Instead: collect every "leaf" element (nodes with
 * no element children — headings, spans, list items, paragraphs — the
 * atomic units that must never be split), and only accept a break at a Y
 * where no leaf's bounding box straddles it. This also handles templates
 * with a two-column layout correctly, since it checks every leaf across the
 * full width, not just one column.
 */
export function computeSafeBreaks(rootEl, pageHeightPx) {
  const rootRect = rootEl.getBoundingClientRect()
  const totalHeightPx = rootEl.scrollHeight

  const leaves = Array.from(rootEl.querySelectorAll('*')).filter((el) => el.children.length === 0)
  const intervals = leaves
    .map((el) => {
      const r = el.getBoundingClientRect()
      return [r.top - rootRect.top, r.bottom - rootRect.top]
    })
    .filter(([top, bottom]) => bottom > top)

  const straddles = (y) => intervals.some(([top, bottom]) => top < y && y < bottom)

  const breaks = [0]
  let cursor = 0

  while (cursor < totalHeightPx - 0.5) {
    let candidate = Math.min(cursor + pageHeightPx, totalHeightPx)

    if (candidate < totalHeightPx) {
      let safe = candidate
      while (safe > cursor && straddles(safe)) safe -= 1
      // No safe gap found within this page's budget (a single leaf taller
      // than one page) — fall back to a hard cut rather than looping forever.
      candidate = safe > cursor ? safe : candidate
    }

    breaks.push(candidate)
    cursor = candidate
  }

  return breaks
}
