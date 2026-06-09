import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import MathDisplay from './MathDisplay'
import MistakeModal from './MistakeModal'

function MultipleChoice({ room, onWrong, onCorrect, solutionRevealed, resetKey }) {
  const [selected, setSelected] = useState(null)

  // resetKey change resets selected via key on parent, but we also reset here
  function handleSelect(idx) {
    if (selected !== null) return
    setSelected(idx)
    const correct = idx === room.correct
    setTimeout(() => {
      if (correct) onCorrect(room.xp)
      else onWrong()
    }, 500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1.5rem' }}>
      {room.answers.map((a, i) => {
        const isCorrect = i === room.correct
        const isSelected = i === selected
        const revealed = selected !== null || solutionRevealed

        let bg = 'var(--bg-card)'
        let border = 'var(--border)'
        let labelColor = 'var(--text-muted)'

        if (solutionRevealed && isCorrect) { bg = 'var(--correct-dim)'; border = 'var(--correct)'; labelColor = 'var(--correct)' }
        if (revealed) {
          if (isCorrect) { bg = 'var(--correct-dim)'; border = 'var(--correct)'; labelColor = 'var(--correct)' }
          else if (isSelected) { bg = 'var(--danger-bg)'; border = 'var(--danger)'; labelColor = 'var(--danger)' }
        }

        const isLatex = typeof a === 'string' && (a.includes('\\') || a.includes('{'))
        return (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            style={{
              padding: '1rem 1.1rem',
              border: `1.5px solid ${border}`,
              borderRadius: 10,
              background: bg,
              color: 'var(--text)',
              cursor: selected === null ? 'pointer' : 'default',
              textAlign: 'left',
              fontSize: '0.95rem',
              display: 'flex', alignItems: 'center', gap: '0.85rem',
              transition: 'background 0.25s, border-color 0.25s',
              minHeight: 52,
            }}
          >
            <span style={{
              color: labelColor,
              minWidth: '1.4rem', fontWeight: 'bold', fontSize: '0.85rem',
              transition: 'color 0.25s',
            }}>
              {['A', 'B', 'C', 'D'][i]}
            </span>
            {isLatex ? <MathDisplay latex={a} /> : <span>{a}</span>}
            {revealed && isCorrect && (
              <span style={{ marginLeft: 'auto', color: 'var(--correct)', fontSize: '1rem' }}>✓</span>
            )}
            {revealed && isSelected && !isCorrect && (
              <span style={{ marginLeft: 'auto', color: 'var(--danger)', fontSize: '1rem' }}>✗</span>
            )}
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
  const [dragStyle, setDragStyle] = useState({})

  function handleDragStart(itemIdx) { setDragging(itemIdx) }

  function handleDrop(targetPos) {
    if (dragging === null) return
    const next = [...order]
    const fromPos = next.indexOf(dragging)
    next.splice(fromPos, 1)
    next.splice(targetPos, 0, dragging)
    setOrder(next)
    setDragging(null)
    setDragStyle({})
  }

  function handleTouchStart(e, itemIdx) {
    e.preventDefault()
    setDragging(itemIdx)
  }

  function handleTouchMove(e) {
    e.preventDefault()
    const touch = e.touches[0]
    setDragStyle({ opacity: 0.5 })
    const el = document.elementFromPoint(touch.clientX, touch.clientY)
    const target = el?.closest('[data-pos]')
    if (!target) return
    const targetPos = parseInt(target.dataset.pos, 10)
    if (dragging === null) return
    const next = [...order]
    const fromPos = next.indexOf(dragging)
    if (fromPos === targetPos) return
    next.splice(fromPos, 1)
    next.splice(targetPos, 0, dragging)
    setOrder(next)
  }

  function handleTouchEnd() {
    setDragging(null)
    setDragStyle({})
  }

  function handleSubmit() {
    if (submitted) return
    setSubmitted(true)
    const correct = order.every((v, i) => v === room.correctOrder[i])
    setTimeout(() => {
      if (correct) onCorrect(room.xp)
      else onWrong()
    }, 600)
  }

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.85rem' }}>
        Drag to reorder, then tap Submit.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {order.map((itemIdx, pos) => (
          <div
            key={itemIdx}
            data-pos={pos}
            draggable
            onDragStart={() => handleDragStart(itemIdx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(pos)}
            onTouchStart={(e) => handleTouchStart(e, itemIdx)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              padding: '0.85rem 1rem',
              background: dragging === itemIdx ? 'var(--bg-elevated)' : 'var(--bg-card)',
              border: `1.5px solid ${dragging === itemIdx ? 'var(--purple)' : 'var(--border)'}`,
              borderRadius: 10,
              cursor: 'grab',
              color: 'var(--text)',
              userSelect: 'none',
              touchAction: 'none',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              fontSize: '0.9rem', minHeight: 52,
              ...(dragging === itemIdx ? dragStyle : {}),
            }}
          >
            <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>⠿</span>
            {room.items[itemIdx]}
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={submitted}
        style={{
          padding: '0.9rem 2rem', minHeight: 52,
          background: submitted ? 'var(--bg-elevated)' : 'var(--purple)',
          border: 'none', color: '#fff', borderRadius: 10,
          cursor: submitted ? 'default' : 'pointer',
          fontSize: '1rem', width: '100%',
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
  const [wrongCount, setWrongCount] = useState(0)
  const [resetKey, setResetKey] = useState(0)
  const [xpPop, setXpPop] = useState(null)

  const correctAnswerText = room.type === 'multiple-choice'
    ? room.answers[room.correct]
    : 'See the correct order above'

  function handleCorrect(xp) {
    setXpPop(xp)
    setTimeout(() => setXpPop(null), 1100)
    if (alwaysShowExplanation) {
      setPendingComplete({ xp, correct: true })
      setShowModal(true)
    } else {
      setTimeout(() => onComplete(xp, true), 500)
    }
  }

  function handleWrong() {
    const newCount = wrongCount + 1
    setWrongCount(newCount)
    setPendingComplete({ xp: 0, correct: false })
    setShowModal(true)
  }

  function handleRetry() {
    setShowModal(false)
    setPendingComplete(null)
    setResetKey(k => k + 1)
  }

  function handleAdvance() {
    setShowModal(false)
    const pc = pendingComplete
    setPendingComplete(null)
    onComplete(pc?.xp ?? 0, pc?.correct ?? false)
  }

  function handleUseScroll() {
    const ok = onUseScroll()
    if (ok !== false) setRevealedSteps(n => Math.min(n + 1, room.steps?.length ?? 0))
  }

  function handleUseSolutionOrb() {
    const ok = onUseSolutionOrb()
    if (ok !== false) setSolutionRevealed(true)
  }

  const visibleSteps = (room.steps ?? []).slice(0, revealedSteps)
  const hasMoreSteps = revealedSteps < (room.steps?.length ?? 0)
  const canRetry = wrongCount <= 1

  return (
    <div style={{
      padding: '1.25rem 1rem 6rem',
      maxWidth: 620,
      margin: '0 auto',
      position: 'relative',
    }}>
      {/* XP float animation */}
      {xpPop !== null && (
        <div style={{
          position: 'fixed',
          top: '38%',
          left: '50%',
          fontFamily: 'var(--font-mono)',
          color: 'var(--correct)',
          fontSize: '1.6rem',
          fontWeight: 'bold',
          animation: 'xpFloat 1.1s ease-out forwards',
          pointerEvents: 'none',
          zIndex: 300,
          textShadow: '0 0 20px rgba(52,211,153,0.6)',
          letterSpacing: '1px',
        }}>
          +{xpPop} XP
        </div>
      )}

      {/* Question */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '1.25rem',
        marginBottom: '0.5rem',
      }}>
        <p style={{ fontSize: '1rem', lineHeight: 1.7, color: 'var(--text)', marginBottom: room.latex ? '0.75rem' : 0 }}>
          {room.question}
        </p>
        {room.latex && <MathDisplay latex={room.latex} className="lesson-math" />}
      </div>

      {/* Solution orb reveal */}
      {solutionRevealed && room.explanation && (
        <div style={{
          margin: '0.75rem 0',
          padding: '0.9rem 1rem',
          background: 'var(--correct-dim)',
          border: '1.5px solid var(--correct)',
          borderRadius: 10,
        }}>
          <div style={{ color: 'var(--correct)', fontSize: '0.6rem', letterSpacing: '1.5px', marginBottom: 6 }}>SOLUTION ORB</div>
          <p style={{ color: 'var(--text)', fontSize: '0.9rem', lineHeight: 1.6 }}>{room.explanation}</p>
        </div>
      )}

      {/* Hint steps */}
      {visibleSteps.length > 0 && (
        <div style={{
          margin: '0.75rem 0', padding: '0.9rem 1rem',
          borderLeft: '3px solid var(--purple)',
          background: 'var(--bg-card)',
          borderRadius: '0 10px 10px 0',
        }}>
          {visibleSteps.map((s, i) => (
            <div key={i} style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: i < visibleSteps.length - 1 ? 6 : 0 }}>
              <MathDisplay latex={s} />
            </div>
          ))}
        </div>
      )}

      {/* Item buttons */}
      {(!focusMode && hasMoreSteps || solutionOrbs > 0) && (
        <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          {!focusMode && hasMoreSteps && (
            <button
              onClick={handleUseScroll}
              disabled={hintScrolls === 0}
              style={{
                padding: '0.5rem 1rem', minHeight: 44,
                background: hintScrolls > 0 ? 'var(--bg-elevated)' : 'var(--bg-card)',
                border: `1px solid ${hintScrolls > 0 ? 'var(--gold)' : 'var(--border)'}`,
                color: hintScrolls > 0 ? 'var(--gold)' : 'var(--text-muted)',
                borderRadius: 8, cursor: hintScrolls > 0 ? 'pointer' : 'not-allowed',
                fontSize: '0.8rem',
              }}
            >
              📜 Hint ({hintScrolls})
            </button>
          )}
          {solutionOrbs > 0 && !solutionRevealed && (
            <button
              onClick={handleUseSolutionOrb}
              style={{
                padding: '0.5rem 1rem', minHeight: 44,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--purple)',
                color: 'var(--purple)', borderRadius: 8, cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              🔮 Solution ({solutionOrbs})
            </button>
          )}
        </div>
      )}

      {/* Answer UI — key forces remount on retry */}
      {room.type === 'multiple-choice' && (
        <MultipleChoice
          key={resetKey}
          room={room}
          onCorrect={handleCorrect}
          onWrong={handleWrong}
          solutionRevealed={solutionRevealed}
        />
      )}
      {room.type === 'drag-and-drop' && (
        <DragAndDrop key={resetKey} room={room} onCorrect={handleCorrect} onWrong={handleWrong} />
      )}

      <AnimatePresence>
        {showModal && (
          <MistakeModal
            explanation={room.explanation ?? 'Review the material and try again.'}
            correctAnswer={correctAnswerText}
            canRetry={canRetry}
            onRetry={handleRetry}
            onDismiss={handleAdvance}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
