import { useEffect, useState } from 'react'
import './App.css'
import { useGameStore } from './store/gameStore'
import { markRoomComplete, markBossComplete } from './hooks/useProgress'
import { useInventory, rollLoot } from './hooks/useInventory'
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

  const {
    inventory, focusMode, scholarActive,
    addItem, useItem, toggleFocus, toggleScholar,
  } = useInventory()

  const [lootDrop, setLootDrop] = useState(null)

  useEffect(() => { updateStreak() }, [])

  const hintScrolls = inventory.find(i => i.type === 'hint-scroll')?.count ?? 0
  const solutionOrbs = inventory.find(i => i.type === 'solution-orb')?.count ?? 0

  function handleSelectKingdom(id) { setActiveKingdom(id) }

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

  function handleRetry() {
    setActiveDungeon(activeDungeon, activeDungeonData)
  }

  function handleContinue() {
    if (lootDrop) addItem(lootDrop)
    setLootDrop(null)
    goToKingdom()
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
          onRetry={handleRetry}
        />
      )}

      {activeView !== 'overworld' && (
        <DetailsPanel
          inventory={inventory}
          focusMode={focusMode}
          scholarActive={scholarActive}
          onToggleFocus={toggleFocus}
          onToggleScholar={toggleScholar}
        />
      )}
    </div>
  )
}
