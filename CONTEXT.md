# MATHCRACK — Domain Glossary

MATHCRACK is a browser app that teaches mathematics — from K-12 pre-algebra through college-level statistics, probability, linear algebra, and quantitative methods — via a dark-fantasy RPG aesthetic. Progress is stored in `localStorage`. Users can optionally create an account (Supabase auth) to sync progress across devices; without an account the app runs in guest mode.

**Repository**: https://github.com/noaRoblesLevy/MATHCRACK — canonical source of truth for all progress and app state.

**Content coverage**: 13 Subjects fully authored at the pre-algebra level (48 Lessons). College-level Courses (Algebra, Probability & Statistics, Linear Algebra, Calculus, Discrete Math, Time Series, Quantitative Trading, Python/Data Analysis) are in active development.

---

## Glossary

### Course
The top-level grouping of related Subjects. One Course corresponds roughly to one textbook or academic discipline (e.g. "Pre-Algebra", "Probability & Statistics", "Python & Data Analysis"). Courses are displayed as sections on the Subjects map. The existing 13 pre-algebra Subjects belong to the **Pre-Algebra** Course.
> The pre-existing flat Subject list is preserved within a Course; no Subject structure changes.

### Subject
One of the 13 top-level math units (e.g. "Arithmetic & Number Types", "Graphing Lines"). A Subject groups related Lessons. Displayed on the **Subjects** tab.
> Internal code name: `kingdom` (legacy — do not use in new UI copy or domain discussion)

### Lesson
A single problem set within a Subject (e.g. "Types of Numbers"). A Lesson contains a Theory Card, 5 Rooms, and a Boss. Lessons unlock sequentially within a Subject; completing a Boss marks the Lesson complete and unlocks the next.
> Internal code name: `dungeon` (legacy)

### Practice
Free-drill mode for a Subject: pulls questions from all authored Lessons in that Subject and presents them ordered by difficulty (1 easy → 3 hard), cycling back to difficulty 1 when the pool is exhausted. Correct answers award half the normal Room XP. Accessed via the "Practice" button on a Subject screen.
> Internal code name: `training` (legacy)

### Library
The reading/theory tab. Contains numbered chapters (ch-01 through ch-68) covering each topic in prose, without gamification. Each chapter is the companion theory for exactly one Lesson. Learners can read a chapter before or after drilling the Lesson.

### Theory Card
A short embedded theory blurb (`lesson.title` + `lesson.body`) inside each Lesson JSON. Shown as a quick-reference primer at the start of a Lesson — a 2–4 sentence summary so the learner doesn't need to navigate to the Library.

### Room
A single question within a Lesson. A Lesson has exactly 5 Rooms (4 multiple-choice + 1 drag-and-drop), worked through sequentially. Each Room awards **10 XP** on a correct answer. Each Room carries a `difficulty` rating (1 = easy, 2 = medium, 3 = hard) used for adaptive ordering in Practice mode.

### Boss
The final challenge of a Lesson: a gauntlet of 3 harder questions. Pass mark is 2/3. Each correct Boss answer awards **25 XP**. Failing allows immediate retry; passing marks the Lesson complete.

Each Boss has a **name** (e.g. "The Numeromancer") and a **taunt** (one-line threat shown on the intro screen). The fight is preceded by a full-screen **Boss Intro** — the learner taps FIGHT to begin. During the fight, **Score Pips** (animated circles, one per question) track correct answers in real time.

Consumable items (Hint Scroll, Solution Orb) **cannot** be used during a Boss fight. The Boss is a skill checkpoint; item use during the fight is intentionally disabled.

### XP (Experience Points)
Numerical score accumulated by answering questions correctly. Rooms award 10 XP each; Boss questions award 25 XP each. A fully completed Lesson (5 rooms + 3 boss) can award up to 125 XP. XP determines the learner's current **Title**.

### Title (Tier)
The learner's rank, derived from total XP. Six tiers, scaled to span the full game (~8 000+ XP across all 13 Units):

| Title | XP range |
|---|---|
| Apprentice | 0 – 499 |
| Adept | 500 – 1 499 |
| Scholar | 1 500 – 3 499 |
| Sage | 3 500 – 6 499 |
| Archmage | 6 500 – 9 999 |
| Math Lich 💀 | 10 000+ |

### Loot
Item drops awarded after a Boss win. Each Boss JSON carries a `lootTable` array of `{ type, weight }` entries; one item is drawn by weighted random roll after a pass. Four item types exist:

| Item | Weight (regular) | Weight (finale) | Effect |
|---|---|---|---|
| Hint Scroll | 70 | 25 | Reveals the hint for a Room question |
| Focus Crystal | 20 | 35 | Activates Focus Mode |
| Scholar's Tome | 7 | 28 | Activates Scholar Mode (always shows explanations) |
| Solution Orb | 3 | 12 | Reveals the correct answer for a Room question |

