import 'server-only'
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  HeadingLevel,
  AlignmentType,
  WidthType,
  BorderStyle,
} from 'docx'

const BORDER = { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' }
const BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER }

function txt(s, { bold = false, size = 20, color = '1F2937' } = {}) {
  return new TextRun({ text: s == null ? '—' : String(s), bold, size, color })
}

export async function toDOCXBuffer({ title, subtitle, rows, columns, actorEmail }) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: columns.map(
      (c) =>
        new TableCell({
          shading: { fill: 'F1F5F9' },
          borders: BORDERS,
          children: [new Paragraph({ children: [txt(c.label, { bold: true, size: 18 })] })],
        })
    ),
  })

  const bodyRows = rows.map(
    (row) =>
      new TableRow({
        children: columns.map(
          (c) =>
            new TableCell({
              borders: BORDERS,
              children: [
                new Paragraph({
                  children: [txt(c.get ? c.get(row) : row[c.key], { size: 18 })],
                }),
              ],
            })
        ),
      })
  )

  const doc = new Document({
    creator: 'MyTechZ',
    title,
    styles: {
      default: { document: { run: { font: 'Calibri', size: 20 } } },
    },
    sections: [
      {
        children: [
          new Paragraph({
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.LEFT,
            children: [new TextRun({ text: 'MyTechZ', color: '1D4ED8', bold: true, size: 32 })],
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: title, size: 26, color: '0F172A' })],
          }),
          ...(subtitle
            ? [
                new Paragraph({
                  children: [new TextRun({ text: subtitle, color: '64748B', size: 18 })],
                }),
              ]
            : []),
          new Paragraph({
            children: [
              new TextRun({
                text: `Generated ${new Date().toLocaleString('en-IN')}${
                  actorEmail ? ` · by ${actorEmail}` : ''
                } · ${rows.length} rows`,
                color: '94A3B8',
                size: 16,
              }),
            ],
            spacing: { after: 200 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [headerRow, ...bodyRows],
          }),
        ],
      },
    ],
  })

  return Packer.toBuffer(doc)
}
