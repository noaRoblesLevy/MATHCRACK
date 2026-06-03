export default function PdfViewer({ book, onBack }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--bg-deep)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 300,
    }}>
      {/* Toolbar — padded for iPhone notch */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        paddingTop: 'calc(0.65rem + env(safe-area-inset-top))',
        paddingBottom: '0.65rem',
        paddingLeft: '0.875rem',
        paddingRight: '0.875rem',
        background: 'var(--bg-mid)',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: '0.8rem',
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.3rem 0.5rem', borderRadius: 6, minHeight: 44,
          }}
        >
          ← Back
        </button>

        <div style={{ width: 1, height: 18, background: 'var(--border)' }} />
        <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{book.icon}</span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {book.title}
          </div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
            {book.author} · {book.pages} pages
          </div>
        </div>

        <a
          href={book.pdf}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            color: 'var(--blue)',
            border: '1px solid var(--blue-glow)',
            borderRadius: 6,
            padding: '0.3rem 0.65rem',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          Open ↗
        </a>
      </div>

      <iframe
        src={book.pdf}
        style={{ flex: 1, border: 'none', width: '100%', display: 'block' }}
        title={book.title}
      />
    </div>
  )
}
