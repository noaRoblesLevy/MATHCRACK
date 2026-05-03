import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import TrainingGround from './TrainingGround'
import { useGameStore } from '../store/gameStore'

vi.mock('../content/kingdoms.json', () => ({
  default: [
    {
      id: 'test-kingdom',
      title: 'Test Kingdom',
      dungeons: [{ id: 'd1', file: 'test/d1.json' }],
    },
  ],
}))

vi.mock('../content/loadDungeon', () => ({
  loadDungeon: vi.fn(() => ({
    lesson: { title: 'Test Topic', body: 'Detailed lesson body here.' },
    rooms: [
      { type: 'multiple-choice', question: 'Q1', answers: ['A', 'B'], correct: 0, xp: 10, difficulty: 1 },
      { type: 'multiple-choice', question: 'Q2', answers: ['C', 'D'], correct: 1, xp: 20, difficulty: 2 },
    ],
  })),
}))

vi.mock('./LessonRoom', () => ({
  default: ({ room, onComplete }) => (
    <div>
      <span data-testid="question">{room.question}</span>
      <button onClick={() => onComplete(room.xp, true)}>Correct</button>
      <button onClick={() => onComplete(room.xp, false)}>Wrong</button>
    </div>
  ),
}))

beforeEach(() => {
  useGameStore.setState({
    xp: 0, streak: 0, lastVisit: null,
    activeView: 'training', activeKingdom: 'test-kingdom',
    activeDungeon: null, activeDungeonData: null,
    currentRoom: 0, bossAnswers: [], lastXPGain: 0, bossResult: null,
    trainingKingdom: 'test-kingdom',
  })
  vi.spyOn(Math, 'random').mockReturnValue(0)
})

describe('TrainingGround', () => {
  it('renders the Training Ground header', () => {
    render(<TrainingGround />)
    expect(screen.getByText('Training Ground')).toBeTruthy()
  })

  it('renders a question from the pool', () => {
    render(<TrainingGround />)
    const q = screen.getByTestId('question').textContent
    expect(['Q1', 'Q2']).toContain(q)
  })

  it('calls stopTraining when Back is clicked', () => {
    render(<TrainingGround />)
    act(() => { fireEvent.click(screen.getByText('← Kingdom')) })
    expect(useGameStore.getState().activeView).toBe('kingdom')
    expect(useGameStore.getState().trainingKingdom).toBeNull()
  })

  it('adds half XP to store on correct answer', () => {
    render(<TrainingGround />)
    act(() => { fireEvent.click(screen.getByText('Correct')) })
    expect([5, 10]).toContain(useGameStore.getState().xp)
  })

  it('increments correct counter on correct answer', () => {
    render(<TrainingGround />)
    act(() => { fireEvent.click(screen.getByText('Correct')) })
    expect(screen.getByText(/✓ 1 correct/)).toBeTruthy()
  })

  it('increments total counter on any answer', () => {
    render(<TrainingGround />)
    act(() => { fireEvent.click(screen.getByText('Wrong')) })
    expect(screen.getByText(/1 done/)).toBeTruthy()
  })

  it('theory panel starts collapsed and expands on click', () => {
    render(<TrainingGround />)
    expect(screen.queryByText('Detailed lesson body here.')).toBeFalsy()
    fireEvent.click(screen.getByText(/Test Topic/))
    expect(screen.getByText('Detailed lesson body here.')).toBeTruthy()
  })
})
