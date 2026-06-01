import MathDisplay from './MathDisplay'

function renderBody(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i} style={{ color: 'var(--text)', fontWeight: 600 }}>{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>
  )
}

const DIFF_LABEL = { 1: 'Easy', 2: 'Medium', 3: 'Hard' }
const DIFF_COLOR = { 1: 'var(--correct)', 2: 'var(--gold)', 3: 'var(--danger)' }

export default function StudyScreen({ dungeon, subjectTitle, subjectColor = 'var(--blue)', onStart, onBack }) {
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
            marginBottom: '1.1rem',
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: 0, fontFamily: 'var(--font-ui)',
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
          marginBottom: '1rem',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            fontSize: '0.56rem',
            letterSpacing: '2px',
            marginBottom: '0.4rem',
          }}>
            STUDY GUIDE
          </div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.1rem' }}>
            {lesson?.title ?? dungeon?.title}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{dungeon?.title}</p>
        </div>

        {/* Lesson body */}
        {lesson?.body && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '1.25rem 1.1rem',
            marginBottom: '1rem',
            lineHeight: 1.85,
            fontSize: '0.92rem',
            color: 'var(--text-muted)',
          }}>
            <p>{renderBody(lesson.body)}</p>
          </div>
        )}

        {/* Quiz preview */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '1rem',
          marginBottom: '1.25rem',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            fontSize: '0.56rem',
            letterSpacing: '2px',
            marginBottom: '0.85rem',
          }}>
            QUIZ PREVIEW — {rooms.length} QUESTIONS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {rooms.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                  background: `${subjectColor}12`,
                  border: `1px solid ${subjectColor}35`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.58rem', color: subjectColor,
                }}>
                  {i + 1}
                </div>
                <span style={{ flex: 1, fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.4 }}>
                  {r.question}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5rem',
                  color: DIFF_COLOR[r.difficulty] ?? 'var(--text-muted)',
                  background: `${DIFF_COLOR[r.difficulty] ?? 'var(--text-muted)'}12`,
                  border: `1px solid ${DIFF_COLOR[r.difficulty] ?? 'var(--text-muted)'}30`,
                  padding: '2px 6px', borderRadius: 4,
                  whiteSpace: 'nowrap', flexShrink: 0,
                  letterSpacing: '0.5px',
                }}>
                  {DIFF_LABEL[r.difficulty] ?? '?'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={onStart}
          style={{
            width: '100%',
            padding: '0.95rem',
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
            transition: 'opacity 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.9' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
        >
          Start Quiz →
        </button>
      </div>
    </div>
  )
}
