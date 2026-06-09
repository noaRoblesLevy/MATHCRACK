# App Quality Improvements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix eight confirmed bugs/UX issues: theme toggle in nav, hardcoded boss/fail colours, touch drag-and-drop, loot gating, total session XP, duplicate Notes button, reactive progress counter, and legacy font variable.

**Architecture:** All eight fixes are independent. Logic fixes (loot, XP, font) touch isolated functions/props. Wiring fixes (theme toggle, colours, drag, Notes button, OverworldMap reactivity) require threading props through existing component boundaries that are already partially set up.

**Tech Stack:** React 18, Vite, Vitest + @testing-library/react, framer-motion, localStorage-backed state (no Redux/Zustand for progress).

---

## File Map

| File | Change |
|---|---|
| `src/hooks/useInventory.js` | `rollLoot`: return `null` for empty table |
| `src/hooks/useInventory.test.js` | Update `rollLoot([])` assertion; add non-empty test |
| `src/App.jsx` | Capture `useTheme()` return; add `sessionXP` state; pass theme props to `BottomNav`; pass `sessionXP` to `ResultScreen` |
| `src/components/BottomNav.jsx` | Render `ThemeToggle` in nav using `isDark`/`onToggle` props |
| `src/components/BossFight.jsx` | Replace 3 hardcoded hex values with CSS variables |
| `src/components/ResultScreen.jsx` | Replace 4 hardcoded hex values; replace 2 `var(--font)` with `var(--font-mono)` |
| `src/components/StudyScreen.jsx` | Remove duplicate Notes button from action row |
| `src/components/StudyScreen.test.jsx` | New file: test single toggle + Start Quiz button |
| `src/components/LessonRoom.jsx` | Add `onTouchStart/Move/End` to `DragAndDrop` items |
| `src/components/OverworldMap.jsx` | Replace inline `localStorage.getItem` with `isDungeonComplete` import |
| `src/components/OverworldMap.test.jsx` | New file: test reactive progress counter |

---

## Task 1: Gate loot drops on non-empty loot table

**Files:**
- Modify: `src/hooks/useInventory.js:53-62`
- Modify: `src/hooks/useInventory.test.js:41-54`

- [ ] **Step 1: Update the failing test first**

Open `src/hooks/useInventory.test.js`. Replace the `rollLoot` describe block (lines 41–54) with:

