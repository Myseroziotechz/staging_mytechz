'use client'

import { toPng, toJpeg, toSvg } from 'html-to-image'
import { jsPDF } from 'jspdf'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'

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

export async function exportAsPDF(element, filename = 'resume.pdf') {
  const imgData = await toPng(element, {
    quality: 1,
    pixelRatio: 2,
    backgroundColor: '#ffffff',
  })

  // A4 dimensions in mm
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  // Calculate image dimensions to fit A4
  const img = new Image()
  await new Promise((resolve) => {
    img.onload = resolve
    img.src = imgData
  })

  const imgRatio = img.width / img.height
  const pageRatio = pageWidth / pageHeight

  let imgW, imgH
  if (imgRatio > pageRatio) {
    imgW = pageWidth - 10 // 5mm margin each side
    imgH = imgW / imgRatio
  } else {
    imgH = pageHeight - 10
    imgW = imgH * imgRatio
  }

  const x = (pageWidth - imgW) / 2
  const y = 5

  pdf.addImage(imgData, 'PNG', x, y, imgW, imgH)
  pdf.save(filename)
}

export async function exportAsDOCX(resumeData, filename = 'resume.docx') {
  const children = []

  // Contact / Header
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

  // Summary
  if (resumeData.summary) {
    children.push(new Paragraph({ text: 'Professional Summary', heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }))
    children.push(new Paragraph({ children: [new TextRun({ text: resumeData.summary, size: 22 })], spacing: { after: 100 } }))
  }

  // Experience
  if (resumeData.experience?.length) {
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
  }

  // Education
  if (resumeData.education?.length) {
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
  }

  // Skills
  if (resumeData.skills?.length) {
    children.push(new Paragraph({ text: 'Skills', heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }))
    children.push(new Paragraph({
      children: [new TextRun({ text: resumeData.skills.join(', '), size: 22 })],
    }))
  }

  // Certifications
  if (resumeData.certifications?.length) {
    children.push(new Paragraph({ text: 'Certifications', heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }))
    for (const cert of resumeData.certifications) {
      children.push(new Paragraph({
        children: [new TextRun({ text: `${cert.name} — ${cert.issuer} (${cert.year})`, size: 22 })],
        bullet: { level: 0 },
      }))
    }
  }

  // Projects
  if (resumeData.projects?.length) {
    children.push(new Paragraph({ text: 'Projects', heading: HeadingLevel.HEADING_2, spacing: { before: 200 } }))
    for (const proj of resumeData.projects) {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: proj.name, bold: true, size: 22 }),
          new TextRun({ text: ` — ${proj.description}`, size: 22 }),
        ],
      }))
    }
  }

  const doc = new Document({ sections: [{ children }] })
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
