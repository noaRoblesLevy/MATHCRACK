import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LootDrop from './LootDrop'

describe('LootDrop', () => {
  it('renders the item name', () => {
    render(<LootDrop itemType="hint-scroll" onCollect={() => {}} />)
    expect(screen.getByText(/Hint Scroll/i)).toBeTruthy()
  })

  it('calls onCollect when button clicked', () => {
    const spy = vi.fn()
    render(<LootDrop itemType="hint-scroll" onCollect={spy} />)
    fireEvent.click(screen.getByText(/Collect/i))
    expect(spy).toHaveBeenCalledOnce()
  })

  it('renders correct label for solution-orb', () => {
    render(<LootDrop itemType="solution-orb" onCollect={() => {}} />)
    expect(screen.getByText(/Solution Orb/i)).toBeTruthy()
  })
})
