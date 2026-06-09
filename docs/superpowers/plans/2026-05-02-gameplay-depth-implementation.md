# Gameplay Depth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add mistake explanations, difficulty-sorted rooms, and a full item/loot system to MATHCRACK's dungeon loop.

**Architecture:** `useInventory` hook centralises all item state in `App.jsx`, which passes counts and spend-callbacks as props down to `LessonRoom`. `LessonRoom` owns the `MistakeModal` internally — it only calls `onComplete` after "Got it" is clicked. Loot is rolled in `App.jsx` after boss pass and displayed via `LootDrop` inside `ResultScreen`.

**Tech Stack:** React 18, Zustand 4, Framer Motion, Vitest + @testing-library/react, localStorage

---

## File Map

| File | Change |
|------|--------|
| `src/hooks/useInventory.js` | **Create** — localStorage inventory read/write + loot roll |
| `src/hooks/useInventory.test.js` | **Create** — tests |
| `src/content/loadDungeon.js` | **Modify** — sort rooms + boss questions by `difficulty` |
| `src/content/linear-algebra/dungeon-01-number-crypt.json` | **Modify** — add `difficulty` + `explanation` to all 8 items |
| `src/content/calculus/dungeon-01-function-foothills.json` | **Modify** — add `difficulty` + `explanation` to all 8 items |
| `src/content/statistics/dungeon-01-counting-cavern.json` | **Modify** — add `difficulty` + `explanation` to all 8 items |
| `src/content/discrete-math/dungeon-01-logic-gate.json` | **Modify** — add `difficulty` + `explanation` to all 8 items |
| `src/components/MistakeModal.jsx` | **Create** — blocking explanation modal |
| `src/components/MistakeModal.test.jsx` | **Create** — tests |
| `src/components/LootDrop.jsx` | **Create** — post-boss loot roll animation |
| `src/components/LootDrop.test.jsx` | **Create** — tests |
| `src/components/InventoryBar.jsx` | **Create** — item display + activate buttons |
| `src/components/LessonRoom.jsx` | **Modify** — steps hidden, hint scroll button, solution orb, mistake modal |
| `src/components/DetailsPanel.jsx` | **Modify** — add `InventoryBar` section |
| `src/components/ResultScreen.jsx` | **Modify** — accept + show `lootDrop` prop |
| `src/App.jsx` | **Modify** — inventory wiring, loot roll, pass props to `LessonRoom` |

---

### Task 1: useInventory Hook

**Files:**
- Create: `src/hooks/useInventory.js`
- Create: `src/hooks/useInventory.test.js`

- [ ] **Step 1: Write failing tests**

Create `src/hooks/useInventory.test.js`:

```js
import { describe, it, expect, beforeEach } from 'vitest'
import {
  getInventory, addItem, useItem, getCount, rollLoot,
} from './useInventory'

beforeEach(() => {
  localStorage.clear()
})

describe('getInventory', () => {
  it('returns default inventory when localStorage is empty', () => {
    const inv = getInventory()
    expect(inv).toHaveLength(4)
    expect(inv.find(i => i.type === 'hint-scroll').count).toBe(0)
  })
})

describe('addItem', () => {
  it('increments count for the given type', () => {
    addItem('hint-scroll')
    addItem('hint-scroll')
    expect(getCount('hint-scroll')).toBe(2)
  })
})

describe('useItem', () => {
  it('returns false and does not decrement when count is 0', () => {
    const ok = useItem('hint-scroll')
    expect(ok).toBe(false)
    expect(getCount('hint-scroll')).toBe(0)
  })

  it('returns true and decrements when count > 0', () => {
    addItem('hint-scroll')
    const ok = useItem('hint-scroll')
    expect(ok).toBe(true)
    expect(getCount('hint-scroll')).toBe(0)
  })
})

describe('rollLoot', () => {
  it('returns a valid item type string', () => {
    const valid = ['hint-scroll', 'focus-crystal', 'scholars-tome', 'solution-orb']
    const result = rollLoot([])
    expect(valid).toContain(result)
  })

  it('respects lootTable filter when provided', () => {
    // run 50 rolls — if filter works, only hint-scroll ever comes out
    const allowed = [{ type: 'hint-scroll', weight: 100 }]
    for (let i = 0; i < 50; i++) {
      expect(rollLoot(allowed)).toBe('hint-scroll')
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/hooks/useInventory.test.js
```

Expected: FAIL — "Cannot find module './useInventory'"

- [ ] **Step 3: Implement useInventory.js**

```js
// src/hooks/useInventory.js
import { useState } from 'react'

const INVENTORY_KEY = 'mathcrack_inventory'
const FOCUS_KEY = 'mathcrack_focus_mode'
const TOME_KEY = 'mathcrack_tome_active'

const DEFAULT_INVENTORY = [
  { type: 'hint-scroll', count: 0 },
  { type: 'focus-crystal', count: 0 },
  { type: 'scholars-tome', count: 0 },
  { type: 'solution-orb', count: 0 },
]

const DEFAULT_LOOT = [
  { type: 'hint-scroll', weight: 60 },
  { type: 'focus-crystal', weight: 25 },
  { type: 'scholars-tome', weight: 10 },
  { type: 'solution-orb', weight: 5 },
]

export function getInventory() {
  try {
    return JSON.parse(localStorage.getItem(INVENTORY_KEY)) ?? [...DEFAULT_INVENTORY.map(i => ({ ...i }))]
  } catch {
    return [...DEFAULT_INVENTORY.map(i => ({ ...i }))]
  }
}

function saveInventory(inv) {
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(inv))
}

export function addItem(type) {
  const inv = getInventory()
  const item = inv.find(i => i.type === type)
  if (item) item.count += 1
  saveInventory(inv)
}

export function useItem(type) {
  const inv = getInventory()
  const item = inv.find(i => i.type === type)
  if (!item || item.count === 0) return false
  item.count -= 1
  saveInventory(inv)
  return true
}

export function getCount(type) {
  return getInventory().find(i => i.type === type)?.count ?? 0
}

export function rollLoot(lootTable) {
  const pool = lootTable && lootTable.length > 0 ? lootTable : DEFAULT_LOOT
  const total = pool.reduce((s, e) => s + e.weight, 0)
  let roll = Math.random() * total
  for (const entry of pool) {
    roll -= entry.weight
    if (roll <= 0) return entry.type
  }
  return pool[pool.length - 1].type
}

export function isFocusMode() {
  return localStorage.getItem(FOCUS_KEY) === 'true'
}

export function setFocusMode(val) {
  localStorage.setItem(FOCUS_KEY, val ? 'true' : 'false')
}

export function isScholarTomeActive() {
  return localStorage.getItem(TOME_KEY) === 'true'
}

export function setScholarTomeActive(val) {
  localStorage.setItem(TOME_KEY, val ? 'true' : 'false')
}

// React hook — call once in App.jsx, pass results as props
export function useInventory() {
  const [inventory, setInventory] = useState(getInventory)
  const [focusMode, setFocusModeState] = useState(isFocusMode)
  const [scholarActive, setScholarActiveState] = useState(isScholarTomeActive)

  function refresh() { setInventory(getInventory()) }

  function addItemAndRefresh(type) { addItem(type); refresh() }

  function useItemAndRefresh(type) {
    const ok = useItem(type)
    if (ok) refresh()
    return ok
  }

  function toggleFocus() {
    if (focusMode) {
      addItem('focus-crystal'); refresh()
      setFocusMode(false); setFocusModeState(false)
    } else {
      const ok = useItem('focus-crystal')
      if (!ok) return false
      refresh(); setFocusMode(true); setFocusModeState(true)
      return true
    }
  }

  function toggleScholar() {
    if (scholarActive) {
      setScholarTomeActive(false); setScholarActiveState(false)
    } else {
      const ok = useItem('scholars-tome')
      if (!ok) return false
      refresh(); setScholarTomeActive(true); setScholarActiveState(true)
      return true
    }
  }

  return {
    inventory, focusMode, scholarActive,
    addItem: addItemAndRefresh, useItem: useItemAndRefresh,
    toggleFocus, toggleScholar,
  }
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx vitest run src/hooks/useInventory.test.js
```

