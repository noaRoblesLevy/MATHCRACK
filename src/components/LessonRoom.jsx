import { useState } from 'react'
import MathDisplay from './MathDisplay'

function MultipleChoice({ room, onComplete }) {
  const [selected, setSelected] = useState(null)

  function handleSelect(idx) {
    if (selected !== null) return
    setSelected(idx)
    const correct = idx === room.correct
    setTimeout(() => onComplete(correct ? room.xp : 0, correct), 800)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
      {room.answers.map((a, i) => {
        let bg = 'var(--bg-mid)'
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

function DragAndDrop({ room, onComplete }) {
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
    setTimeout(() => onComplete(correct ? room.xp : 0, correct), 800)
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

export default function LessonRoom({ room, onComplete }) {
  const hasLatexSteps = room.steps && room.steps.length > 0

  return (
    <div style={{ padding: '1.5rem', maxWidth: 700, margin: '0 auto' }}>
      <p style={{ fontSize: '1.1rem', marginBottom: '1rem', lineHeight: 1.6 }}>{room.question}</p>
      {room.latex && <MathDisplay latex={room.latex} className="lesson-math" />}
      {hasLatexSteps && (
        <div style={{ margin: '1rem 0', paddingLeft: '1rem', borderLeft: '2px solid var(--violet)' }}>
          {room.steps.map((s, i) => (
            <div key={i} style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 4 }}>
              <MathDisplay latex={s} />
            </div>
          ))}
        </div>
      )}
      {room.type === 'multiple-choice' && <MultipleChoice room={room} onComplete={onComplete} />}
      {room.type === 'drag-and-drop' && <DragAndDrop room={room} onComplete={onComplete} />}
    </div>
  )
}
