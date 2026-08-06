import 'server-only'

/**
 * Extract plain text from a PDF buffer using pdfjs-dist's legacy Node build.
 *
 * Deliberately NOT using `pdf-parse`: it wraps pdfjs-dist's full rendering
 * pipeline (CanvasGraphics/pattern helpers), which needs a `DOMMatrix`
 * global. It tries to polyfill that from the optional native `@napi-rs/canvas`
 * dependency, but that polyfill wiring is fragile under Next.js's server
 * runtime and silently fails, so pdfjs's rendering code later throws
 * `ReferenceError: DOMMatrix is not defined`. We only need `getTextContent()`
 * — the text-extraction API — which never touches canvas/DOMMatrix at all.
 */
export async function extractPdfText(buffer) {
  const { getDocument, VerbosityLevel } = await import('pdfjs-dist/legacy/build/pdf.mjs')

  const doc = await getDocument({
    data: new Uint8Array(buffer),
    useWorkerFetch: false,
    isEvalSupported: false,
    disableFontFace: true,
    verbosity: VerbosityLevel.ERRORS,
  }).promise

  try {
    const pages = []
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i)
      const content = await page.getTextContent()
      pages.push(content.items.map((item) => item.str).join(' '))
    }
    return pages.join('\n\n')
  } finally {
    await doc.destroy()
  }
}