Expected: 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useInventory.js src/hooks/useInventory.test.js
git commit -m "feat: useInventory hook with addItem, useItem, rollLoot"
```

---

### Task 2: Difficulty Sorting in loadDungeon

**Files:**
- Modify: `src/content/loadDungeon.js`

- [ ] **Step 1: Replace loadDungeon.js**

```js
// src/content/loadDungeon.js
const dungeonFiles = import.meta.glob('./**/*.json', { eager: true })

export function loadDungeon(filePath) {
  const mod = dungeonFiles[`./${filePath}`]
  if (!mod) return null
  const data = mod.default ?? mod
  return {
    ...data,
    rooms: [...data.rooms].sort((a, b) => (a.difficulty ?? 1) - (b.difficulty ?? 1)),
    boss: data.boss
      ? {
          ...data.boss,
          questions: [...data.boss.questions].sort((a, b) => (a.difficulty ?? 1) - (b.difficulty ?? 1)),
        }
      : data.boss,
  }
}
```

- [ ] **Step 2: Verify in browser**

Run `npm run dev`. Enter The Number Crypt. The first question shown should be "Which of these is an integer?" (difficulty 1). The drag-and-drop question (difficulty 3) should be last. If the ordering looks right, proceed.

- [ ] **Step 3: Commit**

```bash
git add src/content/loadDungeon.js
git commit -m "feat: sort dungeon rooms and boss questions by difficulty at load time"
```

---

### Task 3: Update Dungeon JSONs

**Files:**
- Modify: `src/content/linear-algebra/dungeon-01-number-crypt.json`
- Modify: `src/content/calculus/dungeon-01-function-foothills.json`
- Modify: `src/content/statistics/dungeon-01-counting-cavern.json`
- Modify: `src/content/discrete-math/dungeon-01-logic-gate.json`

Each room needs `"difficulty": 1|2|3` and `"explanation": "..."`. Each boss question needs `"difficulty": 1|2|3` and `"explanation": "..."`.

- [ ] **Step 1: Replace dungeon-01-number-crypt.json**

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
      "steps": ["\\text{Integers are whole numbers: } \\ldots, -2, -1, 0, 1, 2, \\ldots"],
      "answers": ["0.5", "\\sqrt{2}", "-7", "\\pi"],
      "correct": 2,
      "difficulty": 1,
      "explanation": "An integer is a whole number with no fractional part. −7 qualifies. 0.5 has a decimal, √2 ≈ 1.414..., and π ≈ 3.14159... — none of these are whole.",
      "xp": 10
    },
    {
      "type": "multiple-choice",
      "question": "Where does -3 sit on the number line relative to -1?",
      "latex": "\\text{Compare: } -3 \\text{ vs } -1",
      "steps": ["\\text{More negative = further left = smaller}"],
      "answers": ["-3 > -1", "-3 = -1", "-3 < -1", "Cannot compare"],
      "correct": 2,
      "difficulty": 1,
      "explanation": "On the number line, numbers increase left to right. −3 is to the left of −1, so −3 < −1. A larger negative magnitude means a smaller value.",
      "xp": 10
    },
    {
      "type": "multiple-choice",
      "question": "Which set contains only rational numbers?",
      "latex": "\\mathbb{Q} = \\left\\{\\frac{p}{q} \\mid p, q \\in \\mathbb{Z},\\, q \\neq 0\\right\\}",
      "steps": ["\\text{A rational number equals } \\frac{p}{q} \\text{ for integers } p, q"],
      "answers": ["\\{\\pi, e, \\sqrt{2}\\}", "\\{0.5, -3, \\tfrac{2}{7}\\}", "\\{\\sqrt{3}, 1.5\\}", "\\{\\pi, 0, 1\\}"],
      "correct": 1,
      "difficulty": 2,
      "explanation": "0.5 = 1/2, −3 = −3/1, and 2/7 are all ratios of integers, so they are rational. π and e are irrational (no fraction equals them exactly). √2 and √3 are also irrational.",
      "xp": 10
    },
    {
      "type": "multiple-choice",
      "question": "What is |-8|?",
      "latex": "|-8| = ?",
      "steps": ["\\text{Absolute value = distance from 0 on the number line}", "|{-8}| = 8"],
      "answers": ["-8", "0", "8", "64"],
      "correct": 2,
      "difficulty": 2,
      "explanation": "Absolute value measures distance from zero, which is always non-negative. The distance from −8 to 0 is 8 steps, so |−8| = 8. It is not −8 (distances can't be negative) and not 64 (that would be (−8)²).",
      "xp": 10
    },
    {
      "type": "drag-and-drop",
      "question": "Order these number sets from smallest to largest (fewest numbers to most):",
      "items": ["Natural numbers", "Integers", "Rationals", "Reals"],
      "correctOrder": [0, 1, 2, 3],
      "difficulty": 3,
      "explanation": "ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ. Each set is strictly larger: integers add negatives and zero to naturals; rationals add fractions; reals add irrationals like π and √2.",
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
        "difficulty": 1,
        "explanation": "Any integer n can be written as n/1, which is a valid ratio of two integers. So every integer is rational. The set of integers is a subset of the rationals.",
        "xp": 25
      },
      {
        "type": "multiple-choice",
        "question": "The number 0.333... (repeating) is:",
        "latex": "0.\\overline{3} = \\frac{1}{3}",
        "answers": ["Irrational, because it never ends", "Rational, because it repeats", "An integer", "Undefined"],
        "correct": 1,
        "difficulty": 2,
        "explanation": "A decimal is rational if it terminates OR repeats. 0.333... = 1/3 exactly. Irrationals like π also never end, but they never repeat a pattern — that is the key difference.",
        "xp": 25
      },
      {
        "type": "multiple-choice",
        "question": "Which is true about real numbers?",
        "latex": "\\mathbb{N} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}",
        "answers": ["All reals are rational", "All rationals are real", "No integers are real", "Reals exclude irrationals"],
        "correct": 1,
        "difficulty": 3,
        "explanation": "ℝ contains both rationals and irrationals. Since ℚ ⊂ ℝ, every rational number is real. The converse is false: √2 is real but not rational. Integers are also real (ℤ ⊂ ℝ).",
        "xp": 25
      }
    ],
    "passMark": 2
  },
  "lootTable": []
}
```

