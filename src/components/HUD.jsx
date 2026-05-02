import { useGameStore } from '../store/gameStore'

export default function HUD({ dungeonTitle, kingdom, xpReward, currentRoom, totalRooms }) {
  const streak = useGameStore((s) => s.streak)
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0.75rem 1.5rem', background: 'var(--bg-mid)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div>
        <div style={{ color: 'var(--gold)', fontWeight: 'bold', fontSize: '1rem' }}>{dungeonTitle}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{kingdom}</div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {Array.from({ length: totalRooms }).map((_, i) => (
          <span key={i} style={{
            width: 10, height: 10, borderRadius: '50%', display: 'inline-block',
            background: i < currentRoom ? 'var(--correct)' : i === currentRoom ? 'var(--gold)' : 'var(--border)',
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <span style={{ color: 'var(--violet-light)' }}>🔥 {streak}</span>
        <span style={{ color: 'var(--gold)' }}>+{xpReward} XP</span>
      </div>
    </div>
  )
}
