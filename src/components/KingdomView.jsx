import { isDungeonComplete, isDungeonUnlocked } from '../hooks/useProgress'

export default function KingdomView({ kingdomTitle, dungeons, onSelectDungeon, onBack, onTrain }) {
  const ids = dungeons.map((d) => d.id)

  return (
    <div style={{ padding: '1.5rem', maxWidth: 700, margin: '0 auto' }}>
      <button
        onClick={onBack}
        style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', marginBottom: '1rem', fontSize: '0.9rem' }}
      >
        ← Map
      </button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'var(--gold)', margin: 0 }}>{kingdomTitle}</h2>
        <button
          onClick={onTrain}
          style={{
            background: '#1a1040', border: '1px solid #7c3aed', borderRadius: 6,
            color: '#c4b5fd', cursor: 'pointer', padding: '0.4rem 0.9rem',
            fontSize: '0.85rem', fontWeight: 'bold',
          }}
        >
          ⚔ Train
        </button>
      </div>
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {dungeons.map((d, i) => {
          const unlocked = isDungeonUnlocked(ids, i)
          const complete = isDungeonComplete(d.id)
          const isStub = !!d.stub
          return (
            <div
              key={d.id}
              onClick={() => unlocked && !isStub && onSelectDungeon(d)}
              style={{
                padding: '1rem 1.25rem',
                background: 'var(--bg-mid)',
                border: `1px solid ${complete ? 'var(--correct)' : unlocked ? 'var(--border)' : '#1a1030'}`,
                borderRadius: 6,
                cursor: unlocked && !isStub ? 'pointer' : 'default',
                opacity: unlocked ? 1 : 0.4,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}
            >
              <span style={{ color: complete ? 'var(--correct)' : 'var(--text)' }}>
                {i + 1}. {d.title}
              </span>
              <span>{complete ? '✅' : unlocked ? (isStub ? '🔧' : '▶') : '💀'}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