- [ ] **Step 2: Replace dungeon-01-function-foothills.json**

```json
{
  "id": "calculus-01",
  "title": "Function Foothills",
  "kingdom": "calculus",
  "dungeonNumber": 1,
  "rooms": [
    {
      "type": "multiple-choice",
      "question": "If f(x) = x², what is f(-3)?",
      "latex": "f(x) = x^2, \\quad f(-3) = ?",
      "steps": ["f(-3) = (-3)^2 = 9"],
      "answers": ["-9", "6", "9", "-6"],
      "correct": 2,
      "difficulty": 1,
      "explanation": "Substitute x = −3: f(−3) = (−3)² = (−3) × (−3) = 9. A negative number squared is always positive. The answer is not −9 — that would be −(3²), not (−3)².",
      "xp": 10
    },
    {
      "type": "multiple-choice",
      "question": "What is the domain of f(x) = 1/x?",
      "latex": "f(x) = \\frac{1}{x}",
      "steps": ["\\text{Domain = all x where f(x) is defined}", "\\text{1/0 is undefined}"],
      "answers": ["All real numbers", "x > 0", "x \\neq 0", "x < 0"],
      "correct": 2,
      "difficulty": 1,
      "explanation": "The domain is every x-value where the function produces a real output. Division by zero is undefined, so x = 0 must be excluded. All other real numbers (positive and negative) are fine.",
      "xp": 10
    },
    {
      "type": "multiple-choice",
      "question": "Which graph represents a function? (Vertical Line Test)",
      "latex": "\\text{Each } x \\text{ maps to exactly one } y",
      "steps": ["\\text{Draw vertical lines — a function is crossed at most once each}"],
      "answers": ["A circle", "A parabola opening upward", "A sideways parabola", "Two horizontal lines"],
      "correct": 1,
      "difficulty": 2,
      "explanation": "A upward parabola passes the vertical line test — every x has exactly one y. A circle fails it (two y-values for most x). A sideways parabola also fails. Two horizontal lines mean two separate outputs for the same x at their crossing.",
      "xp": 10
    },
    {
      "type": "multiple-choice",
      "question": "What is the range of f(x) = x²?",
      "latex": "f(x) = x^2, \\quad \\text{Range} = ?",
      "steps": ["x^2 \\geq 0 \\text{ for any real } x", "\\text{minimum value is 0, no maximum}"],
      "answers": ["All reals", "y \\geq 0", "y > 0", "y \\leq 0"],
      "correct": 1,
      "difficulty": 2,
      "explanation": "x² is always ≥ 0: squaring any real number gives a non-negative result. At x = 0, f(0) = 0, so 0 is achieved — the range includes 0. It is not y > 0 (that would exclude 0). It is not all reals (no negative outputs).",
      "xp": 10
    },
    {
      "type": "drag-and-drop",
      "question": "Order the steps to evaluate g(f(2)) where f(x)=x+1, g(x)=x²:",
      "items": ["Evaluate f(2) = 3", "Compute g(3) = 9", "Identify the inner function f", "Identify the outer function g"],
      "correctOrder": [2, 3, 0, 1],
      "difficulty": 3,
      "explanation": "Composite functions evaluate inside-out. Identify f (inner) and g (outer) first. Then compute f(2) = 2+1 = 3, then apply g to that result: g(3) = 3² = 9. Working outside-in is a common mistake.",
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
        "difficulty": 1,
        "explanation": "The square root of a negative number is not real, so x must be ≥ 0. x = 0 is allowed: √0 = 0. The domain is [0, ∞), not (0, ∞) — zero is included.",
        "xp": 25
      },
      {
        "type": "multiple-choice",
        "question": "g(x) = x³ − x. Is g even, odd, or neither?",
        "latex": "g(x) = x^3 - x",
        "answers": ["Even: g(-x) = g(x)", "Odd: g(-x) = -g(x)", "Neither", "Both"],
        "correct": 1,
        "difficulty": 2,
        "explanation": "Test g(−x): g(−x) = (−x)³ − (−x) = −x³ + x = −(x³ − x) = −g(x). Since g(−x) = −g(x) for all x, g is odd. An even function would satisfy g(−x) = g(x), which doesn't hold here.",
        "xp": 25
      },
      {
        "type": "multiple-choice",
        "question": "h(x) = |x|. What is h(-5)?",
        "latex": "h(x) = |x|, \\quad h(-5) = ?",
        "answers": ["-5", "0", "5", "25"],
        "correct": 2,
        "difficulty": 3,
        "explanation": "Absolute value returns the non-negative magnitude: |−5| = 5. It is not −5 (absolute values are never negative), not 0 (that's |0|), and not 25 (that would be (−5)²).",
        "xp": 25
      }
    ],
    "passMark": 2
  },
  "lootTable": []
}
```

- [ ] **Step 3: Replace dungeon-01-counting-cavern.json**