```js
describe('rollLoot', () => {
  it('returns null for an empty loot table', () => {
    expect(rollLoot([])).toBeNull()
  })

  it('returns a valid item type from a non-empty table', () => {
    const allowed = [{ type: 'hint-scroll', weight: 100 }]
    for (let i = 0; i < 20; i++) {
      expect(rollLoot(allowed)).toBe('hint-scroll')
    }
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```
cd C:\Users\noaro\MATHCRACK
npx vitest run src/hooks/useInventory.test.js
```

Expected: `returns null for an empty loot table` FAILS (currently returns a valid item type).

- [ ] **Step 3: Fix `rollLoot` in `src/hooks/useInventory.js`**

Replace lines 53–62:

```js
export function rollLoot(lootTable) {
  if (!lootTable || lootTable.length === 0) return null
  const total = lootTable.reduce((s, e) => s + e.weight, 0)
  let roll = Math.random() * total
  for (const entry of lootTable) {
    roll -= entry.weight
    if (roll <= 0) return entry.type
  }
  return lootTable[lootTable.length - 1].type
}
```

- [ ] **Step 4: Run tests to confirm both pass**

```
npx vitest run src/hooks/useInventory.test.js
```

Expected: all 6 tests PASS.

- [ ] **Step 5: Commit**

```
git add src/hooks/useInventory.js src/hooks/useInventory.test.js
git commit -m "fix: rollLoot returns null for empty loot table"
```

---

## Task 2: Show total session XP on result screen

**Files:**
- Modify: `src/App.jsx`

The current code passes `lastXPGain` (only the boss XP: 75) to `ResultScreen`. We need to accumulate XP across all rooms and the boss in local state.

- [ ] **Step 1: Add `sessionXP` state and wiring in `src/App.jsx`**

After line 41 (`const [lootDrop, setLootDrop] = useState(null)`), add:

```js
const [sessionXP, setSessionXP] = useState(0)
```

- [ ] **Step 2: Reset `sessionXP` when a lesson starts**

In `handleSelectDungeon` (line 83), add the reset after `startStudy`:

```js
function handleSelectDungeon(dungeonMeta) {
  const data = loadDungeon(dungeonMeta.file)
  if (!data) return
  startStudy(dungeonMeta.id, data)
  setSessionXP(0)
}
```

- [ ] **Step 3: Accumulate room XP in `handleRoomComplete`**

Replace lines 89–97:

```js
function handleRoomComplete(xpEarned, correct) {
  if (correct) {
    addXP(xpEarned)
    markRoomComplete(activeDungeon, currentRoom)
    setSessionXP(prev => prev + xpEarned)
  }
  const totalRooms = activeDungeonData?.rooms?.length ?? 5
  if (currentRoom + 1 >= totalRooms) startBoss()
  else advanceRoom()
}
```

- [ ] **Step 4: Accumulate boss XP in `handleBossPass`**

Replace lines 99–106:

```js
function handleBossPass() {
  const bossXP = 75
  addXP(bossXP)
  markBossComplete(activeDungeon)
  setBossResult(true)
  setSessionXP(prev => prev + bossXP)
  const drop = rollLoot(activeDungeonData?.lootTable ?? [])
  setLootDrop(drop)
  goToResult()
}
```

- [ ] **Step 5: Reset `sessionXP` in `handleContinue`**

Replace line 114 (`function handleContinue`) block:

```js
function handleContinue() {
  if (lootDrop) addItem(lootDrop)
  setLootDrop(null)
  setSessionXP(0)
  goToKingdom()
}
```

- [ ] **Step 6: Pass `sessionXP` to `ResultScreen`**

In the JSX block at line 210, change `xpGained={lastXPGain}` to `xpGained={sessionXP}`:

```jsx
{activeView === 'result' && (
  <ResultScreen
    passed={bossResult === true}
    xpGained={sessionXP}
    dungeonTitle={activeDungeonData?.title ?? ''}
    lootDrop={lootDrop}
    onContinue={handleContinue}
    onRetry={() => setActiveDungeon(activeDungeon, activeDungeonData)}
  />
)}
```

- [ ] **Step 7: Commit**

```
git add src/App.jsx
git commit -m "fix: show total session XP (rooms + boss) on result screen"
```

---

## Task 3: Replace hardcoded colours in BossFight header

**Files:**
- Modify: `src/components/BossFight.jsx:26-33`

- [ ] **Step 1: Replace hardcoded hex values**

Replace lines 26–33 in `BossFight.jsx`:

```jsx
<div style={{
  padding: '1rem 1.5rem', background: 'var(--danger-bg)',
  borderBottom: '2px solid var(--danger)',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
}}>
  <span style={{ color: 'var(--text)', fontWeight: 'bold' }}>⚔ BOSS FIGHT</span>
  <span style={{ color: 'var(--text)' }}>{questionIdx + 1} / {boss.questions.length}</span>
  <span style={{ color: 'var(--text)' }}>✓ {correctCount} — need {boss.passMark}</span>
</div>
```

- [ ] **Step 2: Commit**

```
git add src/components/BossFight.jsx
git commit -m "fix: replace hardcoded dark-red hex values in BossFight header with CSS vars"
```

---

## Task 4: Replace hardcoded colours and legacy font variable in ResultScreen

**Files:**
- Modify: `src/components/ResultScreen.jsx`

- [ ] **Step 1: Fix fail-state heading colour (line 69)**

Change:
```jsx
<h2 style={{ color: '#ef4444', marginBottom: '0.5rem', fontSize: '1.6rem' }}>
```
To:
```jsx
<h2 style={{ color: 'var(--danger)', marginBottom: '0.5rem', fontSize: '1.6rem' }}>
```

- [ ] **Step 2: Fix fail-state button colours (lines 76–83)**

Change the button's style:
```jsx
style={{
  padding: '0.75rem 2.5rem', background: 'var(--danger-bg)',
  border: '1px solid var(--danger)', color: 'var(--text)',
  borderRadius: 6, cursor: 'pointer', fontSize: '1rem', fontFamily: 'var(--font-mono)',
}}
```

- [ ] **Step 3: Replace `var(--font)` with `var(--font-mono)` in pass-state Continue button (line 59)**

Change:
```jsx
fontFamily: 'var(--font)',
```
To:
```jsx
fontFamily: 'var(--font-mono)',
```

- [ ] **Step 4: Commit**

```
git add src/components/ResultScreen.jsx
git commit -m "fix: replace hardcoded hex values and legacy --font alias in ResultScreen"
```

---

## Task 5: Wire theme toggle into BottomNav

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/BottomNav.jsx`

