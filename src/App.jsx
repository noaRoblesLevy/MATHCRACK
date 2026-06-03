import { useEffect, useState } from 'react'
import './App.css'
import { useGameStore } from './store/gameStore'
import { markRoomComplete, markBossComplete } from './hooks/useProgress'
import { useInventory, rollLoot } from './hooks/useInventory'
import { useTheme } from './hooks/useTheme'
import { useAuth, signOut, loadCloudProgress, saveCloudProgress } from './hooks/useAuth'
import kingdoms from './content/kingdoms.json'
import { loadDungeon } from './content/loadDungeon'
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
import BottomNav from './components/BottomNav'
import LoginScreen from './components/LoginScreen'

const FOCUSED_VIEWS = new Set(['lesson', 'boss'])

export default function App() {
  const {
    activeView, activeKingdom, activeDungeon, activeDungeonData,
    currentRoom, lastXPGain, bossResult,
    addXP, setActiveKingdom, startStudy, startLesson, setActiveDungeon,
    advanceRoom, startBoss, setBossResult, goToResult, goToKingdom,
    goToOverworld, updateStreak, startTraining, goToProfile, goToLibrary,
  } = useGameStore()

  const { inventory, focusMode, scholarActive, addItem, useItem, toggleFocus, toggleScholar } = useInventory()
  useTheme()
  const { user, loading: authLoading, isGuest } = useAuth()
  const [guestMode, setGuestMode] = useState(false)
  const [lootDrop, setLootDrop] = useState(null)
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
    })
  }, [user?.id])

  // Save to cloud after XP changes
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
  }

  function handleRoomComplete(xpEarned, correct) {
    if (correct) {
      addXP(xpEarned)
      markRoomComplete(activeDungeon, currentRoom)
    }
    const totalRooms = activeDungeonData?.rooms?.length ?? 5
    if (currentRoom + 1 >= totalRooms) startBoss()
    else advanceRoom()
  }

  function handleBossPass() {
    addXP(75)
    markBossComplete(activeDungeon)
    setBossResult(true)
    const drop = rollLoot(activeDungeonData?.lootTable ?? [])
    setLootDrop(drop)
    goToResult()
  }

  function handleBossFail() {
    setBossResult(false)
    setLootDrop(null)
    goToResult()
  }

  function handleContinue() {
    if (lootDrop) addItem(lootDrop)
    setLootDrop(null)
    goToKingdom()
  }

  function handleOpenChapter(chapter) {
    setOpenChapter(chapter)
    goToLibrary()
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-deep)' }}>

      {activeView === 'overworld' && (
        <OverworldMap kingdoms={kingdoms} onSelectKingdom={id => setActiveKingdom(id)} />
      )}

      {activeView === 'profile' && <ProfileScreen />}

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
          subjectTitle={activeKingdomData?.title ?? ''}
          subjectColor={activeKingdomData?.color ?? 'var(--blue)'}
          onStart={startLesson}
          onBack={goToKingdom}
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
          onPass={handleBossPass}
          onFail={handleBossFail}
        />
      )}

      {activeView === 'result' && (
        <ResultScreen
          passed={bossResult === true}
          xpGained={lastXPGain}
          dungeonTitle={activeDungeonData?.title ?? ''}
          lootDrop={lootDrop}
          onContinue={handleContinue}
          onRetry={() => setActiveDungeon(activeDungeon, activeDungeonData)}
        />
      )}

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
          onProfile={goToProfile}
        />
      )}
    </div>
  )
}
