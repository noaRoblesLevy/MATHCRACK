import { useGameStore } from '../store/gameStore'
import { getTitle, getXPToNextLevel, getTierProgress } from '../hooks/useXP'
import { useTheme } from '../hooks/useTheme'

const TIERS = [
  { title: 'Apprentice',  icon: '🎒', xp: 0,    next: 100,  color: '#60a5fa', desc: 'Just starting your journey' },
  { title: 'Adept',       icon: '📖', xp: 100,  next: 300,  color: '#34d399', desc: 'The basics are within reach' },
  { title: 'Scholar',     icon: '🎓', xp: 300,  next: 700,  color: '#a78bfa', desc: 'Serious student of mathematics' },
  { title: 'Sage',        icon: '🌟', xp: 700,  next: 1500, color: '#fbbf24', desc: 'Deep knowledge, sharp instincts' },
  { title: 'Archmage',    icon: '🔮', xp: 1500, next: 3000, color: '#f97316', desc: 'Commanding mastery of algebra' },
  { title: 'Math Lich',   icon: '💀', xp: 3000, next: null, color: '#ef4444', desc: 'Immortal. Numbers bend to you.' },
]

function Bar({ pct, color }) {
  return (
    <div style={{ background: 'var(--border)', borderRadius: 2, height: 3, marginTop: '0.5rem' }}>
      <div style={{
        background: color, borderRadius: 2, height: 3,
        width: `${Math.round(pct * 100)}%`,
        transition: 'width 0.6s ease',
        boxShadow: `0 0 6px ${color}`,
        minWidth: pct > 0 ? 4 : 0,
      }} />
    </div>
  )
}

export default function ProfileScreen() {
  const xp = useGameStore(s => s.xp)
  const streak = useGameStore(s => s.streak)
  const currentTitle = getTitle(xp)
  const toNext = getXPToNextLevel(xp)
  const { isDark, toggle: toggleTheme } = useTheme()
  const progress = getTierProgress(xp)
  const currentIdx = TIERS.findIndex(t => t.title === currentTitle)
  const current = TIERS[currentIdx]

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
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '1.25rem',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            fontSize: '0.58rem',
            letterSpacing: '3px',
          }}>PROFILE</span>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              width: 48, height: 26, borderRadius: 13,
              background: isDark ? '#0c1628' : '#dbeafe',
              border: `1px solid ${isDark ? 'rgba(96,165,250,0.25)' : 'rgba(37,99,235,0.2)'}`,
              position: 'relative', cursor: 'pointer',
              transition: 'background 0.3s', padding: 0, flexShrink: 0,
            }}
          >
            <div style={{
              position: 'absolute', top: 4,
              left: isDark ? 4 : 22,
              width: 16, height: 16, borderRadius: '50%',
              background: isDark ? '#60a5fa' : '#fbbf24',
              transition: 'left 0.28s cubic-bezier(0.34,1.56,0.64,1), background 0.3s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.6rem',
              boxShadow: isDark ? '0 0 8px rgba(96,165,250,0.6)' : '0 0 8px rgba(251,191,36,0.6)',
            }}>
              {isDark ? '🌙' : '☀️'}
            </div>
          </button>
        </div>

        {/* Current status */}
        <div style={{
          background: `linear-gradient(135deg, ${current?.color ?? '#60a5fa'}0c 0%, var(--bg-card) 60%)`,
          border: `1px solid ${current?.color ?? '#60a5fa'}25`,
          borderRadius: 14,
          padding: '1.5rem 1.25rem',
          marginBottom: '1.25rem',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem', lineHeight: 1 }}>
            {current?.icon ?? '🎒'}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-mono)',
            color: current?.color ?? 'var(--blue)',
            fontSize: '1.3rem',
            letterSpacing: '3px',
            marginBottom: '0.2rem',
          }}>
            {currentTitle}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '1.25rem' }}>
            {current?.desc}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold)', fontSize: '1.5rem', fontWeight: 'bold', lineHeight: 1 }}>{xp}</div>
              <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.55rem', letterSpacing: '1.5px', marginTop: '0.25rem' }}>TOTAL XP</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue)', fontSize: '1.5rem', fontWeight: 'bold', lineHeight: 1 }}>{streak}</div>
              <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.55rem', letterSpacing: '1.5px', marginTop: '0.25rem' }}>DAY STREAK</div>
            </div>
          </div>

          {toNext > 0 ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
                  → {TIERS[currentIdx + 1]?.title}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.62rem' }}>
                  {toNext} XP to go
                </span>
              </div>
              <Bar pct={progress} color={current?.color ?? 'var(--blue)'} />
            </>
          ) : (
            <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--correct)', fontSize: '0.7rem', letterSpacing: '2px' }}>
              ✓ MAX LEVEL
            </div>
          )}
        </div>

        {/* Title roadmap */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          fontSize: '0.56rem',
          letterSpacing: '2.5px',
          marginBottom: '0.75rem',
        }}>
          TITLE PROGRESSION
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {TIERS.map((tier, i) => {
            const unlocked = xp >= tier.xp
            const isCurrent = tier.title === currentTitle

            return (
              <div key={tier.title} style={{
                background: isCurrent
                  ? `linear-gradient(135deg, ${tier.color}0e 0%, var(--bg-elevated) 60%)`
                  : 'var(--bg-card)',
                border: `1px solid ${isCurrent ? tier.color + '35' : 'var(--border)'}`,
                borderLeft: `2px solid ${unlocked ? tier.color : 'var(--border)'}`,
                borderRadius: 10,
                padding: '0.8rem 0.875rem',
                opacity: unlocked ? 1 : 0.35,
                transition: 'opacity 0.2s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.35rem', lineHeight: 1, flexShrink: 0 }}>
                    {unlocked ? tier.icon : '⌀'}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                      <span style={{
                        fontWeight: isCurrent ? 700 : 500,
                        fontSize: '0.88rem',
                        color: isCurrent ? tier.color : unlocked ? 'var(--text)' : 'var(--text-muted)',
                      }}>
                        {tier.title}
                      </span>
                      {isCurrent && (
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          background: tier.color,
                          color: '#000',
                          fontSize: '0.45rem',
                          padding: '2px 5px',
                          borderRadius: 3,
                          letterSpacing: '1px',
                          fontWeight: 'bold',
                        }}>NOW</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{tier.desc}</div>
                    {isCurrent && tier.next && (
                      <Bar pct={progress} color={tier.color} />
                    )}
                    {!unlocked && (
                      <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.58rem', marginTop: '0.25rem' }}>
                        {tier.xp} XP · {tier.xp - xp} to go
                      </div>
                    )}
                    {unlocked && !isCurrent && (
                      <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--correct)', fontSize: '0.56rem', marginTop: '0.2rem', letterSpacing: '1px' }}>
                        ✓ Unlocked
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
