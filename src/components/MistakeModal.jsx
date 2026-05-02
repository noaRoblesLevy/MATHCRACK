import { motion } from 'framer-motion'

export default function MistakeModal({ explanation, correctAnswer, onDismiss }) {
  return (
    <>
      <div
        onClick={onDismiss}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200 }}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: '#1a0a0a', borderTop: '2px solid #dc2626',
          padding: '2rem 1.5rem', zIndex: 201, maxWidth: 700, margin: '0 auto',
        }}
      >
        <div style={{ color: '#fca5a5', fontSize: '0.75rem', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>
          NOT QUITE — HERE'S WHY
        </div>
        <p style={{ color: 'var(--text)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1rem' }}>
          {explanation}
        </p>
        <div style={{
          padding: '0.75rem 1rem', background: '#14532d',
          borderRadius: 6, marginBottom: '1.5rem', fontSize: '0.9rem', color: '#86efac',
        }}>
          ✓ Correct answer: <strong>{correctAnswer}</strong>
        </div>
        <button
          onClick={onDismiss}
          style={{
            width: '100%', padding: '0.85rem', background: 'var(--violet)',
            border: 'none', color: '#fff', borderRadius: 6,
            cursor: 'pointer', fontSize: '1rem', fontFamily: 'var(--font)',
          }}
        >
          Got it
        </button>
      </motion.div>
    </>
  )
}
