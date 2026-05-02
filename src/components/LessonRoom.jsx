import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import MathDisplay from './MathDisplay'
import MistakeModal from './MistakeModal'

function MultipleChoice({ room, onWrong, onCorrect, solutionRevealed }) {
  const [selected, setSelected] = useState(null)

  function handleSelect(idx) {
    if (selected !== null) return
    setSelected(idx)
    const correct = idx === room.correct
    setTimeout(() => {
      if (correct) onCorrect(room.xp)
      else onWrong()
    }, 800)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
      {room.answers.map((a, i) => {
        let bg = 'var(--bg-mid)'
        if (solutionRevealed && i === room.correct) bg = '#14532d'
        if (selected !== null) {
          if (i === room.correct) bg = '#14532d'
          else if (i === selected) bg = '#7f1d1d'
        }
        const isLatex = typeof a === 'string' && (a.includes('\\') || a.includes('{'))
        return (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            style={{
              padding: '0.9rem 1.25rem', border: '1px solid var(--border)',
              borderRadius: 6, background: bg, color: 'var(--text)',
              cursor: selected === null ? 'pointer' : 'default',
              textAlign: 'left', fontSize: '1rem', fontFamily: 'var(--font)',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
            }}
          >
            <span style={{ color: 'var(--gold)', minWidth: '1.2rem' }}>
              {['A', 'B', 'C', 'D'][i]}
            </span>
            {isLatex ? <MathDisplay latex={a} /> : <span>{a}</span>}
          </button>
        )
      })}
    </div>
  )
}

