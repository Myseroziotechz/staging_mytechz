/**
 * Shared filename utilities — used by both the resume and cover-letter
 * export flows so downloaded files are named consistently everywhere.
 */

const INVALID_FS_CHARS = /[/\\:*?"<>|]/g

/**
 * Sanitizes a display name (e.g. a person's full name) into a safe
 * filename fragment: invalid characters become spaces, then any run of
 * whitespace/dots collapses into a single underscore, with leading/trailing
 * underscores trimmed.
 *
 *   "Varsha M R"    -> "Varsha_M_R"
 *   "Varsha  M.R."  -> "Varsha_M_R"
 *   "John / Smith"  -> "John_Smith"
 */
export function sanitizeForFilename(value) {
  if (!value) return ''
  return String(value)
    .trim()
    .replace(INVALID_FS_CHARS, ' ')
    .replace(/[.\s]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

/**
 * Builds a `<name>_<kind>` filename base (without extension) from a user's
 * display name, falling back to an existing document title, then to a bare
 * `kind` label — so a missing name never produces `undefined_resume` or a
 * lone `_resume`.
 *
 *   buildExportFilenameBase({ userName: 'Varsha M R', kind: 'resume' })
 *     -> 'Varsha_M_R_resume'
 *   buildExportFilenameBase({ userName: '', fallbackTitle: 'My Draft', kind: 'resume' })
 *     -> 'My_Draft'   (preserves the existing title-based behaviour)
 *   buildExportFilenameBase({ userName: '', fallbackTitle: '', kind: 'cover_letter' })
 *     -> 'cover_letter'
 */
export function buildExportFilenameBase({ userName, fallbackTitle, kind }) {
  const name = sanitizeForFilename(userName)
  if (name) return `${name}_${kind}`

  const title = sanitizeForFilename(fallbackTitle)
  if (title) return title

  return kind
}
