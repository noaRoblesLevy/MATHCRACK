import { useState } from 'react'
import LessonRoom from './LessonRoom'

export default function BossFight({ boss, onPass, onFail }) {
  const [questionIdx, setQuestionIdx] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)

  function handleAnswer(xp, correct) {
    const newCorrect = correctCount + (correct ? 1 : 0)
    const next = questionIdx + 1

    if (next >= boss.questions.length) {
      if (newCorrect >= boss.passMark) onPass(newCorrect)
      else onFail(newCorrect)
    } else {
      setCorrectCount(newCorrect)
      setQuestionIdx(next)
    }
  }

  const q = boss.questions[questionIdx]

  return (
    <div>
      <div style={{
        padding: '1rem 1.5rem', background: '#450a0a',
        borderBottom: '2px solid #dc2626',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ color: '#fca5a5', fontWeight: 'bold' }}>⚔ BOSS FIGHT</span>
        <span style={{ color: '#fca5a5' }}>{questionIdx + 1} / {boss.questions.length}</span>
        <span style={{ color: '#fca5a5' }}>✓ {correctCount} — need {boss.passMark}</span>
      </div>
      <LessonRoom key={questionIdx} room={q} onComplete={handleAnswer} />
    </div>
  )
}
