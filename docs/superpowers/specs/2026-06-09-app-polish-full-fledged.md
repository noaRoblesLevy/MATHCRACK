# PRD: App Polish — Full-Fledged Feel

## Problem Statement

MATHCRACK has all of its content and core mechanics in place, but the app does not yet feel like a complete, polished product. Learners encounter a series of disconnected rough edges that break immersion and reduce motivation:

- The Boss encounter — the climax of every Lesson — looks and feels identical to a regular Room question.
- After clearing a Boss, the Result screen uses internal jargon ("Dungeon Cleared!"), shows only a total XP number with no performance breakdown, and forces the learner back to the Subject view before they can start the next Lesson.
- The bottom navigation uses abstract symbols (◈ ◎ ◉) that no learner can identify without tapping each one.
- The loot system (Focus Crystal, Scholar's Tome, Hint Scroll, Solution Orb) exists in the code but never fires because every Lesson's `lootTable` is empty.
- A Lesson that is partially complete (3 of 5 Rooms done) looks identical to a fresh Lesson in both the Subject view and the Lesson list, so returning learners cannot tell where they left off.
- Abandoning a Lesson by tapping ✕ in the HUD is instant and silent — no confirmation — so accidental exits lose the session's progress.
- First-time users land on the map with 13 Subjects and no explanation of how the game loop works.
- Returning users with a streak receive no acknowledgment; completing all 13 Subjects triggers no end state.
- The XP tier thresholds in the Profile screen differed from the domain glossary (capped at 3 000 XP vs the correct 10 000 XP), causing learners to hit "Math Lich" halfway through the content.
- The Practice mode screen used hardcoded dark-theme hex colors that rendered incorrectly in light mode and called itself "Training Ground" in the UI while the rest of the app used "Practice."

## Solution

A focused polish pass that addresses every rough edge above without adding new features or changing the content structure:

- The Boss encounter gets a full-screen dramatic intro (boss name, personalised taunt, stakes display) that the learner dismisses with a "FIGHT" button before questions begin. During the fight, animated score pips replace the plain text counter.
- The Result screen uses domain-correct copy ("Lesson Complete / Lesson Failed"), shows a three-card breakdown (Rooms correct, Boss score, XP earned), and offers a direct "Next: [Lesson] →" button when a next Lesson exists in the same Subject.
- Navigation icons are replaced with recognisable emoji (🗺️ 📚 👤). The theme toggle is removed from the nav bar and consolidated into the Profile screen where it belongs.
- Every Boss's `lootTable` is populated: regular Lessons drop common items (hint-scroll weighted), and the final Lesson of each Subject drops premium items (Scholar's Tome and Solution Orb weighted higher).
- The Study screen detects prior progress and shows a contextual primary button: "Start Quiz →", "Continue (N/5) →", "Fight Boss →", or "Replay →". A quiet "Start Over" secondary button appears when resuming.
- The Lesson list in the Subject view shows room-level progress pips (five dots, filled for completed Rooms) on any in-progress Lesson. The Subjects map shows a thin progress bar per Subject row once any Lesson is complete.
- The HUD ✕ button expands into an inline confirmation ("Leave lesson? Progress so far is saved." + Leave / Stay) instead of navigating immediately.
- First-time learners see a bottom-sheet welcome overlay on their first visit to the Subjects map, explaining the loop in three bullets. It is dismissed with "Let's go →" or a backdrop tap and never shown again.
- A streak banner (dismissible, auto-expires after 4 seconds, once per browser session) appears on the Subjects map for learners with a streak of 2 or more days.
- When all 13 Subjects are complete, a Math Lich trophy card appears above the Subject list.
- The Profile screen XP tier thresholds are corrected to match the domain glossary (Apprentice 0–499, Adept 500–1 499, Scholar 1 500–3 499, Sage 3 500–6 499, Archmage 6 500–9 999, Math Lich 10 000+).
- Practice mode is renamed to "Practice" throughout the UI and its hardcoded hex colours are replaced with CSS variables so the screen respects light/dark theme.

## User Stories

