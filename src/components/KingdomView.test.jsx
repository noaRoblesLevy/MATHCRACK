import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import KingdomView from './KingdomView'

vi.mock('../hooks/useProgress', () => ({
  isDungeonComplete: vi.fn(() => false),
  isDungeonUnlocked: vi.fn(() => true),
}))

const dungeons = [
  { id: 'd1', title: 'Dungeon One', file: 'test/d1.json' },
  { id: 'd2', title: 'Dungeon Two', stub: true },
]

describe('KingdomView', () => {
  it('renders the kingdom title', () => {
    render(<KingdomView kingdomTitle="Realm of Vectors" dungeons={dungeons} onSelectDungeon={() => {}} onBack={() => {}} onTrain={() => {}} />)
    expect(screen.getByText('Realm of Vectors')).toBeTruthy()
  })

  it('renders a Train button', () => {
    render(<KingdomView kingdomTitle="Realm of Vectors" dungeons={dungeons} onSelectDungeon={() => {}} onBack={() => {}} onTrain={() => {}} />)
    expect(screen.getByText('⚔ Train')).toBeTruthy()
  })

  it('calls onTrain when Train button is clicked', () => {
    const spy = vi.fn()
    render(<KingdomView kingdomTitle="Realm of Vectors" dungeons={dungeons} onSelectDungeon={() => {}} onBack={() => {}} onTrain={spy} />)
    fireEvent.click(screen.getByText('⚔ Train'))
    expect(spy).toHaveBeenCalledOnce()
  })
})
