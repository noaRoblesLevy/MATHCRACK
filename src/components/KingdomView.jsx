import { isDungeonComplete, isDungeonUnlocked } from '../hooks/useProgress'

export default function KingdomView({ kingdom, onSelectDungeon, onBack, onTrain }) {
  const { title, subtitle, icon, color = 'var(--blue)', dungeons } = kingdom
  const ids = dungeons.map(d => d.id)
  const completedCount = dungeons.filter(d => isDungeonComplete(d.id)).length
  const availableCount = dungeons.filter(d => !d.stub).length

  return (
    <div className="page-with-nav" style={{
      minHeight: '100vh',
      background: 'var(--bg-deep)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1.25rem 0.875rem 1rem',
    }}>
      <div style={{ width: '100%', maxWidth: 520 }}>

        {/* Back */}
        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: '0.8rem',
            marginBottom: '1rem',
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: 0, fontFamily: 'var(--font-ui)',
          }}
        >
          ← Subjects
        </button>

        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${color}10 0%, var(--bg-card) 60%)`,
          border: `1px solid ${color}25`,
          borderLeft: `3px solid ${color}`,
          borderRadius: 12,
          padding: '1.1rem 1rem',
          marginBottom: '1rem',
          display: 'flex', alignItems: 'center', gap: '0.85rem',
        }}>
          <span style={{ fontSize: '2rem', lineHeight: 1, flexShrink: 0 }}>{icon ?? '📚'}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.15rem', color: 'var(--text)' }}>
              {title}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>{subtitle}</p>
          </div>
          <button
            onClick={onTrain}
            style={{
              background: `${color}14`, border: `1px solid ${color}35`,
              borderRadius: 8, color,
              cursor: 'pointer', padding: '0.4rem 0.75rem',
              fontSize: '0.75rem', fontFamily: 'var(--font-mono)',
              whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            Practice
          </button>
        </div>

        {/* Progress bar */}
        {availableCount > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.56rem', letterSpacing: '1.5px' }}>
                LESSONS
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.56rem' }}>
                {completedCount} / {availableCount}
              </span>
            </div>
            <div style={{ background: 'var(--border)', borderRadius: 2, height: 3 }}>
              <div style={{
                background: color, borderRadius: 2, height: 3,
                width: `${(completedCount / availableCount) * 100}%`,
                transition: 'width 0.5s ease',
                boxShadow: `0 0 6px ${color}`,
                minWidth: completedCount > 0 ? 6 : 0,
              }} />
            </div>
          </div>
        )}

        {/* Lessons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {dungeons.map((d, i) => {
            const unlocked = isDungeonUnlocked(ids, i)
            const complete = isDungeonComplete(d.id)
            const isStub = !!d.stub
            const clickable = unlocked && !isStub

            return (
              <div
                key={d.id}
                onClick={() => clickable && onSelectDungeon(d)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 0.875rem',
                  background: complete
                    ? `linear-gradient(135deg, ${color}08, var(--bg-card))`
                    : unlocked ? 'var(--bg-card)' : 'var(--bg-mid)',
                  border: `1px solid ${complete ? color + '30' : 'var(--border)'}`,
                  borderRadius: 9,
                  cursor: clickable ? 'pointer' : 'default',
                  opacity: unlocked ? 1 : 0.28,
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => { if (clickable) e.currentTarget.style.background = `linear-gradient(135deg, ${color}10, var(--bg-elevated))` }}
                onMouseLeave={e => { e.currentTarget.style.background = complete ? `linear-gradient(135deg, ${color}08, var(--bg-card))` : unlocked ? 'var(--bg-card)' : 'var(--bg-mid)' }}
              >
                {/* Step bubble */}
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                  background: complete ? `${color}18` : 'transparent',
                  border: `1px solid ${complete ? color + '60' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem', fontWeight: 'bold',
                  color: complete ? color : 'var(--text-muted)',
                }}>
                  {complete ? '✓' : i + 1}
                </div>

                <span style={{
                  flex: 1,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: complete ? 'var(--correct)' : unlocked ? 'var(--text)' : 'var(--text-muted)',
                  minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {d.title}
                </span>

                <span style={{ flexShrink: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {complete ? <span style={{ color: 'var(--correct)' }}>✓</span>
                    : !unlocked ? '⌀'
                    : isStub ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '1px', color: 'var(--text-muted)' }}>SOON</span>
                    : '›'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
