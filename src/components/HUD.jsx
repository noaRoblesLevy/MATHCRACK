import { useGameStore } from '../store/gameStore'

export default function HUD({ dungeonTitle, kingdom, xpReward, currentRoom, totalRooms, onBack }) {
  const streak = useGameStore(s => s.streak)

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'var(--bg-mid)',
      borderBottom: '1px solid var(--border)',
      boxShadow: '0 1px 20px var(--shadow)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0.7rem 0.875rem',
        maxWidth: 620, margin: '0 auto',
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: '1rem', flexShrink: 0,
            lineHeight: 1, padding: '0.2rem', width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 6, transition: 'color 0.15s',
          }}
          title="Exit lesson"
        >
          ✕
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {dungeonTitle}
          </div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{kingdom}</div>
        </div>

        {/* Room progress dots */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexShrink: 0 }}>
          {Array.from({ length: totalRooms }).map((_, i) => (
            <div key={i} style={{
              width: i === currentRoom ? 16 : 6,
              height: 6,
              borderRadius: 3,
              background: i < currentRoom
                ? 'var(--correct)'
                : i === currentRoom
                  ? 'var(--blue)'
                  : 'var(--border-strong)',
              boxShadow: i === currentRoom ? '0 0 6px var(--blue)' : 'none',
              transition: 'width 0.3s, background 0.3s',
            }} />
          ))}
        </div>

        <div style={{
          fontFamily: 'var(--font-mono)',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 6, padding: '0.2rem 0.6rem',
          fontSize: '0.72rem', color: 'var(--gold)',
          flexShrink: 0,
        }}>
          +{xpReward}
        </div>
      </div>
    </div>
  )
}
