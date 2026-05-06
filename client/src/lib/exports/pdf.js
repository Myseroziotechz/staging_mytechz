import 'server-only'
import PDFDocument from 'pdfkit'

// Returns a Promise<Buffer> rendering a simple landscape table PDF.
// rows: array of objects. columns: [{ key, label, get?, width? }]
export function toPDFBuffer({ title, subtitle, rows, columns, actorEmail }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margin: 36,
    })
    const chunks = []
    doc.on('data', (c) => chunks.push(c))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    // Header
    doc.fontSize(16).fillColor('#1d4ed8').text('MyTechZ', { continued: false })
    doc
      .moveDown(0.1)
      .fontSize(13)
      .fillColor('#0f172a')
      .text(title, { continued: false })
    if (subtitle) {
      doc.moveDown(0.1).fontSize(9).fillColor('#64748b').text(subtitle)
    }
    doc
      .moveDown(0.1)
      .fontSize(8)
      .fillColor('#94a3b8')
      .text(
        `Generated ${new Date().toLocaleString('en-IN')}${
          actorEmail ? ` · by ${actorEmail}` : ''
        } · ${rows.length} rows`
      )
    doc.moveDown(0.6)

    const usableWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right
    const totalWeight = columns.reduce((s, c) => s + (c.width || 1), 0)
    const widths = columns.map((c) => Math.floor(usableWidth * ((c.width || 1) / totalWeight)))

    // Table header
    const startY = doc.y
    let x = doc.page.margins.left
    doc.font('Helvetica-Bold').fontSize(9).fillColor('#0f172a')
    columns.forEach((c, i) => {
      doc.rect(x, startY, widths[i], 18).fill('#f1f5f9').stroke('#e2e8f0')
      doc.fillColor('#0f172a').text(c.label, x + 4, startY + 5, {
        width: widths[i] - 8,
        ellipsis: true,
        lineBreak: false,
      })
      x += widths[i]
    })
    doc.moveDown(1.5)

    // Rows
    doc.font('Helvetica').fontSize(8).fillColor('#1f2937')
    for (const row of rows) {
      // Page break if needed.
      if (doc.y + 28 > doc.page.height - doc.page.margins.bottom) {
        doc.addPage({ size: 'A4', layout: 'landscape', margin: 36 })
      }
      const rowY = doc.y
      x = doc.page.margins.left
      const rowHeight = 16
      columns.forEach((c, i) => {
        doc
          .rect(x, rowY, widths[i], rowHeight)
          .strokeColor('#f1f5f9')
          .stroke()
        const v = c.get ? c.get(row) : row[c.key]
        doc.fillColor('#1f2937').text(v == null ? '—' : String(v), x + 4, rowY + 4, {
          width: widths[i] - 8,
          ellipsis: true,
          lineBreak: false,
        })
        x += widths[i]
      })
      doc.y = rowY + rowHeight
    }

    // Footer page numbers
    const pages = doc.bufferedPageRange()
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i)
      doc
        .fontSize(7)
        .fillColor('#94a3b8')
        .text(
          `Page ${i + 1} of ${pages.count}`,
          doc.page.margins.left,
          doc.page.height - 24,
          { align: 'right', width: doc.page.width - doc.page.margins.left - doc.page.margins.right }
        )
    }

    doc.end()
  })
}
