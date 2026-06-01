import { isKingdomComplete } from '../hooks/useProgress'

export default function OverworldMap({ kingdoms, onSelectKingdom }) {
  function isUnlocked(index) {
    if (index === 0) return true
    return isKingdomComplete(kingdoms[index - 1].dungeons.map(d => d.id))
  }

  const totalLessons = kingdoms.reduce((sum, k) => sum + k.dungeons.filter(d => !d.stub).length, 0)
  const completedSubjects = kingdoms.filter((k, i) =>
    isUnlocked(i) && isKingdomComplete(k.dungeons.map(d => d.id))
  ).length

  return (
    <div className="page-with-nav" style={{
      minHeight: '100vh',
      background: 'var(--bg-deep)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1.75rem 0.875rem 1rem',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem', width: '100%', maxWidth: 520 }}>
        <h1 style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--blue)',
          fontSize: 'clamp(1.3rem, 5.5vw, 2rem)',
          letterSpacing: '6px',
          textShadow: '0 0 40px var(--blue-glow)',
          marginBottom: '0.3rem',
        }}>
          MATHCRACK
        </h1>
        <p style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          fontSize: '0.6rem',
          letterSpacing: '3px',
        }}>
          PRE-ALGEBRA &amp; ALGEBRA 1
        </p>

        {/* Progress */}
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.58rem', letterSpacing: '1.5px' }}>
              PROGRESS
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.58rem' }}>
              {completedSubjects} / {kingdoms.length}
            </span>
          </div>
          <div style={{ background: 'var(--border)', borderRadius: 2, height: 3 }}>
            <div style={{
              background: 'linear-gradient(90deg, var(--blue), var(--purple))',
              borderRadius: 2, height: 3,
              width: `${(completedSubjects / kingdoms.length) * 100}%`,
              transition: 'width 0.6s ease',
              minWidth: completedSubjects > 0 ? 6 : 0,
              boxShadow: '0 0 6px var(--blue)',
            }} />
          </div>
        </div>
      </div>

      {/* Subject list */}
      <div style={{ width: '100%', maxWidth: 520, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {kingdoms.map((k, i) => {
          const unlocked = isUnlocked(i)
          const complete = isKingdomComplete(k.dungeons.map(d => d.id))
          const available = k.dungeons.filter(d => !d.stub).length
          const color = k.color ?? 'var(--blue)'

          return (
            <button
              key={k.id}
              onClick={() => unlocked && onSelectKingdom(k.id)}
              disabled={!unlocked}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.8rem 0.9rem',
                background: unlocked
                  ? `linear-gradient(135deg, ${color}08 0%, var(--bg-card) 50%)`
                  : 'var(--bg-mid)',
                border: `1px solid ${complete ? `${color}40` : unlocked ? 'var(--border)' : 'transparent'}`,
                borderLeft: `2px solid ${unlocked ? (complete ? 'var(--correct)' : color) : 'transparent'}`,
                borderRadius: 10,
                cursor: unlocked ? 'pointer' : 'default',
                opacity: unlocked ? 1 : 0.28,
                textAlign: 'left',
                width: '100%',
                transition: 'background 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => {
                if (!unlocked) return
                e.currentTarget.style.background = `linear-gradient(135deg, ${color}12 0%, var(--bg-elevated) 60%)`
                e.currentTarget.style.boxShadow = `0 0 0 1px ${color}25`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = unlocked
                  ? `linear-gradient(135deg, ${color}08 0%, var(--bg-card) 50%)`
                  : 'var(--bg-mid)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Step number */}
              <div style={{
                width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                background: unlocked ? `${color}15` : 'transparent',
                border: `1px solid ${unlocked ? (complete ? 'var(--correct)' : color + '60') : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem', fontWeight: 'bold',
                color: unlocked ? (complete ? 'var(--correct)' : color) : 'var(--text-muted)',
              }}>
                {complete ? '✓' : String(i + 1).padStart(2, '0')}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  color: complete ? 'var(--correct)' : unlocked ? 'var(--text)' : 'var(--text-muted)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  marginBottom: '0.1rem',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {k.title}
                </div>
                <div style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.68rem',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {k.subtitle}
                </div>
              </div>

              {/* Badge */}
              <div style={{ flexShrink: 0 }}>
                {unlocked && !complete && (
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    background: available > 0 ? `${color}12` : 'transparent',
                    color: available > 0 ? color : 'var(--text-muted)',
                    border: `1px solid ${available > 0 ? color + '35' : 'var(--border)'}`,
                    borderRadius: 5,
                    padding: '2px 7px',
                    fontSize: '0.52rem',
                    letterSpacing: '1px',
                    whiteSpace: 'nowrap',
                  }}>
                    {available > 0 ? `${available} ready` : 'soon'}
                  </span>
                )}
                {complete && (
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--correct)',
                    fontSize: '0.52rem',
                    letterSpacing: '1.5px',
                  }}>DONE</span>
                )}
                {!unlocked && (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>⌀</span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      <p style={{
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-muted)',
        fontSize: '0.52rem',
        letterSpacing: '2px',
        marginTop: '1.5rem',
        opacity: 0.4,
      }}>
        {totalLessons} LESSONS AVAILABLE
      </p>
    </div>
  )
}
