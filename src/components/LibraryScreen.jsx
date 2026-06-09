import { useState } from 'react'
import libraryIndex from '../content/reading/index.json'
import PdfViewer from './PdfViewer'
import { isChapterRead, getReadChapters } from '../hooks/useProgress'

const allChapters = import.meta.glob('../content/reading/ch-*.json', { eager: true })

function getChapter(chId) {
  const key = Object.keys(allChapters).find(k => {
    const filename = k.split('/').pop()
    return filename.startsWith(chId + '-') || filename === chId + '.json'
  })
  return key ? (allChapters[key].default ?? allChapters[key]) : null
}

function ChapterRow({ chapterId, color, onOpen }) {
  const chapter = getChapter(chapterId)
  if (!chapter) return null
  const read = isChapterRead(chapter.id)

  return (
    <button
      onClick={() => onOpen(chapter)}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.65rem',
        padding: '0.65rem 0.875rem',
        minHeight: 48,
        background: read ? `${color}06` : 'var(--bg-card)',
        border: `1px solid ${read ? color + '20' : 'var(--border)'}`,
        borderRadius: 8,
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = read ? `${color}10` : 'var(--bg-elevated)'}
      onMouseLeave={e => e.currentTarget.style.background = read ? `${color}06` : 'var(--bg-card)'}
    >
      <div style={{
        width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
        background: read ? `${color}20` : `${color}14`,
        border: `1px solid ${read ? color + '50' : color + '35'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem', color,
      }}>
        {read ? '✓' : chapter.chapterNumber}
      </div>
      <span style={{ fontSize: '0.84rem', color: read ? 'var(--text-muted)' : 'var(--text)', flex: 1 }}>
        {chapter.title}
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.72rem', flexShrink: 0 }}>
        p.{chapter.pages}
      </span>
      {read
        ? <span style={{ color, fontSize: '0.72rem', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>✓</span>
        : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', flexShrink: 0 }}>›</span>
      }
    </button>
  )
}

export default function LibraryScreen({ onOpenChapter }) {
  const [expandedBook, setExpandedBook] = useState(libraryIndex[0]?.id ?? null)
  const [pdfBook, setPdfBook] = useState(null)
  const [, forceUpdate] = useState(0)

  function handleOpenChapter(chapter) {
    onOpenChapter(chapter)
    // re-render after returning from reader to reflect updated read state
    setTimeout(() => forceUpdate(n => n + 1), 100)
  }

  if (pdfBook) {
    return <PdfViewer book={pdfBook} onBack={() => setPdfBook(null)} />
  }

  const readChapters = getReadChapters()

  return (
    <div className="page-with-nav" style={{
      minHeight: '100vh',
      background: 'var(--bg-deep)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1.75rem 0.875rem 1rem',
    }}>
      <div style={{ width: '100%', maxWidth: 520 }}>

        <div style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          fontSize: '0.72rem',
          letterSpacing: '2px',
          marginBottom: '1.25rem',
        }}>
          LIBRARY
        </div>

        {libraryIndex.map(book => {
          const isOpen = expandedBook === book.id
          const hasChapters = book.units?.some(u => u.chapters?.length > 0)
          const totalChapters = (book.units ?? []).reduce((n, u) => n + (u.chapters?.length ?? 0), 0)
          const readCount = (book.units ?? []).reduce((n, u) =>
            n + (u.chapters ?? []).filter(chId => {
              const ch = getChapter(chId)
              return ch && readChapters[ch.id]
            }).length, 0)

          return (
            <div key={book.id} style={{ marginBottom: '0.6rem' }}>

              {/* Book card */}
              <div style={{
                background: isOpen
                  ? `linear-gradient(135deg, ${book.color}0e 0%, var(--bg-elevated) 60%)`
                  : 'var(--bg-card)',
                border: `1px solid ${isOpen ? book.color + '30' : 'var(--border)'}`,
                borderLeft: `3px solid ${book.color}`,
                borderRadius: 12,
                overflow: 'hidden',
              }}>
                {/* Header row */}
                <div
                  onClick={() => hasChapters && setExpandedBook(isOpen ? null : book.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.875rem',
                    padding: '0.9rem 1rem',
                    minHeight: 64,
                    cursor: hasChapters ? 'pointer' : 'default',
                  }}
                >
                  <span style={{ fontSize: '1.8rem', lineHeight: 1, flexShrink: 0 }}>{book.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.12rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {book.title}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      {book.author}
                      {totalChapters > 0 && (
                        <span style={{ marginLeft: '0.4rem' }}>
                          · <span style={{ color: readCount > 0 ? book.color : 'var(--text-muted)' }}>
                            {readCount}/{totalChapters} read
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                  {hasChapters && (
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-muted)',
                      fontSize: '0.9rem',
                      flexShrink: 0,
                      transition: 'transform 0.2s',
                      display: 'inline-block',
                      transform: isOpen ? 'rotate(90deg)' : 'none',
                    }}>›</span>
                  )}
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', padding: '0 1rem 0.9rem' }}>
                  {book.pdf && (
                    <button
                      onClick={() => setPdfBook(book)}
                      style={{
                        flex: 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                        padding: '0.6rem', minHeight: 44,
                        background: `${book.color}14`,
                        border: `1px solid ${book.color}35`,
                        borderRadius: 8,
                        cursor: 'pointer',
                        color: book.color,
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.65rem',
                        letterSpacing: '0.5px',
                        transition: 'background 0.12s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = `${book.color}25`}
                      onMouseLeave={e => e.currentTarget.style.background = `${book.color}14`}
                    >
                      <span style={{ fontSize: '0.85rem' }}>📄</span>
                      Full PDF
                    </button>
                  )}
                  {hasChapters && (
                    <button
                      onClick={() => setExpandedBook(isOpen ? null : book.id)}
                      style={{
                        flex: 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                        padding: '0.6rem', minHeight: 44,
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        borderRadius: 8,
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.65rem',
                        letterSpacing: '0.5px',
                      }}
                    >
                      <span style={{ fontSize: '0.85rem' }}>📖</span>
                      Study Notes
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded chapters */}
              {isOpen && hasChapters && (
                <div style={{
                  marginTop: '0.35rem',
                  marginLeft: '0.75rem',
                  borderLeft: `2px solid ${book.color}25`,
                  paddingLeft: '0.875rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}>
                  {book.units.map(unit => (
                    <div key={unit.number}>
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        letterSpacing: '1.5px',
                        color: book.color,
                        marginBottom: '0.35rem',
                      }}>
                        UNIT {unit.number} — {unit.title.toUpperCase()}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.28rem' }}>
                        {unit.chapters.map(chId => (
                          <ChapterRow
                            key={chId}
                            chapterId={chId}
                            color={book.color}
                            onOpen={handleOpenChapter}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
