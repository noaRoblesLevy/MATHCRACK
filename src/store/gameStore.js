import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useGameStore = create(
  persist(
    (set) => ({
      xp: 0,
      streak: 0,
      lastVisit: null,
      hasSeenHint: false,
      activeView: 'overworld',
      activeKingdom: null,
      activeDungeon: null,
      activeDungeonData: null,
      currentRoom: 0,
      bossAnswers: [],
      lastXPGain: 0,
      bossResult: null,
      trainingKingdom: null,

      addXP: (n) => set((s) => ({ xp: s.xp + n, lastXPGain: n })),
      setActiveKingdom: (id) => set({ activeKingdom: id, activeView: 'kingdom' }),

      // Load dungeon data and show study screen first
      startStudy: (id, data) =>
        set({ activeDungeon: id, activeDungeonData: data, activeView: 'study' }),

      // From study screen → start the actual quiz
      startLesson: () =>
        set({ currentRoom: 0, activeView: 'lesson' }),

      setActiveDungeon: (id, data) =>
        set({ activeDungeon: id, activeDungeonData: data, currentRoom: 0, activeView: 'lesson' }),

      advanceRoom: () => set((s) => ({ currentRoom: s.currentRoom + 1 })),
      startBoss: () => set({ activeView: 'boss', bossAnswers: [] }),
      recordBossAnswer: (correct) =>
        set((s) => ({ bossAnswers: [...s.bossAnswers, correct] })),
      setBossResult: (passed) => set({ bossResult: passed }),
      goToResult: () => set({ activeView: 'result' }),
      goToProfile: () => set({ activeView: 'profile' }),
      goToLibrary: () => set({ activeView: 'library' }),
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
      startTraining: (kingdomId) =>
        set({ trainingKingdom: kingdomId, activeView: 'training' }),
      stopTraining: () =>
        set({ trainingKingdom: null, activeView: 'kingdom' }),
      dismissHint: () => set({ hasSeenHint: true }),
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
      partialize: (s) => ({ xp: s.xp, streak: s.streak, lastVisit: s.lastVisit, hasSeenHint: s.hasSeenHint }),
    }
  )
)
