import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import StudyScreen from './StudyScreen'

vi.mock('../hooks/useProgress', () => ({
  getProgress: vi.fn(),
  isDungeonComplete: vi.fn(() => false),
}))

import { getProgress } from '../hooks/useProgress'

const dungeon = {
  id: 'test-01',
  title: 'Test Dungeon',
  lesson: { title: 'Test Lesson', body: 'Some study notes here.' },
  rooms: [1, 2, 3, 4, 5],
}

const baseProps = {
  dungeon,
  dungeonId: 'test-01',
  subjectTitle: 'Algebra',
  onStart: vi.fn(),
  onResume: vi.fn(),
  onBack: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
  getProgress.mockReturnValue({})
})

describe('StudyScreen — not started', () => {
  it('shows Start Quiz when no progress exists', () => {
    render(<StudyScreen {...baseProps} />)
    expect(screen.getByText('Start Quiz →')).toBeTruthy()
  })

  it('calls onStart when Start Quiz is clicked', () => {
    render(<StudyScreen {...baseProps} />)
    fireEvent.click(screen.getByText('Start Quiz →'))
    expect(baseProps.onStart).toHaveBeenCalledOnce()
  })

  it('does not show Start Over when not started', () => {
    render(<StudyScreen {...baseProps} />)
    expect(screen.queryByText('Start Over')).toBeNull()
  })
})

describe('StudyScreen — in progress', () => {
  beforeEach(() => {
    getProgress.mockReturnValue({ 'test-01': { rooms: [0, 1, 2], bossComplete: false } })
  })

  it('shows Continue button with room count', () => {
    render(<StudyScreen {...baseProps} />)
    expect(screen.getByText('Continue (3/5) →')).toBeTruthy()
  })

  it('calls onResume with completed room count when Continue is clicked', () => {
    render(<StudyScreen {...baseProps} />)
    fireEvent.click(screen.getByText('Continue (3/5) →'))
    expect(baseProps.onResume).toHaveBeenCalledWith(3)
  })

  it('shows Start Over button', () => {
    render(<StudyScreen {...baseProps} />)
    expect(screen.getByText('Start Over')).toBeTruthy()
  })

  it('calls onStart when Start Over is clicked', () => {
    render(<StudyScreen {...baseProps} />)
    fireEvent.click(screen.getByText('Start Over'))
    expect(baseProps.onStart).toHaveBeenCalledOnce()
  })
})

describe('StudyScreen — all rooms done, boss pending', () => {
  beforeEach(() => {
    getProgress.mockReturnValue({ 'test-01': { rooms: [0, 1, 2, 3, 4], bossComplete: false } })
  })

  it('shows Fight Boss button', () => {
    render(<StudyScreen {...baseProps} />)
    expect(screen.getByText('Fight Boss →')).toBeTruthy()
  })

  it('calls onResume with "boss" when Fight Boss is clicked', () => {
    render(<StudyScreen {...baseProps} />)
    fireEvent.click(screen.getByText('Fight Boss →'))
    expect(baseProps.onResume).toHaveBeenCalledWith('boss')
  })

  it('shows Start Over button', () => {
    render(<StudyScreen {...baseProps} />)
    expect(screen.getByText('Start Over')).toBeTruthy()
  })
})

describe('StudyScreen — lesson complete', () => {
  beforeEach(() => {
    getProgress.mockReturnValue({ 'test-01': { rooms: [0, 1, 2, 3, 4], bossComplete: true } })
  })

  it('shows Replay button', () => {
    render(<StudyScreen {...baseProps} />)
    expect(screen.getByText('Replay →')).toBeTruthy()
  })

  it('calls onStart when Replay is clicked', () => {
    render(<StudyScreen {...baseProps} />)
    fireEvent.click(screen.getByText('Replay →'))
    expect(baseProps.onStart).toHaveBeenCalledOnce()
  })

  it('does not show Start Over when complete', () => {
    render(<StudyScreen {...baseProps} />)
    expect(screen.queryByText('Start Over')).toBeNull()
  })
})

describe('StudyScreen — study notes', () => {
  it('renders exactly one Study Notes toggle when lesson has a body', () => {
    getProgress.mockReturnValue({})
    render(<StudyScreen {...baseProps} />)
    expect(screen.getAllByText(/Study Notes/i)).toHaveLength(1)
  })
})