1. As a learner encountering a Boss for the first time, I want a dramatic full-screen intro so that I feel the weight of the challenge before the questions begin.
2. As a learner, I want each Boss to have a unique name and taunt so that each encounter feels distinct and personalised.
3. As a learner on the Boss intro screen, I want to see the number of questions, the pass mark, and the maximum XP at stake so that I can set my expectations before I tap FIGHT.
4. As a learner, I want to tap "FIGHT" to start the Boss questions so that I can start on my own terms.
5. As a learner fighting a Boss, I want animated score pips that fill as I answer correctly so that I can track my progress at a glance.
6. As a learner who has just beaten a Boss, I want the Result screen to say "Lesson Complete" (not "Dungeon Cleared") so that the language matches what I see everywhere else in the app.
7. As a learner who failed a Boss, I want the Result screen to say "Lesson Failed" so that the outcome is clearly communicated.
8. As a learner on the Result screen, I want to see how many Questions and Boss questions I answered correctly alongside my XP earned so that I can evaluate my performance.
9. As a learner who has just passed a Boss, I want a "Next: [Lesson Title] →" button so that I can continue without navigating back through the Subject view.
10. As a learner who is the last Lesson in a Subject, I want a "Back to subject" button so that I can review the completed Subject.
11. As a new learner, I want the bottom navigation icons to be immediately recognisable so that I can find the Subjects, Library, and Profile tabs without guessing.
12. As a learner, I want the theme toggle in one consistent location (Profile) so that I am not confused by seeing it in two places.
13. As a learner who clears a Boss, I want to receive a loot drop so that the RPG reward loop feels real.
14. As a learner who clears the final Lesson of a Subject, I want a higher chance of receiving premium loot (Scholar's Tome, Solution Orb) so that finishing a Subject feels meaningfully different.
15. As a returning learner, I want to see which Lessons I have partially completed in the Subject view so that I know exactly where to resume.
16. As a learner, I want in-progress Lessons to show room-level progress pips so that I can see how far through a Lesson I got.
17. As a returning learner opening a partially-completed Lesson's Study screen, I want a "Continue (N/5) →" button so that I do not have to restart from the beginning.
18. As a learner who completed all Rooms but has not yet beaten the Boss, I want a "Fight Boss →" button on the Study screen so that I am taken directly to the challenge.
19. As a learner who has already completed a Lesson, I want a "Replay →" button on the Study screen so that I can re-attempt it for practice.
20. As a learner on the Study screen who resumed, I want a quiet "Start Over" option so that I can restart if I want to.
21. As a learner in the middle of a Lesson, I want the ✕ button to ask me to confirm before exiting so that I do not lose my session progress by accident.
22. As a learner who confirms an exit, I want to be reassured that my completed Rooms are saved so that I feel safe leaving.
23. As a first-time learner arriving at the Subjects map, I want a brief welcome overlay that explains the game loop so that I understand what Rooms, Bosses, XP, and Loot are before I start.
24. As a returning learner with a streak of 2 or more days, I want a short streak acknowledgment on the Subjects map so that I feel recognised for returning consistently.
25. As a learner with a long streak, I want the acknowledgment message to reflect my achievement level so that milestones feel distinct.
26. As a learner who has completed all 13 Subjects, I want a Math Lich trophy card on the Subjects map so that my achievement is permanently visible.
27. As a learner checking my Profile, I want the XP tier thresholds to correctly reflect the full game scale (top tier at 10 000 XP) so that my Title reflects my true progress.
28. As a learner using Practice mode, I want the screen to be labelled "Practice" consistently with the rest of the app.
29. As a learner using light mode, I want Practice mode to respect the theme so that it does not display broken dark-mode colours.
30. As a learner viewing the Subjects map, I want each Subject row to show a thin progress bar when I have completed at least one Lesson so that I can see my progress across all Subjects at a glance.

## Implementation Decisions

### Boss encounter data model
Each Lesson JSON's `boss` object gains two new string fields: `name` (the boss's RPG title, e.g. "The Numeromancer") and `taunt` (a one-line threat, e.g. "Your number sense is pathetically weak."). All 63 Lesson files are updated. The `lootTable` array on each `boss` object is also populated: regular Lessons use a common-weighted table (hint-scroll 70, focus-crystal 20, scholars-tome 7, solution-orb 3); the final Lesson of each Subject uses a premium table (hint-scroll 25, focus-crystal 35, scholars-tome 28, solution-orb 12).

### BossFight phase state machine
The BossFight component gains a two-phase internal state: `intro` and `fighting`. On mount, `intro` is active. Tapping FIGHT transitions to `fighting`. This is a local component state; no store changes are needed.

### Boss XP calculation
Boss XP is now calculated per correct answer (`correctCount × 25`) rather than a flat 75. `onPass` and `onFail` in App receive the correct count from BossFight and App tracks it in `bossScore` state.

### Result screen data flow
App tracks two new pieces of state: `roomsCorrect` (incremented per correct Room answer) and `bossScore` (`{ correct, total }`). Both are reset on `handleSelectDungeon`. The ResultScreen receives `lessonTitle`, `totalRooms`, `roomsCorrect`, `bossScore`, `nextLessonTitle`, and `onNextLesson` props.

### Next Lesson derivation
App computes `nextDungeon` reactively: it looks up the current dungeon's position in its Subject's non-stub dungeon list and returns the next entry, or `null` if the current is last. `handleNextLesson` loads the next dungeon data, resets session state, and calls `startStudy`.

### Study screen resume state
StudyScreen reads `getProgress()[dungeonId]` once at mount via a `useState` initialiser. It derives four states from `completedRooms` and `bossComplete`:
- Not started → "Start Quiz →" / `onStart`
- In progress → "Continue (N/5) →" / `onResume(completedRooms)` + "Start Over"
- All rooms done, no boss → "Fight Boss →" / `onResume('boss')` + "Start Over"
- Complete → "Replay →" / `onStart`

