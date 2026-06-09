import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DAILY_GOAL = 30 // XP needed to advance streak (~3 correct Room answers)
const STREAK_COIN_MILESTONES = { 7: 50, 14: 100, 30: 200 }

export const useGameStore = create(
  persist(
    (set) => ({
      xp: 0,
      coins: 0,
      dailyXP: 0,
      lastStreakDate: null,
      streak: 0,
      lastVisit: null,
      hasSeenHint: false,
      streakFreezes: 0,
      equippedFlair: null,
      equippedIcon: null,
      equippedAccentColor: null,
      premiumCardsUnlocked: false,
      ownedFlairs: [],
      ownedIcons: [],
      ownedAccentColors: [],
      activeView: 'overworld',
      activeKingdom: null,
      activeDungeon: null,
      activeDungeonData: null,
      currentRoom: 0,
      bossAnswers: [],
      lastXPGain: 0,
      bossResult: null,
      trainingKingdom: null,

      addXP: (n) => set((s) => {
        const today = new Date().toDateString()
        const newDailyXP = s.dailyXP + n
        const goalJustMet = newDailyXP >= DAILY_GOAL && s.dailyXP < DAILY_GOAL
        const streakAlreadyGiven = s.lastStreakDate === today

        let streakUpdate = {}
        let coinBonus = 0

        if (goalJustMet && !streakAlreadyGiven) {
          const yesterday = new Date(Date.now() - 86400000).toDateString()
          const newStreak = s.lastStreakDate === yesterday ? s.streak + 1 : 1
          coinBonus += 10
          if (STREAK_COIN_MILESTONES[newStreak]) coinBonus += STREAK_COIN_MILESTONES[newStreak]
          streakUpdate = { streak: newStreak, lastStreakDate: today }
        }

        return { xp: s.xp + n, lastXPGain: n, dailyXP: newDailyXP, coins: s.coins + coinBonus, ...streakUpdate }
      }),

      addCoins: (n) => set((s) => ({ coins: s.coins + n })),
      spendCoins: (n) => {
        let success = false
        set((s) => {
          if (s.coins < n) return {}
          success = true
          return { coins: s.coins - n }
        })
        return success
      },
      buyShopItem: (price, stateUpdateFn) => {
        let success = false
        set((s) => {
          if (s.coins < price) return {}
          success = true
          return { coins: s.coins - price, ...stateUpdateFn(s) }
        })
        return success
      },
      equipFlair: (flair) => set({ equippedFlair: flair }),
      unequipFlair: () => set({ equippedFlair: null }),
      equipIcon: (icon) => set({ equippedIcon: icon }),
      equipAccentColor: (color) => set({ equippedAccentColor: color }),
      setActiveKingdom: (id) => set({ activeKingdom: id, activeView: 'kingdom' }),

      // Load dungeon data and show study screen first
      startStudy: (id, data) =>
        set({ activeDungeon: id, activeDungeonData: data, activeView: 'study' }),

      // From study screen → start the actual quiz
      startLesson: () =>
        set({ currentRoom: 0, activeView: 'lesson' }),

      // Resume from a specific room index
      resumeLesson: (startRoom) =>
        set({ currentRoom: startRoom, activeView: 'lesson' }),

      setActiveDungeon: (id, data) =>
        set({ activeDungeon: id, activeDungeonData: data, currentRoom: 0, activeView: 'lesson' }),

      advanceRoom: () => set((s) => ({ currentRoom: s.currentRoom + 1 })),
      startBoss: () => set({ activeView: 'boss', bossAnswers: [] }),
      recordBossAnswer: (correct) =>
        set((s) => ({ bossAnswers: [...s.bossAnswers, correct] })),
      setBossResult: (passed) => set({ bossResult: passed }),
      goToResult: () => set({ activeView: 'result' }),
      goToProfile: () => set({ activeView: 'profile' }),
      goToShop: () => set({ activeView: 'shop' }),
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
          const todayMs = new Date(today).getTime()
          const lastMs = s.lastStreakDate ? new Date(s.lastStreakDate).getTime() : 0
          const daysMissed = lastMs ? Math.round((todayMs - lastMs) / 86400000) : Infinity
          if (daysMissed > 1 && s.streak > 0) {
            if (s.streakFreezes > 0) {
              return { dailyXP: 0, lastVisit: today, streakFreezes: s.streakFreezes - 1 }
            }
            return { dailyXP: 0, lastVisit: today, streak: 0, lastStreakDate: null }
          }
          return { dailyXP: 0, lastVisit: today }
        }),
    }),
    {
      name: 'mathcrack-game',
      partialize: (s) => ({ xp: s.xp, coins: s.coins, dailyXP: s.dailyXP, lastStreakDate: s.lastStreakDate, streak: s.streak, lastVisit: s.lastVisit, hasSeenHint: s.hasSeenHint, streakFreezes: s.streakFreezes, equippedFlair: s.equippedFlair, equippedIcon: s.equippedIcon, equippedAccentColor: s.equippedAccentColor, premiumCardsUnlocked: s.premiumCardsUnlocked, ownedFlairs: s.ownedFlairs, ownedIcons: s.ownedIcons, ownedAccentColors: s.ownedAccentColors }),
    }
  )
)
