import { describe, it, expect, beforeEach } from 'vitest'
import {
  getProgress, markRoomComplete, markBossComplete,
  isDungeonComplete, isDungeonUnlocked, isKingdomComplete,
} from './useProgress'

beforeEach(() => localStorage.clear())

describe('markRoomComplete', () => {
  it('stores the room index under the dungeon id', () => {
    markRoomComplete('la-01', 0)
    markRoomComplete('la-01', 1)
    expect(getProgress()['la-01'].rooms).toEqual([0, 1])
  })

  it('does not duplicate entries', () => {
    markRoomComplete('la-01', 0)
    markRoomComplete('la-01', 0)
    expect(getProgress()['la-01'].rooms).toEqual([0])
  })
})

describe('markBossComplete', () => {
  it('sets bossComplete to true', () => {
    markBossComplete('la-01')
    expect(getProgress()['la-01'].bossComplete).toBe(true)
  })
})

describe('isDungeonComplete', () => {
  it('returns false when rooms < 5 or boss not done', () => {
    markRoomComplete('la-01', 0)
    expect(isDungeonComplete('la-01')).toBe(false)
  })

  it('returns true when 5 rooms and boss done', () => {
    ;[0, 1, 2, 3, 4].forEach((i) => markRoomComplete('la-01', i))
    markBossComplete('la-01')
    expect(isDungeonComplete('la-01')).toBe(true)
  })
})

describe('isDungeonUnlocked', () => {
  it('first dungeon is always unlocked', () => {
    expect(isDungeonUnlocked(['la-01', 'la-02'], 0)).toBe(true)
  })

  it('second dungeon unlocked only when first is complete', () => {
    expect(isDungeonUnlocked(['la-01', 'la-02'], 1)).toBe(false)
    ;[0, 1, 2, 3, 4].forEach((i) => markRoomComplete('la-01', i))
    markBossComplete('la-01')
    expect(isDungeonUnlocked(['la-01', 'la-02'], 1)).toBe(true)
  })
})

describe('isKingdomComplete', () => {
  it('returns false if any dungeon incomplete', () => {
    expect(isKingdomComplete(['la-01', 'la-02'])).toBe(false)
  })
})
