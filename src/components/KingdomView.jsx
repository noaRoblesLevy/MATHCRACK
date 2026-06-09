import { isDungeonComplete, isDungeonUnlocked, getProgress } from '../hooks/useProgress'

const TOTAL_ROOMS = 5

function RoomPips({ completed, color }) {
  return (
    <div style={{ display: 'flex', gap: 3, marginTop: '0.3rem' }}>
      {Array.from({ length: TOTAL_ROOMS }).map((_, i) => (
        <div key={i} style={{
          width: i < completed ? 10 : 6,
          height: 4,
          borderRadius: 2,
          background: i < completed ? color : 'var(--border-strong)',
          boxShadow: i < completed ? `0 0 4px ${color}` : 'none',
          transition: 'width 0.2s, background 0.2s',
        }} />
      ))}
    </div>
  )
}

export default function KingdomView({ kingdom, onSelectDungeon, onBack, onTrain }) {
  const { title, subtitle, icon, color = 'var(--blue)', dungeons } = kingdom
  const ids = dungeons.map(d => d.id)
  const completedCount = dungeons.filter(d => isDungeonComplete(d.id)).length
  const availableCount = dungeons.filter(d => !d.stub).length
  const allProgress = getProgress()

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
            const complete = isDungeonComplete(d.id)
            const isStub = !!d.stub
            const clickable = !isStub
            const roomsDone = allProgress[d.id]?.rooms?.length ?? 0
            const inProgress = !complete && roomsDone > 0

            return (
              <div
                key={d.id}
                onClick={() => clickable && onSelectDungeon(d)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.875rem 0.875rem',
                  minHeight: 56,
                  background: complete
                    ? `linear-gradient(135deg, ${color}08, var(--bg-card))`
                    : inProgress
                      ? `linear-gradient(135deg, ${color}05, var(--bg-card))`
                      : 'var(--bg-card)',
                  border: `1px solid ${complete ? color + '30' : inProgress ? color + '20' : 'var(--border)'}`,
                  borderRadius: 9,
                  cursor: clickable ? 'pointer' : 'default',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={e => { if (clickable) e.currentTarget.style.background = `linear-gradient(135deg, ${color}10, var(--bg-elevated))` }}
                onMouseLeave={e => { e.currentTarget.style.background = complete ? `linear-gradient(135deg, ${color}08, var(--bg-card))` : inProgress ? `linear-gradient(135deg, ${color}05, var(--bg-card))` : 'var(--bg-card)' }}
              >
                {/* Step bubble */}
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: complete ? `${color}18` : inProgress ? `${color}10` : 'transparent',
                  border: `1px solid ${complete ? color + '60' : inProgress ? color + '40' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem', fontWeight: 'bold',
                  color: complete ? color : inProgress ? color : 'var(--text-muted)',
                }}>
                  {complete ? '✓' : i + 1}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: complete ? 'var(--correct)' : 'var(--text)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {d.title}
                  </span>
                  {inProgress && <RoomPips completed={roomsDone} color={color} />}
                </div>

                <span style={{ flexShrink: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {complete
                    ? <span style={{ color: 'var(--correct)' }}>✓</span>
                    : isStub
                      ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '1px' }}>SOON</span>
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
