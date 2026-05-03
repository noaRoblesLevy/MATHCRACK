# Training Ground Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a per-kingdom study mode where players practice shuffled questions from all kingdom dungeons, with collapsible theory panels, infinite loops, and half-XP rewards.

**Architecture:** New `TrainingGround.jsx` view reads `trainingKingdom` from the store, loads all non-stub dungeons for that kingdom, flattens their rooms into a shuffled infinite pool, and drives `LessonRoom` with XP halved at the call site. Store gets two new actions (`startTraining` / `stopTraining`). `KingdomView` gets an `onTrain` prop.

**Tech Stack:** React 18, Zustand, Vitest + @testing-library/react, existing `loadDungeon` + `kingdoms.json`

---

## File Map

| File | Action | What changes |
|---|---|---|
| `src/content/linear-algebra/dungeon-01-number-crypt.json` | Modify | Add top-level `lesson` object |
| `src/content/calculus/dungeon-01-function-foothills.json` | Modify | Add top-level `lesson` object |
| `src/content/statistics/dungeon-01-counting-cavern.json` | Modify | Add top-level `lesson` object |
| `src/content/discrete-math/dungeon-01-logic-gate.json` | Modify | Add top-level `lesson` object |
| `src/store/gameStore.js` | Modify | Add `trainingKingdom`, `startTraining`, `stopTraining` |
| `src/store/gameStore.test.js` | Modify | Add tests for new store actions |
| `src/components/TrainingGround.jsx` | Create | The new training view |
| `src/components/TrainingGround.test.jsx` | Create | Tests for TrainingGround |
| `src/components/KingdomView.jsx` | Modify | Add `onTrain` prop + Train button |
| `src/components/KingdomView.test.jsx` | Create | Test Train button calls onTrain |
| `src/App.jsx` | Modify | Wire `training` view branch + pass props |

---

## Task 1: Add `lesson` field to dungeon JSON files

**Files:**
- Modify: `src/content/linear-algebra/dungeon-01-number-crypt.json`
- Modify: `src/content/calculus/dungeon-01-function-foothills.json`
- Modify: `src/content/statistics/dungeon-01-counting-cavern.json`
- Modify: `src/content/discrete-math/dungeon-01-logic-gate.json`

No tests for this task — data files have no logic. The lesson field is consumed by TrainingGround (tested in Task 3).

- [ ] **Step 1: Add `lesson` to number-crypt.json**

Open `src/content/linear-algebra/dungeon-01-number-crypt.json`. After the opening `{` and before `"id"` (or at the top-level, after the `"dungeonNumber"` field), add:

```json
  "lesson": {
    "title": "Number Types",
    "body": "An integer is any whole number with no decimal part: …, −2, −1, 0, 1, 2, … Rational numbers can be written as a fraction p/q. Irrational numbers (like √2 and π) cannot. The real number line contains both rational and irrational numbers."
  },
```

- [ ] **Step 2: Add `lesson` to function-foothills.json**

Open `src/content/calculus/dungeon-01-function-foothills.json` and add at the top level:

```json
  "lesson": {
    "title": "Functions",
    "body": "A function maps every input x to exactly one output f(x). The domain is the set of valid inputs; the range is the set of possible outputs. A function is even if f(−x) = f(x) (symmetric about the y-axis) and odd if f(−x) = −f(x) (symmetric about the origin)."
  },
```

- [ ] **Step 3: Add `lesson` to counting-cavern.json**

Open `src/content/statistics/dungeon-01-counting-cavern.json` and add at the top level:

```json
  "lesson": {
    "title": "Counting & Combinatorics",
    "body": "A permutation is an ordered arrangement: P(n,r) = n!/(n−r)!. A combination is an unordered selection: C(n,r) = n!/(r!(n−r)!). The multiplication rule: if event A has m outcomes and B has n outcomes, together they have m×n outcomes."
  },
```

- [ ] **Step 4: Add `lesson` to logic-gate.json**

Open `src/content/discrete-math/dungeon-01-logic-gate.json` and add at the top level:

```json
  "lesson": {
    "title": "Propositional Logic",
    "body": "A proposition is a statement that is either true or false. ¬p is true when p is false. p ∧ q is true only when both p and q are true. p ∨ q is true when at least one is true. p → q (if p then q) is false only when p is true and q is false."
  },
```

