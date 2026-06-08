import { useGameStore } from '../store/gameStore'
import { isKingdomComplete } from '../hooks/useProgress'

export default function OverworldMap({ kingdoms, onSelectKingdom }) {
  const xp = useGameStore(s => s.xp)
  const streak = useGameStore(s => s.streak)
  const hasSeenHint = useGameStore(s => s.hasSeenHint)
  const dismissHint = useGameStore(s => s.dismissHint)

  const totalLessons = kingdoms.reduce((sum, k) => sum + k.dungeons.filter(d => !d.stub).length, 0)
  const completedSubjects = kingdoms.filter(k => isKingdomComplete(k.dungeons.map(d => d.id))).length

  function handleSelect(id) {
    dismissHint()
    onSelectKingdom(id)
  }

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

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
            <img src="/logo.svg" alt="" style={{ width: 40, height: 40 }} />
            <h1 style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--blue)',
              fontSize: 'clamp(1.4rem, 6vw, 2.1rem)',
              letterSpacing: '5px',
              textShadow: '0 0 40px var(--blue-glow)',
              lineHeight: 1,
            }}>
              MATHCRACK
            </h1>
          </div>
          <p style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            fontSize: '0.58rem',
            letterSpacing: '3px',
          }}>
            PRE-ALGEBRA &amp; ALGEBRA 1
          </p>

          {/* Stat bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            marginTop: '0.9rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem' }}>🔥</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold)', fontSize: '0.78rem', fontWeight: 'bold' }}>
                {streak}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.55rem', letterSpacing: '1px' }}>
                DAY
              </span>
            </div>
            <div style={{ width: 1, height: 14, background: 'var(--border)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue)', fontSize: '0.78rem', fontWeight: 'bold' }}>
                {xp}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.55rem', letterSpacing: '1px' }}>
                XP
              </span>
            </div>
            <div style={{ width: 1, height: 14, background: 'var(--border)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--correct)', fontSize: '0.78rem', fontWeight: 'bold' }}>
                {completedSubjects}/{kingdoms.length}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.55rem', letterSpacing: '1px' }}>
                DONE
              </span>
            </div>
          </div>

          {/* Overall progress bar */}
          <div style={{ marginTop: '0.85rem' }}>
            <div style={{ background: 'var(--border)', borderRadius: 2, height: 2 }}>
              <div style={{
                background: 'linear-gradient(90deg, var(--blue), var(--purple))',
                borderRadius: 2, height: 2,
                width: `${(completedSubjects / kingdoms.length) * 100}%`,
                transition: 'width 0.6s ease',
                minWidth: completedSubjects > 0 ? 6 : 0,
                boxShadow: '0 0 6px var(--blue)',
              }} />
            </div>
          </div>
        </div>

        {/* Subject list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {kingdoms.map((k, i) => {
            const complete = isKingdomComplete(k.dungeons.map(d => d.id))
            const available = k.dungeons.filter(d => !d.stub).length
            const completed = k.dungeons.filter(d => {
              const p = JSON.parse(localStorage.getItem('mathcrack_progress') || '{}')
              return p[d.id]?.bossComplete === true
            }).length
            const color = k.color ?? 'var(--blue)'
            const isFirst = i === 0 && !hasSeenHint

            return (
              <div key={k.id} style={{ position: 'relative' }}>
                {isFirst && (
                  <div style={{
                    position: 'absolute',
                    right: -4, top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    pointerEvents: 'none',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--blue)',
                      fontSize: '0.5rem',
                      letterSpacing: '1px',
                      whiteSpace: 'nowrap',
                    }}>START HERE</span>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: 'var(--blue)',
                      animation: 'hintPulse 1.4s ease-in-out infinite',
                      flexShrink: 0,
                    }} />
                  </div>
                )}

                <button
                  onClick={() => handleSelect(k.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.875rem 0.9rem',
                    minHeight: 64,
                    background: `linear-gradient(135deg, ${color}08 0%, var(--bg-card) 50%)`,
                    border: `1px solid ${complete ? `${color}40` : 'var(--border)'}`,
                    borderLeft: `2px solid ${complete ? 'var(--correct)' : color}`,
                    borderRadius: 10,
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'background 0.15s, box-shadow 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${color}12 0%, var(--bg-elevated) 60%)`
                    e.currentTarget.style.boxShadow = `0 0 0 1px ${color}25`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${color}08 0%, var(--bg-card) 50%)`
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {/* Step number */}
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: `${color}15`,
                    border: `1px solid ${complete ? 'var(--correct)' : color + '60'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem', fontWeight: 'bold',
                    color: complete ? 'var(--correct)' : color,
                  }}>
                    {complete ? '✓' : String(i + 1).padStart(2, '0')}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      color: complete ? 'var(--correct)' : 'var(--text)',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      marginBottom: '0.15rem',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {k.title}
                    </div>
                    <div style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.63rem',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {k.subtitle}
                    </div>
                  </div>

                  {/* Lesson count + badge */}
                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    {available > 0 && (
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.62rem',
                        color: complete ? 'var(--correct)' : completed > 0 ? color : 'var(--text-muted)',
                        fontWeight: 'bold',
                        marginBottom: '0.1rem',
                      }}>
                        {completed} / {available}
                      </div>
                    )}
                    {complete ? (
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--correct)',
                        fontSize: '0.48rem',
                        letterSpacing: '1.5px',
                      }}>DONE</span>
                    ) : available === 0 ? (
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border)',
                        borderRadius: 4,
                        padding: '1px 5px',
                        fontSize: '0.48rem',
                        letterSpacing: '1px',
                      }}>soon</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>›</span>
                    )}
                  </div>
                </button>
              </div>
            )
          })}
        </div>

        <p style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          fontSize: '0.52rem',
          letterSpacing: '2px',
          marginTop: '1.5rem',
          textAlign: 'center',
          opacity: 0.4,
        }}>
          {totalLessons} LESSONS AVAILABLE
        </p>
      </div>
    </div>
  )
}
