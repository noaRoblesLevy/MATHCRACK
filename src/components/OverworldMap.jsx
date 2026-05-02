import { isKingdomComplete } from '../hooks/useProgress'

const KINGDOM_COLORS = ['#4c1d95', '#1e3a5f', '#14532d', '#7c2d12']

export default function OverworldMap({ kingdoms, onSelectKingdom }) {
  function isUnlocked(index) {
    if (index === 0) return true
    const prev = kingdoms[index - 1]
    return isKingdomComplete(prev.dungeons.map((d) => d.id))
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ color: 'var(--gold)', textAlign: 'center', marginBottom: '2rem', fontSize: '1.8rem' }}>
        ⚔ MATHCRACK
      </h1>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {kingdoms.map((k, i) => {
          const unlocked = isUnlocked(i)
          return (
            <div
              key={k.id}
              onClick={() => unlocked && onSelectKingdom(k.id)}
              style={{
                padding: '1.5rem',
                background: unlocked ? KINGDOM_COLORS[i] : 'var(--bg-mid)',
                border: `2px solid ${unlocked ? 'var(--gold)' : 'var(--border)'}`,
                borderRadius: 8,
                cursor: unlocked ? 'pointer' : 'default',
                opacity: unlocked ? 1 : 0.5,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: 'var(--gold)', fontWeight: 'bold', fontSize: '1.1rem' }}>{k.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>{k.subtitle}</div>
                </div>
                <span style={{ fontSize: '1.5rem' }}>{unlocked ? '🏰' : '🔒'}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
