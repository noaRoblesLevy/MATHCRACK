const ITEM_META = {
  'hint-scroll':   { emoji: '📜', label: 'Hint Scrolls',   desc: 'Reveal one hint step per use' },
  'focus-crystal': { emoji: '🔷', label: 'Focus Crystal',  desc: 'Hide hints for a cleaner view' },
  'scholars-tome': { emoji: '📖', label: "Scholar's Tome", desc: 'See explanations after every answer' },
  'solution-orb':  { emoji: '🔮', label: 'Solution Orbs',  desc: 'Reveal the correct answer before answering' },
}

export default function InventoryBar({ inventory, focusMode, scholarActive, onToggleFocus, onToggleScholar }) {
  return (
    <div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '0.75rem' }}>INVENTORY</div>
      {inventory.map((item) => {
        const meta = ITEM_META[item.type]
        if (!meta) return null
        const isToggleable = item.type === 'focus-crystal' || item.type === 'scholars-tome'
        const isActive = item.type === 'focus-crystal' ? focusMode : scholarActive
        return (
          <div key={item.type} style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.6rem 0.75rem', marginBottom: '0.5rem',
            background: isActive ? '#1a1040' : 'var(--bg-deep)',
            border: `1px solid ${isActive ? 'var(--violet)' : 'var(--border)'}`,
            borderRadius: 6,
          }}>
            <span style={{ fontSize: '1.2rem' }}>{meta.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'var(--text)', fontSize: '0.85rem' }}>{meta.label}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{meta.desc}</div>
            </div>
            <span style={{ color: 'var(--gold)', fontWeight: 'bold', fontSize: '1rem', minWidth: '1.5rem', textAlign: 'right' }}>
              {item.count}
            </span>
            {isToggleable && (
              <button
                onClick={item.type === 'focus-crystal' ? onToggleFocus : onToggleScholar}
                disabled={!isActive && item.count === 0}
                style={{
                  padding: '0.25rem 0.6rem', fontSize: '0.7rem',
                  background: isActive ? 'var(--violet)' : 'var(--bg-mid)',
                  border: '1px solid var(--border)', color: isActive ? '#fff' : 'var(--text-muted)',
                  borderRadius: 4, cursor: item.count > 0 || isActive ? 'pointer' : 'not-allowed',
                  fontFamily: 'var(--font)',
                }}
              >
                {isActive ? 'ON' : 'USE'}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
