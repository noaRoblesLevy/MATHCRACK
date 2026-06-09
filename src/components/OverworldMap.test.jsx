import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import OverworldMap from './OverworldMap'

vi.mock('framer-motion', () => {
  const passDiv = ({ children, ...rest }) => {
    const { initial, animate, exit, transition, ...domProps } = rest
    return <div {...domProps}>{children}</div>
  }
  const passBtn = ({ children, onClick, ...rest }) => {
    const { initial, animate, exit, transition, whileHover, whileTap, ...domProps } = rest
    return <button onClick={onClick} {...domProps}>{children}</button>
  }
  return {
    motion: { div: passDiv, button: passBtn },
    AnimatePresence: ({ children }) => <>{children}</>,
  }
})

const mockStore = { xp: 0, streak: 0, hasSeenHint: true, dismissHint: vi.fn() }

vi.mock('../store/gameStore', () => ({
  useGameStore: vi.fn(selector => selector(mockStore)),
}))

const { isKingdomComplete, isDungeonComplete } = vi.hoisted(() => ({
  isKingdomComplete: vi.fn(() => false),
  isDungeonComplete: vi.fn(() => false),
}))

vi.mock('../hooks/useProgress', () => ({ isKingdomComplete, isDungeonComplete }))

const kingdoms = [
  {
    id: 'k1', title: 'Algebra', subtitle: 'Equations & Inequalities', color: '#60a5fa',
    dungeons: [
      { id: 'd1', title: 'Lesson One', file: 'l1.json' },
      { id: 'd2', title: 'Lesson Two', file: 'l2.json' },
    ],
  },
  {
    id: 'k2', title: 'Number Systems', subtitle: 'Integers & Fractions', color: '#a78bfa',
    dungeons: [
      { id: 'd3', title: 'Lesson Three', file: 'l3.json' },
    ],
  },
]

const { useGameStore } = await import('../store/gameStore')

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  mockStore.streak = 0
  mockStore.hasSeenHint = true
  isKingdomComplete.mockReturnValue(false)
  isDungeonComplete.mockReturnValue(false)
  vi.clearAllMocks()
  useGameStore.mockImplementation(selector => selector(mockStore))
})

// ─── Welcome Overlay ────────────────────────────────────────────────────────

describe('OverworldMap — welcome overlay', () => {
  it('renders the welcome overlay when localStorage flag is absent', () => {
    // No localStorage key set — first-time user
    render(<OverworldMap kingdoms={kingdoms} onSelectKingdom={vi.fn()} />)
    expect(screen.getByText("Let's go →")).toBeTruthy()
  })

  it('shows the welcome bullet about the Boss', () => {
    render(<OverworldMap kingdoms={kingdoms} onSelectKingdom={vi.fn()} />)
    expect(screen.getByText(/Beat the Boss/)).toBeTruthy()
  })

  it('does NOT render the welcome overlay when localStorage flag is present', () => {
    localStorage.setItem('mathcrack_welcomed', '1')
    render(<OverworldMap kingdoms={kingdoms} onSelectKingdom={vi.fn()} />)
    expect(screen.queryByText("Let's go →")).toBeNull()
  })

  it('hides the overlay after clicking "Let\'s go →"', () => {
    render(<OverworldMap kingdoms={kingdoms} onSelectKingdom={vi.fn()} />)
    fireEvent.click(screen.getByText("Let's go →"))
    expect(screen.queryByText("Let's go →")).toBeNull()
  })

  it('sets the localStorage flag when the overlay is dismissed', () => {
    render(<OverworldMap kingdoms={kingdoms} onSelectKingdom={vi.fn()} />)
    fireEvent.click(screen.getByText("Let's go →"))
    expect(localStorage.getItem('mathcrack_welcomed')).toBeTruthy()
  })
})

// ─── Streak Banner ──────────────────────────────────────────────────────────

describe('OverworldMap — streak banner', () => {
  it('renders streak banner when streak >= 2 and session flag is absent', () => {
    localStorage.setItem('mathcrack_welcomed', '1') // suppress welcome overlay
    mockStore.streak = 3
    useGameStore.mockImplementation(selector => selector(mockStore))
    render(<OverworldMap kingdoms={kingdoms} onSelectKingdom={vi.fn()} />)
    expect(screen.getByText(/Day 3/)).toBeTruthy()
  })

  it('does NOT render streak banner when streak < 2', () => {
    localStorage.setItem('mathcrack_welcomed', '1')
    mockStore.streak = 1
    useGameStore.mockImplementation(selector => selector(mockStore))
    render(<OverworldMap kingdoms={kingdoms} onSelectKingdom={vi.fn()} />)
    expect(screen.queryByText(/day streak/i)).toBeNull()
  })

  it('does NOT render streak banner when sessionStorage flag is present', () => {
    localStorage.setItem('mathcrack_welcomed', '1')
    sessionStorage.setItem('mathcrack_streak_shown', '1')
    mockStore.streak = 5
    useGameStore.mockImplementation(selector => selector(mockStore))
    render(<OverworldMap kingdoms={kingdoms} onSelectKingdom={vi.fn()} />)
    expect(screen.queryByText(/Day 5/)).toBeNull()
  })

  it('hides streak banner when tapped', () => {
    localStorage.setItem('mathcrack_welcomed', '1')
    mockStore.streak = 2
    useGameStore.mockImplementation(selector => selector(mockStore))
    render(<OverworldMap kingdoms={kingdoms} onSelectKingdom={vi.fn()} />)
    const banner = screen.getByText(/Day 2/)
    fireEvent.click(banner.closest('button'))
    expect(screen.queryByText(/Day 2/)).toBeNull()
  })
})

// ─── Completion Trophy ───────────────────────────────────────────────────────

describe('OverworldMap — completion trophy', () => {
  it('renders the Math Lich trophy when all subjects are complete', () => {
    localStorage.setItem('mathcrack_welcomed', '1')
    isKingdomComplete.mockReturnValue(true)
    render(<OverworldMap kingdoms={kingdoms} onSelectKingdom={vi.fn()} />)
    expect(screen.getByText('MATH LICH')).toBeTruthy()
  })

  it('does NOT render the Math Lich trophy when not all subjects are complete', () => {
    localStorage.setItem('mathcrack_welcomed', '1')
    isKingdomComplete.mockImplementation(ids => ids[0] === 'd1') // only k1 complete
    render(<OverworldMap kingdoms={kingdoms} onSelectKingdom={vi.fn()} />)
    expect(screen.queryByText('MATH LICH')).toBeNull()
  })
})

// ─── Subject list ────────────────────────────────────────────────────────────

describe('OverworldMap — subject list', () => {
  it('renders kingdom titles', () => {
    localStorage.setItem('mathcrack_welcomed', '1')
    render(<OverworldMap kingdoms={kingdoms} onSelectKingdom={vi.fn()} />)
    expect(screen.getByText('Algebra')).toBeTruthy()
    expect(screen.getByText('Number Systems')).toBeTruthy()
  })

  it('calls onSelectKingdom with the kingdom id when a row is clicked', () => {
    localStorage.setItem('mathcrack_welcomed', '1')
    const onSelectKingdom = vi.fn()
    render(<OverworldMap kingdoms={kingdoms} onSelectKingdom={onSelectKingdom} />)
    fireEvent.click(screen.getByText('Algebra').closest('button'))
    expect(onSelectKingdom).toHaveBeenCalledWith('k1')
  })
})