- [ ] **Step 5: Commit**

```bash
git add src/content/linear-algebra/dungeon-01-number-crypt.json \
        src/content/calculus/dungeon-01-function-foothills.json \
        src/content/statistics/dungeon-01-counting-cavern.json \
        src/content/discrete-math/dungeon-01-logic-gate.json
git commit -m "feat: add lesson field to all dungeon JSON files"
```

---

## Task 2: Add store actions for Training Ground

**Files:**
- Modify: `src/store/gameStore.js`
- Modify: `src/store/gameStore.test.js`

- [ ] **Step 1: Write failing tests**

Open `src/store/gameStore.test.js`. Add to the end of the file:

```js
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
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/store/gameStore.test.js
```

Expected: FAIL — `startTraining is not a function` (or similar).

- [ ] **Step 3: Add state and actions to gameStore.js**

In `src/store/gameStore.js`, add `trainingKingdom: null` to the initial state (line 17, after `bossResult: null`):

```js
      bossResult: null,
      trainingKingdom: null,
```

Then add the two actions after `goToOverworld` (before `updateStreak`):

```js
      startTraining: (kingdomId) =>
        set({ trainingKingdom: kingdomId, activeView: 'training' }),
      stopTraining: () =>
        set({ trainingKingdom: null, activeView: 'kingdom' }),
```

Also update the `beforeEach` in `gameStore.test.js` to include the new field so tests don't bleed state:

```js
beforeEach(() => {
  useGameStore.setState({
    xp: 0, streak: 0, lastVisit: null,
    activeView: 'overworld', activeKingdom: null,
    activeDungeon: null, activeDungeonData: null,
    currentRoom: 0, bossAnswers: [], lastXPGain: 0, bossResult: null,
    trainingKingdom: null,
  })
})
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/store/gameStore.test.js
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/store/gameStore.js src/store/gameStore.test.js
git commit -m "feat: add startTraining and stopTraining to game store"
```

---

## Task 3: Create TrainingGround component

**Files:**
- Create: `src/components/TrainingGround.jsx`
- Create: `src/components/TrainingGround.test.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/TrainingGround.test.jsx` with this content:

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import TrainingGround from './TrainingGround'
import { useGameStore } from '../store/gameStore'

// Mock kingdoms data
vi.mock('../content/kingdoms.json', () => ({
  default: [
    {
      id: 'test-kingdom',
      title: 'Test Kingdom',
      dungeons: [{ id: 'd1', file: 'test/d1.json' }],
    },
  ],
}))

// Mock loadDungeon to return a dungeon with 2 rooms and a lesson
vi.mock('../content/loadDungeon', () => ({
  loadDungeon: vi.fn(() => ({
    lesson: { title: 'Test Topic', body: 'Detailed lesson body here.' },
    rooms: [
      { type: 'multiple-choice', question: 'Q1', answers: ['A', 'B'], correct: 0, xp: 10, difficulty: 1 },
      { type: 'multiple-choice', question: 'Q2', answers: ['C', 'D'], correct: 1, xp: 20, difficulty: 2 },
    ],
  })),
}))

// Mock LessonRoom to a simple stub
vi.mock('./LessonRoom', () => ({
  default: ({ room, onComplete }) => (
    <div>
      <span data-testid="question">{room.question}</span>
      <button onClick={() => onComplete(room.xp, true)}>Correct</button>
      <button onClick={() => onComplete(room.xp, false)}>Wrong</button>
    </div>
  ),
}))

beforeEach(() => {
  useGameStore.setState({
    xp: 0, streak: 0, lastVisit: null,
    activeView: 'training', activeKingdom: 'test-kingdom',
    activeDungeon: null, activeDungeonData: null,
    currentRoom: 0, bossAnswers: [], lastXPGain: 0, bossResult: null,
    trainingKingdom: 'test-kingdom',
  })
  // Make shuffle deterministic: Math.random always returns 0
  vi.spyOn(Math, 'random').mockReturnValue(0)
})