- [ ] **Step 1: Capture `useTheme()` return value in `App.jsx`**

Line 38 currently reads:
```js
useTheme()
```

Replace with:
```js
const { isDark, toggle: toggleTheme } = useTheme()
```

- [ ] **Step 2: Pass theme props to `BottomNav` in `App.jsx`**

Find the `<BottomNav` JSX (around line 236) and add two props:

```jsx
<BottomNav
  activeView={activeView}
  onSubjects={goToOverworld}
  onLibrary={() => { setOpenChapter(null); goToLibrary() }}
  onProfile={goToProfile}
  isDark={isDark}
  onToggleTheme={toggleTheme}
/>
```

- [ ] **Step 3: Render `ThemeToggle` inside `BottomNav`**

In `src/components/BottomNav.jsx`, update the function signature and JSX.

Change line 36:
```js
export default function BottomNav({ activeView, onSubjects, onLibrary, onProfile, themeToggle, isDark }) {
```
To:
```js
export default function BottomNav({ activeView, onSubjects, onLibrary, onProfile, isDark, onToggleTheme }) {
```

Then, inside the `<nav>` element, after the closing `})}` of the TABS `.map(...)`, add the toggle before `</nav>`:

```jsx
      {/* Theme toggle — right edge of nav */}
      <div style={{ paddingRight: '0.75rem', paddingLeft: '0.5rem', flexShrink: 0 }}>
        <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
      </div>
```

- [ ] **Step 4: Commit**

```
git add src/App.jsx src/components/BottomNav.jsx
git commit -m "feat: move theme toggle into BottomNav so it is accessible from any screen"
```

---

## Task 6: Remove duplicate Notes button from StudyScreen

**Files:**
- Modify: `src/components/StudyScreen.jsx:113-136`
- Create: `src/components/StudyScreen.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/StudyScreen.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import StudyScreen from './StudyScreen'

const dungeonWithNotes = {
  title: 'Test Dungeon',
  lesson: { title: 'Test Lesson', body: 'Some study notes here.' },
  rooms: [1, 2, 3],
}

const dungeonWithoutNotes = {
  title: 'Test Dungeon',
  lesson: { title: 'Test Lesson' },
  rooms: [1, 2, 3],
}

describe('StudyScreen', () => {
  it('renders exactly one Study Notes toggle when lesson has a body', () => {
    render(
      <StudyScreen
        dungeon={dungeonWithNotes}
        subjectTitle="Algebra"
        onStart={vi.fn()}
        onBack={vi.fn()}
      />
    )
    const noteButtons = screen.getAllByText(/Study Notes/i)
    expect(noteButtons).toHaveLength(1)
  })

  it('always renders the Start Quiz button', () => {
    render(
      <StudyScreen
        dungeon={dungeonWithoutNotes}
        subjectTitle="Algebra"
        onStart={vi.fn()}
        onBack={vi.fn()}
      />
    )
    expect(screen.getByText('Start Quiz →')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```
