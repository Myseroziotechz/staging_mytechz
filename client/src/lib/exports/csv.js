import 'server-only'

// CSV-safe cell. Quotes the value, escapes embedded quotes, and prefixes a
// leading =/+/-/@ with `'` to defuse Excel/Sheets formula injection.
function cell(v) {
  if (v == null) return ''
  let s = String(v)
  if (/^[=+\-@]/.test(s)) s = "'" + s
  if (/[",\n\r]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"'
  return s
}

// rows: array of objects. columns: [{ key, label, get? }]
export function toCSV(rows, columns) {
  const header = columns.map((c) => cell(c.label)).join(',')
  const body = rows
    .map((row) =>
      columns
        .map((c) => cell(c.get ? c.get(row) : row[c.key]))
        .join(',')
    )
    .join('\n')
  return header + '\n' + body
}
