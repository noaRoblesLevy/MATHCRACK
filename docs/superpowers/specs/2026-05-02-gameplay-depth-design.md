# MATHCRACK — Gameplay Depth Design Spec (Sub-project 1)
**Date:** 2026-05-02
**Status:** Approved

---

## Overview

This spec covers the first expansion phase of MATHCRACK: deeper gameplay mechanics that make the learning loop feel intentional and fair. Three features:

1. **Mistake explanations** — blocking modal after every wrong answer with a clear "here's why"
2. **Difficulty progression** — rooms sorted easy → hard within every dungeon
3. **Item system** — loot drops after boss wins, Hint Scrolls gate the `steps` reveal

These all build on the existing dungeon flow without changing the three-layer architecture (JSON content → game engine → UI).

---

## Feature 1 — Mistake Explanations

### Behaviour

When a wrong answer is selected in a dungeon room or boss fight:

1. The chosen answer highlights red, the correct answer highlights green (same as now)
2. A modal slides up from the bottom of the screen
3. The modal is **blocking** — no auto-dismiss, no timer
4. The player must tap **"Got it"** to dismiss and advance

### Modal Contents

- Title: "Not quite — here's why"
- Body: the room's `explanation` field rendered as plain text + optional KaTeX expression
- Correct answer restated (e.g. "The correct answer was: **−7**")
- "Got it" button

### Boss Fight Behaviour

Boss fight questions also show the modal on wrong answer. The answer is locked in before the modal appears — the boss score (correct count) is already recorded. So seeing the explanation doesn't let the player undo a wrong answer.

### JSON Schema Change

Every room (dungeon rooms and boss questions) gains a required `explanation` field:

```json
{
  "type": "multiple-choice",
  "question": "Which of these is an integer?",
  "latex": "\\text{Choose the integer:}",
  "steps": [],
  "answers": ["0.5", "\\sqrt{2}", "-7", "\\pi"],
  "correct": 2,
  "difficulty": 1,
  "explanation": "An integer has no fractional part. −7 is a whole number, so it qualifies. 0.5, √2, and π all have non-integer values.",
  "xp": 10
}
```

For drag-and-drop rooms, `explanation` describes why the correct order is what it is.

### Existing Dungeon Updates

All 4 starter dungeons (20 rooms + 12 boss questions = 32 total) need `explanation` fields added and `difficulty` fields added (see Feature 2).

---

## Feature 2 — Difficulty Progression

### Behaviour

Rooms within a dungeon always play in order of difficulty: easy (1) → medium (2) → hard (3). The boss questions also sort by difficulty.

### JSON Schema Change

Every room and boss question gains a `difficulty` field: integer `1`, `2`, or `3`.

```json
{ "difficulty": 1 }
```

### Sorting

Sorting happens in `src/content/loadDungeon.js` at load time, not in the component:

```js
export function loadDungeon(filePath) {
  const mod = dungeonFiles[`./${filePath}`]
  if (!mod) return null
  const data = mod.default ?? mod
  return {
    ...data,
    rooms: [...data.rooms].sort((a, b) => a.difficulty - b.difficulty),
    boss: data.boss
      ? { ...data.boss, questions: [...data.boss.questions].sort((a, b) => a.difficulty - b.difficulty) }
      : data.boss,
  }
}
```

### Difficulty Assignments for Starter Dungeons

**The Number Crypt (Linear Algebra 01):**
- Room 1 (integer recognition) → difficulty 1
- Room 2 (number line comparison) → difficulty 1
- Room 3 (rational number set) → difficulty 2
- Room 4 (absolute value) → difficulty 2
- Room 5 (drag-and-drop set ordering) → difficulty 3

**Function Foothills (Calculus 01):**
- Room 1 (domain of 1/x) → difficulty 1
- Room 2 (evaluate f(-3)) → difficulty 1
- Room 3 (vertical line test) → difficulty 2
- Room 4 (range of x²) → difficulty 2
- Room 5 (drag-and-drop composite function) → difficulty 3

**Counting Cavern (Statistics 01):**
- Room 1 (3!) → difficulty 1
- Room 2 (P(3,2)) → difficulty 2
- Room 3 (C(4,2)) → difficulty 2
- Room 4 (multiplication rule) → difficulty 1
- Room 5 (drag-and-drop C(5,2) steps) → difficulty 3

**Logic Gate (Discrete Math 01):**
- Room 1 (P ∧ Q) → difficulty 1
- Room 2 (P ∨ Q) → difficulty 1
- Room 3 (double negation) → difficulty 2
- Room 4 (implication truth table) → difficulty 2
- Room 5 (drag-and-drop truth table rows) → difficulty 3