npx vitest run src/components/StudyScreen.test.jsx
```

Expected: `renders exactly one Study Notes toggle` FAILS (currently two toggle buttons exist).

- [ ] **Step 3: Remove the duplicate Notes button from `StudyScreen.jsx`**

In `src/components/StudyScreen.jsx`, delete lines 114–136 (the `{lesson?.body && (<button … Notes/Hide Notes … </button>)}` block inside the action row). The action row at the bottom should then only contain the Start Quiz button:

```jsx
{/* Action buttons */}
<div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.75rem' }}>
  <button
    onClick={onStart}
    style={{
      flex: 1,
      padding: '0.95rem',
      minHeight: 52,
      background: subjectColor,
      border: 'none',
      borderRadius: 12,
      color: '#fff',
      fontSize: '0.95rem',
      fontFamily: 'var(--font-mono)',
      cursor: 'pointer',
      letterSpacing: '1px',
      fontWeight: 'bold',
      boxShadow: `0 0 24px ${subjectColor}40`,
      transition: 'opacity 0.15s',
    }}
    onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
  >
    Start Quiz →
  </button>
</div>
```

- [ ] **Step 4: Run tests to confirm both pass**

```
npx vitest run src/components/StudyScreen.test.jsx
```

Expected: both tests PASS.

- [ ] **Step 5: Commit**

```
git add src/components/StudyScreen.jsx src/components/StudyScreen.test.jsx
git commit -m "fix: remove duplicate Notes button from StudyScreen action row"
```

---

## Task 7: Fix OverworldMap progress counter reactivity

**Files:**
- Modify: `src/components/OverworldMap.jsx:110-113`
- Create: `src/components/OverworldMap.test.jsx`

The problem is on lines 110–113 of `OverworldMap.jsx`:
```js
const completed = k.dungeons.filter(d => {
  const p = JSON.parse(localStorage.getItem('mathcrack_progress') || '{}')
  return p[d.id]?.bossComplete === true
}).length
```
This reads raw `localStorage` instead of calling `isDungeonComplete`, which means it doesn't update reactively when the store changes.

- [ ] **Step 1: Write the failing test**

Create `src/components/OverworldMap.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import OverworldMap from './OverworldMap'

vi.mock('../store/gameStore', () => ({
  useGameStore: vi.fn(selector => selector({ xp: 0, streak: 0, hasSeenHint: true, dismissHint: vi.fn() })),
}))

vi.mock('../hooks/useProgress', () => ({
  isDungeonComplete: vi.fn(id => id === 'd1'),
  isKingdomComplete: vi.fn(() => false),
}))

const kingdoms = [
  {
    id: 'k1',
    title: 'Algebra',
    subtitle: 'Numbers',
    color: '#60a5fa',
    dungeons: [
      { id: 'd1', title: 'Lesson One', file: 'l1.json' },
      { id: 'd2', title: 'Lesson Two', file: 'l2.json' },
    ],
  },
]

