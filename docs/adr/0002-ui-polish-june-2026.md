# ADR 0002 — UI/UX polish pass (June 2026)

**Date:** 2026-06-09  
**Status:** Accepted

## Context

All content and core mechanics were in place but the app lacked polish. A focused pass addressed 16 rough edges identified via structured Q&A against CONTEXT.md. This ADR records the non-obvious decisions made during that pass.

---

## Decision 1 — Boss XP is per correct answer, not flat

**Chosen:** `correctCount × 25 XP`  
**Rejected:** flat 75 XP regardless of performance

A flat reward gave the same outcome whether the learner got 1 or 3 correct. Per-answer XP makes the Boss feel consequential and consistent with Rooms (which also award per correct answer). `App.jsx` receives `correctCount` from `BossFight.onPass` / `BossFight.onFail` and credits accordingly.

---

## Decision 2 — Boss phase state is local to BossFight, not in the store

The intro → fighting transition is purely presentational. Storing it in Zustand would expose transient UI state to persistence. A local `useState('intro')` inside `BossFight.jsx` is sufficient and is reset naturally on unmount.

---

## Decision 3 — Theme state lives in one place (App.jsx)

`useTheme()` creates a `useState`. Calling it in both `App.jsx` and `ProfileScreen.jsx` created two independent state instances. When the user toggled in `ProfileScreen`, its instance updated, but App's synchronous render block (guarding against first-load flash) reset `data-theme` back to `'dark'` on the next navigation.

**Fix:** `useTheme()` is called only in `App.jsx`. `isDark` and `onToggleTheme` are passed as props to `ProfileScreen`. No other component calls `useTheme()`.

---

## Decision 4 — Welcome overlay uses localStorage; streak banner uses sessionStorage

| Flag | Storage | Reason |
|---|---|---|
| `mathcrack_welcomed` | `localStorage` | Must never show again after first visit |
| `mathcrack_streak_shown` | `sessionStorage` | Relevant once per browser session; re-shows on new tab/session without being annoying |

---

## Decision 5 — Resume state is read once at StudyScreen mount

`StudyScreen` reads `getProgress()[dungeonId]` via a `useState` initialiser (`useState(() => ...)`). This snapshot is stable for the lifetime of the screen. It does not subscribe to progress changes — if the user somehow completes a room while the study screen is visible, it would not re-derive. This is acceptable because the study screen is only shown before the lesson starts.

---

## Decision 6 — Loot tables: common vs. finale weighting

The final Lesson of each Subject uses a premium loot table. "Final Lesson" is defined as the last non-stub entry in a Subject's `dungeons` array in `kingdoms.json`. This is determined at authoring time (via the injection script), not at runtime. The weights are encoded directly in each Lesson JSON's `boss.lootTable` — there is no runtime differentiation by position.

---

## Decision 7 — Framer Motion must be mocked in component tests

`AnimatePresence mode="wait"` keeps exiting children in the DOM until exit animations complete. In jsdom there is no animation engine, so exit animations never complete and elements are never removed. Any test that asserts an element is absent after a phase transition must mock `framer-motion`:

```js
vi.mock('framer-motion', () => ({
  motion: { div: passThrough, button: passThrough, ... },
  AnimatePresence: ({ children }) => <>{children}</>,
}))
```

Affected test files: `BossFight.test.jsx`, `OverworldMap.test.jsx`. Apply the same mock to any future test file that covers a component using `AnimatePresence`.
