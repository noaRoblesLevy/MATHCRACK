import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { getTitle, getXPToNextLevel } from '../hooks/useXP'
import LootDrop from './LootDrop'

function StatCard({ label, value, sub, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      style={{
        flex: 1,
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '0.75rem 0.5rem',
        textAlign: 'center',
      }}
    >
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: color ?? 'var(--text)',
        lineHeight: 1,
        marginBottom: '0.3rem',
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        letterSpacing: '1px',
        color: 'var(--text-muted)',
        marginBottom: sub ? '0.15rem' : 0,
      }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          {sub}
        </div>
      )}
    </motion.div>
  )
}

export default function ResultScreen({
  passed,
  xpGained,
  lessonTitle,
  totalRooms = 5,
  roomsCorrect = 0,
  bossScore = { correct: 0, total: 3 },
  lootDrop,
  wrongBossQuestions = [],
  nextLessonTitle = null,
  onContinue,
  onNextLesson = null,
  onRetry,
}) {
  const xp = useGameStore((s) => s.xp)
  const [lootCollected, setLootCollected] = useState(false)
  const [showMistakes, setShowMistakes] = useState(false)
  const toNext = getXPToNextLevel(xp)

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '2rem 1.25rem',
      background: 'var(--bg-deep)',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {passed ? (
          <>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 0.6 }}
              style={{ fontSize: '3.5rem', textAlign: 'center', marginBottom: '0.75rem' }}
            >
              🏆
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              style={{
                color: 'var(--gold)', textAlign: 'center',
                marginBottom: '0.3rem', fontSize: '1.5rem', fontWeight: 700,
              }}
            >
              Lesson Complete
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              style={{
                color: 'var(--text-muted)', textAlign: 'center',
                fontSize: '0.8rem', marginBottom: '1.75rem',
              }}
            >
              {lessonTitle}
            </motion.p>

            {/* Performance breakdown */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <StatCard
                label="QUESTIONS"
                value={`${roomsCorrect}/${totalRooms}`}
                sub={roomsCorrect === totalRooms ? 'perfect' : null}
                color={roomsCorrect === totalRooms ? 'var(--correct)' : 'var(--text)'}
                delay={0.4}
              />
              <StatCard
                label="BOSS"
                value={`${bossScore.correct}/${bossScore.total}`}
                sub={`need ${Math.ceil(bossScore.total * 2 / 3)}`}
                color={bossScore.correct >= Math.ceil(bossScore.total * 2 / 3) ? 'var(--correct)' : 'var(--text)'}
                delay={0.48}
              />
              <StatCard
                label="XP EARNED"
                value={`+${xpGained}`}
                color="var(--gold)"
                delay={0.56}
              />
            </div>

            {/* XP progress */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              style={{
                padding: '0.875rem 1rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                marginBottom: lootDrop ? '1rem' : '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)', fontSize: '0.82rem' }}>
                {getTitle(xp)}
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                color: toNext > 0 ? 'var(--text-muted)' : 'var(--correct)',
                fontSize: '0.65rem',
              }}>
                {toNext > 0 ? `${toNext} XP to next level` : '✓ MAX LEVEL'}
              </span>
            </motion.div>

            {lootDrop && !lootCollected && (
              <LootDrop itemType={lootDrop} onCollect={() => setLootCollected(true)} />
            )}

            {(!lootDrop || lootCollected) && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
              >
                {onNextLesson && (
                  <button
                    onClick={onNextLesson}
                    style={{
                      width: '100%', padding: '0.95rem', minHeight: 52,
                      background: 'var(--violet)', border: 'none', color: '#fff',
                      borderRadius: 10, cursor: 'pointer', fontSize: '0.95rem',
                      fontFamily: 'var(--font-mono)', fontWeight: 'bold', letterSpacing: '1px',
                      boxShadow: '0 0 20px rgba(139,92,246,0.3)',
                    }}
                  >
                    Next: {nextLessonTitle} →
                  </button>
                )}
                <button
                  onClick={onContinue}
                  style={{
                    width: '100%', padding: '0.75rem', minHeight: 44,
                    background: 'none',
                    border: onNextLesson ? 'none' : '1px solid var(--border)',
                    borderRadius: 10, color: onNextLesson ? 'var(--text-muted)' : 'var(--text)',
                    cursor: 'pointer', fontSize: onNextLesson ? '0.78rem' : '0.95rem',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {onNextLesson ? 'Back to subject' : 'Continue →'}
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <>
            <div style={{ fontSize: '3.5rem', textAlign: 'center', marginBottom: '0.75rem' }}>💀</div>
            <h2 style={{
              color: 'var(--danger)', textAlign: 'center',
              marginBottom: '0.3rem', fontSize: '1.5rem', fontWeight: 700,
            }}>
              Lesson Failed
            </h2>
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.8rem', marginBottom: '1.75rem' }}>
              {lessonTitle}
            </p>

            {/* Boss score on fail */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <StatCard
                label="QUESTIONS"
                value={`${roomsCorrect}/${totalRooms}`}
                color="var(--text)"
                delay={0.1}
              />
              <StatCard
                label="BOSS"
                value={`${bossScore.correct}/${bossScore.total}`}
                sub={`needed ${Math.ceil(bossScore.total * 2 / 3)}`}
                color="var(--danger)"
                delay={0.18}
              />
            </div>

            {wrongBossQuestions.length > 0 && (
              <div style={{ marginBottom: '1rem' }}>
                <button
                  onClick={() => setShowMistakes(m => !m)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.75rem 1rem', minHeight: 44,
                    background: showMistakes ? 'rgba(239,68,68,0.08)' : 'var(--bg-card)',
                    border: `1px solid ${showMistakes ? 'var(--danger)' : 'var(--border)'}`,
                    borderRadius: showMistakes ? '10px 10px 0 0' : 10,
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--danger)', fontSize: '0.68rem', letterSpacing: '1px' }}>
                    ✗ WHAT WENT WRONG ({wrongBossQuestions.length})
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', transform: showMistakes ? 'rotate(90deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>›</span>
                </button>
                {showMistakes && (
                  <div style={{ border: '1px solid var(--danger)', borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
                    {wrongBossQuestions.map((q, i) => (
                      <div key={i} style={{
                        padding: '0.875rem 1rem',
                        borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                        background: 'var(--bg-card)',
                      }}>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text)', marginBottom: '0.4rem', lineHeight: 1.5 }}>{q.question}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--correct)', marginBottom: q.explanation ? '0.3rem' : 0 }}>
                          ✓ {q.answers?.[q.correct] ?? 'See correct order'}
                        </p>
                        {q.explanation && (
                          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{q.explanation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button
              onClick={onRetry}
              style={{
                width: '100%',
                padding: '0.95rem',
                minHeight: 52,
                background: 'var(--danger-bg)',
                border: '1px solid var(--danger)', color: 'var(--text)',
                borderRadius: 10, cursor: 'pointer', fontSize: '0.95rem',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  )
}