---

## Feature 3 — Item System

### Item Types

| Rarity | Item | Drop Rate | Effect |
|--------|------|-----------|--------|
| Common | Hint Scroll | 60% | Reveals one `steps` entry per use (sequential) |
| Rare | Focus Crystal | 25% | Toggles `focusMode` — hides hint button for cleaner layout |
| Epic | Scholar's Tome | 10% | Shows full `explanation` immediately after answering (correct or wrong) |
| Legendary | Solution Orb | 5% | Reveals correct answer + full explanation before answering |

### Loot Drop Mechanics

After every boss fight win, one roll determines if a drop occurs and what rarity:

```
Roll 0–100:
  0–59   → Common (Hint Scroll)
  60–84  → Rare (Focus Crystal)
  85–94  → Epic (Scholar's Tome)
  95–99  → Legendary (Solution Orb)
  (no "no drop" — a win always gives something)
```

The dungeon's `lootTable` array (currently `[]`) can override which items are eligible for that dungeon. If `lootTable` is empty, all four items are eligible.

### Inventory Storage

Items stored in `localStorage` under key `mathcrack_inventory`:

```json
[
  { "type": "hint-scroll", "count": 3 },
  { "type": "focus-crystal", "count": 1 },
  { "type": "scholars-tome", "count": 0 },
  { "type": "solution-orb", "count": 0 }
]
```

A `useInventory` hook handles read/write.

### In-Room Hint Reveal

The `steps` array is **hidden by default** (previously always visible). A "Use Hint Scroll" button appears below the question:

- If player has ≥ 1 scroll: button is active, gold-coloured
- If player has 0 scrolls: button is grey, tooltip "Need a Hint Scroll — earn one by defeating a boss"
- Each tap: costs 1 scroll, reveals the next unrevealed step
- Steps revealed so far persist for the current question only (not saved to localStorage)

### Focus Crystal

Activating a Focus Crystal (from the DetailsPanel inventory) toggles `focusMode: true` in `localStorage`. While active:
- The hint button disappears from all rooms
- A small crystal icon on the HUD indicates focus mode is on
- Using another Focus Crystal toggles it back off (refunds the crystal)

### Scholar's Tome

Activating before entering a dungeon (from DetailsPanel): after any answered question (correct or wrong) the `explanation` modal shows automatically — even when the answer was correct. Costs 1 tome per dungeon session (not per question).

### Solution Orb

Activating mid-question (button appears below the question when player has ≥ 1 orb): reveals the correct answer highlighted in gold and shows the full `explanation` text beneath the question. The player still has to click the correct answer themselves — the orb reveals it, doesn't auto-submit. Costs 1 orb per room.

---

## New Files

| File | Responsibility |
|------|---------------|
| `src/hooks/useInventory.js` | Read/write inventory from localStorage |
| `src/components/MistakeModal.jsx` | Blocking explanation modal |
| `src/components/LootDrop.jsx` | Post-boss loot roll animation + result |
| `src/components/InventoryBar.jsx` | Item display + use buttons inside DetailsPanel |

## Modified Files

| File | Change |
|------|--------|
| `src/content/loadDungeon.js` | Sort rooms and boss questions by difficulty |
| `src/content/linear-algebra/dungeon-01-number-crypt.json` | Add `difficulty` + `explanation` to all rooms/boss |
| `src/content/calculus/dungeon-01-function-foothills.json` | Add `difficulty` + `explanation` to all rooms/boss |
| `src/content/statistics/dungeon-01-counting-cavern.json` | Add `difficulty` + `explanation` to all rooms/boss |
| `src/content/discrete-math/dungeon-01-logic-gate.json` | Add `difficulty` + `explanation` to all rooms/boss |
| `src/components/LessonRoom.jsx` | Hide steps by default, add Hint Scroll button + Solution Orb button |
| `src/components/BossFight.jsx` | Pass wrong-answer callback to trigger MistakeModal |
| `src/components/ResultScreen.jsx` | Trigger LootDrop after boss win |
| `src/components/DetailsPanel.jsx` | Add InventoryBar section |
| `src/App.jsx` | Handle loot roll result, pass inventory state down |

---

## What This Spec Does NOT Cover

- Training Ground (Sub-project 2)
- Visual / pixel art overhaul (Sub-project 3)
- Additional dungeon content beyond the 4 starter dungeons