```json
{
  "id": "statistics-01",
  "title": "Counting Cavern",
  "kingdom": "statistics",
  "dungeonNumber": 1,
  "rooms": [
    {
      "type": "multiple-choice",
      "question": "A restaurant has 3 starters and 4 mains. How many 1-starter+1-main meals?",
      "latex": "\\text{Multiplication Rule: } 3 \\times 4",
      "steps": ["\\text{Each starter pairs with each main independently}"],
      "answers": ["7", "12", "24", "3"],
      "correct": 1,
      "difficulty": 1,
      "explanation": "The multiplication rule: when two independent choices are made, multiply the number of options. 3 starters × 4 mains = 12 combinations. Adding (3+4=7) would be wrong — that counts only choosing one or the other, not both.",
      "xp": 10
    },
    {
      "type": "multiple-choice",
      "question": "How many ways can you arrange 3 distinct books on a shelf?",
      "latex": "3! = ?",
      "steps": ["3! = 3 \\times 2 \\times 1 = 6"],
      "answers": ["3", "6", "9", "27"],
      "correct": 1,
      "difficulty": 1,
      "explanation": "For n distinct objects, there are n! arrangements (permutations). 3! = 3×2×1 = 6. Think of it: 3 choices for first spot, then 2 remain, then 1. Multiplying gives 6.",
      "xp": 10
    },
    {
      "type": "multiple-choice",
      "question": "How many 2-letter codes can be made from {A, B, C} without repeating?",
      "latex": "P(3, 2) = \\frac{3!}{(3-2)!}",
      "steps": ["P(3,2) = 3 \\times 2 = 6"],
      "answers": ["3", "6", "9", "8"],
      "correct": 1,
      "difficulty": 2,
      "explanation": "P(n,r) = n!/(n−r)! counts ordered arrangements of r items from n. P(3,2) = 3!/1! = 6. Order matters: AB and BA are different codes. The 6 codes are: AB, AC, BA, BC, CA, CB.",
      "xp": 10
    },
    {
      "type": "multiple-choice",
      "question": "How many ways to choose 2 items from 4 (order does not matter)?",
      "latex": "\\binom{4}{2} = \\frac{4!}{2!\\,2!}",
      "steps": ["= \\frac{4 \\times 3}{2 \\times 1} = 6"],
      "answers": ["12", "8", "6", "4"],
      "correct": 2,
      "difficulty": 2,
      "explanation": "C(4,2) = 4!/(2!×2!) = 6. Unlike permutations, order doesn't matter: {A,B} = {B,A}. We divide P(4,2)=12 by 2! because each pair is counted twice in the ordered version.",
      "xp": 10
    },
    {
      "type": "drag-and-drop",
      "question": "Order the steps to compute C(5,2):",
      "items": ["Write C(5,2) = 5! / (2! × 3!)", "Compute 5! = 120", "Divide: 120 / (2×6) = 10", "Compute 2!=2 and 3!=6"],
      "correctOrder": [0, 1, 3, 2],
      "difficulty": 3,
      "explanation": "The combination formula C(n,r) = n!/(r!×(n−r)!). For C(5,2): write the formula, compute 5!=120, compute the denominator factorials (2!=2, 3!=6), then divide: 120/12=10.",
      "xp": 20
    }
  ],
  "boss": {
    "questions": [
      {
        "type": "multiple-choice",
        "question": "A coin is flipped 4 times. How many total outcomes?",
        "latex": "2^4 = ?",
        "answers": ["8", "16", "12", "4"],
        "correct": 1,
        "difficulty": 1,
        "explanation": "Each flip has 2 outcomes (H or T), and the flips are independent. By the multiplication rule: 2×2×2×2 = 2⁴ = 16 total sequences (HHHH, HHHT, ..., TTTT).",
        "xp": 25
      },
      {
        "type": "multiple-choice",
        "question": "P(6,3) = ?",
        "latex": "P(6, 3) = \\frac{6!}{3!}",
        "answers": ["20", "60", "120", "720"],
        "correct": 2,
        "difficulty": 2,
        "explanation": "P(6,3) = 6!/(6−3)! = 6!/3! = (6×5×4×3!)/(3!) = 6×5×4 = 120. The 3! in numerator and denominator cancel, leaving just the top 3 factors of 6!.",
        "xp": 25
      },
      {
        "type": "multiple-choice",
        "question": "How many 3-person committees from 5 people?",
        "latex": "\\binom{5}{3} = ?",
        "answers": ["10", "15", "20", "60"],
        "correct": 0,
        "difficulty": 3,
        "explanation": "C(5,3) = 5!/(3!×2!) = 120/(6×2) = 10. A committee has no ordering, so we use combinations not permutations. Note C(5,3) = C(5,2) = 10 — choosing 3 to include is the same as choosing 2 to exclude.",
        "xp": 25
      }
    ],
    "passMark": 2
  },
  "lootTable": []
}
```

- [ ] **Step 4: Replace dungeon-01-logic-gate.json**

```json
{
  "id": "discrete-math-01",
  "title": "Logic Gate",
  "kingdom": "discrete-math",
  "dungeonNumber": 1,
  "rooms": [
    {
      "type": "multiple-choice",
      "question": "What is the truth value of P ∧ Q when P=T, Q=F?",
      "latex": "P \\land Q, \\quad P = \\top,\\; Q = \\bot",
      "steps": ["\\text{AND (∧) is true only when BOTH inputs are true}"],
      "answers": ["True", "False", "Undefined", "Depends on P"],
      "correct": 1,
      "difficulty": 1,
      "explanation": "P ∧ Q (AND) requires both P and Q to be true. Since Q is false here, P ∧ Q is false regardless of P. Think of it as: a chain is only as strong as its weakest link.",
      "xp": 10
    },
    {
      "type": "multiple-choice",
      "question": "What is the truth value of P ∨ Q when P=F, Q=F?",
      "latex": "P \\lor Q, \\quad P = \\bot,\\; Q = \\bot",
      "steps": ["\\text{OR (∨) is true when AT LEAST ONE input is true}"],
      "answers": ["True", "False", "True only if both false", "Undefined"],
      "correct": 1,
      "difficulty": 1,
      "explanation": "P ∨ Q (OR) is false only when both P and Q are false. Since both are false here, P ∨ Q is false. If even one were true, the OR would be true.",
      "xp": 10
    },
    {
      "type": "multiple-choice",
      "question": "What is ¬(¬P) equivalent to?",
      "latex": "\\neg(\\neg P) = ?",
      "steps": ["\\text{Negation flips truth value}", "\\text{Negating twice returns to original}"],
      "answers": ["¬P", "P", "False", "True"],
      "correct": 1,
      "difficulty": 2,
      "explanation": "¬ flips a truth value. ¬P is the opposite of P. ¬(¬P) flips it back — double negation cancels. If P is true, ¬P is false, ¬(¬P) is true again. This is the double negation law.",
      "xp": 10
    },
    {
      "type": "multiple-choice",
      "question": "P → Q is FALSE when:",
      "latex": "P \\Rightarrow Q \\text{ is false when...}",
      "steps": ["\\text{Implication is false ONLY when the premise is true but the conclusion is false}"],
      "answers": ["P=F, Q=T", "P=T, Q=T", "P=T, Q=F", "P=F, Q=F"],
      "correct": 2,
      "difficulty": 2,
      "explanation": "An implication P→Q is false only when P is true and Q is false — a true premise leading to a false conclusion is a broken promise. All other combinations (P false, or Q true) make the implication vacuously or genuinely true.",
      "xp": 10
    },
    {
      "type": "drag-and-drop",
      "question": "Order the rows of the truth table for P ∧ Q:",
      "items": ["P=T, Q=T → T", "P=T, Q=F → F", "P=F, Q=T → F", "P=F, Q=F → F"],
      "correctOrder": [0, 1, 2, 3],
      "difficulty": 3,
      "explanation": "Standard truth table order cycles P and Q through TT, TF, FT, FF. For AND: only the first row (both true) gives true. The remaining three rows all give false.",
      "xp": 20
    }
  ],
  "boss": {
    "questions": [
      {
        "type": "multiple-choice",
        "question": "Which is logically equivalent to P → Q?",
        "latex": "P \\Rightarrow Q \\equiv ?",
        "answers": ["Q → P", "¬P ∨ Q", "P ∧ ¬Q", "¬P → Q"],
        "correct": 1,
        "difficulty": 1,
        "explanation": "P→Q is equivalent to ¬P ∨ Q (if not P, then at least Q must save us). You can verify by checking all four T/F combinations — both expressions have identical truth tables. Q→P is the converse, not equivalent.",
        "xp": 25
      },
      {
        "type": "multiple-choice",
        "question": "De Morgan's Law: ¬(P ∧ Q) = ?",
        "latex": "\\neg(P \\land Q) = ?",
        "answers": ["¬P ∧ ¬Q", "¬P ∨ ¬Q", "P ∨ Q", "¬P → Q"],
        "correct": 1,
        "difficulty": 2,
        "explanation": "De Morgan's Law: ¬(P ∧ Q) = ¬P ∨ ¬Q. Negating an AND flips to OR and negates each part. Similarly ¬(P ∨ Q) = ¬P ∧ ¬Q. A helpful reading: 'not (both)' means 'at least one is not'.",
        "xp": 25
      },
      {
        "type": "multiple-choice",
        "question": "A tautology is a statement that is:",
        "latex": "\\text{Tautology} = ?",
        "answers": ["Always false", "Sometimes true", "Always true", "Unprovable"],
        "correct": 2,
        "difficulty": 3,
        "explanation": "A tautology is a proposition that is true under every possible assignment of truth values to its variables. Example: P ∨ ¬P is always true. Its opposite — always false — is a contradiction. 'Sometimes true' describes a contingency.",
        "xp": 25
      }
    ],
    "passMark": 2
  },
  "lootTable": []
}
```

