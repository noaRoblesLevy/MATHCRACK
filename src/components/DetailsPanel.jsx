import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { getTitle, getXPToNextLevel, getTierProgress } from '../hooks/useXP'
import InventoryBar from './InventoryBar'

export default function DetailsPanel({ inventory, focusMode, scholarActive, onToggleFocus, onToggleScholar }) {
  const [open, setOpen] = useState(false)
  const xp = useGameStore((s) => s.xp)
  const streak = useGameStore((s) => s.streak)
  const title = getTitle(xp)
  const toNext = getXPToNextLevel(xp)
  const progress = getTierProgress(xp)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem',
          background: 'var(--violet)', border: 'none', color: '#fff',
          padding: '0.6rem 1.2rem', borderRadius: 6,
          cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--font)',
          zIndex: 99,
        }}
      >
        Stats ▲
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, width: 300,
                background: 'var(--bg-mid)', borderLeft: '2px solid var(--border)',
                padding: '2rem 1.5rem', zIndex: 101, overflowY: 'auto',
              }}
            >
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.9rem' }}
              >
                ✕ Close
              </button>
              <h3 style={{ color: 'var(--gold)', marginBottom: '1.5rem' }}>Your Stats</h3>
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: 4 }}>TITLE</div>
                <div style={{ color: 'var(--gold)', fontWeight: 'bold', fontSize: '1.1rem' }}>{title}</div>
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: 4 }}>TOTAL XP</div>
                <div style={{ color: 'var(--text)', fontSize: '1.4rem' }}>{xp}</div>
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: 6 }}>
                  {toNext > 0 ? `${toNext} XP to next level` : 'MAX LEVEL — Math Lich achieved'}
                </div>
                <div style={{ background: 'var(--border)', borderRadius: 4, height: 8 }}>
                  <div style={{
                    background: 'var(--gold)', borderRadius: 4, height: 8,
                    width: `${Math.round(progress * 100)}%`,
                    transition: 'width 0.4s',
                  }} />
                </div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: 4 }}>STREAK</div>
                <div style={{ color: 'var(--violet-light)', fontSize: '1.1rem' }}>🔥 {streak} days</div>
              </div>
              {inventory && (
                <InventoryBar
                  inventory={inventory}
                  focusMode={focusMode}
                  scholarActive={scholarActive}
                  onToggleFocus={onToggleFocus}
                  onToggleScholar={onToggleScholar}
                />
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
