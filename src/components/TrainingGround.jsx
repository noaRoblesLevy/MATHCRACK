import { useState, useMemo } from 'react'
import { useGameStore } from '../store/gameStore'
import kingdoms from '../content/kingdoms.json'
import { loadDungeon } from '../content/loadDungeon'
import LessonRoom from './LessonRoom'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function TrainingGround() {
  const { trainingKingdom, stopTraining, addXP } = useGameStore()

  const initialPool = useMemo(() => {
    const kingdom = kingdoms.find((k) => k.id === trainingKingdom)
    if (!kingdom) return []
    const dungeons = kingdom.dungeons
      .filter((d) => d.file)
      .map((d) => loadDungeon(d.file))
      .filter(Boolean)
    const flat = dungeons.flatMap((d) =>
      d.rooms.map((r) => ({ ...r, lesson: d.lesson ?? null }))
    )
    // Order by difficulty 1→3, randomise within each tier
    return [1, 2, 3].flatMap(d => shuffle(flat.filter(r => (r.difficulty ?? 2) === d)))
  }, [trainingKingdom])

  const [pool, setPool] = useState(initialPool)
  const [idx, setIdx] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [total, setTotal] = useState(0)
  const [theoryOpen, setTheoryOpen] = useState(false)

  if (pool.length === 0) {
    return (
      <div style={{ padding: '2rem', color: 'var(--text)' }}>
        <button onClick={stopTraining} style={backStyle}>← Kingdom</button>
        <p>No questions available for this kingdom yet.</p>
      </div>
    )
  }

  const current = pool[idx]

  function advance() {
    const nextIdx = idx + 1
    if (nextIdx >= pool.length) {
      const newPool = shuffle([...pool])
      setPool(newPool)
      setIdx(0)
      setTheoryOpen(false)
    } else {
      if (pool[nextIdx]?.lesson?.title !== current.lesson?.title) setTheoryOpen(false)
      setIdx(nextIdx)
    }
  }

  function handleComplete(xp, wasCorrect) {
    if (wasCorrect) {
      addXP(Math.floor(xp / 2))
      setCorrect((c) => c + 1)
    }
    setTotal((t) => t + 1)
    advance()
  }

  const hasLesson = current.lesson?.title

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-deep)' }}>
      <div style={{
        padding: '1rem 1.5rem',
        background: 'var(--bg-mid)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <button onClick={stopTraining} style={backStyle}>← Kingdom</button>
        <span style={{ color: 'var(--gold)', fontWeight: 'bold', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '1px' }}>PRACTICE</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          ✓ {correct} correct &nbsp;|&nbsp; {total} done
        </span>
      </div>

      {hasLesson && (
        <div style={{
          margin: '1rem 1.5rem 0',
          background: 'var(--bg-card)',
          border: '1px solid var(--purple)',
          borderRadius: 8,
          overflow: 'hidden',
        }}>
          <button
            onClick={() => setTheoryOpen((o) => !o)}
            style={{
              width: '100%', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', padding: '0.6rem 0.9rem',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--purple-light, var(--purple))', fontSize: '0.9rem', fontWeight: 'bold',
            }}
          >
            <span>📖 {current.lesson.title}</span>
            <span style={{ color: 'var(--text-muted)' }}>{theoryOpen ? '▲' : '▼'}</span>
          </button>
          {theoryOpen && (
            <div style={{ padding: '0 0.9rem 0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, borderTop: '1px solid var(--border)' }}>
              {current.lesson.body}
            </div>
          )}
        </div>
      )}

      <LessonRoom
        key={`${idx}-${pool.length}`}
        room={current}
        onComplete={handleComplete}
      />
    </div>
  )
}

const backStyle = {
  background: 'none', border: 'none',
  color: 'var(--gold)', cursor: 'pointer', fontSize: '0.9rem',
}
