import { motion } from 'framer-motion'

const ITEM_META = {
  'hint-scroll':   { emoji: '📜', label: 'Hint Scroll',    rarity: 'COMMON',    color: '#94a3b8' },
  'focus-crystal': { emoji: '🔷', label: 'Focus Crystal',  rarity: 'RARE',      color: '#60a5fa' },
  'scholars-tome': { emoji: '📖', label: "Scholar's Tome", rarity: 'EPIC',      color: '#a78bfa' },
  'solution-orb':  { emoji: '🔮', label: 'Solution Orb',   rarity: 'LEGENDARY', color: '#fbbf24' },
}

export default function LootDrop({ itemType, onCollect }) {
  const meta = ITEM_META[itemType] ?? ITEM_META['hint-scroll']
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, type: 'spring', duration: 0.5 }}
      style={{
        margin: '1.5rem auto', padding: '1.5rem',
        background: 'var(--bg-mid)', border: `2px solid ${meta.color}`,
        borderRadius: 10, textAlign: 'center', maxWidth: 300,
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{meta.emoji}</div>
      <div style={{ color: meta.color, fontSize: '0.7rem', letterSpacing: '0.12em', marginBottom: '0.25rem' }}>
        {meta.rarity} DROP
      </div>
      <div style={{ color: 'var(--text)', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        {meta.label}
      </div>
      <button
        onClick={onCollect}
        style={{
          padding: '0.6rem 1.5rem', background: meta.color,
          border: 'none', color: '#000', borderRadius: 6,
          cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--font)', fontWeight: 'bold',
        }}
      >
        Collect
      </button>
    </motion.div>
  )
}
