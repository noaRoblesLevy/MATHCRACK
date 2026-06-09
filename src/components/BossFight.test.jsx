import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BossFight from './BossFight'

// AnimatePresence keeps exiting children in the DOM until animations complete,
// which never happens in jsdom. Mock to render children directly.
vi.mock('framer-motion', () => {
  const passThrough = ({ children, ...rest }) => {
    const { initial, animate, exit, transition, whileHover, whileTap, ...domProps } = rest
    return children ? <div {...domProps}>{children}</div> : null
  }
  return {
    motion: {
      div: passThrough,
      button: ({ children, onClick, ...rest }) => {
        const { initial, animate, exit, transition, whileHover, whileTap, ...domProps } = rest
        return <button onClick={onClick} {...domProps}>{children}</button>
      },
      h1: passThrough,
      p: passThrough,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
  }
})

vi.mock('./LessonRoom', () => ({
  default: ({ onComplete }) => (
    <button onClick={() => onComplete(25, true)}>MockRoom</button>
  ),
}))

const boss = {
  name: 'The Numeromancer',
  taunt: 'Your number sense is pathetically weak.',
  questions: [
    { type: 'multiple-choice', question: 'Q1', answers: ['A', 'B'], correct: 0, xp: 25 },
    { type: 'multiple-choice', question: 'Q2', answers: ['A', 'B'], correct: 0, xp: 25 },
    { type: 'multiple-choice', question: 'Q3', answers: ['A', 'B'], correct: 0, xp: 25 },
  ],
  passMark: 2,
}

describe('BossFight — intro phase', () => {
  it('renders the boss name on the intro screen', () => {
    render(<BossFight boss={boss} lessonTitle="Types of Numbers" onPass={vi.fn()} onFail={vi.fn()} />)
    expect(screen.getByText('The Numeromancer')).toBeTruthy()
  })

  it('renders the boss taunt on the intro screen', () => {
    render(<BossFight boss={boss} lessonTitle="Types of Numbers" onPass={vi.fn()} onFail={vi.fn()} />)
    expect(screen.getByText(/pathetically weak/)).toBeTruthy()
  })

  it('renders the FIGHT button', () => {
    render(<BossFight boss={boss} lessonTitle="Types of Numbers" onPass={vi.fn()} onFail={vi.fn()} />)
    expect(screen.getByText('FIGHT')).toBeTruthy()
  })

  it('does not render the mock room on the intro screen', () => {
    render(<BossFight boss={boss} lessonTitle="Types of Numbers" onPass={vi.fn()} onFail={vi.fn()} />)
    expect(screen.queryByText('MockRoom')).toBeNull()
  })
})

describe('BossFight — fighting phase', () => {
  it('shows the mock room after tapping FIGHT', () => {
    render(<BossFight boss={boss} lessonTitle="Types of Numbers" onPass={vi.fn()} onFail={vi.fn()} />)
    fireEvent.click(screen.getByText('FIGHT'))
    expect(screen.getByText('MockRoom')).toBeTruthy()
  })

  it('hides the boss name after tapping FIGHT', () => {
    render(<BossFight boss={boss} lessonTitle="Types of Numbers" onPass={vi.fn()} onFail={vi.fn()} />)
    fireEvent.click(screen.getByText('FIGHT'))
    // Boss name now appears only in the compact header, not the large intro heading
    // The intro "⚔ BOSS ENCOUNTER" label should be gone
    expect(screen.queryByText('⚔ BOSS ENCOUNTER')).toBeNull()
  })

  it('calls onPass when enough questions are answered correctly', () => {
    const onPass = vi.fn()
    render(<BossFight boss={boss} lessonTitle="Types of Numbers" onPass={onPass} onFail={vi.fn()} />)
    fireEvent.click(screen.getByText('FIGHT'))
    // Answer all 3 questions correctly via mock
    fireEvent.click(screen.getByText('MockRoom'))
    fireEvent.click(screen.getByText('MockRoom'))
    fireEvent.click(screen.getByText('MockRoom'))
    expect(onPass).toHaveBeenCalledWith(3)
  })
})
