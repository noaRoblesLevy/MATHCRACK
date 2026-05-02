import { useEffect } from 'react'
import './App.css'
import { useGameStore } from './store/gameStore'
import { markRoomComplete, markBossComplete } from './hooks/useProgress'
import kingdoms from './content/kingdoms.json'
import { loadDungeon } from './content/loadDungeon'
import OverworldMap from './components/OverworldMap'
import KingdomView from './components/KingdomView'
import LessonRoom from './components/LessonRoom'
import BossFight from './components/BossFight'
import ResultScreen from './components/ResultScreen'
import DetailsPanel from './components/DetailsPanel'
import HUD from './components/HUD'

export default function App() {
  const {
    activeView, activeKingdom, activeDungeon, activeDungeonData,
    currentRoom, lastXPGain, bossResult,
    addXP, setActiveKingdom, setActiveDungeon, advanceRoom,
    startBoss, setBossResult, goToResult, goToKingdom, goToOverworld, updateStreak,
  } = useGameStore()

  useEffect(() => { updateStreak() }, [])

  function handleSelectKingdom(id) {
    setActiveKingdom(id)
  }

  function handleSelectDungeon(dungeonMeta) {
    const data = loadDungeon(dungeonMeta.file)
    if (!data) return
    setActiveDungeon(dungeonMeta.id, data)
  }

  function handleRoomComplete(xpEarned, correct) {
    if (correct) {
      addXP(xpEarned)
      markRoomComplete(activeDungeon, currentRoom)
    }
    const totalRooms = activeDungeonData?.rooms?.length ?? 5
    if (currentRoom + 1 >= totalRooms) {
      startBoss()
    } else {
      advanceRoom()
    }
  }

  function handleBossPass(correctCount) {
    addXP(75)
    markBossComplete(activeDungeon)
    setBossResult(true)
    goToResult()
  }

  function handleBossFail() {
    setBossResult(false)
    goToResult()
  }

  function handleRetry() {
    setActiveDungeon(activeDungeon, activeDungeonData)
  }

  const activeKingdomData = kingdoms.find((k) => k.id === activeKingdom)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-deep)' }}>
      {activeView === 'overworld' && (
        <OverworldMap kingdoms={kingdoms} onSelectKingdom={handleSelectKingdom} />
      )}

      {activeView === 'kingdom' && activeKingdomData && (
        <KingdomView
          kingdomTitle={activeKingdomData.title}
          dungeons={activeKingdomData.dungeons}
          onSelectDungeon={handleSelectDungeon}
          onBack={goToOverworld}
        />
      )}

      {activeView === 'lesson' && activeDungeonData && (
        <>
          <HUD
            dungeonTitle={activeDungeonData.title}
            kingdom={activeKingdomData?.subtitle ?? ''}
            xpReward={activeDungeonData.rooms[currentRoom]?.xp ?? 10}
            currentRoom={currentRoom}
            totalRooms={activeDungeonData.rooms.length}
          />
          <LessonRoom
            key={currentRoom}
            room={activeDungeonData.rooms[currentRoom]}
            onComplete={handleRoomComplete}
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
          onContinue={goToKingdom}
          onRetry={handleRetry}
        />
      )}

      {activeView !== 'overworld' && <DetailsPanel />}
    </div>
  )
}
