import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LessonRoom from './LessonRoom'

function ScorePips({ total, correct, needed }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0.6, opacity: 0.3 }}
          animate={{ scale: i < correct ? 1.15 : 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          style={{
            width: 14, height: 14, borderRadius: '50%',
            background: i < correct
              ? 'var(--correct)'
              : 'transparent',
            border: `2px solid ${i < correct ? 'var(--correct)' : i < needed ? 'var(--danger)' : 'var(--border)'}`,
            boxShadow: i < correct ? '0 0 8px var(--correct)' : 'none',
            transition: 'background 0.3s, box-shadow 0.3s',
          }}
        />
      ))}
      <span style={{
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-muted)',
        fontSize: '0.7rem',
        letterSpacing: '1px',
        marginLeft: '0.25rem',
      }}>
        NEED {needed}
      </span>
    </div>
  )
}

function BossIntro({ boss, lessonTitle, onFight }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      style={{
        minHeight: '100vh',
        background: 'var(--bg-deep)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 40% at 50% 60%, var(--danger-bg) 0%, transparent 70%)',
        opacity: 0.6,
      }} />

      {/* BOSS label */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--danger)',
          fontSize: '0.72rem',
          letterSpacing: '3px',
          marginBottom: '1.5rem',
        }}
      >
        ⚔ BOSS ENCOUNTER
      </motion.div>

      {/* Boss name */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 22 }}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(1.6rem, 7vw, 2.4rem)',
          color: 'var(--text)',
          textAlign: 'center',
          letterSpacing: '2px',
          marginBottom: '0.75rem',
          lineHeight: 1.15,
          textShadow: '0 0 40px var(--danger)',
        }}
      >
        {boss.name}
      </motion.h1>

      {/* Taunt */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--danger)',
          fontSize: '0.82rem',
          textAlign: 'center',
          fontStyle: 'italic',
          maxWidth: 340,
          marginBottom: '0.5rem',
          lineHeight: 1.6,
          opacity: 0.85,
        }}
      >
        "{boss.taunt}"
      </motion.p>

      {/* Lesson context */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.35 }}
        style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          fontSize: '0.7rem',
          letterSpacing: '1.5px',
          marginBottom: '3rem',
          opacity: 0.7,
        }}
      >
        {lessonTitle.toUpperCase()}
      </motion.div>

      {/* Stakes */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        style={{
          display: 'flex',
          gap: '2rem',
          marginBottom: '2.5rem',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold)', fontSize: '1.2rem', fontWeight: 'bold', lineHeight: 1 }}>
            {boss.questions.length}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '1px', marginTop: '0.3rem' }}>
            QUESTIONS
          </div>
        </div>
        <div style={{ width: 1, background: 'var(--border)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--correct)', fontSize: '1.2rem', fontWeight: 'bold', lineHeight: 1 }}>
            {boss.passMark}/{boss.questions.length}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '1px', marginTop: '0.3rem' }}>
            TO PASS
          </div>
        </div>
        <div style={{ width: 1, background: 'var(--border)' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue)', fontSize: '1.2rem', fontWeight: 'bold', lineHeight: 1 }}>
            {boss.questions.length * 25}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '1px', marginTop: '0.3rem' }}>
            MAX XP
          </div>
        </div>
      </motion.div>

      {/* Fight button */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75, type: 'spring', stiffness: 300, damping: 24 }}
        onClick={onFight}
        style={{
          padding: '1rem 3rem',
          minHeight: 56,
          background: 'var(--danger)',
          border: 'none',
          borderRadius: 12,
          color: '#fff',
          fontFamily: 'var(--font-mono)',
          fontSize: '1rem',
          fontWeight: 'bold',
          letterSpacing: '3px',
          cursor: 'pointer',
          boxShadow: '0 0 32px var(--danger), 0 4px 16px rgba(0,0,0,0.4)',
        }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        FIGHT
      </motion.button>
    </motion.div>
  )
}

export default function BossFight({ boss, lessonTitle = '', onPass, onFail }) {
  const [phase, setPhase] = useState('intro')
  const [questionIdx, setQuestionIdx] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongQuestions, setWrongQuestions] = useState([])

  function handleAnswer(xp, correct) {
    const newCorrect = correctCount + (correct ? 1 : 0)
    const newWrong = correct ? wrongQuestions : [...wrongQuestions, boss.questions[questionIdx]]
    const next = questionIdx + 1

    if (next >= boss.questions.length) {
      if (newCorrect >= boss.passMark) onPass(newCorrect)
      else onFail(newCorrect, newWrong)
    } else {
      setCorrectCount(newCorrect)
      setWrongQuestions(newWrong)
      setQuestionIdx(next)
    }
  }

  const q = boss.questions[questionIdx]

  return (
    <AnimatePresence mode="wait">
      {phase === 'intro' ? (
        <BossIntro
          key="intro"
          boss={boss}
          lessonTitle={lessonTitle}
          onFight={() => setPhase('fighting')}
        />
      ) : (
        <motion.div
          key="fighting"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Fight header */}
          <div style={{
            padding: '0.85rem 1.25rem',
            background: 'var(--danger-bg)',
            borderBottom: '2px solid var(--danger)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--danger)',
                fontSize: '0.72rem',
                letterSpacing: '1.5px',
                marginBottom: '0.15rem',
              }}>
                ⚔ BOSS
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--text)',
                fontSize: '0.78rem',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {boss.name}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem', flexShrink: 0 }}>
              <ScorePips
                total={boss.questions.length}
                correct={correctCount}
                needed={boss.passMark}
              />
              <div style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                fontSize: '0.68rem',
                letterSpacing: '0.5px',
              }}>
                Q {questionIdx + 1} / {boss.questions.length}
              </div>
            </div>
          </div>

          <LessonRoom key={questionIdx} room={q} onComplete={handleAnswer} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
