# MATHCRACK Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dark-fantasy pixel-art RPG webapp that teaches math from zero to master's level, storing all progress in localStorage.

**Architecture:** Three-layer design — JSON content files define all questions, a Zustand store + localStorage hooks form the game engine, and React components render the UI. KaTeX handles all math rendering via DOM refs (not innerHTML).

**Tech Stack:** React 18, Vite 5, Zustand 4 (persist middleware), KaTeX, Framer Motion, Vitest + @testing-library/react

---

## File Map

| File | Responsibility |
|------|---------------|
| `src/store/gameStore.js` | Zustand store: xp, streak, activeView, navigation actions |
| `src/hooks/useProgress.js` | localStorage read/write: room completions, boss completions |
| `src/hooks/useXP.js` | XP tier titles, XP-to-next-level, tier progress ratio |
| `src/content/kingdoms.json` | Registry of all 4 kingdoms and their dungeon lists |
| `src/content/loadDungeon.js` | `import.meta.glob` loader for dungeon JSON files |
| `src/content/linear-algebra/dungeon-01-number-crypt.json` | Real dungeon: 5 rooms + boss |
| `src/content/calculus/dungeon-01-function-foothills.json` | Real dungeon: 5 rooms + boss |
| `src/content/statistics/dungeon-01-counting-cavern.json` | Real dungeon: 5 rooms + boss |
| `src/content/discrete-math/dungeon-01-logic-gate.json` | Real dungeon: 5 rooms + boss |
| `src/components/MathDisplay.jsx` | KaTeX renderer via `useRef` + `katex.render()` |
| `src/components/HUD.jsx` | Top bar: dungeon name, streak, XP reward, room dots |
| `src/components/OverworldMap.jsx` | 4 kingdoms, locked/active/complete states |
| `src/components/KingdomView.jsx` | Dungeon list within a kingdom with progression |
| `src/components/LessonRoom.jsx` | Multiple-choice + drag-and-drop question renderer |
| `src/components/BossFight.jsx` | 3-question gauntlet, 2/3 pass mark |
| `src/components/ResultScreen.jsx` | Framer Motion XP animation + dungeon seal |
| `src/components/DetailsPanel.jsx` | Slide-out stats: level, XP bar, XP to next level |
| `src/App.jsx` | View router wiring all components together |
| `src/App.css` | CSS variables + global dark fantasy styles |

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `src/App.jsx` (stub)
- Create: `src/App.css`

- [ ] **Step 1: Initialise the project**

```bash
cd C:\Users\noaro\MATHCRACK
npm create vite@latest . -- --template react
npm install zustand katex framer-motion
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 2: Configure Vite for tests**

Replace the generated `vite.config.js` with:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.js'],
  },
})
```

- [ ] **Step 3: Create test setup file**

Create `src/test-setup.js`:

```js
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Replace App.css with design system variables**

```css
/* src/App.css */
:root {
  --bg-deep: #0d0a1a;
  --bg-mid: #120d24;
  --gold: #ffd700;
  --violet: #7c3aed;
  --violet-light: #a78bfa;
  --correct: #22c55e;
  --text: #e2e8f0;
  --text-muted: #94a3b8;
  --border: #2d1b69;
  --font: 'Courier New', Courier, monospace;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--bg-deep);
  color: var(--text);
  font-family: var(--font);
  min-height: 100vh;
}
```

- [ ] **Step 5: Stub App.jsx**

```jsx
// src/App.jsx
export default function App() {
  return <div style={{ padding: '2rem', color: 'var(--gold)' }}>MATHCRACK loading…</div>
}
```

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```

Expected: browser shows "MATHCRACK loading…" on dark background.

- [ ] **Step 7: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold React/Vite project with dark fantasy CSS variables"
```

---

### Task 2: Zustand Game Store

**Files:**
- Create: `src/store/gameStore.js`
- Create: `src/store/gameStore.test.js`

- [ ] **Step 1: Write failing tests**

Create `src/store/gameStore.test.js`:

```js
import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from './gameStore'
import { act } from '@testing-library/react'

beforeEach(() => {
  useGameStore.setState({
    xp: 0, streak: 0, lastVisit: null,
    activeView: 'overworld', activeKingdom: null,
    activeDungeon: null, activeDungeonData: null,
    currentRoom: 0, bossAnswers: [], lastXPGain: 0,
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
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npx vitest run src/store/gameStore.test.js
```

Expected: FAIL — "Cannot find module './gameStore'"

- [ ] **Step 3: Implement gameStore.js**

```js
// src/store/gameStore.js
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

      addXP: (n) => set((s) => ({ xp: s.xp + n, lastXPGain: n })),
      setActiveKingdom: (id) => set({ activeKingdom: id, activeView: 'kingdom' }),
      setActiveDungeon: (id, data) =>
        set({ activeDungeon: id, activeDungeonData: data, currentRoom: 0, activeView: 'lesson' }),
      advanceRoom: () => set((s) => ({ currentRoom: s.currentRoom + 1 })),
      startBoss: () => set({ activeView: 'boss', bossAnswers: [] }),
      recordBossAnswer: (correct) =>
        set((s) => ({ bossAnswers: [...s.bossAnswers, correct] })),
      goToResult: () => set({ activeView: 'result' }),
      goToKingdom: () => set({ activeView: 'kingdom', activeDungeon: null, activeDungeonData: null }),
      goToOverworld: () =>
        set({ activeView: 'overworld', activeKingdom: null, activeDungeon: null, activeDungeonData: null }),
      updateStreak: () =>
        set((s) => {
          const today = new Date().toDateString()
          if (s.lastVisit === today) return {}
          const yesterday = new Date(Date.now() - 86400000).toDateString()
          return { streak: s.lastVisit === yesterday ? s.streak + 1 : 1, lastVisit: today }
        }),
    }),
    {
      name: 'mathcrack-game',
      partialize: (s) => ({ xp: s.xp, streak: s.streak, lastVisit: s.lastVisit }),
    }
  )
)
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx vitest run src/store/gameStore.test.js
```

Expected: 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/store/
git commit -m "feat: Zustand game store with xp, streak, view navigation"
```

---

### Task 3: useProgress Hook

**Files:**
- Create: `src/hooks/useProgress.js`
- Create: `src/hooks/useProgress.test.js`

- [ ] **Step 1: Write failing tests**

Create `src/hooks/useProgress.test.js`:

