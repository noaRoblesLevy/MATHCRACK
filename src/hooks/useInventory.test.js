import { describe, it, expect, beforeEach } from 'vitest'
import {
  getInventory, addItem, useItem, getCount, rollLoot,
} from './useInventory'

beforeEach(() => {
  localStorage.clear()
})

describe('getInventory', () => {
  it('returns default inventory when localStorage is empty', () => {
    const inv = getInventory()
    expect(inv).toHaveLength(4)
    expect(inv.find(i => i.type === 'hint-scroll').count).toBe(0)
  })
})

describe('addItem', () => {
  it('increments count for the given type', () => {
    addItem('hint-scroll')
    addItem('hint-scroll')
    expect(getCount('hint-scroll')).toBe(2)
  })
})

describe('useItem', () => {
  it('returns false and does not decrement when count is 0', () => {
    const ok = useItem('hint-scroll')
    expect(ok).toBe(false)
    expect(getCount('hint-scroll')).toBe(0)
  })

  it('returns true and decrements when count > 0', () => {
    addItem('hint-scroll')
    const ok = useItem('hint-scroll')
    expect(ok).toBe(true)
    expect(getCount('hint-scroll')).toBe(0)
  })
})

describe('rollLoot', () => {
  it('returns null for an empty loot table', () => {
    expect(rollLoot([])).toBeNull()
  })

  it('returns a valid item type from a non-empty table', () => {
    const allowed = [{ type: 'hint-scroll', weight: 100 }]
    for (let i = 0; i < 20; i++) {
      expect(rollLoot(allowed)).toBe('hint-scroll')
    }
  })
})
