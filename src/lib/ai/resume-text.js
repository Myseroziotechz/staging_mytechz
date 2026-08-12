import 'server-only'
import { extractPdfText } from './pdf-text'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB — matches the client-side FileUpload limit
const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'doc', 'txt']

/** Returns an error message string, or null if the file is acceptable. */
export function validateResumeFile(file) {
  if (!file) return 'No file uploaded'
  if (file.size > MAX_FILE_SIZE) return 'File size must be under 5MB'
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) return 'Supported formats: PDF, DOCX, DOC, TXT'
  return null
}

/**
 * Extracts raw text from an uploaded resume file. Consolidates the
 * PDF/mammoth/txt branching previously duplicated inline in
 * src/app/api/ai/resume/parse/route.js and .../autofill/route.js.
 */
export async function extractResumeText(file) {
  const fileType = file.name.split('.').pop()?.toLowerCase()
  const buffer = Buffer.from(await file.arrayBuffer())

  if (fileType === 'pdf') return extractPdfText(buffer)
  if (fileType === 'docx' || fileType === 'doc') {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  }
  return buffer.toString('utf-8')
}