```js
import { describe, it, expect, beforeEach } from 'vitest'
import {
  getProgress, markRoomComplete, markBossComplete,
  isDungeonComplete, isDungeonUnlocked, isKingdomComplete,
} from './useProgress'

beforeEach(() => localStorage.clear())

describe('markRoomComplete', () => {
  it('stores the room index under the dungeon id', () => {
    markRoomComplete('la-01', 0)
    markRoomComplete('la-01', 1)
    expect(getProgress()['la-01'].rooms).toEqual([0, 1])
  })

  it('does not duplicate entries', () => {
    markRoomComplete('la-01', 0)
    markRoomComplete('la-01', 0)
    expect(getProgress()['la-01'].rooms).toEqual([0])
  })
})

describe('markBossComplete', () => {
  it('sets bossComplete to true', () => {
    markBossComplete('la-01')
    expect(getProgress()['la-01'].bossComplete).toBe(true)
  })
})

describe('isDungeonComplete', () => {
  it('returns false when rooms < 5 or boss not done', () => {
    markRoomComplete('la-01', 0)
    expect(isDungeonComplete('la-01')).toBe(false)
  })

  it('returns true when 5 rooms and boss done', () => {
    ;[0, 1, 2, 3, 4].forEach((i) => markRoomComplete('la-01', i))
    markBossComplete('la-01')
    expect(isDungeonComplete('la-01')).toBe(true)
  })
})

describe('isDungeonUnlocked', () => {
  it('first dungeon is always unlocked', () => {
    expect(isDungeonUnlocked(['la-01', 'la-02'], 0)).toBe(true)
  })

  it('second dungeon unlocked only when first is complete', () => {
    expect(isDungeonUnlocked(['la-01', 'la-02'], 1)).toBe(false)
    ;[0, 1, 2, 3, 4].forEach((i) => markRoomComplete('la-01', i))
    markBossComplete('la-01')
    expect(isDungeonUnlocked(['la-01', 'la-02'], 1)).toBe(true)
  })
})

describe('isKingdomComplete', () => {
  it('returns false if any dungeon incomplete', () => {
    expect(isKingdomComplete(['la-01', 'la-02'])).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npx vitest run src/hooks/useProgress.test.js
```

Expected: FAIL — "Cannot find module './useProgress'"

- [ ] **Step 3: Implement useProgress.js**

```js
// src/hooks/useProgress.js
const KEY = 'mathcrack_progress'

export function getProgress() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}

function saveProgress(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function markRoomComplete(dungeonId, idx) {
  const p = getProgress()
  if (!p[dungeonId]) p[dungeonId] = { rooms: [], bossComplete: false }
  if (!p[dungeonId].rooms.includes(idx)) p[dungeonId].rooms.push(idx)
  saveProgress(p)
}

export function markBossComplete(dungeonId) {
  const p = getProgress()
  if (!p[dungeonId]) p[dungeonId] = { rooms: [], bossComplete: false }
  p[dungeonId].bossComplete = true
  saveProgress(p)
}

export function isDungeonComplete(dungeonId) {
  const d = getProgress()[dungeonId]
  return !!d && d.rooms.length >= 5 && d.bossComplete === true
}

export function isDungeonUnlocked(ids, index) {
  return index === 0 || isDungeonComplete(ids[index - 1])
}

export function isKingdomComplete(ids) {
  return ids.every((id) => isDungeonComplete(id))
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx vitest run src/hooks/useProgress.test.js
```

Expected: all 7 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useProgress.js src/hooks/useProgress.test.js
git commit -m "feat: useProgress hook for localStorage dungeon/boss completion tracking"
```

---

### Task 4: useXP Hook

**Files:**
- Create: `src/hooks/useXP.js`
- Create: `src/hooks/useXP.test.js`

- [ ] **Step 1: Write failing tests**

Create `src/hooks/useXP.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { getTitle, getXPToNextLevel, getTierProgress } from './useXP'

describe('getTitle', () => {
  it('returns Apprentice at 0 XP', () => expect(getTitle(0)).toBe('Apprentice'))
  it('returns Adept at 100 XP', () => expect(getTitle(100)).toBe('Adept'))
  it('returns Scholar at 300 XP', () => expect(getTitle(300)).toBe('Scholar'))
  it('returns Sage at 700 XP', () => expect(getTitle(700)).toBe('Sage'))
  it('returns Archmage at 1500 XP', () => expect(getTitle(1500)).toBe('Archmage'))
  it('returns Math Lich at 3000 XP', () => expect(getTitle(3000)).toBe('Math Lich 💀'))
})

describe('getXPToNextLevel', () => {
  it('returns 100 at 0 XP (Apprentice, max 99)', () => expect(getXPToNextLevel(0)).toBe(100))
  it('returns 0 at Math Lich tier (no next level)', () => expect(getXPToNextLevel(3000)).toBe(0))
})

