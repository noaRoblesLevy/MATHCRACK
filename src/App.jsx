import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './App.css'
import { useGameStore } from './store/gameStore'
import { markRoomComplete, markBossComplete } from './hooks/useProgress'
import { useInventory, rollLoot } from './hooks/useInventory'
import { useTheme } from './hooks/useTheme'
import { useAuth, signOut, loadCloudProgress, saveCloudProgress } from './hooks/useAuth'
import kingdomsData from './content/kingdoms.json'
const courses = kingdomsData.courses
const kingdoms = courses.flatMap(c => c.subjects)
import { loadDungeon } from './content/loadDungeon'
import { loadChapter } from './content/loadChapter'
import { CHAPTER_REFS } from './content/chapterRefs'
import OverworldMap from './components/OverworldMap'
import KingdomView from './components/KingdomView'
import StudyScreen from './components/StudyScreen'
import LessonRoom from './components/LessonRoom'
import BossFight from './components/BossFight'
import ResultScreen from './components/ResultScreen'
import DetailsPanel from './components/DetailsPanel'
import HUD from './components/HUD'
import TrainingGround from './components/TrainingGround'
import ProfileScreen from './components/ProfileScreen'
import LibraryScreen from './components/LibraryScreen'
import ReaderScreen from './components/ReaderScreen'
import ShopScreen from './components/ShopScreen'
import BottomNav from './components/BottomNav'
import LoginScreen from './components/LoginScreen'

const FOCUSED_VIEWS = new Set(['lesson', 'boss'])
const NAV_VIEWS = new Set(['overworld', 'profile', 'library', 'shop'])

