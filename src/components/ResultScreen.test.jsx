import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ResultScreen from './ResultScreen'

vi.mock('../store/gameStore', () => ({
  useGameStore: vi.fn(selector => selector({ xp: 600 })),
}))

vi.mock('../hooks/useXP', () => ({
  getTitle: vi.fn(() => 'Adept'),
  getXPToNextLevel: vi.fn(() => 400),
}))

vi.mock('./LootDrop', () => ({
  default: ({ onCollect }) => <button onClick={onCollect}>CollectLoot</button>,
}))

const baseProps = {
  lessonTitle: 'Types of Numbers',
  totalRooms: 5,
  roomsCorrect: 4,
  bossScore: { correct: 2, total: 3 },
  xpGained: 115,
  lootDrop: null,
  onContinue: vi.fn(),
  onRetry: vi.fn(),
}

describe('ResultScreen — pass', () => {
  it('shows "Lesson Complete" on pass', () => {
    render(<ResultScreen {...baseProps} passed={true} />)
    expect(screen.getByText('Lesson Complete')).toBeTruthy()
  })

  it('shows the lesson title', () => {
    render(<ResultScreen {...baseProps} passed={true} />)
    expect(screen.getAllByText('Types of Numbers').length).toBeGreaterThan(0)
  })

  it('shows rooms correct stat', () => {
    render(<ResultScreen {...baseProps} passed={true} />)
    expect(screen.getByText('4/5')).toBeTruthy()
  })

  it('shows boss score stat', () => {
    render(<ResultScreen {...baseProps} passed={true} />)
    expect(screen.getByText('2/3')).toBeTruthy()
  })

  it('shows XP earned stat', () => {
    render(<ResultScreen {...baseProps} passed={true} />)
    expect(screen.getByText('+115')).toBeTruthy()
  })

  it('shows title from useXP', () => {
    render(<ResultScreen {...baseProps} passed={true} />)
    expect(screen.getByText('Adept')).toBeTruthy()
  })

  it('shows Continue when no next lesson', () => {
    render(<ResultScreen {...baseProps} passed={true} onNextLesson={null} />)
    expect(screen.getByText('Continue →')).toBeTruthy()
  })

  it('shows Next Lesson button when onNextLesson is provided', () => {
    render(
      <ResultScreen
        {...baseProps}
        passed={true}
        nextLessonTitle="Algebraic Properties"
        onNextLesson={vi.fn()}
      />
    )
    expect(screen.getByText(/Algebraic Properties/)).toBeTruthy()
  })

  it('does not show Next Lesson button when onNextLesson is null', () => {
    render(<ResultScreen {...baseProps} passed={true} onNextLesson={null} />)
    expect(screen.queryByText(/Next:/)).toBeNull()
  })

  it('calls onNextLesson when Next Lesson is clicked', () => {
    const onNextLesson = vi.fn()
    render(
      <ResultScreen
        {...baseProps}
        passed={true}
        nextLessonTitle="Algebraic Properties"
        onNextLesson={onNextLesson}
      />
    )
    fireEvent.click(screen.getByText(/Algebraic Properties/))
    expect(onNextLesson).toHaveBeenCalledOnce()
  })

  it('calls onContinue when Continue is clicked', () => {
    const onContinue = vi.fn()
    render(<ResultScreen {...baseProps} passed={true} onContinue={onContinue} onNextLesson={null} />)
    fireEvent.click(screen.getByText('Continue →'))
    expect(onContinue).toHaveBeenCalledOnce()
  })
})

describe('ResultScreen — fail', () => {
  it('shows "Lesson Failed" on fail', () => {
    render(<ResultScreen {...baseProps} passed={false} />)
    expect(screen.getByText('Lesson Failed')).toBeTruthy()
  })

  it('shows rooms and boss breakdown on fail', () => {
    render(<ResultScreen {...baseProps} passed={false} />)
    expect(screen.getByText('4/5')).toBeTruthy()
    expect(screen.getByText('2/3')).toBeTruthy()
  })

  it('calls onRetry when Try Again is clicked', () => {
    const onRetry = vi.fn()
    render(<ResultScreen {...baseProps} passed={false} onRetry={onRetry} />)
    fireEvent.click(screen.getByText('Try Again'))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('does not show "Lesson Complete" on fail', () => {
    render(<ResultScreen {...baseProps} passed={false} />)
    expect(screen.queryByText('Lesson Complete')).toBeNull()
  })
})

describe('ResultScreen — loot', () => {
  it('shows loot before Continue when lootDrop is present', () => {
    render(<ResultScreen {...baseProps} passed={true} lootDrop="hint-scroll" />)
    expect(screen.getByText('CollectLoot')).toBeTruthy()
    expect(screen.queryByText('Continue →')).toBeNull()
  })

  it('shows Continue after loot is collected', () => {
    render(<ResultScreen {...baseProps} passed={true} lootDrop="hint-scroll" onNextLesson={null} />)
    fireEvent.click(screen.getByText('CollectLoot'))
    expect(screen.getByText('Continue →')).toBeTruthy()
  })
})
