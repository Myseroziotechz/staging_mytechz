/** Common CTC tiers for pre-filled SEO landing pages, shared between the [lpa] route and sitemap.js. */
export const LPA_TIERS = [6, 8, 10, 12, 15, 20, 25, 30, 40, 50]

export function lpaSlug(lpa) {
  return `${lpa}-lpa-in-hand-salary`
}

export function parseLpaSlug(slug) {
  const match = String(slug || '').match(/^(\d+(?:\.\d+)?)-lpa-in-hand-salary$/)
  return match ? Number(match[1]) : null
}
