# PRD — App Quality Improvements
**Date:** 2026-06-08  
**Status:** Ready for implementation

---

## Problem Statement

As a learner using MATHCRACK on mobile and across both light and dark themes, I encounter several bugs that degrade the experience: the theme toggle is buried on the Profile screen so I can't switch themes from anywhere else in the app; drag-and-drop questions are completely non-functional on touch screens; the result screen understates the XP I earned; and loot items drop on every boss win even though the loot system isn't ready. Several UI surfaces also have minor inconsistencies that accumulate into a rough feel.

---

## Solution

Fix eight confirmed bugs and UX issues identified through code review and grilling:

1. Move the theme toggle to the bottom navigation bar so it is accessible from any screen.
2. Replace hardcoded dark-red hex values in the Boss fight header and fail-state result screen with CSS variables so they respect the active theme.
3. Add proper touch drag support to drag-and-drop Rooms so mobile learners can reorder items.
4. Disable loot drops when a Lesson's `lootTable` is empty, so loot is only awarded when it has been intentionally authored.
5. Show total session XP (all Rooms + Boss) on the result screen, not just the Boss reward.
6. Remove the duplicate "Notes" button from the `StudyScreen` action row.
7. Fix the Subjects screen progress counter to update reactively when Lesson completion changes.
8. Replace the legacy `var(--font)` alias with `var(--font-mono)` in the result screen.

---

## User Stories

1. As a learner, I want to switch between light and dark mode from the bottom navigation bar, so that I do not have to navigate to my Profile every time I want to change the theme.
2. As a learner, I want the theme toggle to be visible on every screen, so that I always know which mode is active.
3. As a mobile learner, I want to drag items to reorder them in drag-and-drop questions using my finger, so that I can answer these questions on my phone.
4. As a mobile learner, I want the dragged item to follow my finger visually, so that I have clear feedback about where I am dropping it.
5. As a learner, I want the Boss fight header and fail state to use colours consistent with the active theme, so that the dark-red header does not look broken in light mode.
6. As a learner, I want the result screen to show the total XP I earned across the entire Lesson (all Rooms plus the Boss), so that the reward reflects my full effort.
7. As a learner, I want loot to only drop when it has been set up for a Lesson, so that items do not appear unexpectedly before the loot system is ready.
8. As a learner on the Study screen, I want a single "Study Notes" toggle, not two buttons that do the same thing, so that the interface is not confusing.
9. As a learner returning to the Subjects screen after completing a Lesson, I want the progress counter to reflect my latest completion without needing to reload the page.
10. As a learner, I want all text on the result screen to render in the correct monospace font, consistent with the rest of the app.

---

## Implementation Decisions

### 1. Theme toggle placement
- `App.jsx` currently calls `useTheme()` but discards the return value. It must capture `{ isDark, toggle }` and pass them as props to `BottomNav`.
- `BottomNav` already contains a `ThemeToggle` sub-component that accepts `isDark` and `onToggle` props but is never rendered. Wire it into the nav's JSX.
- The toggle in `ProfileScreen` can remain as a secondary access point (it is already functional there).

### 2. Boss / fail-state theming
- `BossFight` header: replace hardcoded `#450a0a` (background), `#dc2626` (border), `#fca5a5` (text) with `var(--danger-bg)`, `var(--danger)`, and `var(--text)` respectively.
- `ResultScreen` fail state: replace hardcoded `#ef4444` (heading colour), `#7f1d1d` (button background), `#ef4444` (button border), `#fca5a5` (button text) with CSS variables from the danger palette.

### 3. Touch drag-and-drop
- Implement `onTouchStart`, `onTouchMove`, `onTouchEnd` handlers on each drag item alongside the existing mouse drag handlers.
- On `touchmove`, compute the current touch position via `e.touches[0]`, use `document.elementFromPoint` to find the target slot, and update the order state in real time (same logic as `handleDrop`).
- Visually clone or elevate the dragged item during touch drag so the learner sees it following their finger.
- The existing `order` state and `handleDrop` logic can be reused; only the event binding layer changes.

