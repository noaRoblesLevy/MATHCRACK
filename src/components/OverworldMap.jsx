import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { isKingdomComplete, isDungeonComplete } from '../hooks/useProgress'

const STREAK_SHOWN_KEY = 'mathcrack_streak_shown'
const WELCOMED_KEY = 'mathcrack_welcomed'

const WELCOME_BULLETS = [
  { icon: '📖', text: 'Read the theory, then answer 5 questions per lesson.' },
  { icon: '⚔', text: 'Beat the Boss at the end to complete the lesson and earn XP.' },
  { icon: '✨', text: 'Collect Loot after each Boss win to unlock hints and power-ups.' },
]

function streakMessage(streak) {
  if (streak >= 30) return `🔥 ${streak} days — legendary dedication.`
  if (streak >= 14) return `🔥 ${streak}-day streak — you're unstoppable.`
  if (streak >= 7)  return `🔥 ${streak} days strong — keep the fire burning.`
  if (streak >= 3)  return `🔥 Day ${streak} — you're building something real.`
  return `🔥 Day ${streak} — welcome back.`
}

export default function OverworldMap({ courses = [], kingdoms = [], onSelectKingdom, premiumCardsUnlocked = false }) {
  const xp = useGameStore(s => s.xp)
  const streak = useGameStore(s => s.streak)
  const hasSeenHint = useGameStore(s => s.hasSeenHint)
  const dismissHint = useGameStore(s => s.dismissHint)

  const shouldShow = streak >= 2 && !sessionStorage.getItem(STREAK_SHOWN_KEY)
  const [showStreak, setShowStreak] = useState(shouldShow)
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem(WELCOMED_KEY))

  function dismissWelcome() {
    localStorage.setItem(WELCOMED_KEY, '1')
    setShowWelcome(false)
  }

  function dismissStreak() {
    sessionStorage.setItem(STREAK_SHOWN_KEY, '1')
    setShowStreak(false)
  }

  useEffect(() => {
    if (!showStreak) return
    const t = setTimeout(dismissStreak, 4000)
    return () => clearTimeout(t)
  }, [showStreak])

  const totalLessons = kingdoms.reduce((sum, k) => sum + k.dungeons.filter(d => !d.stub).length, 0)
  const completedSubjects = kingdoms.filter(k => isKingdomComplete(k.dungeons.map(d => d.id))).length
  const allComplete = completedSubjects === kingdoms.length && kingdoms.length > 0

  function handleSelect(id) {
    dismissHint()
    onSelectKingdom(id)
  }

  return (
    <>
    <div className="page-with-nav" style={{
      minHeight: '100vh',
      background: 'var(--bg-deep)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1.75rem 0.875rem 1rem',
    }}>
      <div style={{ width: '100%', maxWidth: 520 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
            <img src="/logo.svg" alt="" style={{ width: 40, height: 40 }} />
            <h1 style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--blue)',
              fontSize: 'clamp(1.4rem, 6vw, 2.1rem)',
              letterSpacing: '5px',
              textShadow: '0 0 40px var(--blue-glow)',
              lineHeight: 1,
            }}>
              MATHCRACK
            </h1>
          </div>
          <p style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            fontSize: '0.58rem',
            letterSpacing: '3px',
          }}>
            PRE-ALGEBRA &amp; ALGEBRA 1
          </p>

          {/* Stat bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            marginTop: '0.9rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem' }}>🔥</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--gold)', fontSize: '0.78rem', fontWeight: 'bold' }}>
                {streak}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.55rem', letterSpacing: '1px' }}>
                DAY
              </span>
            </div>
            <div style={{ width: 1, height: 14, background: 'var(--border)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue)', fontSize: '0.78rem', fontWeight: 'bold' }}>
                {xp}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.55rem', letterSpacing: '1px' }}>
                XP
              </span>
            </div>
            <div style={{ width: 1, height: 14, background: 'var(--border)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--correct)', fontSize: '0.78rem', fontWeight: 'bold' }}>
                {completedSubjects}/{kingdoms.length}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.55rem', letterSpacing: '1px' }}>
                DONE
              </span>
            </div>
          </div>

          {/* Overall progress bar */}
          <div style={{ marginTop: '0.85rem' }}>
            <div style={{ background: 'var(--border)', borderRadius: 2, height: 2 }}>
              <div style={{
                background: 'linear-gradient(90deg, var(--blue), var(--purple))',
                borderRadius: 2, height: 2,
                width: `${(completedSubjects / kingdoms.length) * 100}%`,
                transition: 'width 0.6s ease',
                minWidth: completedSubjects > 0 ? 6 : 0,
                boxShadow: '0 0 6px var(--blue)',
              }} />
            </div>
          </div>
        </div>

        {/* Completion trophy */}
        {allComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              marginBottom: '1rem',
              padding: '1.25rem 1rem',
              background: 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(139,92,246,0.06) 50%, var(--bg-card) 100%)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 14,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Ambient glow */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'radial-gradient(ellipse 70% 50% at 50% 100%, rgba(239,68,68,0.06) 0%, transparent 70%)',
            }} />
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', lineHeight: 1 }}>💀</div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              color: '#ef4444',
              fontSize: '1rem',
              fontWeight: 'bold',
              letterSpacing: '3px',
              marginBottom: '0.3rem',
            }}>
              MATH LICH
            </div>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              lineHeight: 1.6,
              maxWidth: 280,
              margin: '0 auto 0.75rem',
            }}>
              All {kingdoms.length} subjects conquered. {xp.toLocaleString()} XP. You are immortal.
            </p>
            <div style={{
              display: 'inline-block',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              fontSize: '0.5rem',
              letterSpacing: '2px',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 4,
              padding: '3px 8px',
            }}>
              NUMBERS BEND TO YOU
            </div>
          </motion.div>
        )}

        {/* Streak banner */}
        <AnimatePresence>
          {showStreak && (
            <motion.button
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              onClick={dismissStreak}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.65rem 0.9rem',
                marginBottom: '0.75rem',
                background: 'linear-gradient(135deg, rgba(251,191,36,0.08) 0%, var(--bg-card) 70%)',
                border: '1px solid rgba(251,191,36,0.25)',
                borderRadius: 10,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--gold)',
                fontSize: '0.75rem',
                letterSpacing: '0.5px',
              }}>
                {streakMessage(streak)}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', flexShrink: 0, marginLeft: '0.5rem' }}>✕</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Course sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {courses.map((course, courseIdx) => {
            const courseSubjects = course.subjects ?? []
            if (courseSubjects.length === 0) return null

            // global subject index for step numbering (across all courses)
            const subjectOffset = courses
              .slice(0, courseIdx)
              .reduce((acc, c) => acc + (c.subjects?.length ?? 0), 0)

            return (
              <div key={course.id}>
                {/* Course header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.6rem',
                  paddingBottom: '0.4rem',
                  borderBottom: `1px solid ${course.color}30`,
                }}>
                  <span style={{ fontSize: '1rem', lineHeight: 1 }}>{course.icon}</span>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    color: course.color,
                    fontSize: '0.6rem',
                    letterSpacing: '2px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                  }}>
                    {course.title}
                  </span>
                </div>

                {/* Subjects within this course */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {courseSubjects.map((k, i) => {
                    const globalIdx = subjectOffset + i
                    const complete = isKingdomComplete(k.dungeons.map(d => d.id))
                    const available = k.dungeons.filter(d => !d.stub).length
                    const completed = k.dungeons.filter(d => !d.stub && isDungeonComplete(d.id)).length
                    const color = k.color ?? 'var(--blue)'
                    const isFirst = globalIdx === 0 && !hasSeenHint

                    return (
                      <div key={k.id} style={{ position: 'relative' }}>
                        {isFirst && (
                          <div style={{
                            position: 'absolute',
                            right: -4, top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 10,
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            pointerEvents: 'none',
                          }}>
                            <span style={{
                              fontFamily: 'var(--font-mono)',
                              color: 'var(--blue)',
                              fontSize: '0.5rem',
                              letterSpacing: '1px',
                              whiteSpace: 'nowrap',
                            }}>START HERE</span>
                            <div style={{
                              width: 8, height: 8, borderRadius: '50%',
                              background: 'var(--blue)',
                              animation: 'hintPulse 1.4s ease-in-out infinite',
                              flexShrink: 0,
                            }} />
                          </div>
                        )}

                        <button
                          onClick={() => handleSelect(k.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.875rem 0.9rem',
                            minHeight: 64,
                            background: complete && premiumCardsUnlocked
                              ? `linear-gradient(135deg, ${color}18 0%, ${color}08 50%, var(--bg-card) 100%)`
                              : `linear-gradient(135deg, ${color}08 0%, var(--bg-card) 50%)`,
                            border: `1px solid ${complete ? (premiumCardsUnlocked ? color + '60' : color + '40') : 'var(--border)'}`,
                            borderLeft: `${complete && premiumCardsUnlocked ? '3px' : '2px'} solid ${complete ? (premiumCardsUnlocked ? color : 'var(--correct)') : color}`,
                            borderRadius: 10,
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                            transition: 'background 0.15s, box-shadow 0.15s',
                            boxShadow: complete && premiumCardsUnlocked ? `0 0 12px ${color}20` : 'none',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = `linear-gradient(135deg, ${color}12 0%, var(--bg-elevated) 60%)`
                            e.currentTarget.style.boxShadow = `0 0 0 1px ${color}25`
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = `linear-gradient(135deg, ${color}08 0%, var(--bg-card) 50%)`
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                        >
                          {/* Step number */}
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                            background: `${color}15`,
                            border: `1px solid ${complete ? 'var(--correct)' : color + '60'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.7rem', fontWeight: 'bold',
                            color: complete ? 'var(--correct)' : color,
                          }}>
                            {complete ? '✓' : String(globalIdx + 1).padStart(2, '0')}
                          </div>

                          {/* Text + progress */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              color: complete ? 'var(--correct)' : 'var(--text)',
                              fontSize: '0.88rem',
                              fontWeight: 600,
                              marginBottom: '0.15rem',
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>
                              {k.title}
                            </div>
                            <div style={{
                              color: 'var(--text-muted)',
                              fontSize: '0.63rem',
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                              marginBottom: available > 0 && completed > 0 ? '0.35rem' : 0,
                            }}>
                              {k.subtitle}
                            </div>
                            {available > 0 && completed > 0 && (
                              <div style={{ background: 'var(--border)', borderRadius: 2, height: 2 }}>
                                <div style={{
                                  background: complete ? 'var(--correct)' : color,
                                  borderRadius: 2,
                                  height: 2,
                                  width: `${(completed / available) * 100}%`,
                                  boxShadow: `0 0 4px ${complete ? 'var(--correct)' : color}`,
                                  transition: 'width 0.5s ease',
                                }} />
                              </div>
                            )}
                          </div>

                          {/* Badge */}
                          <div style={{ flexShrink: 0, textAlign: 'right' }}>
                            {complete ? (
                              <span style={{
                                fontFamily: 'var(--font-mono)',
                                color: 'var(--correct)',
                                fontSize: '0.48rem',
                                letterSpacing: '1.5px',
                              }}>DONE</span>
                            ) : available === 0 ? (
                              <span style={{
                                fontFamily: 'var(--font-mono)',
                                color: 'var(--text-muted)',
                                border: '1px solid var(--border)',
                                borderRadius: 4,
                                padding: '1px 5px',
                                fontSize: '0.48rem',
                                letterSpacing: '1px',
                              }}>soon</span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>›</span>
                            )}
                          </div>
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        <p style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          fontSize: '0.52rem',
          letterSpacing: '2px',
          marginTop: '1.5rem',
          textAlign: 'center',
          opacity: 0.4,
        }}>
          {totalLessons} LESSONS AVAILABLE
        </p>
      </div>
    </div>

    {/* First-run welcome overlay */}

    <AnimatePresence>
      {showWelcome && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={dismissWelcome}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 300 }}
          />
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            style={{
              position: 'fixed',
              bottom: 0, left: 0, right: 0,
              background: 'var(--bg-mid)',
              borderTop: '1px solid var(--border)',
              borderRadius: '16px 16px 0 0',
              padding: '1.75rem 1.5rem calc(1.75rem + env(safe-area-inset-bottom))',
              zIndex: 301,
              maxWidth: 480,
              margin: '0 auto',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <img src="/logo.svg" alt="" style={{ width: 28, height: 28 }} />
              <span style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--blue)',
                fontSize: '1rem',
                letterSpacing: '3px',
                textShadow: '0 0 20px var(--blue-glow)',
              }}>MATHCRACK</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
              {WELCOME_BULLETS.map(({ icon, text }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.1rem', lineHeight: 1.4, flexShrink: 0 }}>{icon}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.55 }}>{text}</span>
                </div>
              ))}
            </div>

            <button
              onClick={dismissWelcome}
              style={{
                width: '100%', padding: '0.95rem', minHeight: 52,
                background: 'var(--blue)', border: 'none',
                borderRadius: 12, color: '#fff',
                fontFamily: 'var(--font-mono)', fontSize: '0.95rem',
                fontWeight: 'bold', letterSpacing: '1px', cursor: 'pointer',
                boxShadow: '0 0 24px var(--blue-glow)',
              }}
            >
              Let's go →
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  )
}
