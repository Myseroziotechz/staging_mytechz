'use client'

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9fafb',
          padding: '1rem',
        }}>
          <div style={{
            maxWidth: '28rem',
            width: '100%',
            backgroundColor: '#fff',
            borderRadius: '1rem',
            border: '1px solid #e5e7eb',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0 }}>
              Something went wrong
            </h1>
            <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
              {error?.message || 'A critical error occurred. Please reload the page.'}
            </p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={reset}
                style={{
                  padding: '0.625rem 1.25rem',
                  backgroundColor: '#2563eb',
                  color: '#fff',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  borderRadius: '0.75rem',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Try Again
              </button>
              <a
                href="/"
                style={{
                  padding: '0.625rem 1.25rem',
                  backgroundColor: '#fff',
                  color: '#374151',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  borderRadius: '0.75rem',
                  border: '1px solid #e5e7eb',
                  textDecoration: 'none',
                }}
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
