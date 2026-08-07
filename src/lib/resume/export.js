'use client'

import { toPng, toJpeg, toSvg, toCanvas } from 'html-to-image'
import { jsPDF } from 'jspdf'
import { computeSafeBreaks } from './pdf-paginate'
// docx is imported dynamically inside exportAsDOCX to avoid webpack SWC
// compilation issues with the 'super' keyword in docx/dist/index.mjs


/**
 * Export resume preview element to various formats.
 * All exports happen client-side from the live preview DOM element.
 */

export async function exportAsPNG(element, filename = 'resume.png') {
  const dataUrl = await toPng(element, {
    quality: 1,
    pixelRatio: 2,
    backgroundColor: '#ffffff',
  })
  downloadDataUrl(dataUrl, filename)
  return dataUrl
}

export async function exportAsJPG(element, filename = 'resume.jpg') {
  const dataUrl = await toJpeg(element, {
    quality: 0.95,
    pixelRatio: 2,
    backgroundColor: '#ffffff',
  })
  downloadDataUrl(dataUrl, filename)
  return dataUrl
}

export async function exportAsSVG(element, filename = 'resume.svg') {
  const dataUrl = await toSvg(element, {
    backgroundColor: '#ffffff',
  })
  downloadDataUrl(dataUrl, filename)
  return dataUrl
}

const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297
const MARGIN_MM = 10
const CONTENT_WIDTH_MM = A4_WIDTH_MM - 2 * MARGIN_MM
const CONTENT_HEIGHT_MM = A4_HEIGHT_MM - 2 * MARGIN_MM

/**
 * Exports the live preview element as a paginated A4 PDF.
 *
 * Previous behaviour rasterized the whole (possibly multi-page-tall)
 * element into one PNG and shrunk it to fit a single page — long resumes
 * just got smaller instead of flowing onto page 2+. This now:
 *   1. Reads safe page-break Y-coordinates from the live DOM (before
 *      rasterizing), so a break never lands mid-heading/mid-line.
 *   2. Rasterizes the element once via `toCanvas`.
 *   3. Slices that canvas into per-page chunks at those break points and
 *      adds one PDF page per chunk, with a consistent margin on every page.
 */
export async function exportAsPDF(element, filename = 'resume.pdf') {
  const mmPerPx = CONTENT_WIDTH_MM / element.offsetWidth
  const pageHeightPx = CONTENT_HEIGHT_MM / mmPerPx
  const breaks = computeSafeBreaks(element, pageHeightPx)

  const sourceCanvas = await toCanvas(element, {
    pixelRatio: 2,
    backgroundColor: '#ffffff',
  })
  const scaleFactor = sourceCanvas.width / element.offsetWidth

  const pdf = new jsPDF('p', 'mm', 'a4')

  for (let i = 0; i < breaks.length - 1; i++) {
    const sliceTopPx = breaks[i] * scaleFactor
    const sliceHeightPx = (breaks[i + 1] - breaks[i]) * scaleFactor
    if (sliceHeightPx <= 0) continue

    const pageCanvas = document.createElement('canvas')
    pageCanvas.width = sourceCanvas.width
    pageCanvas.height = sliceHeightPx
    const ctx = pageCanvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height)
    ctx.drawImage(sourceCanvas, 0, -sliceTopPx)

    const imgData = pageCanvas.toDataURL('image/png')
    if (i > 0) pdf.addPage()

    const sliceHeightMm = sliceHeightPx / scaleFactor * mmPerPx
    pdf.addImage(imgData, 'PNG', MARGIN_MM, MARGIN_MM, CONTENT_WIDTH_MM, sliceHeightMm)
  }

  pdf.save(filename)
}

const DEFAULT_SECTION_ORDER = [
  'summary', 'experience', 'education', 'skills', 'languages', 'certifications', 'projects',
]

/**
 * DOCX can't be a pixel snapshot of the chosen template (colors, columns,
 * dark backgrounds don't translate to a flow document) — it's an independent
 * reconstruction from resumeData. This keeps that constraint, but fixes:
 * explicit A4 page size/margins (previously unset, defaulting to the docx
 * library's own default page size), the missing Languages section and
 * project tech-stack list (both silently dropped before), and section order
 * driven by the template's own `default_sections` when supplied instead of
 * a fixed hardcoded order.
 */