App handles `onResume`: if `fromRoom === 'boss'` it calls `startBoss()`; otherwise it calls the new `resumeLesson(startRoom)` store action and sets `roomsCorrect` to `startRoom` to credit already-completed Rooms.

### gameStore addition
A `resumeLesson(startRoom)` action sets `currentRoom: startRoom, activeView: 'lesson'`.

### KingdomView progress
KingdomView calls `getProgress()` once at component mount and derives `roomsDone` and `inProgress` per dungeon row. In-progress rows show a `RoomPips` component (five rectangles, filled for completed Rooms, using the Subject's colour).

### OverworldMap additions
Three independent additions:
- **Subject progress bar**: a 2 px bar rendered below the subtitle inside the text block, visible only when `completed > 0`.
- **Streak banner**: rendered via `useState(() => streak >= 2 && !sessionStorage.getItem(STREAK_SHOWN_KEY))`. Auto-dismissed after 4 seconds via `useEffect`. Message copy scales with streak length (Day 2 / Day 3 / Day 7+ / Day 14+ / Day 30+).
- **Completion trophy**: rendered when `completedSubjects === kingdoms.length && kingdoms.length > 0`. Static; no dismiss.
- **Welcome overlay**: rendered via `useState(() => !localStorage.getItem(WELCOMED_KEY))`. A bottom-sheet with three bullets and a "Let's go →" button. Dismissed by button tap or backdrop tap; sets `localStorage` flag permanently.

### HUD confirmation
HUD gains `const [confirming, setConfirming] = useState(false)`. When `confirming` is true, the HUD content is replaced with a confirmation message and Leave / Stay buttons. The border transitions to `var(--danger)`.

### CSS and naming
All hardcoded hex colours in TrainingGround are replaced with CSS variables. The "Training Ground" label is renamed to "PRACTICE". The theme toggle is removed from BottomNav; the component no longer accepts `isDark` or `onToggleTheme` props. BottomNav tab icons are updated to emoji: 🗺️, 📚, 👤.

### XP tier fix
The `TIERS` constant in ProfileScreen is corrected to match `useXP.js` and CONTEXT.md: thresholds at 0 / 500 / 1 500 / 3 500 / 6 500 / 10 000.

## Testing Decisions

Good tests for this work verify **observable component behaviour from the outside** — what the user sees and can interact with — not internal state or implementation details.

### StudyScreen — resume state
Test the four button configurations by rendering with different `dungeonId` values and mocking `getProgress` to return each progress state (empty, partial, all rooms, boss complete). Assert the primary button label and that the correct callback fires on click. Prior art: `src/components/StudyScreen.test.jsx`.

### BossFight — phase transition
Render with a mock `boss` object. Assert the intro screen renders the boss name, taunt, and FIGHT button. Simulate a FIGHT button click and assert the question is rendered. Prior art: `src/components/TrainingGround.test.jsx` (exercises LessonRoom via a wrapper component).

### ResultScreen — pass/fail rendering
Render with `passed={true}` and `passed={false}`. Assert "Lesson Complete" / "Lesson Failed" copy. Assert stat card values. Assert "Next: [title] →" button renders when `onNextLesson` is provided and is absent when it is `null`. Prior art: `src/components/LootDrop.test.jsx` (conditional rendering test).

### HUD — exit confirmation
Render with a mock `onBack`. Assert ✕ is visible. Click ✕ and assert "Leave lesson?" text appears and `onBack` has not been called. Click "Stay" and assert the confirmation message disappears. Click ✕ again and click "Leave" and assert `onBack` was called. Prior art: `src/components/MistakeModal.test.jsx`.

### OverworldMap — overlays
Mock `localStorage` and `sessionStorage`. Test that the welcome overlay renders when the localStorage flag is absent and does not render when it is present. Test that the streak banner renders when `streak >= 2` and `sessionStorage` flag is absent. Test that the completion trophy renders when all subjects are flagged complete. Prior art: `src/components/OverworldMap.test.jsx`.

## Out of Scope

- Sound effects or haptic feedback.
- Push notifications for streak reminders.
- Animated loot collection beyond the existing LootDrop component.
- Onboarding flow for the Library or Practice tabs.
- Leaderboards or social features.
- Backend changes to the Supabase schema (all changes are client-side and localStorage-based).
- New question types beyond multiple-choice and drag-and-drop.
- Changes to the content of any Lesson, Room, or Boss question.

## Further Notes

All data changes (boss `name`, `taunt`, and `lootTable` fields) were applied to the 63 Lesson JSON files via a one-shot Node.js injection script that was deleted after use. The boss names and taunts follow a consistent dark-fantasy naming convention (e.g. "The Numeromancer", "The Equation Lich") and scale in thematic difficulty with the subject matter.

The `resumeLesson` store action does not persist to `localStorage` (it is excluded from `partialize`), consistent with all other transient navigation state in the store.

The streak banner uses `sessionStorage` (resets on tab close) while the welcome overlay uses `localStorage` (permanent). This distinction is intentional: the streak message is relevant every new session but would become noise if shown every page load within the same session; the welcome overlay must never repeat after the first visit.
