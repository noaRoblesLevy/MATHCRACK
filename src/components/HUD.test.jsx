import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import HUD from './HUD'

vi.mock('../store/gameStore', () => ({
  useGameStore: vi.fn(selector => selector({ streak: 3 })),
}))

const baseProps = {
  dungeonTitle: 'Types of Numbers',
  kingdom: 'Number Systems',
  xpReward: 25,
  currentRoom: 1,
  totalRooms: 5,
  onBack: vi.fn(),
}

describe('HUD — normal state', () => {
  it('renders the ✕ button', () => {
    render(<HUD {...baseProps} />)
    expect(screen.getByTitle('Exit lesson')).toBeTruthy()
  })

  it('shows dungeon title', () => {
    render(<HUD {...baseProps} />)
    expect(screen.getByText('Types of Numbers')).toBeTruthy()
  })

  it('does not call onBack when ✕ is first clicked', () => {
    const onBack = vi.fn()
    render(<HUD {...baseProps} onBack={onBack} />)
    fireEvent.click(screen.getByTitle('Exit lesson'))
    expect(onBack).not.toHaveBeenCalled()
  })
})

describe('HUD — confirming state', () => {
  it('shows "Leave lesson?" text after clicking ✕', () => {
    render(<HUD {...baseProps} />)
    fireEvent.click(screen.getByTitle('Exit lesson'))
    expect(screen.getByText(/Leave lesson\?/)).toBeTruthy()
  })

  it('shows Leave and Stay buttons after clicking ✕', () => {
    render(<HUD {...baseProps} />)
    fireEvent.click(screen.getByTitle('Exit lesson'))
    expect(screen.getByText('Leave')).toBeTruthy()
    expect(screen.getByText('Stay')).toBeTruthy()
  })

  it('hides dungeon title when confirming', () => {
    render(<HUD {...baseProps} />)
    fireEvent.click(screen.getByTitle('Exit lesson'))
    expect(screen.queryByText('Types of Numbers')).toBeNull()
  })

  it('calls onBack when Leave is clicked', () => {
    const onBack = vi.fn()
    render(<HUD {...baseProps} onBack={onBack} />)
    fireEvent.click(screen.getByTitle('Exit lesson'))
    fireEvent.click(screen.getByText('Leave'))
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('dismisses confirmation and shows title when Stay is clicked', () => {
    render(<HUD {...baseProps} />)
    fireEvent.click(screen.getByTitle('Exit lesson'))
    expect(screen.getByText(/Leave lesson\?/)).toBeTruthy()
    fireEvent.click(screen.getByText('Stay'))
    expect(screen.queryByText(/Leave lesson\?/)).toBeNull()
    expect(screen.getByText('Types of Numbers')).toBeTruthy()
  })

  it('does not call onBack when Stay is clicked', () => {
    const onBack = vi.fn()
    render(<HUD {...baseProps} onBack={onBack} />)
    fireEvent.click(screen.getByTitle('Exit lesson'))
    fireEvent.click(screen.getByText('Stay'))
    expect(onBack).not.toHaveBeenCalled()
  })
})