Regular Lessons use the common-weighted table; the **final Lesson** of each Subject uses the premium table (Scholar's Tome and Solution Orb weighted higher). A loot drop is shown on the Result screen before the Continue button appears.

### Stub
A Lesson defined in `kingdoms.json` with `"stub": true` instead of a `"file"` path. Rendered as "SOON" and non-interactive. Stubs do not block progression. As of June 2026, no stubs remain in the app.

### Streak
Count of consecutive days the learner has met the **Daily Goal**. Displayed on the Subjects map. A **Streak Banner** appears once per browser session (sessionStorage flag) when streak ≥ 2, with copy that scales with streak length (Day 2 → Day 30+). The banner auto-dismisses after 4 seconds or on tap.

### Daily Goal
The minimum XP a learner must earn in a calendar day for their Streak to advance. Opening the app without earning XP does not extend the streak. The threshold is set low enough to be achievable in ~5 minutes of study.

### Welcome Overlay
A bottom-sheet shown to first-time users on their first visit to the Subjects map. Explains Rooms, Bosses, XP, and Loot in three bullets. Dismissed by tapping "Let's go →" or the backdrop. A `localStorage` flag (`mathcrack_welcomed`) prevents it from showing again.

### Result Screen
Shown after every Boss fight. Displays "Lesson Complete" or "Lesson Failed", a three-card breakdown (Questions correct, Boss score, XP earned), and the learner's current Title. On a pass, if a next Lesson exists in the same Subject, a "Next: [title] →" button offers direct continuation without returning to the Subject view.

On a **failed** Boss fight, a **Mistake Review** is available: an expandable list of the questions the learner answered incorrectly, showing the correct answer and explanation for each. Its purpose is to make the retry informed rather than reflexive.

### Mistake Review
Post-boss review mode available only on a failed Result Screen. Shows each incorrectly-answered Boss question with its correct answer and explanation. Not shown on a pass — forward momentum is preserved.

### Theme
Light/dark mode. Toggled via a toggle in the Profile tab. The selected theme is persisted to `localStorage` (`mathcrack-theme`). The theme state lives in a single `useTheme()` call in `App.jsx` and is passed down as props to `ProfileScreen` — no component other than `App` owns theme state.

### Coins
A spendable currency earned through gameplay, separate from XP. Coins never decrease XP or affect Title progression. Earned via: correct Room answers (small amount per answer), Boss pass (lump sum), Daily Goal met (daily bonus), and Streak milestones (large one-time payouts at 7/14/30-day streaks). Spent in the **Shop**.

### Shop
A fourth bottom-navigation tab where learners spend Coins. Sells: consumable Loot items (Hint Scroll, Focus Crystal, Scholar's Tome, Solution Orb), Streak Freezes, Flair, and Cosmetics. Replaces the loot-drop as the primary way to acquire items intentionally (loot drops remain as bonus rewards after Boss wins).

### Streak Freeze
A purchasable insurance item bought from the Shop. The learner activates it in advance; if they fail to meet the Daily Goal on a calendar day, the freeze absorbs the miss and is consumed — the Streak does not break. A learner who has no freeze equipped and misses the Daily Goal loses their Streak; there is no retroactive repair.

### Flair
A purchasable display label bought from the Shop. Shown alongside the earned Title on the Profile screen (e.g. "Archmage · The Procrastinator"). Flair is purely cosmetic — it does not affect XP, Title, or any gameplay mechanic. Multiple Flair items can be owned but only one equipped at a time.
> Distinct from **Title**, which is XP-derived and cannot be purchased.

### Cosmetic
A purchasable visual customisation bought from the Shop. Three types are supported: **Profile Icon** (an emoji/glyph shown on the Profile screen), **HUD Accent Color** (replaces the default blue room-progress dot color during Lessons), and **Premium Subject Card** (an enhanced visual treatment for completed Subject cards on the Subjects map). Cosmetics are purely visual and do not affect gameplay.

### Achievement
A named, one-time accomplishment awarded for a specific milestone. Displayed on the Profile screen alongside the Title ladder. The set is intentionally small (8–12 total) and focused on subject-completion milestones (e.g. "Conquer Arithmetic — complete all Arithmetic lessons") rather than accuracy streaks, which risk penalising learners who are genuinely struggling.

### Guest Mode
The default state when a user has not signed in. All progress is local to `localStorage`. Guest mode is fully functional; account creation is optional.

### Account (Auth)
Supabase-backed email/password authentication. Signing in syncs `localStorage` progress to the cloud and pulls it back on sign-in from a new device. Signing out does not erase local progress.