- [ ] **Step 5: Commit**

```bash
git add src/content/
git commit -m "feat: add difficulty + explanation fields to all 4 starter dungeons"
```

---

### Task 4: MistakeModal Component

**Files:**
- Create: `src/components/MistakeModal.jsx`
- Create: `src/components/MistakeModal.test.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/MistakeModal.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MistakeModal from './MistakeModal'

describe('MistakeModal', () => {
  it('renders the explanation text', () => {
    render(<MistakeModal explanation="Because x must be non-zero." correctAnswer="x ≠ 0" onDismiss={() => {}} />)
    expect(screen.getByText('Because x must be non-zero.')).toBeTruthy()
  })

  it('renders the correct answer', () => {
    render(<MistakeModal explanation="Because x must be non-zero." correctAnswer="x ≠ 0" onDismiss={() => {}} />)
    expect(screen.getByText(/x ≠ 0/)).toBeTruthy()
  })

  it('calls onDismiss when Got it is clicked', () => {
    const spy = vi.fn()
    render(<MistakeModal explanation="Because x must be non-zero." correctAnswer="x ≠ 0" onDismiss={spy} />)
    fireEvent.click(screen.getByText('Got it'))
    expect(spy).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npx vitest run src/components/MistakeModal.test.jsx
```

Expected: FAIL — "Cannot find module './MistakeModal'"

- [ ] **Step 3: Implement MistakeModal.jsx**

```jsx
// src/components/MistakeModal.jsx
import { motion } from 'framer-motion'

export default function MistakeModal({ explanation, correctAnswer, onDismiss }) {
  return (
    <>
      <div
        onClick={onDismiss}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200 }}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: '#1a0a0a', borderTop: '2px solid #dc2626',
          padding: '2rem 1.5rem', zIndex: 201, maxWidth: 700, margin: '0 auto',
        }}
      >
        <div style={{ color: '#fca5a5', fontSize: '0.75rem', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>
          NOT QUITE — HERE'S WHY
        </div>
        <p style={{ color: 'var(--text)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1rem' }}>
          {explanation}
        </p>
        <div style={{
          padding: '0.75rem 1rem', background: '#14532d',
          borderRadius: 6, marginBottom: '1.5rem', fontSize: '0.9rem', color: '#86efac',
        }}>
          ✓ Correct answer: <strong>{correctAnswer}</strong>
        </div>
        <button
          onClick={onDismiss}
          style={{
            width: '100%', padding: '0.85rem', background: 'var(--violet)',
            border: 'none', color: '#fff', borderRadius: 6,
            cursor: 'pointer', fontSize: '1rem', fontFamily: 'var(--font)',
          }}
        >
          Got it
        </button>
      </motion.div>
    </>
  )
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx vitest run src/components/MistakeModal.test.jsx
```

Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/MistakeModal.jsx src/components/MistakeModal.test.jsx
git commit -m "feat: MistakeModal — blocking explanation modal for wrong answers"
```

---

### Task 5: Update LessonRoom

**Files:**
- Modify: `src/components/LessonRoom.jsx`

LessonRoom gains four new capabilities:
1. Steps hidden by default — revealed one at a time via Hint Scroll
2. Solution Orb button — reveals correct answer + explanation before answering
3. MistakeModal shown on wrong answer — `onComplete` only fires after "Got it"
4. Scholar's Tome support — modal also shows on correct answer when `alwaysShowExplanation` is true

Props added: `hintScrolls` (number), `solutionOrbs` (number), `focusMode` (bool), `alwaysShowExplanation` (bool), `onUseScroll` (fn), `onUseSolutionOrb` (fn)

- [ ] **Step 1: Replace LessonRoom.jsx**

```jsx
// src/components/LessonRoom.jsx
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import MathDisplay from './MathDisplay'
import MistakeModal from './MistakeModal'

function MultipleChoice({ room, onWrong, onCorrect, solutionRevealed }) {
  const [selected, setSelected] = useState(null)

  function handleSelect(idx) {
    if (selected !== null) return
    setSelected(idx)
    const correct = idx === room.correct
    setTimeout(() => {
      if (correct) onCorrect(room.xp)
      else onWrong()
    }, 800)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
      {room.answers.map((a, i) => {
        let bg = 'var(--bg-mid)'
        if (solutionRevealed && i === room.correct) bg = '#14532d'
        if (selected !== null) {
          if (i === room.correct) bg = '#14532d'
          else if (i === selected) bg = '#7f1d1d'
        }
        const isLatex = typeof a === 'string' && (a.includes('\\') || a.includes('{'))
        return (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            style={{
              padding: '0.9rem 1.25rem', border: '1px solid var(--border)',
              borderRadius: 6, background: bg, color: 'var(--text)',
              cursor: selected === null ? 'pointer' : 'default',
              textAlign: 'left', fontSize: '1rem', fontFamily: 'var(--font)',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
            }}
          >
            <span style={{ color: 'var(--gold)', minWidth: '1.2rem' }}>
              {['A', 'B', 'C', 'D'][i]}
            </span>
            {isLatex ? <MathDisplay latex={a} /> : <span>{a}</span>}
          </button>
        )
      })}
    </div>
  )
}