export default function App() {
  const {
    activeView, activeKingdom, activeDungeon, activeDungeonData,
    currentRoom, lastXPGain, bossResult,
    addXP, addCoins, setActiveKingdom, startStudy, startLesson, setActiveDungeon,
    advanceRoom, startBoss, setBossResult, goToResult, goToKingdom,
    goToOverworld, updateStreak, startTraining, goToProfile, goToLibrary, goToShop,
    resumeLesson, equippedAccentColor, premiumCardsUnlocked,
  } = useGameStore()

  const { inventory, focusMode, scholarActive, addItem, useItem, toggleFocus, toggleScholar } = useInventory()
  const { isDark, toggle: toggleTheme } = useTheme()
  const { user, loading: authLoading, isGuest } = useAuth()
  const [guestMode, setGuestMode] = useState(false)
  const [lootDrop, setLootDrop] = useState(null)
  const [sessionXP, setSessionXP] = useState(0)
  const [roomsCorrect, setRoomsCorrect] = useState(0)
  const [bossScore, setBossScore] = useState({ correct: 0, total: 3 })
  const [wrongBossQuestions, setWrongBossQuestions] = useState([])
  const [openChapter, setOpenChapter] = useState(null)

  useEffect(() => { updateStreak() }, [])

  // When a user logs in, pull their cloud progress and merge
  useEffect(() => {
    if (!user) return
    loadCloudProgress(user.id).then(data => {
      if (!data) return
      // Use whichever has more XP (cloud or local)
      const store = useGameStore.getState()
      if (data.xp > store.xp) {
        useGameStore.setState({ xp: data.xp, streak: data.streak, lastVisit: data.last_visit })
      }
      // Merge dungeon completion — union of cloud and local (a dungeon stays complete)
      if (data.progress && typeof data.progress === 'object') {
        const local = JSON.parse(localStorage.getItem('mathcrack_progress') || '{}')
        const merged = { ...data.progress }
        for (const [id, val] of Object.entries(local)) {
          if (!merged[id]) { merged[id] = val; continue }
          merged[id] = {
            rooms: [...new Set([...(merged[id].rooms ?? []), ...(val.rooms ?? [])])],
            bossComplete: merged[id].bossComplete || val.bossComplete,
          }
        }
        localStorage.setItem('mathcrack_progress', JSON.stringify(merged))
      }
    })
  }, [user?.id])

  // Save to cloud after XP or dungeon progress changes
  const xp = useGameStore(s => s.xp)
  const streak = useGameStore(s => s.streak)
  const lastVisit = useGameStore(s => s.lastVisit)
  useEffect(() => {
    if (!user) return
    saveCloudProgress(user.id, { xp, streak, last_visit: lastVisit })
  }, [xp, streak, user?.id])

  const hintScrolls = inventory.find(i => i.type === 'hint-scroll')?.count ?? 0
  const solutionOrbs = inventory.find(i => i.type === 'solution-orb')?.count ?? 0
  const activeKingdomData = kingdoms.find(k => k.id === activeKingdom)
  const showNav = !FOCUSED_VIEWS.has(activeView)

  // Next lesson in the same subject (null if this is the last one)
  const nextDungeon = (() => {
    if (!activeKingdomData || !activeDungeon) return null
    const available = activeKingdomData.dungeons.filter(d => !d.stub)
    const idx = available.findIndex(d => d.id === activeDungeon)
    return idx >= 0 && idx < available.length - 1 ? available[idx + 1] : null
  })()

  // Show login screen until authenticated or guest mode chosen
  if (!isGuest && authLoading) return (
    <div style={{ minHeight:'100vh', background:'var(--bg-deep)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ fontFamily:'var(--font-mono)', color:'var(--text-muted)', fontSize:'0.75rem', letterSpacing:'2px' }}>LOADING...</div>
    </div>
  )
  if (!isGuest && !user && !guestMode) return (
    <LoginScreen onGuest={() => setGuestMode(true)} />
  )

  function handleSelectDungeon(dungeonMeta) {
    const data = loadDungeon(dungeonMeta.file)
    if (!data) return
    startStudy(dungeonMeta.id, data)
    setSessionXP(0)
    setRoomsCorrect(0)
  }

  function handleResume(fromRoom) {
    if (fromRoom === 'boss') {
      startBoss()
    } else {
      resumeLesson(fromRoom)
      setRoomsCorrect(fromRoom) // credit already-completed rooms
    }
  }

  function handleRoomComplete(xpEarned, correct) {
    if (correct) {
      addXP(xpEarned)
      addCoins(2)
      markRoomComplete(activeDungeon, currentRoom)
      setSessionXP(prev => prev + xpEarned)
      setRoomsCorrect(prev => prev + 1)
    }
    const totalRooms = activeDungeonData?.rooms?.length ?? 5
    if (currentRoom + 1 >= totalRooms) startBoss()
    else advanceRoom()
  }

  function handleBossPass(correctCount) {
    const bossTotal = activeDungeonData?.boss?.questions?.length ?? 3
    const bossXP = correctCount * 25
    addXP(bossXP)
    addCoins(20)
    markBossComplete(activeDungeon)
    setBossResult(true)
    setSessionXP(prev => prev + bossXP)
    setBossScore({ correct: correctCount, total: bossTotal })
    setWrongBossQuestions([])
    const drop = rollLoot(activeDungeonData?.lootTable ?? [])
    setLootDrop(drop)
    goToResult()
  }

  function handleBossFail(correctCount, wrongQuestions) {
    const bossTotal = activeDungeonData?.boss?.questions?.length ?? 3
    setBossResult(false)
    setBossScore({ correct: correctCount, total: bossTotal })
    setWrongBossQuestions(wrongQuestions ?? [])
    setLootDrop(null)
    goToResult()
  }

  function handleContinue() {
    if (lootDrop) addItem(lootDrop)
    setLootDrop(null)
    setSessionXP(0)
    setRoomsCorrect(0)
    goToKingdom()
  }

  function handleNextLesson() {
    if (!nextDungeon) return
    if (lootDrop) addItem(lootDrop)
    setLootDrop(null)
    const data = loadDungeon(nextDungeon.file)
    if (!data) { goToKingdom(); return }
    setSessionXP(0)
    setRoomsCorrect(0)
    startStudy(nextDungeon.id, data)
  }

  function handleOpenChapter(chapter) {
    setOpenChapter(chapter)
    goToLibrary()
  }

  function handleReadChapterFromLesson(chapterId) {
    const chapter = loadChapter(chapterId)
    if (chapter) handleOpenChapter(chapter)
  }

  const transitionKey = activeView + (openChapter ? '-reader' : '')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-deep)' }}>

      <AnimatePresence mode="sync">
        <motion.div
          key={transitionKey}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={{ minHeight: '100vh' }}
        >
          {activeView === 'overworld' && (
            <OverworldMap courses={courses} kingdoms={kingdoms} onSelectKingdom={id => setActiveKingdom(id)} premiumCardsUnlocked={premiumCardsUnlocked} />
          )}

          {activeView === 'profile' && <ProfileScreen isDark={isDark} onToggleTheme={toggleTheme} />}
          {activeView === 'shop' && <ShopScreen />}

          {activeView === 'library' && !openChapter && (
            <LibraryScreen onOpenChapter={handleOpenChapter} />
          )}

          {activeView === 'library' && openChapter && (
            <ReaderScreen
              chapter={openChapter}
              onBack={() => setOpenChapter(null)}
            />
          )}

          {activeView === 'kingdom' && activeKingdomData && (
            <KingdomView
              kingdom={activeKingdomData}
              onSelectDungeon={handleSelectDungeon}
              onBack={goToOverworld}
              onTrain={() => startTraining(activeKingdom)}
            />
          )}

          {activeView === 'study' && activeDungeonData && (
            <StudyScreen
              dungeon={activeDungeonData}
              dungeonId={activeDungeon}
              subjectTitle={activeKingdomData?.title ?? ''}
              subjectColor={activeKingdomData?.color ?? 'var(--blue)'}
              onStart={startLesson}
              onResume={handleResume}
              onBack={goToKingdom}
              onReadChapter={handleReadChapterFromLesson}
              inventory={inventory}
              focusMode={focusMode}
              scholarActive={scholarActive}
              onToggleFocus={toggleFocus}
              onToggleScholar={toggleScholar}
            />
          )}

          {activeView === 'training' && <TrainingGround />}

          {activeView === 'lesson' && activeDungeonData && (
            <>
              <HUD
                dungeonTitle={activeDungeonData.title}
                kingdom={activeKingdomData?.title ?? ''}
                xpReward={activeDungeonData.rooms[currentRoom]?.xp ?? 10}
                currentRoom={currentRoom}
                totalRooms={activeDungeonData.rooms.length}
                onBack={goToKingdom}
                accentColor={equippedAccentColor}
              />
              <LessonRoom
                key={currentRoom}
                room={activeDungeonData.rooms[currentRoom]}
                onComplete={handleRoomComplete}
                hintScrolls={hintScrolls}
                solutionOrbs={solutionOrbs}
                focusMode={focusMode}
                alwaysShowExplanation={scholarActive}
                onUseScroll={() => useItem('hint-scroll')}
                onUseSolutionOrb={() => useItem('solution-orb')}
              />
            </>
          )}

          {activeView === 'boss' && activeDungeonData?.boss && (
            <BossFight
              boss={activeDungeonData.boss}
              lessonTitle={activeDungeonData.title ?? ''}
              onPass={handleBossPass}
              onFail={handleBossFail}
            />
          )}

          {activeView === 'result' && (
            <ResultScreen
              passed={bossResult === true}
              xpGained={sessionXP}
              lessonTitle={activeDungeonData?.title ?? ''}
              totalRooms={activeDungeonData?.rooms?.length ?? 5}
              roomsCorrect={roomsCorrect}
              bossScore={bossScore}
              lootDrop={lootDrop}
              wrongBossQuestions={wrongBossQuestions}
              nextLessonTitle={nextDungeon?.title ?? null}
              onContinue={handleContinue}
              onNextLesson={nextDungeon ? handleNextLesson : null}
              onRetry={() => setActiveDungeon(activeDungeon, activeDungeonData)}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {!FOCUSED_VIEWS.has(activeView) &&
        activeView !== 'overworld' &&
        activeView !== 'profile' &&
        activeView !== 'library' && (
        <DetailsPanel
          inventory={inventory}
          focusMode={focusMode}
          scholarActive={scholarActive}
          onToggleFocus={toggleFocus}
          onToggleScholar={toggleScholar}
        />
      )}

      {showNav && (
        <BottomNav
          activeView={activeView}
          onSubjects={goToOverworld}
          onLibrary={() => { setOpenChapter(null); goToLibrary() }}
          onShop={goToShop}
          onProfile={goToProfile}
        />
      )}
    </div>
  )
}
