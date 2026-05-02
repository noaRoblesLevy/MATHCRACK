import { describe, it, expect } from 'vitest'
import { getTitle, getXPToNextLevel, getTierProgress } from './useXP'

describe('getTitle', () => {
  it('returns Apprentice at 0 XP', () => expect(getTitle(0)).toBe('Apprentice'))
  it('returns Adept at 100 XP', () => expect(getTitle(100)).toBe('Adept'))
  it('returns Scholar at 300 XP', () => expect(getTitle(300)).toBe('Scholar'))
  it('returns Sage at 700 XP', () => expect(getTitle(700)).toBe('Sage'))
  it('returns Archmage at 1500 XP', () => expect(getTitle(1500)).toBe('Archmage'))
  it('returns Math Lich at 3000 XP', () => expect(getTitle(3000)).toContain('Math Lich'))
})

describe('getXPToNextLevel', () => {
  it('returns 100 at 0 XP (Apprentice max is 99)', () => expect(getXPToNextLevel(0)).toBe(100))
  it('returns 0 at Math Lich tier (no next level)', () => expect(getXPToNextLevel(3000)).toBe(0))
})

describe('getTierProgress', () => {
  it('returns 0 at the start of a tier', () => expect(getTierProgress(0)).toBeCloseTo(0))
  it('returns 1 at Math Lich (max tier)', () => expect(getTierProgress(3000)).toBe(1))
})
