# Training Ground — Design Spec

**Goal:** Add a per-kingdom study mode where players can practice questions from all dungeons in a kingdom with lesson theory, infinite shuffled loops, and half-XP rewards.

**Architecture:** A new `TrainingGround.jsx` view is added alongside the existing dungeon/boss views. The game store gets two minimal additions (`startTraining` / `stopTraining`). All question and lesson data lives in the existing dungeon JSON files — no new data layer.

**Approach chosen:** Option A — new view, minimal store changes, no new hooks or abstractions. Training state is local to the component and is not persisted.

---

## Data

### `lesson` field in dungeon JSON

Each dungeon file gains a top-level `lesson` object:

```json
"lesson": {
  "title": "Integers",
  "body": "An integer is a whole number with no fractional part. It can be negative, zero, or positive (…−2, −1, 0, 1, 2…). Decimals and fractions are NOT integers."
}
```

All four existing dungeon files must be updated:
- `src/content/dungeons/number-crypt.json`
- `src/content/dungeons/function-foothills.json`
- `src/content/dungeons/counting-cavern.json`
- `src/content/dungeons/logic-gate.json`

If a dungeon has no `lesson` field, the theory panel is hidden for questions from that dungeon — no crash, no empty panel.

---

## Store Changes (`src/store/gameStore.js`)

Two new fields and two new actions. Neither field is persisted (partialize unchanged).

| Addition | Type | Purpose |
|---|---|---|
| `trainingKingdom` | `string \| null` | ID of the kingdom being trained |
| `startTraining(kingdomId)` | action | Sets `trainingKingdom` + `activeView: 'training'` |
| `stopTraining()` | action | Clears `trainingKingdom` + sets `activeView: 'kingdom'` |

---

## Components

### `KingdomView.jsx` — Train button

A "Train" button is added next to the dungeon list header. It is always visible when the kingdom has at least one dungeon (no unlock gate). Clicking it calls `startTraining(activeKingdom)`.

### `TrainingGround.jsx` (new)

**Responsibilities:**
- Load all dungeons for `trainingKingdom` using `loadDungeon` + `kingdomMap`
- Flatten all dungeon rooms into one question pool, tagging each with its source dungeon's `lesson`
- Shuffle the pool (Fisher-Yates) and loop infinitely
- Render `LessonRoom` with XP halved
- Show a collapsible theory panel above the question

**Local state:**
- `pool` — shuffled array of `{ ...room, lesson }`
- `idx` — current position in pool
- `correct` — session correct count
- `total` — session questions answered
- `theoryOpen` — whether the theory panel is expanded

**Pool construction:**
```js
const pool = dungeons.flatMap(dungeon =>
  dungeon.rooms.map(room => ({ ...room, lesson: dungeon.lesson }))
)
```

Boss questions are excluded.

**Advance logic:**
```js
function advance() {
  if (idx + 1 >= pool.length) {
    setPool(shuffle([...pool]))
    setIdx(0)
  } else {
    setIdx(idx + 1)
  }
}
```

**XP halving — at the call site:**
```js
<LessonRoom
  room={pool[idx]}
  onComplete={(xp, correct) => {
    handleAnswer(Math.floor(xp / 2), correct)
  }}
/>
```

No changes to `LessonRoom` or `addXP`.

**Theory panel behaviour:**
- Starts collapsed
- Tap header to toggle open/closed
- Auto-collapses when the question advances to one from a different dungeon (topic-change signal)
- Collapsed bar shows `lesson.title`; expanded shows `lesson.body`
- Hidden entirely if the current question has no `lesson`

**Layout:**
```
┌─────────────────────────────────────────────┐
│  ← Back to Kingdom          Training Ground  │
│  ✓ 4 correct   |   12 questions done         │
├─────────────────────────────────────────────┤
│  📖 Integers — tap to expand            ▼   │
│  (expanded: lesson body text here)           │
├─────────────────────────────────────────────┤
│                                              │
│   LessonRoom (current question)              │
│                                              │
└─────────────────────────────────────────────┘
```

- Back button calls `stopTraining()` — no confirmation, session progress is not persisted
- Stats bar (correct count, total done) resets each session
- XP toasts still fire (half XP) so players see reward feedback
- `MistakeModal` appears on wrong answers as usual (already wired into `LessonRoom`)

---

## Routing

`App.jsx` adds a new branch in the view switch:

```js
case 'training':
  return <TrainingGround />
```

`TrainingGround` reads `trainingKingdom` from the store directly (like other views read `activeKingdom`).

---

## Edge Cases

| Case | Behaviour |
|---|---|
| Kingdom with one dungeon | Pool is that dungeon's rooms. Theory panel never auto-collapses (topic never changes). |
| Dungeon missing `lesson` | Theory panel hidden for those questions. |
| Pool of 1 question | Loops correctly — reshuffle a pool of 1 is a no-op. |
| Player leaves mid-session | `stopTraining()` resets state. No data loss (XP already added per question). |

---

## Out of Scope

- Per-session summary screen (infinite mode has no natural end)
- Bookmarking or saving training progress
- Training XP contributing to dungeon completion
- Filtering by difficulty within training mode