describe('TrainingGround', () => {
  it('renders the Training Ground header', () => {
    render(<TrainingGround />)
    expect(screen.getByText('Training Ground')).toBeTruthy()
  })

  it('renders a question from the pool', () => {
    render(<TrainingGround />)
    const q = screen.getByTestId('question').textContent
    expect(['Q1', 'Q2']).toContain(q)
  })

  it('calls stopTraining when Back is clicked', () => {
    render(<TrainingGround />)
    act(() => { fireEvent.click(screen.getByText('← Kingdom')) })
    expect(useGameStore.getState().activeView).toBe('kingdom')
    expect(useGameStore.getState().trainingKingdom).toBeNull()
  })

  it('adds half XP to store on correct answer', () => {
    render(<TrainingGround />)
    act(() => { fireEvent.click(screen.getByText('Correct')) })
    // xp should be Math.floor(room.xp / 2) — either 5 (Q1) or 10 (Q2)
    expect([5, 10]).toContain(useGameStore.getState().xp)
  })

  it('increments correct counter on correct answer', () => {
    render(<TrainingGround />)
    act(() => { fireEvent.click(screen.getByText('Correct')) })
    expect(screen.getByText(/✓ 1 correct/)).toBeTruthy()
  })

  it('increments total counter on any answer', () => {
    render(<TrainingGround />)
    act(() => { fireEvent.click(screen.getByText('Wrong')) })
    expect(screen.getByText(/1 done/)).toBeTruthy()
  })

  it('theory panel starts collapsed and expands on click', () => {
    render(<TrainingGround />)
    expect(screen.queryByText('Detailed lesson body here.')).toBeFalsy()
    fireEvent.click(screen.getByText(/Test Topic/))
    expect(screen.getByText('Detailed lesson body here.')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/components/TrainingGround.test.jsx
```

Expected: FAIL — `Cannot find module './TrainingGround'`.

- [ ] **Step 3: Implement TrainingGround.jsx**

Create `src/components/TrainingGround.jsx`:

```jsx
import { useState, useMemo } from 'react'
import { useGameStore } from '../store/gameStore'
import kingdoms from '../content/kingdoms.json'
import { loadDungeon } from '../content/loadDungeon'
import LessonRoom from './LessonRoom'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function TrainingGround() {
  const { trainingKingdom, stopTraining, addXP } = useGameStore()

  const initialPool = useMemo(() => {
    const kingdom = kingdoms.find((k) => k.id === trainingKingdom)
    if (!kingdom) return []
    const dungeons = kingdom.dungeons
      .filter((d) => d.file)
      .map((d) => loadDungeon(d.file))
      .filter(Boolean)
    const flat = dungeons.flatMap((d) =>
      d.rooms.map((r) => ({ ...r, lesson: d.lesson ?? null }))
    )
    return shuffle(flat)
  }, [trainingKingdom])

  const [pool, setPool] = useState(initialPool)
  const [idx, setIdx] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [total, setTotal] = useState(0)
  const [theoryOpen, setTheoryOpen] = useState(false)

  if (pool.length === 0) {
    return (
      <div style={{ padding: '2rem', color: 'var(--text)' }}>
        <button onClick={stopTraining} style={backStyle}>← Kingdom</button>
        <p>No questions available for this kingdom yet.</p>
      </div>
    )
  }

  const current = pool[idx]

  function advance() {
    const nextIdx = idx + 1
    if (nextIdx >= pool.length) {
      const newPool = shuffle([...pool])
      setPool(newPool)
      setIdx(0)
      setTheoryOpen(false)
    } else {
      const nextLesson = pool[nextIdx]?.lesson
      if (nextLesson?.title !== current.lesson?.title) setTheoryOpen(false)
      setIdx(nextIdx)
    }
  }

  function handleComplete(xp, wasCorrect) {
    if (wasCorrect) {
      addXP(Math.floor(xp / 2))
      setCorrect((c) => c + 1)
    }
    setTotal((t) => t + 1)
    advance()
  }

  const hasLesson = current.lesson?.title

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-deep)' }}>
      {/* Header */}
      <div style={{
        padding: '1rem 1.5rem',
        background: 'var(--bg-mid)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <button onClick={stopTraining} style={backStyle}>← Kingdom</button>
        <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>Training Ground</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          ✓ {correct} correct &nbsp;|&nbsp; {total} done
        </span>
      </div>

      {/* Theory panel */}
      {hasLesson && (
        <div style={{
          margin: '1rem 1.5rem 0',
          background: '#1a1040',
          border: '1px solid #7c3aed',
          borderRadius: 6,
          overflow: 'hidden',
        }}>
          <button
            onClick={() => setTheoryOpen((o) => !o)}
            style={{
              width: '100%', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', padding: '0.6rem 0.9rem',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#c4b5fd', fontSize: '0.9rem', fontWeight: 'bold',
            }}
          >
            <span>📖 {current.lesson.title}</span>
            <span>{theoryOpen ? '▲' : '▼'}</span>
          </button>
          {theoryOpen && (
            <div style={{ padding: '0 0.9rem 0.75rem', color: '#e2e8f0', fontSize: '0.85rem', lineHeight: 1.6 }}>
              {current.lesson.body}
            </div>
          )}
        </div>
      )}

      {/* Question */}
      <LessonRoom
        key={`${idx}-${pool.length}`}
        room={current}
        onComplete={handleComplete}
      />
    </div>
  )
}

const backStyle = {
  background: 'none', border: 'none',
  color: 'var(--gold)', cursor: 'pointer', fontSize: '0.9rem',
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/components/TrainingGround.test.jsx
```

Expected: all 7 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/TrainingGround.jsx src/components/TrainingGround.test.jsx
git commit -m "feat: add TrainingGround component with shuffled pool and theory panel"
```

---

## Task 4: Add Train button to KingdomView

**Files:**
- Modify: `src/components/KingdomView.jsx`
- Create: `src/components/KingdomView.test.jsx`

- [ ] **Step 1: Write failing test**

Create `src/components/KingdomView.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import KingdomView from './KingdomView'

// useProgress uses localStorage — mock it so tests don't depend on state
vi.mock('../hooks/useProgress', () => ({
  isDungeonComplete: vi.fn(() => false),
  isDungeonUnlocked: vi.fn(() => true),
}))

const dungeons = [
  { id: 'd1', title: 'Dungeon One', file: 'test/d1.json' },
  { id: 'd2', title: 'Dungeon Two', stub: true },
]

describe('KingdomView', () => {
  it('renders the kingdom title', () => {
    render(<KingdomView kingdomTitle="Realm of Vectors" dungeons={dungeons} onSelectDungeon={() => {}} onBack={() => {}} onTrain={() => {}} />)
    expect(screen.getByText('Realm of Vectors')).toBeTruthy()
  })

  it('renders a Train button', () => {
    render(<KingdomView kingdomTitle="Realm of Vectors" dungeons={dungeons} onSelectDungeon={() => {}} onBack={() => {}} onTrain={() => {}} />)
    expect(screen.getByText('⚔ Train')).toBeTruthy()
  })

  it('calls onTrain when Train button is clicked', () => {
    const spy = vi.fn()
    render(<KingdomView kingdomTitle="Realm of Vectors" dungeons={dungeons} onSelectDungeon={() => {}} onBack={() => {}} onTrain={spy} />)
    fireEvent.click(screen.getByText('⚔ Train'))
    expect(spy).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/components/KingdomView.test.jsx
```

Expected: FAIL — `Unable to find an element with the text: ⚔ Train`.

- [ ] **Step 3: Add `onTrain` prop and Train button to KingdomView.jsx**

Replace `src/components/KingdomView.jsx` with:

```jsx
import { isDungeonComplete, isDungeonUnlocked } from '../hooks/useProgress'

export default function KingdomView({ kingdomTitle, dungeons, onSelectDungeon, onBack, onTrain }) {
  const ids = dungeons.map((d) => d.id)

  return (
    <div style={{ padding: '1.5rem', maxWidth: 700, margin: '0 auto' }}>
      <button
        onClick={onBack}
        style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', marginBottom: '1rem', fontSize: '0.9rem' }}
      >
        ← Map
      </button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ color: 'var(--gold)', margin: 0 }}>{kingdomTitle}</h2>
        <button
          onClick={onTrain}
          style={{
            background: '#1a1040', border: '1px solid #7c3aed', borderRadius: 6,
            color: '#c4b5fd', cursor: 'pointer', padding: '0.4rem 0.9rem',
            fontSize: '0.85rem', fontWeight: 'bold',
          }}
        >
          ⚔ Train
        </button>
      </div>
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {dungeons.map((d, i) => {
          const unlocked = isDungeonUnlocked(ids, i)
          const complete = isDungeonComplete(d.id)
          const isStub = !!d.stub
          return (
            <div
              key={d.id}
              onClick={() => unlocked && !isStub && onSelectDungeon(d)}
              style={{
                padding: '1rem 1.25rem',
                background: 'var(--bg-mid)',
                border: `1px solid ${complete ? 'var(--correct)' : unlocked ? 'var(--border)' : '#1a1030'}`,
                borderRadius: 6,
                cursor: unlocked && !isStub ? 'pointer' : 'default',
                opacity: unlocked ? 1 : 0.4,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}
            >
              <span style={{ color: complete ? 'var(--correct)' : 'var(--text)' }}>
                {i + 1}. {d.title}
              </span>
              <span>{complete ? '✅' : unlocked ? (isStub ? '🔧' : '▶') : '💀'}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/components/KingdomView.test.jsx
```

Expected: all 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/KingdomView.jsx src/components/KingdomView.test.jsx
git commit -m "feat: add Train button to KingdomView"
```

---

## Task 5: Wire TrainingGround into App.jsx

**Files:**
- Modify: `src/App.jsx`

No new tests for this task — the wiring is integration-level and all pieces are tested individually. Manual smoke test is specified below.

- [ ] **Step 1: Update App.jsx**

Replace `src/App.jsx` with:

```jsx
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
import TrainingGround from './components/TrainingGround'

export default function App() {
  const {
    activeView, activeKingdom, activeDungeon, activeDungeonData,
    currentRoom, lastXPGain, bossResult,
    addXP, setActiveKingdom, setActiveDungeon, advanceRoom,
    startBoss, setBossResult, goToResult, goToKingdom, goToOverworld, updateStreak,
    startTraining,
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
          onTrain={() => startTraining(activeKingdom)}
        />
      )}

      {activeView === 'training' && (
        <TrainingGround />
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
```

- [ ] **Step 2: Run full test suite**

```bash
npx vitest run
```

Expected: all tests PASS.

- [ ] **Step 3: Smoke test in browser**

```bash
npm run dev
```

Manual checklist:
1. Open http://localhost:5173
2. Click a kingdom (e.g. "The Realm of Vectors") → kingdom view appears
3. "⚔ Train" button visible in header area next to kingdom title
4. Click "⚔ Train" → Training Ground view loads
5. A question renders (multiple choice or drag-and-drop)
6. Theory panel bar visible with topic title and ▼ arrow
7. Click theory panel bar → expands to show lesson body
8. Click again → collapses
9. Answer a question correctly → XP toast appears (half the room XP)
10. Stats bar updates: "✓ 1 correct | 1 done"
11. Answer wrong → MistakeModal appears with explanation → "Got it" → next question
12. Click "← Kingdom" → returns to kingdom view
13. DetailsPanel (gear icon) still works on Training Ground screen

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: wire TrainingGround into App — training view complete"
```

---

## Self-Review

**Spec coverage check:**
- ✅ `lesson` field in all 4 dungeon JSON files — Task 1
- ✅ `startTraining` / `stopTraining` store actions — Task 2
- ✅ `TrainingGround.jsx` with shuffle + infinite loop — Task 3
- ✅ Collapsible theory panel, starts collapsed, auto-collapses on topic change — Task 3
- ✅ XP halved at call site — Task 3 (`Math.floor(xp / 2)`)
- ✅ Back button calls `stopTraining` — Task 3
- ✅ Stats bar (correct / total) — Task 3
- ✅ Train button in KingdomView — Task 4
- ✅ `activeView === 'training'` branch in App — Task 5
- ✅ Edge case: no lesson → panel hidden — Task 3 (`hasLesson` guard)
- ✅ Edge case: no dungeons with files → empty state message — Task 3

**Placeholder scan:** None found.

**Type consistency:** `onTrain` prop added to KingdomView in Task 4 and called in App in Task 5. `startTraining(kingdomId)` defined in Task 2 and called as `startTraining(activeKingdom)` in Task 5. `stopTraining()` defined in Task 2 and called in `TrainingGround` (Task 3). All consistent.
