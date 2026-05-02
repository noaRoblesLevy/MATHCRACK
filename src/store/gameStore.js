import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useGameStore = create(
  persist(
    (set) => ({
      xp: 0,
      streak: 0,
      lastVisit: null,
      activeView: 'overworld',
      activeKingdom: null,
      activeDungeon: null,
      activeDungeonData: null,
      currentRoom: 0,
      bossAnswers: [],
      lastXPGain: 0,
      bossResult: null,

      addXP: (n) => set((s) => ({ xp: s.xp + n, lastXPGain: n })),
      setActiveKingdom: (id) => set({ activeKingdom: id, activeView: 'kingdom' }),
      setActiveDungeon: (id, data) =>
        set({ activeDungeon: id, activeDungeonData: data, currentRoom: 0, activeView: 'lesson' }),
      advanceRoom: () => set((s) => ({ currentRoom: s.currentRoom + 1 })),
      startBoss: () => set({ activeView: 'boss', bossAnswers: [] }),
      recordBossAnswer: (correct) =>
        set((s) => ({ bossAnswers: [...s.bossAnswers, correct] })),
      setBossResult: (passed) => set({ bossResult: passed }),
      goToResult: () => set({ activeView: 'result' }),
      goToKingdom: () =>
        set({ activeView: 'kingdom', activeDungeon: null, activeDungeonData: null, bossResult: null }),
      goToOverworld: () =>
        set({
          activeView: 'overworld',
          activeKingdom: null,
          activeDungeon: null,
          activeDungeonData: null,
          bossResult: null,
        }),
      updateStreak: () =>
        set((s) => {
          const today = new Date().toDateString()
          if (s.lastVisit === today) return {}
          const yesterday = new Date(Date.now() - 86400000).toDateString()
          return {
            streak: s.lastVisit === yesterday ? s.streak + 1 : 1,
            lastVisit: today,
          }
        }),
    }),
    {
      name: 'mathcrack-game',
      partialize: (s) => ({ xp: s.xp, streak: s.streak, lastVisit: s.lastVisit }),
    }
  )
)
