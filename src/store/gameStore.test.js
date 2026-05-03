import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from './gameStore'
import { act } from '@testing-library/react'

beforeEach(() => {
  useGameStore.setState({
    xp: 0, streak: 0, lastVisit: null,
    activeView: 'overworld', activeKingdom: null,
    activeDungeon: null, activeDungeonData: null,
    currentRoom: 0, bossAnswers: [], lastXPGain: 0, bossResult: null,
    trainingKingdom: null,
  })
})

describe('addXP', () => {
  it('increments xp and sets lastXPGain', () => {
    act(() => useGameStore.getState().addXP(10))
    const { xp, lastXPGain } = useGameStore.getState()
    expect(xp).toBe(10)
    expect(lastXPGain).toBe(10)
  })
})

describe('setActiveKingdom', () => {
  it('sets activeKingdom and switches view to kingdom', () => {
    act(() => useGameStore.getState().setActiveKingdom('linear-algebra'))
    const { activeKingdom, activeView } = useGameStore.getState()
    expect(activeKingdom).toBe('linear-algebra')
    expect(activeView).toBe('kingdom')
  })
})

describe('setActiveDungeon', () => {
  it('resets currentRoom to 0 and switches view to lesson', () => {
    useGameStore.setState({ currentRoom: 3 })
    act(() => useGameStore.getState().setActiveDungeon('la-01', { rooms: [] }))
    const { currentRoom, activeView } = useGameStore.getState()
    expect(currentRoom).toBe(0)
    expect(activeView).toBe('lesson')
  })
})

describe('advanceRoom', () => {
  it('increments currentRoom', () => {
    act(() => useGameStore.getState().advanceRoom())
    expect(useGameStore.getState().currentRoom).toBe(1)
  })
})

describe('goToOverworld', () => {
  it('resets to overworld view', () => {
    useGameStore.setState({ activeView: 'lesson', activeKingdom: 'calculus' })
    act(() => useGameStore.getState().goToOverworld())
    expect(useGameStore.getState().activeView).toBe('overworld')
  })
})

describe('startTraining', () => {
  it('sets trainingKingdom and switches view to training', () => {
    act(() => useGameStore.getState().startTraining('calculus'))
    const { trainingKingdom, activeView } = useGameStore.getState()
    expect(trainingKingdom).toBe('calculus')
    expect(activeView).toBe('training')
  })
})

describe('stopTraining', () => {
  it('clears trainingKingdom and returns to kingdom view', () => {
    useGameStore.setState({ trainingKingdom: 'calculus', activeView: 'training' })
    act(() => useGameStore.getState().stopTraining())
    const { trainingKingdom, activeView } = useGameStore.getState()
    expect(trainingKingdom).toBeNull()
    expect(activeView).toBe('kingdom')
  })
})
