import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { getTitle, getXPToNextLevel } from '../hooks/useXP'
import LootDrop from './LootDrop'

export default function ResultScreen({ passed, xpGained, dungeonTitle, lootDrop, onContinue, onRetry }) {
  const xp = useGameStore((s) => s.xp)
  const [lootCollected, setLootCollected] = useState(false)

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '2rem',
      background: 'var(--bg-deep)',
    }}>
      {passed ? (
        <>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.6 }}
            style={{ fontSize: '4rem', marginBottom: '1rem' }}
          >
            🏆
          </motion.div>
          <h2 style={{ color: 'var(--gold)', marginBottom: '0.5rem', fontSize: '1.6rem' }}>
            Dungeon Cleared!
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{dungeonTitle}</p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              padding: '1rem 2rem', background: 'var(--bg-mid)',
              border: '2px solid var(--gold)', borderRadius: 8,
              marginBottom: lootDrop ? '1rem' : '2rem', textAlign: 'center',
            }}
          >
            <div style={{ color: 'var(--gold)', fontSize: '1.5rem', fontWeight: 'bold' }}>
              +{xpGained} XP
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>
              {getTitle(xp)} · {getXPToNextLevel(xp) > 0 ? `${getXPToNextLevel(xp)} XP to next level` : 'MAX LEVEL'}
            </div>
          </motion.div>

          {lootDrop && !lootCollected && (
            <LootDrop itemType={lootDrop} onCollect={() => setLootCollected(true)} />
          )}

          {(!lootDrop || lootCollected) && (
            <button
              onClick={onContinue}
              style={{
                padding: '0.75rem 2.5rem', background: 'var(--violet)',
                border: 'none', color: '#fff', borderRadius: 6,
                cursor: 'pointer', fontSize: '1rem', fontFamily: 'var(--font)',
              }}
            >
              Continue →
            </button>
          )}
        </>
      ) : (
        <>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💀</div>
          <h2 style={{ color: '#ef4444', marginBottom: '0.5rem', fontSize: '1.6rem' }}>
            Boss Defeated You
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Review the material and try again.
          </p>
          <button
            onClick={onRetry}
            style={{
              padding: '0.75rem 2.5rem', background: '#7f1d1d',
              border: '1px solid #ef4444', color: '#fca5a5',
              borderRadius: 6, cursor: 'pointer', fontSize: '1rem', fontFamily: 'var(--font)',
            }}
          >
            Try Again
          </button>
        </>
      )}
    </div>
  )
}