describe('getTierProgress', () => {
  it('returns 0 at the start of a tier', () => expect(getTierProgress(0)).toBeCloseTo(0))
  it('returns 0.5 at midpoint of Apprentice (0–99)', () => expect(getTierProgress(49)).toBeCloseTo(0.49, 1))
  it('returns 1 at Math Lich (no cap)', () => expect(getTierProgress(3000)).toBe(1))
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npx vitest run src/hooks/useXP.test.js
```

Expected: FAIL — "Cannot find module './useXP'"

- [ ] **Step 3: Implement useXP.js**

```js
// src/hooks/useXP.js
const TIERS = [
  { title: 'Apprentice', min: 0, max: 99 },
  { title: 'Adept', min: 100, max: 299 },
  { title: 'Scholar', min: 300, max: 699 },
  { title: 'Sage', min: 700, max: 1499 },
  { title: 'Archmage', min: 1500, max: 2999 },
  { title: 'Math Lich 💀', min: 3000, max: Infinity },
]

function currentTier(xp) {
  return TIERS.find((t) => xp >= t.min && xp <= t.max) ?? TIERS[TIERS.length - 1]
}

export function getTitle(xp) {
  return currentTier(xp).title
}

export function getXPToNextLevel(xp) {
  const t = currentTier(xp)
  return t.max === Infinity ? 0 : t.max + 1 - xp
}

export function getTierProgress(xp) {
  const t = currentTier(xp)
  if (t.max === Infinity) return 1
  const range = t.max - t.min + 1
  return (xp - t.min) / range
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx vitest run src/hooks/useXP.test.js
```

Expected: all 9 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useXP.js src/hooks/useXP.test.js
git commit -m "feat: useXP hook with tier titles and progress calculations"
```

---

### Task 5: Content Layer

**Files:**
- Create: `src/content/kingdoms.json`
- Create: `src/content/loadDungeon.js`
- Create: `src/content/linear-algebra/dungeon-01-number-crypt.json`
- Create: `src/content/calculus/dungeon-01-function-foothills.json`
- Create: `src/content/statistics/dungeon-01-counting-cavern.json`
- Create: `src/content/discrete-math/dungeon-01-logic-gate.json`

- [ ] **Step 1: Create kingdoms.json**

```json
[
  {
    "id": "linear-algebra",
    "title": "The Realm of Vectors",
    "subtitle": "Linear Algebra",
    "dungeons": [
      { "id": "linear-algebra-01", "title": "The Number Crypt", "file": "linear-algebra/dungeon-01-number-crypt.json" },
      { "id": "linear-algebra-02", "title": "The Equation Vault", "stub": true },
      { "id": "linear-algebra-03", "title": "Coordinate Sanctum", "stub": true },
      { "id": "linear-algebra-04", "title": "Vector Caverns", "stub": true },
      { "id": "linear-algebra-05", "title": "Vector Operations", "stub": true },
      { "id": "linear-algebra-06", "title": "The Matrix Gate", "stub": true },
      { "id": "linear-algebra-07", "title": "Matrix Operations", "stub": true },
      { "id": "linear-algebra-08", "title": "The System Labyrinth", "stub": true },
      { "id": "linear-algebra-09", "title": "Gaussian Fortress", "stub": true },
      { "id": "linear-algebra-10", "title": "Determinant Depths", "stub": true },
      { "id": "linear-algebra-11", "title": "The Vector Space", "stub": true },
      { "id": "linear-algebra-12", "title": "Basis & Dimension Crypts", "stub": true },
      { "id": "linear-algebra-13", "title": "Transformation Tower", "stub": true },
      { "id": "linear-algebra-14", "title": "Eigenvalue Abyss", "stub": true },
      { "id": "linear-algebra-15", "title": "Diagonalization Domain", "stub": true },
      { "id": "linear-algebra-16", "title": "Orthogonality Halls", "stub": true },
      { "id": "linear-algebra-17", "title": "The SVD Spire", "stub": true },
      { "id": "linear-algebra-18", "title": "Master's Vault", "stub": true }
    ]
  },
  {
    "id": "calculus",
    "title": "The Calculus Keep",
    "subtitle": "Calculus",
    "dungeons": [
      { "id": "calculus-01", "title": "Function Foothills", "file": "calculus/dungeon-01-function-foothills.json" },
      { "id": "calculus-02", "title": "The Limit Hollow", "stub": true },
      { "id": "calculus-03", "title": "Continuity Catacombs", "stub": true },
      { "id": "calculus-04", "title": "Derivative Den", "stub": true },
      { "id": "calculus-05", "title": "Differentiation Rules", "stub": true },
      { "id": "calculus-06", "title": "Chain Rule Crypt", "stub": true },
      { "id": "calculus-07", "title": "Applications Citadel", "stub": true },
      { "id": "calculus-08", "title": "Integral Vault", "stub": true },
      { "id": "calculus-09", "title": "Antiderivative Alcove", "stub": true },
      { "id": "calculus-10", "title": "The FTC Stronghold", "stub": true },
      { "id": "calculus-11", "title": "Integration Techniques", "stub": true },
      { "id": "calculus-12", "title": "Infinite Spire", "stub": true },
      { "id": "calculus-13", "title": "Taylor's Tower", "stub": true },
      { "id": "calculus-14", "title": "Multivariable Maze", "stub": true },
      { "id": "calculus-15", "title": "Partial Derivative Pass", "stub": true },
      { "id": "calculus-16", "title": "Optimization Outpost", "stub": true },
      { "id": "calculus-17", "title": "Multiple Integral Mines", "stub": true },
      { "id": "calculus-18", "title": "Vector Calculus Vaults", "stub": true },
      { "id": "calculus-19", "title": "ODE Observatory", "stub": true },
      { "id": "calculus-20", "title": "Master's Lair", "stub": true }
    ]
  },
  {
    "id": "statistics",
    "title": "The Statistics Sanctum",
    "subtitle": "Statistics & Probability",
    "dungeons": [
      { "id": "statistics-01", "title": "Counting Cavern", "file": "statistics/dungeon-01-counting-cavern.json" },
      { "id": "statistics-02", "title": "Probability Pit", "stub": true },
      { "id": "statistics-03", "title": "Conditional Crypt", "stub": true },
      { "id": "statistics-04", "title": "Bayes' Bastion", "stub": true },
      { "id": "statistics-05", "title": "Random Variable Ridge", "stub": true },
      { "id": "statistics-06", "title": "Expected Value Enclave", "stub": true },
      { "id": "statistics-07", "title": "Discrete Distributions", "stub": true },
      { "id": "statistics-08", "title": "Continuous Domains", "stub": true },
      { "id": "statistics-09", "title": "The Normal Nexus", "stub": true },
      { "id": "statistics-10", "title": "CLT Citadel", "stub": true },
      { "id": "statistics-11", "title": "Estimation Enclave", "stub": true },
      { "id": "statistics-12", "title": "Confidence Corridor", "stub": true },
      { "id": "statistics-13", "title": "Hypothesis Halls", "stub": true },
      { "id": "statistics-14", "title": "Testing Temple", "stub": true },
      { "id": "statistics-15", "title": "Regression Ruins", "stub": true },
      { "id": "statistics-16", "title": "Multiple Regression Maze", "stub": true },
      { "id": "statistics-17", "title": "Bayesian Battlements", "stub": true },
      { "id": "statistics-18", "title": "Markov Monastery", "stub": true },
      { "id": "statistics-19", "title": "Information Inferno", "stub": true },
      { "id": "statistics-20", "title": "Master's Oracle", "stub": true }
    ]
  },
  {
    "id": "discrete-math",
    "title": "The Discrete Dungeon",
    "subtitle": "Discrete Mathematics",
    "dungeons": [
      { "id": "discrete-math-01", "title": "Logic Gate", "file": "discrete-math/dungeon-01-logic-gate.json" },
      { "id": "discrete-math-02", "title": "Predicate Passage", "stub": true },
      { "id": "discrete-math-03", "title": "Proof Pit", "stub": true },
      { "id": "discrete-math-04", "title": "Induction Lair", "stub": true },
      { "id": "discrete-math-05", "title": "Set Sanctum", "stub": true },
      { "id": "discrete-math-06", "title": "Relation Realm", "stub": true },
      { "id": "discrete-math-07", "title": "Function Fields", "stub": true },
      { "id": "discrete-math-08", "title": "Counting Crypt", "stub": true },
      { "id": "discrete-math-09", "title": "Combinatorics Castle", "stub": true },
      { "id": "discrete-math-10", "title": "Number Theory Nexus", "stub": true },
      { "id": "discrete-math-11", "title": "Modular Maze", "stub": true },
      { "id": "discrete-math-12", "title": "Cryptography Crypt", "stub": true },
      { "id": "discrete-math-13", "title": "Graph Grotto", "stub": true },
      { "id": "discrete-math-14", "title": "Tree Tunnels", "stub": true },
      { "id": "discrete-math-15", "title": "Algorithm Alcove", "stub": true },
      { "id": "discrete-math-16", "title": "Recurrence Ridge", "stub": true },
      { "id": "discrete-math-17", "title": "Automata Arena", "stub": true },
      { "id": "discrete-math-18", "title": "Grammar Graveyard", "stub": true },
      { "id": "discrete-math-19", "title": "Complexity Citadel", "stub": true },
      { "id": "discrete-math-20", "title": "Master's Sanctum", "stub": true }
    ]
  }
]
```

- [ ] **Step 2: Create loadDungeon.js**

```js
// src/content/loadDungeon.js
const dungeonFiles = import.meta.glob('./**/*.json', { eager: true })

export function loadDungeon(filePath) {
  const mod = dungeonFiles[`./${filePath}`]
  return mod ? (mod.default ?? mod) : null
}
```

- [ ] **Step 3: Create dungeon-01-number-crypt.json**

Create `src/content/linear-algebra/dungeon-01-number-crypt.json`:

```json
{
  "id": "linear-algebra-01",
  "title": "The Number Crypt",
  "kingdom": "linear-algebra",
  "dungeonNumber": 1,
  "rooms": [
    {
      "type": "multiple-choice",
      "question": "Which of these is an integer?",
      "latex": "\\text{Choose the integer:}",
      "steps": [],
      "answers": ["0.5", "\\sqrt{2}", "-7", "\\pi"],
      "correct": 2,
      "xp": 10
    },
    {
      "type": "multiple-choice",
      "question": "Where does -3 sit on the number line relative to -1?",
      "latex": "\\text{Compare: } -3 \\text{ vs } -1",
      "steps": ["Negative numbers: further left = smaller"],
      "answers": ["-3 > -1", "-3 = -1", "-3 < -1", "Cannot compare"],
      "correct": 2,
      "xp": 10
    },
    {
      "type": "multiple-choice",
      "question": "Which set contains only rational numbers?",
      "latex": "\\mathbb{Q} = \\left\\{\\frac{p}{q} \\mid p, q \\in \\mathbb{Z},\\, q \\neq 0\\right\\}",
      "steps": ["A rational number can be written as a fraction of two integers"],
      "answers": ["\\{\\pi, e, \\sqrt{2}\\}", "\\{0.5, -3, \\frac{2}{7}\\}", "\\{\\sqrt{3}, 1.5\\}", "\\{\\pi, 0, 1\\}"],
      "correct": 1,
      "xp": 10
    },
    {
      "type": "multiple-choice",
      "question": "What is |−8|?",
      "latex": "|-8| = ?",
      "steps": ["Absolute value = distance from 0", "|-8| = 8"],
      "answers": ["-8", "0", "8", "64"],
      "correct": 2,
      "xp": 10
    },
    {
      "type": "drag-and-drop",
      "question": "Order these sets from smallest to largest (fewest numbers to most):",
      "items": ["Natural numbers \\mathbb{N}", "Integers \\mathbb{Z}", "Rationals \\mathbb{Q}", "Reals \\mathbb{R}"],
      "correctOrder": [0, 1, 2, 3],
      "xp": 20
    }
  ],
  "boss": {
    "questions": [
      {
        "type": "multiple-choice",
        "question": "Which statement is TRUE?",
        "latex": "\\text{Every integer is rational.}",
        "answers": ["True — integers fit p/q with q=1", "False — integers are not fractions", "True — but only positive integers", "False — some integers are irrational"],
        "correct": 0,
        "xp": 25
      },
      {
        "type": "multiple-choice",
        "question": "The number 0.333... (repeating) is:",
        "latex": "0.\\overline{3} = \\frac{1}{3}",
        "answers": ["Irrational, because it never ends", "Rational, because it repeats", "An integer", "Undefined"],
        "correct": 1,
        "xp": 25
      },
      {
        "type": "multiple-choice",
        "question": "Which is true about real numbers?",
        "latex": "\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}",
        "answers": ["All reals are rational", "All rationals are real", "No integers are real", "Reals exclude irrationals"],
        "correct": 1,
        "xp": 25
      }
    ],
    "passMark": 2
  },
  "lootTable": []
}
```

- [ ] **Step 4: Create dungeon-01-function-foothills.json**

Create `src/content/calculus/dungeon-01-function-foothills.json`:

```json
{
  "id": "calculus-01",
  "title": "Function Foothills",
  "kingdom": "calculus",
  "dungeonNumber": 1,
  "rooms": [
    {
      "type": "multiple-choice",
      "question": "What is the domain of f(x) = 1/x?",
      "latex": "f(x) = \\frac{1}{x}",
      "steps": ["Domain = all x where f(x) is defined", "Division by zero is undefined"],
      "answers": ["All real numbers", "x > 0", "x \\neq 0", "x < 0"],
      "correct": 2,
      "xp": 10
    },
    {
      "type": "multiple-choice",
      "question": "If f(x) = x², what is f(−3)?",
      "latex": "f(x) = x^2, \\quad f(-3) = ?",
      "steps": ["f(-3) = (-3)^2 = 9"],
      "answers": ["-9", "6", "9", "-6"],
      "correct": 2,
      "xp": 10
    },
    {
      "type": "multiple-choice",
      "question": "Which graph represents a function?",
      "latex": "\\text{Vertical Line Test: each x has exactly one y}",
      "steps": ["A relation is a function if no vertical line crosses it twice"],
      "answers": ["A circle", "A parabola opening upward", "A sideways parabola", "Two horizontal lines"],
      "correct": 1,
      "xp": 10
    },
    {
      "type": "multiple-choice",
      "question": "What is the range of f(x) = x²?",
      "latex": "f(x) = x^2, \\quad \\text{Range} = ?",
      "steps": ["x² is always ≥ 0 for any real x"],
      "answers": ["All reals", "x ≥ 0", "x > 0", "x ≤ 0"],
      "correct": 1,
      "xp": 10
    },
    {
      "type": "drag-and-drop",
      "question": "Order the steps to evaluate a composite function g(f(2)) where f(x)=x+1, g(x)=x²:",
      "items": ["Evaluate f(2) = 2+1 = 3", "Plug into g: g(3) = 3² = 9", "Identify the inner function f", "Identify the outer function g"],
      "correctOrder": [2, 3, 0, 1],
      "xp": 20
    }
  ],
  "boss": {
    "questions": [
      {
        "type": "multiple-choice",
        "question": "f(x) = √x. What is the domain?",
        "latex": "f(x) = \\sqrt{x}",
        "answers": ["All reals", "x > 0", "x \\geq 0", "x \\neq 0"],
        "correct": 2,
        "xp": 25
      },
      {
        "type": "multiple-choice",
        "question": "g(x) = x³ − x. Is g even, odd, or neither?",
        "latex": "g(x) = x^3 - x",
        "answers": ["Even: g(-x)=g(x)", "Odd: g(-x)=-g(x)", "Neither", "Both"],
        "correct": 1,
        "xp": 25
      },
      {
        "type": "multiple-choice",
        "question": "h(x) = |x|. What is h(−5)?",
        "latex": "h(x) = |x|, \\quad h(-5) = ?",
        "answers": ["-5", "0", "5", "25"],
        "correct": 2,
        "xp": 25
      }
    ],
    "passMark": 2
  },
  "lootTable": []
}
```

- [ ] **Step 5: Create dungeon-01-counting-cavern.json**

Create `src/content/statistics/dungeon-01-counting-cavern.json`:

```json
{
  "id": "statistics-01",
  "title": "Counting Cavern",
  "kingdom": "statistics",
  "dungeonNumber": 1,
  "rooms": [
    {
      "type": "multiple-choice",
      "question": "How many ways can you arrange 3 distinct books on a shelf?",
      "latex": "3! = ?",
      "steps": ["3! = 3 × 2 × 1 = 6"],
      "answers": ["3", "6", "9", "27"],
      "correct": 1,
      "xp": 10
    },
    {
      "type": "multiple-choice",
      "question": "How many 2-letter codes can be made from {A, B, C} without repeating?",
      "latex": "P(3, 2) = \\frac{3!}{(3-2)!}",
      "steps": ["P(3,2) = 3 × 2 = 6"],
      "answers": ["3", "6", "9", "8"],
      "correct": 1,
      "xp": 10
    },
    {
      "type": "multiple-choice",
      "question": "How many ways to choose 2 items from 4 (order does not matter)?",
      "latex": "\\binom{4}{2} = \\frac{4!}{2!\\,2!}",
      "steps": ["= (4×3)/(2×1) = 6"],
      "answers": ["12", "8", "6", "4"],
      "correct": 2,
      "xp": 10
    },
    {
      "type": "multiple-choice",
      "question": "A restaurant has 3 starters and 4 mains. How many meals (1 starter + 1 main)?",
      "latex": "\\text{Multiplication Rule: } 3 \\times 4",
      "steps": ["Each starter pairs with each main → 3 × 4 = 12"],
      "answers": ["7", "12", "24", "3"],
      "correct": 1,
      "xp": 10
    },
    {
      "type": "drag-and-drop",
      "question": "Order the steps to compute C(5,2):",
      "items": ["Write \\binom{5}{2} = \\frac{5!}{2!\\cdot 3!}", "Compute 5! = 120", "Divide: 120 / (2 × 6) = 10", "Compute 2! = 2 and 3! = 6"],
      "correctOrder": [0, 1, 3, 2],
      "xp": 20
    }
  ],
  "boss": {
    "questions": [
      {
        "type": "multiple-choice",
        "question": "P(6,3) = ?",
        "latex": "P(6, 3) = \\frac{6!}{3!}",
        "answers": ["20", "60", "120", "720"],
        "correct": 2,
        "xp": 25
      },
      {
        "type": "multiple-choice",
        "question": "How many 3-person committees from 5 people?",
        "latex": "\\binom{5}{3} = ?",
        "answers": ["10", "15", "20", "60"],
        "correct": 0,
        "xp": 25
      },
      {
        "type": "multiple-choice",
        "question": "A coin is flipped 4 times. How many total outcomes?",
        "latex": "2^4 = ?",
        "answers": ["8", "16", "12", "4"],
        "correct": 1,
        "xp": 25
      }
    ],
    "passMark": 2
  },
  "lootTable": []
}
```

- [ ] **Step 6: Create dungeon-01-logic-gate.json**

Create `src/content/discrete-math/dungeon-01-logic-gate.json`:

```json
{
  "id": "discrete-math-01",
  "title": "Logic Gate",
  "kingdom": "discrete-math",
  "dungeonNumber": 1,
  "rooms": [
    {
      "type": "multiple-choice",
      "question": "What is the truth value of: P ∧ Q when P=T, Q=F?",
      "latex": "P \\land Q, \\quad P = \\top,\\; Q = \\bot",
      "steps": ["AND is true only when BOTH are true"],
      "answers": ["True", "False", "Undefined", "Depends on P"],
      "correct": 1,
      "xp": 10
    },
    {
      "type": "multiple-choice",
      "question": "What is the truth value of: P ∨ Q when P=F, Q=F?",
      "latex": "P \\lor Q, \\quad P = \\bot,\\; Q = \\bot",
      "steps": ["OR is true when AT LEAST ONE is true"],
      "answers": ["True", "False", "True only if both false", "Undefined"],
      "correct": 1,
      "xp": 10
    },
    {
      "type": "multiple-choice",
      "question": "What is ¬(¬P) equivalent to?",
      "latex": "\\neg(\\neg P) = ?",
      "steps": ["Double negation cancels out"],
      "answers": ["¬P", "P", "False", "True"],
      "correct": 1,
      "xp": 10
    },
    {
      "type": "multiple-choice",
      "question": "P → Q is FALSE when:",
      "latex": "P \\Rightarrow Q \\text{ is false when...}",
      "steps": ["Implication is false only when P is true and Q is false"],
      "answers": ["P=F, Q=T", "P=T, Q=T", "P=T, Q=F", "P=F, Q=F"],
      "correct": 2,
      "xp": 10
    },
    {
      "type": "drag-and-drop",
      "question": "Order the rows of the truth table for P ∧ Q (T=True, F=False):",
      "items": ["P=T, Q=T → T", "P=T, Q=F → F", "P=F, Q=T → F", "P=F, Q=F → F"],
      "correctOrder": [0, 1, 2, 3],
      "xp": 20
    }
  ],
  "boss": {
    "questions": [
      {
        "type": "multiple-choice",
        "question": "Which is logically equivalent to P → Q?",
        "latex": "P \\Rightarrow Q \\equiv ?",
        "answers": ["Q → P", "¬P ∨ Q", "P ∧ ¬Q", "¬Q → ¬P only"],
        "correct": 1,
        "xp": 25
      },
      {
        "type": "multiple-choice",
        "question": "De Morgan's Law: ¬(P ∧ Q) = ?",
        "latex": "\\neg(P \\land Q) = ?",
        "answers": ["¬P ∧ ¬Q", "¬P ∨ ¬Q", "P ∨ Q", "¬P → Q"],
        "correct": 1,
        "xp": 25
      },
      {
        "type": "multiple-choice",
        "question": "A tautology is a statement that is:",
        "latex": "\\text{Tautology} = ?",
        "answers": ["Always false", "Sometimes true", "Always true", "Unprovable"],
        "correct": 2,
        "xp": 25
      }
    ],
    "passMark": 2
  },
  "lootTable": []
}
```

- [ ] **Step 7: Commit**

```bash
git add src/content/
git commit -m "feat: content layer — kingdoms registry + 4 starter dungeons with real math problems"
```

---

### Task 6: MathDisplay + HUD Components

**Files:**
- Create: `src/components/MathDisplay.jsx`
- Create: `src/components/HUD.jsx`
- Create: `src/components/MathDisplay.test.jsx`

- [ ] **Step 1: Write failing test for MathDisplay**

Create `src/components/MathDisplay.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MathDisplay from './MathDisplay'

describe('MathDisplay', () => {
  it('renders a span when latex is provided', () => {
    render(<MathDisplay latex="x^2" />)
    expect(document.querySelector('span')).toBeTruthy()
  })

  it('renders nothing when latex is empty', () => {
    const { container } = render(<MathDisplay latex="" />)
    expect(container.firstChild).toBeNull()
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npx vitest run src/components/MathDisplay.test.jsx
```

Expected: FAIL — "Cannot find module './MathDisplay'"

- [ ] **Step 3: Implement MathDisplay.jsx**

```jsx
// src/components/MathDisplay.jsx
import { useEffect, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

export default function MathDisplay({ latex, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current && latex) {
      katex.render(latex, ref.current, { throwOnError: false })
    }
  }, [latex])
  if (!latex) return null
  return <span ref={ref} className={className} />
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npx vitest run src/components/MathDisplay.test.jsx
```

Expected: 2 tests pass.

- [ ] **Step 5: Implement HUD.jsx**

```jsx
// src/components/HUD.jsx
import { useGameStore } from '../store/gameStore'

export default function HUD({ dungeonTitle, kingdom, xpReward, currentRoom, totalRooms }) {
  const streak = useGameStore((s) => s.streak)
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0.75rem 1.5rem', background: 'var(--bg-mid)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div>
        <div style={{ color: 'var(--gold)', fontWeight: 'bold', fontSize: '1rem' }}>{dungeonTitle}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{kingdom}</div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {Array.from({ length: totalRooms }).map((_, i) => (
          <span key={i} style={{
            width: 10, height: 10, borderRadius: '50%',
            background: i < currentRoom ? 'var(--correct)' : i === currentRoom ? 'var(--gold)' : 'var(--border)',
            display: 'inline-block',
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <span style={{ color: 'var(--violet-light)' }}>🔥 {streak}</span>
        <span style={{ color: 'var(--gold)' }}>+{xpReward} XP</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/MathDisplay.jsx src/components/MathDisplay.test.jsx src/components/HUD.jsx
git commit -m "feat: MathDisplay (katex ref renderer) + HUD component"
```

---

### Task 7: OverworldMap Component

**Files:**
- Create: `src/components/OverworldMap.jsx`
- Create: `src/components/OverworldMap.test.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/OverworldMap.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import OverworldMap from './OverworldMap'

const kingdoms = [
  { id: 'la', title: 'Realm of Vectors', subtitle: 'Linear Algebra', dungeons: [{ id: 'la-01' }] },
  { id: 'calc', title: 'Calculus Keep', subtitle: 'Calculus', dungeons: [{ id: 'calc-01', stub: true }] },
]

describe('OverworldMap', () => {
  it('renders all kingdom titles', () => {
    render(<OverworldMap kingdoms={kingdoms} onSelectKingdom={() => {}} />)
    expect(screen.getByText('Realm of Vectors')).toBeTruthy()
    expect(screen.getByText('Calculus Keep')).toBeTruthy()
  })

  it('calls onSelectKingdom with kingdom id when clicked', () => {
    const spy = vi.fn()
    render(<OverworldMap kingdoms={kingdoms} onSelectKingdom={spy} />)
    fireEvent.click(screen.getByText('Realm of Vectors'))
    expect(spy).toHaveBeenCalledWith('la')
  })

  it('shows second kingdom as locked', () => {
    render(<OverworldMap kingdoms={kingdoms} onSelectKingdom={() => {}} />)
    expect(screen.getByText('🔒')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npx vitest run src/components/OverworldMap.test.jsx
```

Expected: FAIL — "Cannot find module './OverworldMap'"

- [ ] **Step 3: Implement OverworldMap.jsx**

```jsx
// src/components/OverworldMap.jsx
import { isKingdomComplete } from '../hooks/useProgress'
import { useGameStore } from '../store/gameStore'
import { useXP } from '../hooks/useXP'

const KINGDOM_COLORS = ['#4c1d95', '#1e3a5f', '#14532d', '#7c2d12']

export default function OverworldMap({ kingdoms, onSelectKingdom }) {
  const xp = useGameStore((s) => s.xp)

  function isUnlocked(index) {
    if (index === 0) return true
    const prev = kingdoms[index - 1]
    return isKingdomComplete(prev.dungeons.map((d) => d.id))
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ color: 'var(--gold)', textAlign: 'center', marginBottom: '2rem', fontSize: '1.8rem' }}>
        ⚔ MATHCRACK
      </h1>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {kingdoms.map((k, i) => {
          const unlocked = isUnlocked(i)
          return (
            <div
              key={k.id}
              onClick={() => unlocked && onSelectKingdom(k.id)}
              style={{
                padding: '1.5rem',
                background: unlocked ? KINGDOM_COLORS[i] : 'var(--bg-mid)',
                border: `2px solid ${unlocked ? 'var(--gold)' : 'var(--border)'}`,
                borderRadius: 8,
                cursor: unlocked ? 'pointer' : 'default',
                opacity: unlocked ? 1 : 0.5,
                transition: 'transform 0.1s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: 'var(--gold)', fontWeight: 'bold', fontSize: '1.1rem' }}>{k.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>{k.subtitle}</div>
                </div>
                <span style={{ fontSize: '1.5rem' }}>{unlocked ? '🏰' : '🔒'}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx vitest run src/components/OverworldMap.test.jsx
```

Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/OverworldMap.jsx src/components/OverworldMap.test.jsx
git commit -m "feat: OverworldMap with kingdom unlock progression"
```

---

### Task 8: KingdomView Component

**Files:**
- Create: `src/components/KingdomView.jsx`
- Create: `src/components/KingdomView.test.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/KingdomView.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import KingdomView from './KingdomView'

const dungeons = [
  { id: 'd-01', title: 'First Dungeon', file: 'la/d01.json' },
  { id: 'd-02', title: 'Second Dungeon', stub: true },
]

describe('KingdomView', () => {
  it('renders dungeon titles', () => {
    render(<KingdomView kingdomTitle="Test Kingdom" dungeons={dungeons} onSelectDungeon={() => {}} onBack={() => {}} />)
    expect(screen.getByText('First Dungeon')).toBeTruthy()
    expect(screen.getByText('Second Dungeon')).toBeTruthy()
  })

  it('calls onBack when back button clicked', () => {
    const spy = vi.fn()
    render(<KingdomView kingdomTitle="Test Kingdom" dungeons={dungeons} onSelectDungeon={() => {}} onBack={spy} />)
    fireEvent.click(screen.getByText('← Map'))
    expect(spy).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npx vitest run src/components/KingdomView.test.jsx
```

Expected: FAIL — "Cannot find module './KingdomView'"

- [ ] **Step 3: Implement KingdomView.jsx**

```jsx
// src/components/KingdomView.jsx
import { isDungeonComplete, isDungeonUnlocked } from '../hooks/useProgress'

export default function KingdomView({ kingdomTitle, dungeons, onSelectDungeon, onBack }) {
  const ids = dungeons.map((d) => d.id)

  return (
    <div style={{ padding: '1.5rem', maxWidth: 700, margin: '0 auto' }}>
      <button
        onClick={onBack}
        style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', marginBottom: '1rem', fontSize: '0.9rem' }}
      >
        ← Map
      </button>
      <h2 style={{ color: 'var(--gold)', marginBottom: '1.5rem' }}>{kingdomTitle}</h2>
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

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx vitest run src/components/KingdomView.test.jsx
```

Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/KingdomView.jsx src/components/KingdomView.test.jsx
git commit -m "feat: KingdomView with dungeon progression and lock states"
```

---

### Task 9: LessonRoom Component

**Files:**
- Create: `src/components/LessonRoom.jsx`
- Create: `src/components/LessonRoom.test.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/LessonRoom.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LessonRoom from './LessonRoom'

const mcRoom = {
  type: 'multiple-choice',
  question: 'What is 2+2?',
  latex: '',
  steps: [],
  answers: ['3', '4', '5', '6'],
  correct: 1,
  xp: 10,
}

const dndRoom = {
  type: 'drag-and-drop',
  question: 'Order these:',
  items: ['B', 'A', 'C'],
  correctOrder: [1, 0, 2],
  xp: 20,
}

describe('LessonRoom — multiple choice', () => {
  it('renders all 4 answer options', () => {
    render(<LessonRoom room={mcRoom} onComplete={() => {}} />)
    expect(screen.getByText('3')).toBeTruthy()
    expect(screen.getByText('4')).toBeTruthy()
  })

  it('calls onComplete with xp when correct answer clicked', () => {
    const spy = vi.fn()
    render(<LessonRoom room={mcRoom} onComplete={spy} />)
    fireEvent.click(screen.getByText('4'))
    expect(spy).toHaveBeenCalledWith(10, true)
  })

  it('calls onComplete with xp=0 when wrong answer clicked', () => {
    const spy = vi.fn()
    render(<LessonRoom room={mcRoom} onComplete={spy} />)
    fireEvent.click(screen.getByText('3'))
    expect(spy).toHaveBeenCalledWith(0, false)
  })
})

describe('LessonRoom — drag-and-drop', () => {
  it('renders the question and all items', () => {
    render(<LessonRoom room={dndRoom} onComplete={() => {}} />)
    expect(screen.getByText('Order these:')).toBeTruthy()
    expect(screen.getByText('A')).toBeTruthy()
    expect(screen.getByText('B')).toBeTruthy()
    expect(screen.getByText('C')).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npx vitest run src/components/LessonRoom.test.jsx
```

Expected: FAIL — "Cannot find module './LessonRoom'"

- [ ] **Step 3: Implement LessonRoom.jsx**

```jsx
// src/components/LessonRoom.jsx
import { useState } from 'react'
import MathDisplay from './MathDisplay'

function MultipleChoice({ room, onComplete }) {
  const [selected, setSelected] = useState(null)

  function handleSelect(idx) {
    if (selected !== null) return
    setSelected(idx)
    const correct = idx === room.correct
    setTimeout(() => onComplete(correct ? room.xp : 0, correct), 800)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
      {room.answers.map((a, i) => {
        let bg = 'var(--bg-mid)'
        if (selected !== null) {
          if (i === room.correct) bg = '#14532d'
          else if (i === selected) bg = '#7f1d1d'
        }
        return (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            style={{
              padding: '0.9rem 1.25rem', border: '1px solid var(--border)',
              borderRadius: 6, background: bg, color: 'var(--text)',
              cursor: selected === null ? 'pointer' : 'default',
              textAlign: 'left', fontSize: '1rem', fontFamily: 'var(--font)',
            }}
          >
            <span style={{ color: 'var(--gold)', marginRight: 12 }}>
              {['A', 'B', 'C', 'D'][i]}
            </span>
            {a.startsWith('\\') ? <MathDisplay latex={a} /> : a}
          </button>
        )
      })}
    </div>
  )
}

function DragAndDrop({ room, onComplete }) {
  const [order, setOrder] = useState(() => room.items.map((_, i) => i))
  const [dragging, setDragging] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  function handleDragStart(idx) { setDragging(idx) }
  function handleDrop(targetIdx) {
    if (dragging === null) return
    const next = [...order]
    const from = next.indexOf(dragging)
    next.splice(from, 1)
    next.splice(targetIdx, 0, dragging)
    setOrder(next)
    setDragging(null)
  }

  function handleSubmit() {
    if (submitted) return
    setSubmitted(true)
    const correct = order.every((v, i) => v === room.correctOrder[i])
    setTimeout(() => onComplete(correct ? room.xp : 0, correct), 800)
  }

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {order.map((itemIdx, pos) => (
          <div
            key={itemIdx}
            draggable
            onDragStart={() => handleDragStart(itemIdx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(pos)}
            style={{
              padding: '0.75rem 1rem', background: 'var(--bg-mid)',
              border: '1px solid var(--border)', borderRadius: 6,
              cursor: 'grab', color: 'var(--text)',
            }}
          >
            ⠿ {room.items[itemIdx]}
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        disabled={submitted}
        style={{
          padding: '0.75rem 2rem', background: 'var(--violet)', border: 'none',
          color: '#fff', borderRadius: 6, cursor: 'pointer', fontSize: '1rem',
        }}
      >
        Submit Order
      </button>
    </div>
  )
}

export default function LessonRoom({ room, onComplete }) {
  return (
    <div style={{ padding: '1.5rem', maxWidth: 700, margin: '0 auto' }}>
      <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{room.question}</p>
      {room.latex && <MathDisplay latex={room.latex} className="lesson-math" />}
      {room.steps && room.steps.length > 0 && (
        <div style={{ margin: '1rem 0', paddingLeft: '1rem', borderLeft: '2px solid var(--violet)' }}>
          {room.steps.map((s, i) => (
            <div key={i} style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 4 }}>
              <MathDisplay latex={s} />
            </div>
          ))}
        </div>
      )}
      {room.type === 'multiple-choice' && <MultipleChoice room={room} onComplete={onComplete} />}
      {room.type === 'drag-and-drop' && <DragAndDrop room={room} onComplete={onComplete} />}
    </div>
  )
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx vitest run src/components/LessonRoom.test.jsx
```

Expected: 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/LessonRoom.jsx src/components/LessonRoom.test.jsx
git commit -m "feat: LessonRoom with multiple-choice and drag-and-drop question types"
```

---

### Task 10: BossFight Component

**Files:**
- Create: `src/components/BossFight.jsx`
- Create: `src/components/BossFight.test.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/BossFight.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import BossFight from './BossFight'

const boss = {
  questions: [
    { type: 'multiple-choice', question: 'Q1', latex: '', answers: ['A', 'B', 'C', 'D'], correct: 0, xp: 25 },
    { type: 'multiple-choice', question: 'Q2', latex: '', answers: ['A', 'B', 'C', 'D'], correct: 1, xp: 25 },
    { type: 'multiple-choice', question: 'Q3', latex: '', answers: ['A', 'B', 'C', 'D'], correct: 2, xp: 25 },
  ],
  passMark: 2,
}

describe('BossFight', () => {
  it('renders the first boss question', () => {
    render(<BossFight boss={boss} onPass={() => {}} onFail={() => {}} />)
    expect(screen.getByText('Q1')).toBeTruthy()
  })

  it('shows question counter', () => {
    render(<BossFight boss={boss} onPass={() => {}} onFail={() => {}} />)
    expect(screen.getByText(/1 \/ 3/)).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npx vitest run src/components/BossFight.test.jsx
```

Expected: FAIL — "Cannot find module './BossFight'"

- [ ] **Step 3: Implement BossFight.jsx**

```jsx
// src/components/BossFight.jsx
import { useState } from 'react'
import LessonRoom from './LessonRoom'

export default function BossFight({ boss, onPass, onFail }) {
  const [questionIdx, setQuestionIdx] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)

  function handleAnswer(xp, correct) {
    const newCorrect = correctCount + (correct ? 1 : 0)
    const next = questionIdx + 1

    if (next >= boss.questions.length) {
      if (newCorrect >= boss.passMark) onPass(newCorrect)
      else onFail(newCorrect)
    } else {
      setCorrectCount(newCorrect)
      setQuestionIdx(next)
    }
  }

  const q = boss.questions[questionIdx]

  return (
    <div>
      <div style={{
        padding: '1rem 1.5rem', background: '#450a0a',
        borderBottom: '2px solid #dc2626',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ color: '#fca5a5', fontWeight: 'bold' }}>⚔ BOSS FIGHT</span>
        <span style={{ color: '#fca5a5' }}>{questionIdx + 1} / {boss.questions.length}</span>
        <span style={{ color: '#fca5a5' }}>✓ {correctCount} needed: {boss.passMark}</span>
      </div>
      <LessonRoom key={questionIdx} room={q} onComplete={handleAnswer} />
    </div>
  )
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx vitest run src/components/BossFight.test.jsx
```

Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/BossFight.jsx src/components/BossFight.test.jsx
git commit -m "feat: BossFight 3-question gauntlet with 2/3 pass mark"
```

---

### Task 11: ResultScreen + DetailsPanel

**Files:**
- Create: `src/components/ResultScreen.jsx`
- Create: `src/components/DetailsPanel.jsx`

- [ ] **Step 1: Implement ResultScreen.jsx**

```jsx
// src/components/ResultScreen.jsx
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { getTitle, getXPToNextLevel } from '../hooks/useXP'

export default function ResultScreen({ passed, xpGained, dungeonTitle, onContinue, onRetry }) {
  const xp = useGameStore((s) => s.xp)

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '2rem',
    }}>
      {passed ? (
        <>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.6 }}
            style={{ fontSize: '4rem', marginBottom: '1rem' }}
          >
            🏆
          </motion.div>
          <h2 style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}>Dungeon Cleared!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{dungeonTitle}</p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              padding: '1rem 2rem', background: 'var(--bg-mid)',
              border: '2px solid var(--gold)', borderRadius: 8, marginBottom: '2rem',
              textAlign: 'center',
            }}
          >
            <div style={{ color: 'var(--gold)', fontSize: '1.5rem', fontWeight: 'bold' }}>+{xpGained} XP</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>
              {getTitle(xp)} · {getXPToNextLevel(xp)} XP to next level
            </div>
          </motion.div>
          <button
            onClick={onContinue}
            style={{
              padding: '0.75rem 2.5rem', background: 'var(--violet)',
              border: 'none', color: '#fff', borderRadius: 6, cursor: 'pointer', fontSize: '1rem',
            }}
          >
            Continue →
          </button>
        </>
      ) : (
        <>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💀</div>
          <h2 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Boss Defeated You</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Review the material and try again.</p>
          <button
            onClick={onRetry}
            style={{
              padding: '0.75rem 2.5rem', background: '#7f1d1d',
              border: '1px solid #ef4444', color: '#fca5a5', borderRadius: 6, cursor: 'pointer', fontSize: '1rem',
            }}
          >
            Try Again
          </button>
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Implement DetailsPanel.jsx**

```jsx
// src/components/DetailsPanel.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { getTitle, getXPToNextLevel, getTierProgress } from '../hooks/useXP'

export default function DetailsPanel() {
  const [open, setOpen] = useState(false)
  const xp = useGameStore((s) => s.xp)
  const streak = useGameStore((s) => s.streak)
  const title = getTitle(xp)
  const toNext = getXPToNextLevel(xp)
  const progress = getTierProgress(xp)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem',
          background: 'var(--violet)', border: 'none', color: '#fff',
          padding: '0.6rem 1.2rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.9rem',
        }}
      >
        Stats ▲
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: 280,
              background: 'var(--bg-mid)', borderLeft: '2px solid var(--border)',
              padding: '2rem 1.5rem', zIndex: 100,
            }}
          >
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1.5rem' }}
            >
              ✕ Close
            </button>
            <h3 style={{ color: 'var(--gold)', marginBottom: '1.5rem' }}>Your Stats</h3>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>TITLE</div>
              <div style={{ color: 'var(--gold)', fontWeight: 'bold' }}>{title}</div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>TOTAL XP</div>
              <div style={{ color: 'var(--text)', fontSize: '1.2rem' }}>{xp}</div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: 6 }}>
                {toNext > 0 ? `${toNext} XP to next level` : 'MAX LEVEL'}
              </div>
              <div style={{ background: 'var(--border)', borderRadius: 4, height: 8 }}>
                <div style={{
                  background: 'var(--gold)', borderRadius: 4, height: 8,
                  width: `${Math.round(progress * 100)}%`, transition: 'width 0.4s',
                }} />
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>STREAK</div>
              <div style={{ color: 'var(--violet-light)' }}>🔥 {streak} days</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ResultScreen.jsx src/components/DetailsPanel.jsx
git commit -m "feat: ResultScreen with Framer Motion XP animation + slide-out DetailsPanel"
```

---

### Task 12: App.jsx — Wire Everything Together

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Replace App.jsx with full view router**

```jsx
// src/App.jsx
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
    currentRoom, xp, lastXPGain,
    addXP, setActiveKingdom, setActiveDungeon, advanceRoom,
    startBoss, goToResult, goToKingdom, goToOverworld, updateStreak,
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
    const bossXP = 75
    addXP(bossXP)
    markBossComplete(activeDungeon)
    goToResult()
  }

  function handleBossFail(correctCount) {
    goToResult()
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
          passed={!!markBossComplete._lastResult}
          xpGained={lastXPGain}
          dungeonTitle={activeDungeonData?.title ?? ''}
          onContinue={goToKingdom}
          onRetry={() => setActiveDungeon(activeDungeon, activeDungeonData)}
        />
      )}

      {activeView !== 'overworld' && <DetailsPanel />}
    </div>
  )
}
```

> **Note:** The `passed` prop on ResultScreen uses a workaround — App tracks boss pass/fail state. In Step 2, fix this by adding a `bossResult` field to the Zustand store.

- [ ] **Step 2: Add bossResult to gameStore.js**

In `src/store/gameStore.js`, add to the state object:

```js
bossResult: null,
```

Add to actions:

```js
setBossResult: (passed) => set({ bossResult: passed }),
```

Update `goToKingdom` and `goToOverworld` to reset it:

```js
goToKingdom: () => set({ activeView: 'kingdom', activeDungeon: null, activeDungeonData: null, bossResult: null }),
goToOverworld: () => set({ activeView: 'overworld', activeKingdom: null, activeDungeon: null, activeDungeonData: null, bossResult: null }),
```

- [ ] **Step 3: Update App.jsx to use bossResult**

Replace `handleBossPass` and `handleBossFail` and the `passed` prop:

```jsx
const { bossResult, setBossResult } = useGameStore()

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

// In JSX, replace the passed prop:
// passed={bossResult === true}
```

- [ ] **Step 4: Run full test suite**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 5: Start dev server and manually test the golden path**

```bash
npm run dev
```

Test this flow:
1. Open app → see Overworld with 4 kingdoms (3 locked)
2. Click "The Realm of Vectors" → see dungeon list with 1 active, 17 locked
3. Click "The Number Crypt" → 5 lesson rooms play correctly (KaTeX renders math)
4. Complete 5 rooms → Boss Fight opens
5. Answer 2/3 boss questions correctly → Result screen shows "Dungeon Cleared!" + XP
6. Click "Continue" → back to kingdom view, dungeon now shows ✅
7. Click Stats button → DetailsPanel slides in with XP bar and title
8. Refresh page → progress and XP persist (localStorage)

- [ ] **Step 6: Commit**

```bash
git add src/App.jsx src/store/gameStore.js
git commit -m "feat: App.jsx full view router — overworld, kingdom, lesson, boss, result"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Covered by |
|-----------------|-----------|
| React + Vite | Task 1 |
| KaTeX math rendering | Task 6 (MathDisplay with ref) |
| Framer Motion animations | Task 11 (ResultScreen, DetailsPanel) |
| Zustand + persist | Task 2 (gameStore with partialize) |
| localStorage progress | Task 3 (useProgress) |
| Dark fantasy CSS palette | Task 1 (App.css variables) |
| 4 kingdoms, dungeon progression | Tasks 5, 7, 8 |
| 5 rooms + boss per dungeon | Tasks 5, 9, 10 |
| Multiple-choice (+10 XP) | Task 9 |
| Drag-and-drop (+20 XP) | Task 9 |
| Boss 2/3 pass mark (+75 XP) | Task 10 |
| XP tiers (Apprentice → Math Lich) | Task 4 |
| Daily streak counter | Task 2 (updateStreak) |
| HUD with room progress dots | Task 6 |
| DetailsPanel slide-out | Task 11 |
| Result screen with seal | Task 11 |
| No lives, no penalty for wrong | Task 9 (onComplete(0, false)) |
| Boss retry on fail | Task 12 (onRetry) |
| Content JSON schema (lootTable reserved) | Task 5 (lootTable: []) |
| localStorage only, no backend | All tasks — no fetch/API calls |

**Placeholder scan:** No TBDs, no "implement later", all code blocks complete.

**Type consistency:** `onComplete(xpEarned, correct)` used consistently across LessonRoom → BossFight → App. `onPass(correctCount)` / `onFail(correctCount)` consistent between BossFight and App.