export async function exportAsDOCX(resumeData, filename = 'resume.docx', sectionOrder = DEFAULT_SECTION_ORDER) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, convertMillimetersToTwip } = await import('docx')
  const children = []

  // Contact / Header — always first, not a toggleable section.
  const contact = resumeData.contact || {}
  if (contact.fullName) {
    children.push(new Paragraph({
      children: [new TextRun({ text: contact.fullName, bold: true, size: 32 })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    }))
  }

  const contactParts = [contact.email, contact.phone, contact.location, contact.linkedin].filter(Boolean)
  if (contactParts.length) {
    children.push(new Paragraph({
      children: [new TextRun({ text: contactParts.join(' | '), size: 20, color: '666666' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }))
  }

  const SECTION_BUILDERS = {
    summary: () => {
      if (!resumeData.summary) return
      children.push(new Paragraph({ text: 'Professional Summary', heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }))
      children.push(new Paragraph({ children: [new TextRun({ text: resumeData.summary, size: 22 })], spacing: { after: 100 } }))
    },
    experience: () => {
      if (!resumeData.experience?.length) return
      children.push(new Paragraph({ text: 'Experience', heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }))
      for (const exp of resumeData.experience) {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: `${exp.title}`, bold: true, size: 22 }),
            new TextRun({ text: ` — ${exp.company}`, size: 22 }),
            new TextRun({ text: `  ${exp.startDate} – ${exp.endDate}`, size: 20, color: '666666' }),
          ],
          spacing: { before: 100 },
        }))
        if (exp.bullets?.length) {
          for (const bullet of exp.bullets) {
            children.push(new Paragraph({
              children: [new TextRun({ text: bullet, size: 22 })],
              bullet: { level: 0 },
            }))
          }
        }
      }
    },
    education: () => {
      if (!resumeData.education?.length) return
      children.push(new Paragraph({ text: 'Education', heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }))
      for (const edu of resumeData.education) {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: edu.degree, bold: true, size: 22 }),
            new TextRun({ text: ` — ${edu.institution}`, size: 22 }),
            new TextRun({ text: `  ${edu.year}`, size: 20, color: '666666' }),
          ],
        }))
      }
    },
    skills: () => {
      if (!resumeData.skills?.length) return
      children.push(new Paragraph({ text: 'Skills', heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }))
      children.push(new Paragraph({
        children: [new TextRun({ text: resumeData.skills.join(', '), size: 22 })],
      }))
    },
    languages: () => {
      if (!resumeData.languages?.length) return
      children.push(new Paragraph({ text: 'Languages', heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }))
      const text = resumeData.languages
        .map((l) => (typeof l === 'string' ? l : [l.name, l.proficiency].filter(Boolean).join(' — ')))
        .join(', ')
      children.push(new Paragraph({ children: [new TextRun({ text, size: 22 })] }))
    },
    certifications: () => {
      if (!resumeData.certifications?.length) return
      children.push(new Paragraph({ text: 'Certifications', heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }))
      for (const cert of resumeData.certifications) {
        children.push(new Paragraph({
          children: [new TextRun({ text: `${cert.name} — ${cert.issuer} (${cert.year})`, size: 22 })],
          bullet: { level: 0 },
        }))
      }
    },
    projects: () => {
      if (!resumeData.projects?.length) return
      children.push(new Paragraph({ text: 'Projects', heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }))
      for (const proj of resumeData.projects) {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: proj.name, bold: true, size: 22 }),
            new TextRun({ text: ` — ${proj.description}`, size: 22 }),
          ],
        }))
        if (proj.techStack?.length) {
          children.push(new Paragraph({
            children: [new TextRun({ text: `Tech: ${proj.techStack.join(', ')}`, size: 20, color: '666666', italics: true })],
            spacing: { after: 100 },
          }))
        }
      }
    },
  }

  // Any section the template declares that isn't in our known list is
  // skipped safely; any known section the template didn't list still runs
  // via DEFAULT_SECTION_ORDER's fallback so content is never silently lost.
  const order = sectionOrder?.length ? sectionOrder : DEFAULT_SECTION_ORDER
  const seen = new Set()
  for (const key of order) {
    if (SECTION_BUILDERS[key] && !seen.has(key)) {
      SECTION_BUILDERS[key]()
      seen.add(key)
    }
  }
  for (const key of DEFAULT_SECTION_ORDER) {
    if (!seen.has(key)) SECTION_BUILDERS[key]()
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: {
            width: convertMillimetersToTwip(A4_WIDTH_MM),
            height: convertMillimetersToTwip(A4_HEIGHT_MM),
          },
          margin: {
            top: convertMillimetersToTwip(MARGIN_MM * 2),
            bottom: convertMillimetersToTwip(MARGIN_MM * 2),
            left: convertMillimetersToTwip(MARGIN_MM * 2),
            right: convertMillimetersToTwip(MARGIN_MM * 2),
          },
        },
      },
      children,
    }],
  })
  const buffer = await Packer.toBlob(doc)
  downloadBlob(buffer, filename)
}

function downloadDataUrl(dataUrl, filename) {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.download = filename
  link.href = url
  link.click()
  URL.revokeObjectURL(url)
}