function DragAndDrop({ room, onWrong, onCorrect }) {
  const [order, setOrder] = useState(() => room.items.map((_, i) => i))
  const [dragging, setDragging] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  function handleDragStart(itemIdx) { setDragging(itemIdx) }

  function handleDrop(targetPos) {
    if (dragging === null) return
    const next = [...order]
    const fromPos = next.indexOf(dragging)
    next.splice(fromPos, 1)
    next.splice(targetPos, 0, dragging)
    setOrder(next)
    setDragging(null)
  }

  function handleSubmit() {
    if (submitted) return
    setSubmitted(true)
    const correct = order.every((v, i) => v === room.correctOrder[i])
    setTimeout(() => {
      if (correct) onCorrect(room.xp)
      else onWrong()
    }, 800)
  }

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
        Drag to reorder, then click Submit.
      </p>
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
              cursor: 'grab', color: 'var(--text)', userSelect: 'none',
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
          color: '#fff', borderRadius: 6, cursor: submitted ? 'default' : 'pointer',
          fontSize: '1rem', fontFamily: 'var(--font)',
        }}
      >
        Submit Order
      </button>
    </div>
  )
}

export default function LessonRoom({
  room, onComplete,
  hintScrolls = 0, solutionOrbs = 0, focusMode = false,
  alwaysShowExplanation = false,
  onUseScroll = () => {}, onUseSolutionOrb = () => {},
}) {
  const [revealedSteps, setRevealedSteps] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [solutionRevealed, setSolutionRevealed] = useState(false)
  const [pendingComplete, setPendingComplete] = useState(null) // { xp, correct }

  const correctAnswerText = room.type === 'multiple-choice'
    ? room.answers[room.correct]
    : 'See the correct order above'

  function handleCorrect(xp) {
    if (alwaysShowExplanation) {
      setPendingComplete({ xp, correct: true })
      setShowModal(true)
    } else {
      onComplete(xp, true)
    }
  }

  function handleWrong() {
    setPendingComplete({ xp: 0, correct: false })
    setShowModal(true)
  }

  function handleDismiss() {
    setShowModal(false)
    if (pendingComplete) {
      onComplete(pendingComplete.xp, pendingComplete.correct)
      setPendingComplete(null)
    }
  }

  function handleUseScroll() {
    const ok = onUseScroll()
    if (ok !== false) setRevealedSteps((n) => Math.min(n + 1, room.steps?.length ?? 0))
  }

  function handleUseSolutionOrb() {
    const ok = onUseSolutionOrb()
    if (ok !== false) setSolutionRevealed(true)
  }

  const visibleSteps = (room.steps ?? []).slice(0, revealedSteps)
  const hasMoreSteps = revealedSteps < (room.steps?.length ?? 0)

  return (
    <div style={{ padding: '1.5rem', maxWidth: 700, margin: '0 auto' }}>
      <p style={{ fontSize: '1.1rem', marginBottom: '1rem', lineHeight: 1.6 }}>{room.question}</p>
      {room.latex && <MathDisplay latex={room.latex} className="lesson-math" />}

      {solutionRevealed && room.explanation && (
        <div style={{ margin: '1rem 0', padding: '0.75rem 1rem', background: '#1a2a1a', border: '1px solid var(--correct)', borderRadius: 6 }}>
          <div style={{ color: 'var(--correct)', fontSize: '0.75rem', marginBottom: 4 }}>SOLUTION ORB ACTIVE</div>
          <p style={{ color: 'var(--text)', fontSize: '0.9rem' }}>{room.explanation}</p>
        </div>
      )}

      {visibleSteps.length > 0 && (
        <div style={{ margin: '1rem 0', paddingLeft: '1rem', borderLeft: '2px solid var(--violet)' }}>
          {visibleSteps.map((s, i) => (
            <div key={i} style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 4 }}>
              <MathDisplay latex={s} />
            </div>
          ))}
        </div>
      )}

      {!focusMode && hasMoreSteps && (
        <button
          onClick={handleUseScroll}
          disabled={hintScrolls === 0}
          title={hintScrolls === 0 ? 'Need a Hint Scroll — earn one by defeating a boss' : `Use Hint Scroll (${hintScrolls} left)`}
          style={{
            padding: '0.4rem 1rem', marginBottom: '1rem',
            background: hintScrolls > 0 ? 'var(--bg-mid)' : '#1a1030',
            border: `1px solid ${hintScrolls > 0 ? 'var(--gold)' : 'var(--border)'}`,
            color: hintScrolls > 0 ? 'var(--gold)' : 'var(--text-muted)',
            borderRadius: 6, cursor: hintScrolls > 0 ? 'pointer' : 'not-allowed',
            fontSize: '0.85rem', fontFamily: 'var(--font)',
          }}
        >
          📜 Hint Scroll {hintScrolls > 0 ? `(${hintScrolls})` : '(0)'}
        </button>
      )}

      {solutionOrbs > 0 && !solutionRevealed && (
        <button
          onClick={handleUseSolutionOrb}
          style={{
            padding: '0.4rem 1rem', marginBottom: '1rem', marginLeft: '0.5rem',
            background: 'var(--bg-mid)', border: '1px solid #a855f7',
            color: '#a855f7', borderRadius: 6, cursor: 'pointer',
            fontSize: '0.85rem', fontFamily: 'var(--font)',
          }}
        >
          🔮 Solution Orb ({solutionOrbs})
        </button>
      )}

      {room.type === 'multiple-choice' && (
        <MultipleChoice
          room={room}
          onCorrect={handleCorrect}
          onWrong={handleWrong}
          solutionRevealed={solutionRevealed}
        />
      )}
      {room.type === 'drag-and-drop' && (
        <DragAndDrop room={room} onCorrect={handleCorrect} onWrong={handleWrong} />
      )}

      <AnimatePresence>
        {showModal && (
          <MistakeModal
            explanation={room.explanation ?? 'Review the material and try again.'}
            correctAnswer={correctAnswerText}
            onDismiss={handleDismiss}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
```

- [ ] **Step 2: Run full test suite to check nothing broke**

```bash
npx vitest run
```

Expected: all previously passing tests still pass. (LessonRoom tests from Task 9 of the original plan still work because the new props all have defaults.)

- [ ] **Step 3: Commit**

```bash
git add src/components/LessonRoom.jsx
git commit -m "feat: LessonRoom — mistake modal, hint scroll reveal, solution orb, scholar tome support"
```

---

### Task 6: LootDrop Component

**Files:**
- Create: `src/components/LootDrop.jsx`
- Create: `src/components/LootDrop.test.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/LootDrop.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LootDrop from './LootDrop'

describe('LootDrop', () => {
  it('renders the item name', () => {
    render(<LootDrop itemType="hint-scroll" onCollect={() => {}} />)
    expect(screen.getByText(/Hint Scroll/i)).toBeTruthy()
  })

  it('calls onCollect when button clicked', () => {
    const spy = vi.fn()
    render(<LootDrop itemType="hint-scroll" onCollect={spy} />)
    fireEvent.click(screen.getByText(/Collect/i))
    expect(spy).toHaveBeenCalledOnce()
  })

  it('renders correct label for solution-orb', () => {
    render(<LootDrop itemType="solution-orb" onCollect={() => {}} />)
    expect(screen.getByText(/Solution Orb/i)).toBeTruthy()
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npx vitest run src/components/LootDrop.test.jsx
```

Expected: FAIL — "Cannot find module './LootDrop'"

- [ ] **Step 3: Implement LootDrop.jsx**

```jsx
// src/components/LootDrop.jsx
import { motion } from 'framer-motion'

const ITEM_META = {
  'hint-scroll':    { emoji: '📜', label: 'Hint Scroll',    rarity: 'COMMON',    color: '#94a3b8' },
  'focus-crystal':  { emoji: '🔷', label: 'Focus Crystal',  rarity: 'RARE',      color: '#60a5fa' },
  'scholars-tome':  { emoji: '📖', label: "Scholar's Tome", rarity: 'EPIC',      color: '#a78bfa' },
  'solution-orb':   { emoji: '🔮', label: 'Solution Orb',   rarity: 'LEGENDARY', color: '#fbbf24' },
}

export default function LootDrop({ itemType, onCollect }) {
  const meta = ITEM_META[itemType] ?? ITEM_META['hint-scroll']
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, type: 'spring', duration: 0.5 }}
      style={{
        margin: '1.5rem auto', padding: '1.5rem',
        background: 'var(--bg-mid)', border: `2px solid ${meta.color}`,
        borderRadius: 10, textAlign: 'center', maxWidth: 300,
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{meta.emoji}</div>
      <div style={{ color: meta.color, fontSize: '0.7rem', letterSpacing: '0.12em', marginBottom: '0.25rem' }}>
        {meta.rarity} DROP
      </div>
      <div style={{ color: 'var(--text)', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        {meta.label}
      </div>
      <button
        onClick={onCollect}
        style={{
          padding: '0.6rem 1.5rem', background: meta.color,
          border: 'none', color: '#000', borderRadius: 6,
          cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--font)', fontWeight: 'bold',
        }}
      >
        Collect
      </button>
    </motion.div>
  )
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx vitest run src/components/LootDrop.test.jsx
```

Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/LootDrop.jsx src/components/LootDrop.test.jsx
git commit -m "feat: LootDrop component with rarity colours and collect button"
```

---

### Task 7: InventoryBar + Update DetailsPanel

**Files:**
- Create: `src/components/InventoryBar.jsx`
- Modify: `src/components/DetailsPanel.jsx`

- [ ] **Step 1: Implement InventoryBar.jsx**

```jsx
// src/components/InventoryBar.jsx
const ITEM_META = {
  'hint-scroll':   { emoji: '📜', label: 'Hint Scrolls',   desc: 'Reveal one hint step per use' },
  'focus-crystal': { emoji: '🔷', label: 'Focus Crystal',  desc: 'Hide hints for a cleaner view' },
  'scholars-tome': { emoji: '📖', label: "Scholar's Tome", desc: 'See explanations after every answer' },
  'solution-orb':  { emoji: '🔮', label: 'Solution Orbs',  desc: 'Reveal the correct answer before answering' },
}

export default function InventoryBar({ inventory, focusMode, scholarActive, onToggleFocus, onToggleScholar }) {
  return (
    <div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: '0.75rem' }}>INVENTORY</div>
      {inventory.map((item) => {
        const meta = ITEM_META[item.type]
        if (!meta) return null
        const isToggleable = item.type === 'focus-crystal' || item.type === 'scholars-tome'
        const isActive = item.type === 'focus-crystal' ? focusMode : scholarActive
        return (
          <div key={item.type} style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.6rem 0.75rem', marginBottom: '0.5rem',
            background: isActive ? '#1a1040' : 'var(--bg-deep)',
            border: `1px solid ${isActive ? 'var(--violet)' : 'var(--border)'}`,
            borderRadius: 6,
          }}>
            <span style={{ fontSize: '1.2rem' }}>{meta.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'var(--text)', fontSize: '0.85rem' }}>{meta.label}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{meta.desc}</div>
            </div>
            <span style={{ color: 'var(--gold)', fontWeight: 'bold', fontSize: '1rem', minWidth: '1.5rem', textAlign: 'right' }}>
              {item.count}
            </span>
            {isToggleable && (
              <button
                onClick={item.type === 'focus-crystal' ? onToggleFocus : onToggleScholar}
                disabled={!isActive && item.count === 0}
                style={{
                  padding: '0.25rem 0.6rem', fontSize: '0.7rem',
                  background: isActive ? 'var(--violet)' : 'var(--bg-mid)',
                  border: '1px solid var(--border)', color: isActive ? '#fff' : 'var(--text-muted)',
                  borderRadius: 4, cursor: item.count > 0 || isActive ? 'pointer' : 'not-allowed',
                  fontFamily: 'var(--font)',
                }}
              >
                {isActive ? 'ON' : 'USE'}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Update DetailsPanel.jsx**

Replace the entire file:

```jsx
// src/components/DetailsPanel.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { getTitle, getXPToNextLevel, getTierProgress } from '../hooks/useXP'
import InventoryBar from './InventoryBar'

export default function DetailsPanel({ inventory, focusMode, scholarActive, onToggleFocus, onToggleScholar }) {
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
          padding: '0.6rem 1.2rem', borderRadius: 6,
          cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'var(--font)',
          zIndex: 99,
        }}
      >
        Stats ▲
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, width: 300,
                background: 'var(--bg-mid)', borderLeft: '2px solid var(--border)',
                padding: '2rem 1.5rem', zIndex: 101, overflowY: 'auto',
              }}
            >
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.9rem' }}
              >
                ✕ Close
              </button>
              <h3 style={{ color: 'var(--gold)', marginBottom: '1.5rem' }}>Your Stats</h3>
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: 4 }}>TITLE</div>
                <div style={{ color: 'var(--gold)', fontWeight: 'bold', fontSize: '1.1rem' }}>{title}</div>
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: 4 }}>TOTAL XP</div>
                <div style={{ color: 'var(--text)', fontSize: '1.4rem' }}>{xp}</div>
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: 6 }}>
                  {toNext > 0 ? `${toNext} XP to next level` : 'MAX LEVEL — Math Lich achieved'}
                </div>
                <div style={{ background: 'var(--border)', borderRadius: 4, height: 8 }}>
                  <div style={{
                    background: 'var(--gold)', borderRadius: 4, height: 8,
                    width: `${Math.round(progress * 100)}%`,
                    transition: 'width 0.4s',
                  }} />
                </div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginBottom: 4 }}>STREAK</div>
                <div style={{ color: 'var(--violet-light)', fontSize: '1.1rem' }}>🔥 {streak} days</div>
              </div>
              <InventoryBar
                inventory={inventory}
                focusMode={focusMode}
                scholarActive={scholarActive}
                onToggleFocus={onToggleFocus}
                onToggleScholar={onToggleScholar}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/InventoryBar.jsx src/components/DetailsPanel.jsx
