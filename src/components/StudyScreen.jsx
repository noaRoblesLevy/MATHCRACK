import { useState } from 'react'
import MathDisplay from './MathDisplay'

function renderBody(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i} style={{ color: 'var(--text)', fontWeight: 600 }}>{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>
  )
}

export default function StudyScreen({ dungeon, subjectTitle, subjectColor = 'var(--blue)', onStart, onBack }) {
  const [showNotes, setShowNotes] = useState(false)
  const lesson = dungeon?.lesson
  const rooms = dungeon?.rooms ?? []

  return (
    <div className="page-with-nav" style={{
      minHeight: '100vh',
      background: 'var(--bg-deep)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1.25rem 0.875rem 1.5rem',
    }}>
      <div style={{ width: '100%', maxWidth: 560 }}>

        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: '0.8rem',
            marginBottom: '1.1rem', minHeight: 44,
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0 0', fontFamily: 'var(--font-ui)',
          }}
        >
          ← {subjectTitle}
        </button>

        {/* Title block */}
        <div style={{
          background: `linear-gradient(135deg, ${subjectColor}10 0%, var(--bg-card) 60%)`,
          border: `1px solid ${subjectColor}25`,
          borderLeft: `3px solid ${subjectColor}`,
          borderRadius: 12,
          padding: '1.1rem 1rem',
          marginBottom: '1.25rem',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            fontSize: '0.56rem',
            letterSpacing: '2px',
            marginBottom: '0.4rem',
          }}>
            LESSON · {rooms.length} QUESTIONS
          </div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.1rem' }}>
            {lesson?.title ?? dungeon?.title}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{dungeon?.title}</p>
        </div>

        {/* Study notes panel */}
        {lesson?.body && (
          <>
            <button
              onClick={() => setShowNotes(n => !n)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.75rem 1rem', minHeight: 48,
                background: showNotes ? `${subjectColor}08` : 'var(--bg-card)',
                border: `1px solid ${showNotes ? subjectColor + '30' : 'var(--border)'}`,
                borderRadius: showNotes ? '10px 10px 0 0' : 10,
                cursor: 'pointer', marginBottom: showNotes ? 0 : '0.5rem',
                transition: 'background 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem' }}>📖</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text)', letterSpacing: '0.5px' }}>
                  Study Notes
                </span>
              </div>
              <span style={{
                color: 'var(--text-muted)', fontSize: '0.8rem',
                transform: showNotes ? 'rotate(90deg)' : 'none',
                display: 'inline-block', transition: 'transform 0.2s',
              }}>›</span>
            </button>

            {showNotes && (
              <div style={{
                background: 'var(--bg-card)',
                border: `1px solid ${subjectColor}20`,
                borderTop: 'none',
                borderRadius: '0 0 10px 10px',
                padding: '1.1rem 1rem',
                marginBottom: '0.5rem',
                lineHeight: 1.85,
                fontSize: '0.92rem',
                color: 'var(--text-muted)',
              }}>
                <p>{renderBody(lesson.body)}</p>
              </div>
            )}
          </>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.75rem' }}>
          {lesson?.body && (
            <button
              onClick={() => setShowNotes(n => !n)}
              style={{
                flex: 1,
                padding: '0.95rem',
                minHeight: 52,
                background: 'var(--bg-card)',
                border: `1px solid ${subjectColor}30`,
                borderRadius: 12,
                color: subjectColor,
                fontSize: '0.85rem',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                letterSpacing: '0.5px',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = `${subjectColor}0c`}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-card)'}
            >
              {showNotes ? 'Hide Notes' : '📖 Notes'}
            </button>
          )}

          <button
            onClick={onStart}
            style={{
              flex: lesson?.body ? 2 : 1,
              padding: '0.95rem',
              minHeight: 52,
              background: subjectColor,
              border: 'none',
              borderRadius: 12,
              color: '#fff',
              fontSize: '0.95rem',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              letterSpacing: '1px',
              fontWeight: 'bold',
              boxShadow: `0 0 24px ${subjectColor}40`,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Start Quiz →
          </button>
        </div>
      </div>
    </div>
  )
}