describe('OverworldMap', () => {
  it('shows 1/2 completed when isDungeonComplete returns true for d1', () => {
    render(<OverworldMap kingdoms={kingdoms} onSelectKingdom={vi.fn()} />)
    expect(screen.getByText('1 / 2')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```
npx vitest run src/components/OverworldMap.test.jsx
```

Expected: FAILS because the inline `localStorage.getItem` ignores the mocked `isDungeonComplete`.

- [ ] **Step 3: Add `isDungeonComplete` import and fix the filter**

At the top of `src/components/OverworldMap.jsx`, change:
```js
import { isKingdomComplete } from '../hooks/useProgress'
```
To:
```js
import { isKingdomComplete, isDungeonComplete } from '../hooks/useProgress'
```

Then replace lines 110–113:
```js
const completed = k.dungeons.filter(d => !d.stub && isDungeonComplete(d.id)).length
```

- [ ] **Step 4: Run test to confirm it passes**

```
npx vitest run src/components/OverworldMap.test.jsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```
git add src/components/OverworldMap.jsx src/components/OverworldMap.test.jsx
git commit -m "fix: use isDungeonComplete in OverworldMap instead of raw localStorage read"
```

---

## Task 8: Add touch drag support to DragAndDrop

**Files:**
- Modify: `src/components/LessonRoom.jsx:77-149`

Note: JSDOM doesn't support touch events fully, so this fix is verified manually on a real mobile browser (see PRD §Testing Decisions).

- [ ] **Step 1: Add touch state and handlers to `DragAndDrop`**

Replace the entire `DragAndDrop` function (lines 77–149) with:

```jsx
function DragAndDrop({ room, onWrong, onCorrect }) {
  const [order, setOrder] = useState(() => room.items.map((_, i) => i))
  const [dragging, setDragging] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [dragStyle, setDragStyle] = useState({})

  function handleDragStart(itemIdx) { setDragging(itemIdx) }

  function handleDrop(targetPos) {
    if (dragging === null) return
    const next = [...order]
    const fromPos = next.indexOf(dragging)
    next.splice(fromPos, 1)
    next.splice(targetPos, 0, dragging)
    setOrder(next)
    setDragging(null)
    setDragStyle({})
  }

  function handleTouchStart(e, itemIdx) {
    e.preventDefault()
    setDragging(itemIdx)
  }

  function handleTouchMove(e) {
    e.preventDefault()
    const touch = e.touches[0]
    setDragStyle({ opacity: 0.5 })
    const el = document.elementFromPoint(touch.clientX, touch.clientY)
    const target = el?.closest('[data-pos]')
    if (!target) return
    const targetPos = parseInt(target.dataset.pos, 10)
    if (dragging === null) return
    const next = [...order]
    const fromPos = next.indexOf(dragging)
    if (fromPos === targetPos) return
    next.splice(fromPos, 1)
    next.splice(targetPos, 0, dragging)
    setOrder(next)
  }

  function handleTouchEnd() {
    setDragging(null)
    setDragStyle({})
  }

  function handleSubmit() {
    if (submitted) return
    setSubmitted(true)
    const correct = order.every((v, i) => v === room.correctOrder[i])
    setTimeout(() => {
      if (correct) onCorrect(room.xp)
      else onWrong()
    }, 600)
  }

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.85rem' }}>
        Drag to reorder, then tap Submit.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {order.map((itemIdx, pos) => (
          <div
            key={itemIdx}
            data-pos={pos}
            draggable
            onDragStart={() => handleDragStart(itemIdx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(pos)}
            onTouchStart={(e) => handleTouchStart(e, itemIdx)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              padding: '0.85rem 1rem',
              background: dragging === itemIdx ? 'var(--bg-elevated)' : 'var(--bg-card)',
              border: `1.5px solid ${dragging === itemIdx ? 'var(--purple)' : 'var(--border)'}`,
              borderRadius: 10,
              cursor: 'grab',
              color: 'var(--text)',
              userSelect: 'none',
              touchAction: 'none',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              fontSize: '0.9rem', minHeight: 52,
              ...(dragging === itemIdx ? dragStyle : {}),
            }}
          >
            <span style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>⠿</span>
            {room.items[itemIdx]}
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={submitted}
        style={{
          padding: '0.9rem 2rem', minHeight: 52,
          background: submitted ? 'var(--bg-elevated)' : 'var(--purple)',
          border: 'none', color: '#fff', borderRadius: 10,
          cursor: submitted ? 'default' : 'pointer',
          fontSize: '1rem', width: '100%',
        }}
      >
        Submit Order
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Run the full test suite to confirm no regressions**

```
npx vitest run
```

Expected: all tests PASS.

- [ ] **Step 3: Commit**

```
git add src/components/LessonRoom.jsx
git commit -m "fix: add touch drag-and-drop support for mobile learners"
```

---

## Self-Review

**Spec coverage check:**
1. ✅ Theme toggle in BottomNav — Task 5
2. ✅ Boss header / fail-state CSS vars — Tasks 3 & 4
3. ✅ Touch drag-and-drop — Task 8
4. ✅ Loot gating for empty table — Task 1
5. ✅ Total session XP on result screen — Task 2
6. ✅ Remove duplicate Notes button — Task 6
7. ✅ OverworldMap reactivity — Task 7
8. ✅ Replace `var(--font)` with `var(--font-mono)` — Task 4 (ResultScreen)

**Placeholder scan:** No TBDs or "similar to Task N" references found.

**Type consistency:** `isDark` / `onToggleTheme` props are consistently named between App.jsx (Task 5 step 2) and BottomNav.jsx (Task 5 step 3). `sessionXP` is introduced in Task 2 step 1 and referenced in steps 3–6 within the same task.