function DragAndDrop({ room, onWrong, onCorrect }) {
  const [order, setOrder] = useState(() => room.items.map((_, i) => i))
  const [dragging, setDragging] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  function handleDragStart(itemIdx) { setDragging(itemIdx) }

  function handleDrop(targetPos) {
    if (dragging === null) return
    const next = [...order]
    const fromPos = next.indexOf(dragging)
    next.splice(fromPos, 1)
    next.splice(targetPos, 0, dragging)
    setOrder(next)
    setDragging(null)
  }

  function handleSubmit() {
    if (submitted) return
    setSubmitted(true)
    const correct = order.every((v, i) => v === room.correctOrder[i])
    setTimeout(() => {
      if (correct) onCorrect(room.xp)
      else onWrong()
    }, 800)
  }

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
        Drag to reorder, then click Submit.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {order.map((itemIdx, pos) => (
          <div
            key={itemIdx}
            draggable
            onDragStart={() => handleDragStart(itemIdx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(pos)}
            style={{
              padding: '0.75rem 1rem', background: 'var(--bg-mid)',
              border: '1px solid var(--border)', borderRadius: 6,
              cursor: 'grab', color: 'var(--text)', userSelect: 'none',
            }}
          >
            ⠿ {room.items[itemIdx]}
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={submitted}
        style={{
          padding: '0.75rem 2rem', background: 'var(--violet)', border: 'none',
          color: '#fff', borderRadius: 6, cursor: submitted ? 'default' : 'pointer',
          fontSize: '1rem', fontFamily: 'var(--font)',
        }}
      >
        Submit Order
      </button>
    </div>
  )
}

export default function LessonRoom({
  room, onComplete,
  hintScrolls = 0, solutionOrbs = 0, focusMode = false,
  alwaysShowExplanation = false,
  onUseScroll = () => {}, onUseSolutionOrb = () => {},
}) {
  const [revealedSteps, setRevealedSteps] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [solutionRevealed, setSolutionRevealed] = useState(false)
  const [pendingComplete, setPendingComplete] = useState(null)

  const correctAnswerText = room.type === 'multiple-choice'
    ? room.answers[room.correct]
    : 'See the correct order above'

  function handleCorrect(xp) {
    if (alwaysShowExplanation) {
      setPendingComplete({ xp, correct: true })
      setShowModal(true)
    } else {
      onComplete(xp, true)
    }
  }

  function handleWrong() {
    setPendingComplete({ xp: 0, correct: false })
    setShowModal(true)
  }

  function handleDismiss() {
    setShowModal(false)
    if (pendingComplete) {
      onComplete(pendingComplete.xp, pendingComplete.correct)
      setPendingComplete(null)
    }
  }

  function handleUseScroll() {
    const ok = onUseScroll()
    if (ok !== false) setRevealedSteps((n) => Math.min(n + 1, room.steps?.length ?? 0))
  }

  function handleUseSolutionOrb() {
    const ok = onUseSolutionOrb()
    if (ok !== false) setSolutionRevealed(true)
  }

  const visibleSteps = (room.steps ?? []).slice(0, revealedSteps)
  const hasMoreSteps = revealedSteps < (room.steps?.length ?? 0)

  return (
    <div style={{ padding: '1.5rem', maxWidth: 700, margin: '0 auto' }}>
      <p style={{ fontSize: '1.1rem', marginBottom: '1rem', lineHeight: 1.6 }}>{room.question}</p>
      {room.latex && <MathDisplay latex={room.latex} className="lesson-math" />}

      {solutionRevealed && room.explanation && (
        <div style={{ margin: '1rem 0', padding: '0.75rem 1rem', background: '#1a2a1a', border: '1px solid var(--correct)', borderRadius: 6 }}>
          <div style={{ color: 'var(--correct)', fontSize: '0.75rem', marginBottom: 4 }}>SOLUTION ORB ACTIVE</div>
          <p style={{ color: 'var(--text)', fontSize: '0.9rem' }}>{room.explanation}</p>
        </div>
      )}

      {visibleSteps.length > 0 && (
        <div style={{ margin: '1rem 0', paddingLeft: '1rem', borderLeft: '2px solid var(--violet)' }}>
          {visibleSteps.map((s, i) => (
            <div key={i} style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 4 }}>
              <MathDisplay latex={s} />
            </div>
          ))}
        </div>
      )}

      {!focusMode && hasMoreSteps && (
        <button
          onClick={handleUseScroll}
          disabled={hintScrolls === 0}
          title={hintScrolls === 0 ? 'Need a Hint Scroll — earn one by defeating a boss' : `Use Hint Scroll (${hintScrolls} left)`}
          style={{
            padding: '0.4rem 1rem', marginBottom: '1rem',
            background: hintScrolls > 0 ? 'var(--bg-mid)' : '#1a1030',
            border: `1px solid ${hintScrolls > 0 ? 'var(--gold)' : 'var(--border)'}`,
            color: hintScrolls > 0 ? 'var(--gold)' : 'var(--text-muted)',
            borderRadius: 6, cursor: hintScrolls > 0 ? 'pointer' : 'not-allowed',
            fontSize: '0.85rem', fontFamily: 'var(--font)',
          }}
        >
          📜 Hint Scroll {hintScrolls > 0 ? `(${hintScrolls})` : '(0)'}
        </button>
      )}

      {solutionOrbs > 0 && !solutionRevealed && (
        <button
          onClick={handleUseSolutionOrb}
          style={{
            padding: '0.4rem 1rem', marginBottom: '1rem', marginLeft: '0.5rem',
            background: 'var(--bg-mid)', border: '1px solid #a855f7',
            color: '#a855f7', borderRadius: 6, cursor: 'pointer',
            fontSize: '0.85rem', fontFamily: 'var(--font)',
          }}
        >
          🔮 Solution Orb ({solutionOrbs})
        </button>
      )}

      {room.type === 'multiple-choice' && (
        <MultipleChoice
          room={room}
          onCorrect={handleCorrect}
          onWrong={handleWrong}
          solutionRevealed={solutionRevealed}
        />
      )}
      {room.type === 'drag-and-drop' && (
        <DragAndDrop room={room} onCorrect={handleCorrect} onWrong={handleWrong} />
      )}

      <AnimatePresence>
        {showModal && (
          <MistakeModal
            explanation={room.explanation ?? 'Review the material and try again.'}
            correctAnswer={correctAnswerText}
            onDismiss={handleDismiss}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
