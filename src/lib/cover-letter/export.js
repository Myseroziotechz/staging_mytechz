'use client'

// Re-exports the generic, DOM-element-in/file-out PDF export from the resume
// builder unchanged — `exportAsPDF` and its underlying pagination
// (`computeSafeBreaks`) have no resume-specific logic, so cover-letter code
// gets identical A4/margin/pagination behaviour for free instead of a copy.
export { exportAsPDF } from '@/lib/resume/export'

const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297
const MARGIN_MM = 20

/**
 * Exports a cover letter as a DOCX. Unlike the PDF export (a pixel-accurate
 * snapshot of the live template), this is an independent reconstruction from
 * the letter's own data — same trade-off the resume builder's DOCX export
 * already accepts (colors/layout can't translate to a flow document), so
 * this focuses on correct page setup and complete, correctly-ordered content.
 */
export async function exportCoverLetterAsDOCX(sender = {}, recipient = {}, letter = {}, filename = 'cover-letter.docx') {
  const { Document, Packer, Paragraph, TextRun, convertMillimetersToTwip } = await import('docx')
  const children = []

  if (sender.fullName) {
    children.push(new Paragraph({
      children: [new TextRun({ text: sender.fullName, bold: true, size: 28 })],
      spacing: { after: 40 },
    }))
  }
  if (sender.headline) {
    children.push(new Paragraph({
      children: [new TextRun({ text: sender.headline, size: 20, color: '666666' })],
      spacing: { after: 60 },
    }))
  }
  const contactParts = [sender.email, sender.phone, sender.location, sender.linkedin, sender.portfolio].filter(Boolean)
  if (contactParts.length) {
    children.push(new Paragraph({
      children: [new TextRun({ text: contactParts.join(' | '), size: 18, color: '666666' })],
      spacing: { after: 240 },
    }))
  }

  if (recipient.date) {
    children.push(new Paragraph({ children: [new TextRun({ text: recipient.date, size: 20 })], spacing: { after: 200 } }))
  }

  const recipientLines = [recipient.hiringManagerName, recipient.hiringManagerTitle, recipient.companyName, recipient.companyLocation].filter(Boolean)
  for (const line of recipientLines) {
    children.push(new Paragraph({ children: [new TextRun({ text: line, size: 20 })] }))
  }
  if (recipientLines.length) children.push(new Paragraph({ text: '', spacing: { after: 100 } }))

  if (recipient.jobTitle) {
    const ref = recipient.jobRef ? ` (Ref: ${recipient.jobRef})` : ''
    children.push(new Paragraph({
      children: [new TextRun({ text: `Re: Application for ${recipient.jobTitle}${ref}`, bold: true, size: 20 })],
      spacing: { after: 200 },
    }))
  }

  if (letter.greeting) {
    children.push(new Paragraph({ children: [new TextRun({ text: letter.greeting, size: 22 })], spacing: { after: 160 } }))
  }
  if (letter.opening) {
    children.push(new Paragraph({ children: [new TextRun({ text: letter.opening, size: 22 })], spacing: { after: 160 } }))
  }
  for (const para of letter.body || []) {
    if (!para) continue
    children.push(new Paragraph({ children: [new TextRun({ text: para, size: 22 })], spacing: { after: 160 } }))
  }
  if (letter.closing) {
    children.push(new Paragraph({ children: [new TextRun({ text: letter.closing, size: 22 })], spacing: { after: 280 } }))
  }
  if (letter.signOff) {
    children.push(new Paragraph({ children: [new TextRun({ text: letter.signOff, size: 22 })], spacing: { after: 40 } }))
  }
  if (sender.fullName) {
    children.push(new Paragraph({ children: [new TextRun({ text: sender.fullName, size: 22 })] }))
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
            top: convertMillimetersToTwip(MARGIN_MM),
            bottom: convertMillimetersToTwip(MARGIN_MM),
            left: convertMillimetersToTwip(MARGIN_MM),
            right: convertMillimetersToTwip(MARGIN_MM),
          },
        },
      },
      children: children.length ? children : [new Paragraph({ children: [new TextRun({ text: '', size: 22 })] })],
    }],
  })

  const blob = await Packer.toBlob(doc)
  downloadBlob(blob, filename)
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.download = filename
  link.href = url
  link.click()
  URL.revokeObjectURL(url)
}