### 4. Loot gating
- `rollLoot(lootTable)`: when `lootTable` is an empty array, return `null` immediately instead of falling back to `DEFAULT_LOOT`.
- The existing `DEFAULT_LOOT` constant is retained for when dungeons are eventually authored with loot tables.
- `App.jsx` already handles `null` loot correctly (`setLootDrop(drop)` where `drop` can be null, and `ResultScreen` only renders `LootDrop` when `lootDrop` is truthy).

### 5. Total session XP on result screen
- Add a `sessionXP` local state variable in `App.jsx`, initialised to `0` when a Lesson starts (`startStudy`).
- Accumulate it in `handleRoomComplete` for correct answers and in `handleBossPass` for the boss reward.
- Reset `sessionXP` to `0` in `handleContinue` and whenever a new Lesson begins.
- Pass the accumulated value as `xpGained` to `ResultScreen` instead of `lastXPGain` from the store.

### 6. StudyScreen Notes button
- Remove the Notes button from the two-button action row in `StudyScreen`. The row then only contains "Start Quiz →".
- The collapsible panel toggle at the top of the screen remains as the sole way to expand Study Notes.

### 7. OverworldMap reactivity
- The inline `localStorage.getItem` call inside the `.filter` callback is replaced with the existing `isDungeonComplete(d.id)` import (already used correctly in `KingdomView`).
- No new hooks or state required — `isDungeonComplete` reads from `localStorage` via the shared progress module; the component re-renders when the store updates.

### 8. Font variable
- `ResultScreen`: two occurrences of `var(--font)` replaced with `var(--font-mono)`. `var(--font)` is a legacy alias defined in `App.css` that may be removed in future.

---

## Testing Decisions

**What makes a good test here:** test observable behaviour and return values, not internal implementation. For logic functions, test inputs → outputs directly. For components, test what the user sees and what happens when they interact.

### Modules to test

**`useInventory` (unit — `useInventory.test.js`)**  
Extend the existing `rollLoot` describe block:
- `rollLoot([])` must return `null` (currently this test asserts it returns a valid item type — that assertion must be inverted).
- `rollLoot` with a non-empty table must continue to return an item from that table.

**`gameStore` (unit — `gameStore.test.js`)**  
No store changes are needed for session XP (it is tracked in App local state), so no new store tests are required.

**`StudyScreen` (component — new `StudyScreen.test.jsx`)**  
Pattern: same render + `screen.getBy*` style as `KingdomView.test.jsx` and `MistakeModal.test.jsx`.
- When a Lesson has a `lesson.body`, exactly one "Study Notes" toggle button is rendered (not two).
- The "Start Quiz" button is always rendered.

**`OverworldMap` (component — new `OverworldMap.test.jsx`)**  
- Mock `isDungeonComplete` to return `true` for a given dungeon ID and assert the completion count in the rendered output reflects it.
- Pattern: same vi.mock approach as `KingdomView.test.jsx`.

**`DragAndDrop` (manual / integration)**  
JSDOM does not fully simulate touch events; automated testing of drag reordering is low value here. Verify manually in a real mobile browser.

---

## Out of Scope

- Adding new loot table content to any Lesson JSON files (loot system authoring is a separate future task).
- The bidirectional `chapterRef` / `lessonRef` link between Library chapters and Lessons (tracked in ADR 0001).
- The adaptive difficulty ordering in Practice mode (the `difficulty` field on Rooms exists but the adaptive algorithm is not part of this PRD).
- Any new features, content authoring, or visual redesign beyond the eight fixes listed above.

---

## Further Notes

- The Boss fight has been confirmed as intentionally inescapable — no back button will be added.
- The legacy `kingdom` / `dungeon` / `training` internal code names are not being renamed in this pass; they are documented as legacy in `CONTEXT.md`.
- All eight fixes are independent and can be implemented and reviewed in any order.
