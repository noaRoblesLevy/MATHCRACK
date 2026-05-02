import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MistakeModal from './MistakeModal'

describe('MistakeModal', () => {
  it('renders the explanation text', () => {
    render(<MistakeModal explanation="Because x must be non-zero." correctAnswer="x ≠ 0" onDismiss={() => {}} />)
    expect(screen.getByText('Because x must be non-zero.')).toBeTruthy()
  })

  it('renders the correct answer', () => {
    render(<MistakeModal explanation="Because x must be non-zero." correctAnswer="x ≠ 0" onDismiss={() => {}} />)
    expect(screen.getByText(/x ≠ 0/)).toBeTruthy()
  })

  it('calls onDismiss when Got it is clicked', () => {
    const spy = vi.fn()
    render(<MistakeModal explanation="Because x must be non-zero." correctAnswer="x ≠ 0" onDismiss={spy} />)
    fireEvent.click(screen.getByText('Got it'))
    expect(spy).toHaveBeenCalledOnce()
  })
})
