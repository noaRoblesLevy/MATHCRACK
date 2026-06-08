import { useEffect } from 'react'
import { markChapterRead } from '../hooks/useProgress'

const BLOCK_STYLES = {
  definition: {
    border: 'var(--blue)',
    bg: 'var(--blue-glow)',
    label: 'DEFINITION',
    labelColor: 'var(--blue)',
  },
  rule: {
    border: 'var(--purple)',
    bg: 'var(--purple-glow)',
    label: 'RULE',
    labelColor: 'var(--purple)',
  },
  example: {
    border: 'var(--correct)',
    bg: 'var(--correct-dim)',
    label: null,
    labelColor: 'var(--correct)',
  },
  note: {
    border: 'var(--gold)',
    bg: 'var(--gold-glow)',
    label: '💡',
    labelColor: 'var(--gold)',
  },
}

function Block({ block }) {
  if (block.type === 'heading') {
    return (
      <h3 style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.7rem',
        letterSpacing: '2px',
        color: 'var(--text-muted)',
        margin: '1.5rem 0 0.5rem',
        textTransform: 'uppercase',
        borderBottom: '1px solid var(--border)',
        paddingBottom: '0.4rem',
      }}>
        {block.text}
      </h3>
    )
  }

  if (block.type === 'text') {
    return (
      <p style={{
        fontSize: '0.95rem',
        lineHeight: 1.85,
        color: 'var(--text-muted)',
        margin: '0.5rem 0',
      }}>
        {block.body}
      </p>
    )
  }

  const style = BLOCK_STYLES[block.type]
  if (!style) return null

  return (
    <div style={{
      background: style.bg,
      border: `1px solid ${style.border}30`,
      borderLeft: `3px solid ${style.border}`,
      borderRadius: '0 10px 10px 0',
      padding: '0.875rem 1rem',
      margin: '0.6rem 0',
    }}>
      {/* Label row */}
      {(style.label || block.term || block.label) && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          marginBottom: '0.4rem',
        }}>
          {style.label && (
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.52rem',
              letterSpacing: '1.5px',
              color: style.labelColor,
              background: `${style.border}15`,
              border: `1px solid ${style.border}30`,
              padding: '2px 6px',
              borderRadius: 4,
            }}>
              {style.label}
            </span>
          )}
          {block.term && (
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              color: style.labelColor,
            }}>
              {block.term}
            </span>
          )}
          {block.label && block.type === 'example' && (
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: style.labelColor,
              fontWeight: 'bold',
            }}>
              {block.label}
            </span>
          )}
        </div>
      )}

      <p style={{
        fontSize: '0.92rem',
        lineHeight: 1.8,
        color: 'var(--text)',
        margin: 0,
      }}>
        {block.body}
      </p>
    </div>
  )
}

export default function ReaderScreen({ chapter, onBack }) {
  useEffect(() => {
    if (chapter?.id) markChapterRead(chapter.id)
  }, [chapter?.id])

  if (!chapter) return null

  return (
    <div className="page-with-nav" style={{
      minHeight: '100vh',
      background: 'var(--bg-deep)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1.25rem 0.875rem 1.5rem',
    }}>
      <div style={{ width: '100%', maxWidth: 600 }}>

        {/* Back */}
        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: '0.8rem',
            marginBottom: '1.1rem',
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: 0,
          }}
        >
          ← Library
        </button>

        {/* Chapter header */}
        <div style={{
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            letterSpacing: '2px',
            color: 'var(--text-muted)',
            marginBottom: '0.5rem',
          }}>
            UNIT {chapter.unit} — {chapter.unitTitle?.toUpperCase()} · CHAPTER {chapter.chapterNumber} · P. {chapter.pages}
          </div>
          <h1 style={{
            fontSize: 'clamp(1.3rem, 4vw, 1.7rem)',
            fontWeight: 700,
            color: 'var(--text)',
            lineHeight: 1.2,
          }}>
            {chapter.title}
          </h1>
        </div>

        {/* Content blocks */}
        <div>
          {(chapter.blocks ?? []).map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '2.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            fontSize: '0.58rem',
            letterSpacing: '1px',
          }}>
            {chapter.blocks?.length ?? 0} sections · Pre-Algebra & Algebra 1 (Wang)
          </span>
          <button
            onClick={onBack}
            style={{
              background: 'none', border: '1px solid var(--border)',
              borderRadius: 8, color: 'var(--text-muted)',
              cursor: 'pointer', padding: '0.4rem 0.9rem',
              fontSize: '0.75rem',
            }}
          >
            ← Back to Library
          </button>
        </div>
      </div>
    </div>
  )
}
