import { motion } from 'framer-motion'

export default function MistakeModal({ explanation, correctAnswer, canRetry, onRetry, onDismiss }) {
  return (
    <>
      <div
        onClick={canRetry ? onRetry : onDismiss}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200 }}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'var(--bg-mid)',
          borderTop: '2px solid var(--danger)',
          padding: '1.75rem 1.5rem calc(1.75rem + env(safe-area-inset-bottom))',
          zIndex: 201, maxWidth: 700, margin: '0 auto',
        }}
      >
        <div style={{ color: 'var(--danger)', fontSize: '0.72rem', marginBottom: '0.5rem', letterSpacing: '1.5px', fontFamily: 'var(--font-mono)' }}>
          {canRetry ? 'NOT QUITE — TRY AGAIN?' : 'NOT QUITE — HERE\'S WHY'}
        </div>
        <p style={{ color: 'var(--text)', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '1rem' }}>
          {explanation}
        </p>
        <div style={{
          padding: '0.7rem 1rem', background: 'var(--correct-dim)',
          border: '1px solid var(--correct)',
          borderRadius: 8, marginBottom: '1.25rem', fontSize: '0.88rem', color: 'var(--correct)',
        }}>
          ✓ {correctAnswer}
        </div>

        {canRetry ? (
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              onClick={onDismiss}
              style={{
                flex: 1, padding: '0.85rem', minHeight: 52,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)', color: 'var(--text-muted)',
                borderRadius: 10, cursor: 'pointer',
                fontSize: '0.88rem', fontFamily: 'var(--font-mono)',
              }}
            >
              Skip
            </button>
            <button
              onClick={onRetry}
              style={{
                flex: 2, padding: '0.85rem', minHeight: 52,
                background: 'var(--blue)',
                border: 'none', color: '#fff',
                borderRadius: 10, cursor: 'pointer',
                fontSize: '0.95rem', fontFamily: 'var(--font-mono)',
                fontWeight: 'bold', letterSpacing: '0.5px',
                boxShadow: '0 0 16px var(--blue-glow)',
              }}
            >
              Try Again →
            </button>
          </div>
        ) : (
          <button
            onClick={onDismiss}
            style={{
              width: '100%', padding: '0.85rem', minHeight: 52,
              background: 'var(--purple)',
              border: 'none', color: '#fff', borderRadius: 10,
              cursor: 'pointer', fontSize: '0.95rem',
              fontFamily: 'var(--font-mono)', fontWeight: 'bold',
            }}
          >
            Got it
          </button>
        )}
      </motion.div>
    </>
  )
}
