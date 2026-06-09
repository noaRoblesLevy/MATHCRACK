import { useState } from 'react'
import MathDisplay from './MathDisplay'
import { getProgress, isDungeonComplete } from '../hooks/useProgress'
import { CHAPTER_REFS } from '../content/chapterRefs'

function renderBody(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i} style={{ color: 'var(--text)', fontWeight: 600 }}>{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>
  )
}

const ITEM_META = {
  'hint-scroll':   { emoji: '📜', label: 'Hint' },
  'focus-crystal': { emoji: '🔷', label: 'Focus' },
  'scholars-tome': { emoji: '📖', label: 'Scholar' },
  'solution-orb':  { emoji: '🔮', label: 'Orb' },
}

export default function StudyScreen({ dungeon, dungeonId, subjectTitle, subjectColor = 'var(--blue)', onStart, onResume, onBack, onReadChapter, inventory = [], focusMode = false, scholarActive = false, onToggleFocus, onToggleScholar }) {
  const [showNotes, setShowNotes] = useState(false)
  const lesson = dungeon?.lesson
  const rooms = dungeon?.rooms ?? []
  const totalRooms = rooms.length

  // Snapshot progress at mount — no need to re-read while the screen is open
  const [progress] = useState(() => getProgress()[dungeonId] ?? { rooms: [], bossComplete: false })
  const completedRooms = progress.rooms.length
  const bossComplete = progress.bossComplete
  const allRoomsDone = completedRooms >= totalRooms
  const isComplete = bossComplete
  const isInProgress = completedRooms > 0 && !isComplete

  // Decide button configuration
  let primaryLabel, primaryAction, secondaryLabel, secondaryAction
  if (isComplete) {
    primaryLabel = 'Replay →'
    primaryAction = onStart
  } else if (allRoomsDone) {
    primaryLabel = 'Fight Boss →'
    primaryAction = () => onResume('boss')
    secondaryLabel = 'Start Over'
    secondaryAction = onStart
  } else if (isInProgress) {
    primaryLabel = `Continue (${completedRooms}/${totalRooms}) →`
    primaryAction = () => onResume(completedRooms)
    secondaryLabel = 'Start Over'
    secondaryAction = onStart
  } else {
    primaryLabel = 'Start Quiz →'
    primaryAction = onStart
  }

  const chapterId = CHAPTER_REFS[dungeonId]

  return (
    <div className="page-with-nav" style={{
      minHeight: '100vh',
      background: 'var(--bg-deep)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1.25rem 0.875rem 1.5rem',
    }}>
      <div style={{ width: '100%', maxWidth: 560 }}>

        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: '0.8rem',
            marginBottom: '1.1rem', minHeight: 44,
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0 0', fontFamily: 'var(--font-ui)',
          }}
        >
          ← {subjectTitle}
        </button>

        {/* Title block */}
        <div style={{
          background: `linear-gradient(135deg, ${subjectColor}10 0%, var(--bg-card) 60%)`,
          border: `1px solid ${subjectColor}25`,
          borderLeft: `3px solid ${subjectColor}`,
          borderRadius: 12,
          padding: '1.1rem 1rem',
          marginBottom: '1.25rem',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            fontSize: '0.56rem',
            letterSpacing: '2px',
            marginBottom: '0.4rem',
          }}>
            LESSON · {totalRooms} QUESTIONS
          </div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.1rem' }}>
            {lesson?.title ?? dungeon?.title}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{dungeon?.title}</p>

          {/* Progress indicator */}
          {isComplete ? (
            <div style={{
              marginTop: '0.75rem',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
            }}>
              <span style={{ color: 'var(--correct)', fontSize: '0.8rem' }}>✓</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--correct)', fontSize: '0.58rem', letterSpacing: '1px' }}>
                COMPLETE
              </span>
            </div>
          ) : isInProgress || allRoomsDone ? (
            <div style={{ marginTop: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.55rem', letterSpacing: '1px' }}>
                  {allRoomsDone ? 'QUESTIONS DONE — BOSS AWAITS' : 'IN PROGRESS'}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', color: subjectColor, fontSize: '0.55rem' }}>
                  {completedRooms}/{totalRooms}
                </span>
              </div>
              <div style={{ background: 'var(--border)', borderRadius: 2, height: 3 }}>
                <div style={{
                  background: allRoomsDone ? 'var(--danger)' : subjectColor,
                  borderRadius: 2, height: 3,
                  width: `${(completedRooms / totalRooms) * 100}%`,
                  boxShadow: `0 0 6px ${allRoomsDone ? 'var(--danger)' : subjectColor}`,
                  transition: 'width 0.4s ease',
                }} />
              </div>
            </div>
          ) : null}
        </div>

        {/* Study notes panel */}
        {lesson?.body && (
          <>
            <button
              onClick={() => setShowNotes(n => !n)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.75rem 1rem', minHeight: 48,
                background: showNotes ? `${subjectColor}08` : 'var(--bg-card)',
                border: `1px solid ${showNotes ? subjectColor + '30' : 'var(--border)'}`,
                borderRadius: showNotes ? '10px 10px 0 0' : 10,
                cursor: 'pointer', marginBottom: showNotes ? 0 : '0.5rem',
                transition: 'background 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem' }}>📖</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text)', letterSpacing: '0.5px' }}>
                  Study Notes
                </span>
              </div>
              <span style={{
                color: 'var(--text-muted)', fontSize: '0.8rem',
                transform: showNotes ? 'rotate(90deg)' : 'none',
                display: 'inline-block', transition: 'transform 0.2s',
              }}>›</span>
            </button>

            {showNotes && (
              <div style={{
                background: 'var(--bg-card)',
                border: `1px solid ${subjectColor}20`,
                borderTop: 'none',
                borderRadius: '0 0 10px 10px',
                padding: '1.1rem 1rem',
                marginBottom: '0.5rem',
                lineHeight: 1.85,
                fontSize: '0.92rem',
                color: 'var(--text-muted)',
              }}>
                <p>{renderBody(lesson.body)}</p>
              </div>
            )}
          </>
        )}

        {/* Inventory tray */}
        {inventory.length > 0 && (
          <div style={{
            display: 'flex', gap: '0.5rem', flexWrap: 'wrap',
            padding: '0.75rem 1rem',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            marginBottom: '0.75rem',
          }}>
            {inventory.map(item => {
              const meta = ITEM_META[item.type]
              if (!meta) return null
              const isToggle = item.type === 'focus-crystal' || item.type === 'scholars-tome'
              const isActive = item.type === 'focus-crystal' ? focusMode : scholarActive
              return (
                <div key={item.type} style={{
                  display: 'flex', alignItems: 'center', gap: '0.35rem',
                  padding: '0.3rem 0.6rem',
                  background: isActive ? `${subjectColor}18` : 'var(--bg-elevated)',
                  border: `1px solid ${isActive ? subjectColor + '60' : item.count > 0 ? 'var(--border-strong)' : 'var(--border)'}`,
                  borderRadius: 6,
                  opacity: item.count === 0 && !isActive ? 0.4 : 1,
                  cursor: isToggle && (item.count > 0 || isActive) ? 'pointer' : 'default',
                }}
                  onClick={() => {
                    if (!isToggle) return
                    if (item.type === 'focus-crystal') onToggleFocus?.()
                    else onToggleScholar?.()
                  }}
                >
                  <span style={{ fontSize: '0.85rem' }}>{meta.emoji}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: isActive ? subjectColor : 'var(--text-muted)' }}>
                    {isActive ? 'ON' : item.count}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
          <button
            onClick={primaryAction}
            style={{
              width: '100%',
              padding: '0.95rem',
              minHeight: 52,
              background: isComplete ? 'var(--bg-elevated)' : subjectColor,
              border: isComplete ? `1px solid ${subjectColor}40` : 'none',
              borderRadius: 12,
              color: isComplete ? subjectColor : '#fff',
              fontSize: '0.95rem',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              letterSpacing: '1px',
              fontWeight: 'bold',
              boxShadow: isComplete ? 'none' : `0 0 24px ${subjectColor}40`,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {primaryLabel}
          </button>

          {secondaryLabel && (
            <button
              onClick={secondaryAction}
              style={{
                width: '100%',
                padding: '0.65rem',
                minHeight: 40,
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                letterSpacing: '0.5px',
              }}
            >
              {secondaryLabel}
            </button>
          )}

          {chapterId && onReadChapter && (
            <button
              onClick={() => onReadChapter(chapterId)}
              style={{
                width: '100%',
                padding: '0.65rem',
                minHeight: 44,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = subjectColor + '60'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <span>📚</span> Read Chapter →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