git commit -m "feat: InventoryBar with item counts and toggle buttons, wired into DetailsPanel"
```

---

### Task 8: Update ResultScreen + App.jsx

**Files:**
- Modify: `src/components/ResultScreen.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Update ResultScreen.jsx to show LootDrop**

Replace the entire file:

```jsx
// src/components/ResultScreen.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import { getTitle, getXPToNextLevel } from '../hooks/useXP'
import LootDrop from './LootDrop'

export default function ResultScreen({ passed, xpGained, dungeonTitle, lootDrop, onContinue, onRetry }) {
  const xp = useGameStore((s) => s.xp)
  const [lootCollected, setLootCollected] = useState(false)

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '2rem',
      background: 'var(--bg-deep)',
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
          <h2 style={{ color: 'var(--gold)', marginBottom: '0.5rem', fontSize: '1.6rem' }}>
            Dungeon Cleared!
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{dungeonTitle}</p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              padding: '1rem 2rem', background: 'var(--bg-mid)',
              border: '2px solid var(--gold)', borderRadius: 8,
              marginBottom: lootDrop ? '1rem' : '2rem', textAlign: 'center',
            }}
          >
            <div style={{ color: 'var(--gold)', fontSize: '1.5rem', fontWeight: 'bold' }}>
              +{xpGained} XP
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 4 }}>
              {getTitle(xp)} · {getXPToNextLevel(xp) > 0 ? `${getXPToNextLevel(xp)} XP to next level` : 'MAX LEVEL'}
            </div>
          </motion.div>

          {lootDrop && !lootCollected && (
            <LootDrop itemType={lootDrop} onCollect={() => setLootCollected(true)} />
          )}

          {(!lootDrop || lootCollected) && (
            <button
              onClick={onContinue}
              style={{
                padding: '0.75rem 2.5rem', background: 'var(--violet)',
                border: 'none', color: '#fff', borderRadius: 6,
                cursor: 'pointer', fontSize: '1rem', fontFamily: 'var(--font)',
              }}
            >
              Continue →
            </button>
          )}
        </>
      ) : (
        <>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💀</div>
          <h2 style={{ color: '#ef4444', marginBottom: '0.5rem', fontSize: '1.6rem' }}>
            Boss Defeated You
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Review the material and try again.
          </p>
          <button
            onClick={onRetry}
            style={{
              padding: '0.75rem 2.5rem', background: '#7f1d1d',
              border: '1px solid #ef4444', color: '#fca5a5',
              borderRadius: 6, cursor: 'pointer', fontSize: '1rem', fontFamily: 'var(--font)',
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

- [ ] **Step 2: Update App.jsx**

Replace the entire file:

```jsx
// src/App.jsx
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

  function handleLootCollect() {
    if (lootDrop) addItem(lootDrop)
    setLootDrop(null)
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
```

- [ ] **Step 3: Run full test suite**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 4: Start dev server and test the golden path manually**

```bash
npm run dev
```

Test this flow:
1. Enter The Number Crypt → first room is difficulty 1 (integer recognition)
2. Answer wrong → MistakeModal slides up with explanation, blocks progress
3. Click "Got it" → advances to next room
4. Complete all 5 rooms, beat boss (answer ≥ 2/3 correctly)
5. ResultScreen shows trophy + XP + a loot drop card (emoji, rarity colour, Collect button)
6. Click Collect → loot card disappears, Continue button appears
7. Open Stats panel → Inventory section shows the collected item with count 1
8. If it was a Hint Scroll: re-enter a dungeon, the 📜 Hint Scroll button is now active (gold)
9. Click Hint Scroll → one step reveals below the question, scroll count drops to 0

- [ ] **Step 5: Commit**

```bash
git add src/components/ResultScreen.jsx src/App.jsx
git commit -m "feat: loot drops after boss win, inventory wired into LessonRoom and DetailsPanel"
```

---

## Self-Review

**Spec coverage:**

| Spec requirement | Task |
|-----------------|------|
| Mistake modal — blocking, "Got it" button | Task 4 + Task 5 |
| Mistake modal shows on boss fight wrong answers | Task 5 (LessonRoom used inside BossFight) |
| `explanation` field on all rooms | Task 3 |
| `difficulty` field on all rooms | Task 3 |
| Rooms sorted by difficulty at load time | Task 2 |
| Boss questions also sorted by difficulty | Task 2 |
| Steps hidden by default | Task 5 |
| Hint Scroll reveals one step per use | Task 5 |
| Hint Scroll button grey when count = 0 | Task 5 |
| Solution Orb reveals correct answer + explanation | Task 5 |
| Scholar's Tome — explanation shows even on correct | Task 5 |
| Focus Crystal — hides hint button | Task 5 |
| Loot roll after boss win (60/25/10/5 weights) | Task 1 + Task 8 |
| `lootTable` overrides default pool | Task 1 (`rollLoot`) |
| LootDrop component with rarity colours | Task 6 |
| Inventory stored in localStorage | Task 1 |
| InventoryBar in DetailsPanel | Task 7 |
| Toggle Focus Crystal / Scholar's Tome from DetailsPanel | Task 7 |
| Focus Crystal refunded on deactivate | Task 1 (`toggleFocus`) |

**Placeholder scan:** No TBDs. All code blocks complete.

**Type consistency:** `onUseScroll` returns the result of `useItem()` (boolean) — `LessonRoom` checks `ok !== false`. `rollLoot` returns a string type key — matches `ITEM_META` keys in `LootDrop`. `inventory` is `{ type, count }[]` — used consistently in `InventoryBar` and `App.jsx`.
