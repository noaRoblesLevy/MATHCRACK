# MATHCRACK — Design Spec
**Date:** 2026-04-30  
**Status:** Approved  

---

## Overview

MATHCRACK is a personal-use browser webapp that teaches mathematics through a dark-fantasy pixel-art RPG. It takes a complete beginner from zero math experience to master's-level CS mathematics across four subjects: Linear Algebra, Calculus, Statistics & Probability, and Discrete Math. Learning is structured as an overworld map with kingdoms, dungeons, and boss fights. Progress is stored in `localStorage` — no backend, no accounts.

---

## Tech Stack

- **Framework:** React + Vite
- **Math rendering:** KaTeX (renders LaTeX expressions at any size, always readable)
- **Animations:** Framer Motion (room transitions, XP pop-ups, boss fight effects)
- **State management:** Zustand (lightweight global store for XP, progress, active dungeon)
- **Storage:** localStorage (all progress persisted client-side)
- **Style:** Plain CSS (dark fantasy palette, monospace font, pixel-art aesthetic)

---

## Architecture

Three layers:

1. **Content layer** — JSON files in `src/content/` define every kingdom, dungeon, room, and boss. No code changes needed to add or edit problems.
2. **Game engine** — Zustand store + `localStorage` hooks manage XP, level, dungeon unlock state, streak, and inventory slots.
3. **UI layer** — React components render the map, lesson rooms, and boss fights. KaTeX handles all math notation.

---

## File Structure

```
MATHCRACK/
├── src/
│   ├── content/
│   │   ├── linear-algebra/
│   │   │   ├── dungeon-01-number-crypt.json
│   │   │   ├── dungeon-02-equation-vault.json
│   │   │   └── ... (18 dungeons)
│   │   ├── calculus/          (20 dungeons)
│   │   ├── statistics/        (20 dungeons)
│   │   └── discrete-math/     (20 dungeons)
│   │
│   ├── components/
│   │   ├── OverworldMap.jsx     — 4 kingdom nodes, locked/active/complete states
│   │   ├── KingdomView.jsx      — dungeon list within a kingdom
│   │   ├── LessonRoom.jsx       — split layout: question left, answers right
│   │   ├── BossFight.jsx        — 3-question gauntlet, requires 2/3 to pass
│   │   ├── ResultScreen.jsx     — XP gain animation, dungeon complete seal
│   │   ├── HUD.jsx              — top bar: dungeon name, streak, XP reward
│   │   └── DetailsPanel.jsx     — slide-out panel: level, total XP, inventory
│   │
│   ├── hooks/
│   │   ├── useProgress.js       — read/write dungeon/boss completion to localStorage
│   │   └── useXP.js             — XP accumulation, level thresholds, title lookup
│   │
│   ├── store/
│   │   └── gameStore.js         — Zustand store: xp, level, streak, activeView
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── docs/superpowers/specs/
├── index.html
├── vite.config.js
└── package.json
```

---

## Game World Structure

**78 total dungeons × (5 rooms + 1 boss) = 468 lesson problems**

### Kingdom 1 — The Realm of Vectors (Linear Algebra, 18 dungeons)
| # | Title | Topics |
|---|-------|--------|
| 01 | The Number Crypt | Integers, rationals, reals, number line |
| 02 | The Equation Vault | Variables, solving linear equations |
| 03 | Coordinate Sanctum | Coordinate systems, plotting, geometry |
| 04 | Vector Caverns | Vectors, magnitude, direction |
| 05 | Vector Operations | Addition, scaling, dot product |
| 06 | The Matrix Gate | Matrices as grids, reading/writing |
| 07 | Matrix Operations | Addition, scalar multiplication, matrix multiplication |
| 08 | The System Labyrinth | Systems of equations, substitution, elimination |
| 09 | Gaussian Fortress | Row reduction, Gaussian elimination, RREF |
| 10 | Determinant Depths | 2×2 and 3×3 determinants, geometric meaning |
| 11 | The Vector Space | Span, linear independence, subspaces |
| 12 | Basis & Dimension Crypts | Basis, rank, nullity, rank-nullity theorem |
| 13 | Transformation Tower | Linear maps, kernel, image |
| 14 | Eigenvalue Abyss | Characteristic polynomial, eigenvalues, eigenvectors |
| 15 | Diagonalization Domain | Diagonalization, change of basis |
| 16 | Orthogonality Halls | Orthogonal vectors, projections, Gram-Schmidt |
| 17 | The SVD Spire | Singular value decomposition, pseudoinverse |
| 18 | Master's Vault | PCA, quadratic forms, positive definiteness |

### Kingdom 2 — The Calculus Keep (20 dungeons)
| # | Title | Topics |
|---|-------|--------|
| 01 | Function Foothills | Functions, domain, range, graphs |
| 02 | The Limit Hollow | Intuition of limits, one-sided limits |
| 03 | Continuity Catacombs | Continuous functions, discontinuities, IVT |
| 04 | Derivative Den | Rate of change, tangent line, definition |
| 05 | Differentiation Rules | Power, sum, constant rules |
| 06 | Chain Rule Crypt | Chain, product, quotient rules |
| 07 | Applications Citadel | Optimization, related rates, curve sketching |
| 08 | Integral Vault | Riemann sums, area under curve |
| 09 | Antiderivative Alcove | Indefinite integrals, basic rules |
| 10 | The FTC Stronghold | Fundamental theorem of calculus I & II |
| 11 | Integration Techniques | Substitution, integration by parts, partial fractions |
| 12 | Infinite Spire | Sequences, series, convergence tests |
| 13 | Taylor's Tower | Taylor & Maclaurin series, power series |
| 14 | Multivariable Maze | Functions of 2+ variables, surfaces, level curves |
| 15 | Partial Derivative Pass | Partial derivatives, gradient, directional derivative |
| 16 | Optimization Outpost | Lagrange multipliers, saddle points, Hessian |
| 17 | Multiple Integral Mines | Double/triple integrals, change of variables |
| 18 | Vector Calculus Vaults | Divergence, curl, Green's/Stokes'/Divergence theorems |
| 19 | ODE Observatory | First/second order ODEs, separation of variables |
| 20 | Master's Lair | Laplace transforms, systems of ODEs, stability |

### Kingdom 3 — The Statistics Sanctum (20 dungeons)
| # | Title | Topics |
|---|-------|--------|
| 01 | Counting Cavern | Counting principles, permutations, combinations |
| 02 | Probability Pit | Sample spaces, events, axioms |
| 03 | Conditional Crypt | Conditional probability, independence |
| 04 | Bayes' Bastion | Bayes' theorem, prior/posterior |
| 05 | Random Variable Ridge | Discrete RVs, PMF, CDF |
| 06 | Expected Value Enclave | Expectation, variance, standard deviation |
| 07 | Discrete Distributions | Bernoulli, Binomial, Geometric, Poisson |
| 08 | Continuous Domains | PDF, CDF, Uniform, Exponential |
| 09 | The Normal Nexus | Normal distribution, Z-scores, standard normal |
| 10 | CLT Citadel | Central Limit Theorem, sampling distributions |
| 11 | Estimation Enclave | Point estimates, MLE, method of moments |
| 12 | Confidence Corridor | Confidence intervals, margin of error |
| 13 | Hypothesis Halls | Null/alt hypothesis, p-values, type I/II errors |
| 14 | Testing Temple | t-tests, chi-square, ANOVA |
| 15 | Regression Ruins | Linear regression, least squares, R² |
| 16 | Multiple Regression Maze | Multiple regression, multicollinearity |
| 17 | Bayesian Battlements | Bayesian inference, conjugate priors |
| 18 | Markov Monastery | Markov chains, steady state, transition matrices |
| 19 | Information Inferno | Entropy, KL divergence, mutual information |
| 20 | Master's Oracle | EM algorithm, variational inference, Gaussian processes |

### Kingdom 4 — The Discrete Dungeon (20 dungeons)
| # | Title | Topics |
|---|-------|--------|
| 01 | Logic Gate | Propositions, connectives, truth tables |
| 02 | Predicate Passage | Predicates, quantifiers, logical equivalence |
| 03 | Proof Pit | Direct proof, contradiction, contrapositive |
| 04 | Induction Lair | Weak & strong induction, well-ordering |
| 05 | Set Sanctum | Sets, operations, power set, Venn diagrams |
| 06 | Relation Realm | Relations, equivalence classes, partial orders |
| 07 | Function Fields | Injective, surjective, bijective, inverse |
| 08 | Counting Crypt | Advanced counting, inclusion-exclusion, pigeonhole |
| 09 | Combinatorics Castle | Generating functions, Stirling numbers, Catalan |
| 10 | Number Theory Nexus | Divisibility, GCD, primes, fundamental theorem |
| 11 | Modular Maze | Modular arithmetic, congruences, Chinese Remainder |
| 12 | Cryptography Crypt | RSA, Diffie-Hellman, discrete log problem |
| 13 | Graph Grotto | Graph definitions, paths, cycles, connectivity |
| 14 | Tree Tunnels | Trees, spanning trees, Prüfer sequences |
| 15 | Algorithm Alcove | BFS, DFS, Dijkstra, complexity of graph algorithms |
| 16 | Recurrence Ridge | Recurrences, Master theorem, characteristic roots |
| 17 | Automata Arena | DFA, NFA, regular expressions, Kleene's theorem |
| 18 | Grammar Graveyard | Context-free grammars, pushdown automata, parsing |
| 19 | Complexity Citadel | P, NP, NP-completeness, reductions |
| 20 | Master's Sanctum | Computability, halting problem, Rice's theorem |

---

## Gamification System

### XP & Levels
| Title | XP Range |
|-------|----------|
| Apprentice | 0 – 99 |
| Adept | 100 – 299 |
| Scholar | 300 – 699 |
| Sage | 700 – 1,499 |
| Archmage | 1,500 – 2,999 |
| Math Lich 💀 | 3,000+ |

- Correct room answer (multiple choice): **+10 XP**
- Correct room answer (drag-and-drop): **+20 XP**
- Boss fight win: **+75 XP** + dungeon completion badge
- Wrong answer: no XP lost, no lives system

### Dungeon Progression
- 5 rooms per dungeon, then 1 boss fight unlocks
- Boss fight: 3 harder multi-step questions, must score **2/3** to pass
- Failing the boss: retry immediately, no penalty — shows which concepts need review
- Completing a dungeon: unlocks the next dungeon in the kingdom
- Completing all dungeons in a kingdom: unlocks the next kingdom

### Progress Map
- Overworld shows 4 kingdoms as distinct dark-fantasy regions
- Dungeon nodes: `locked` (skull icon, dark) / `active` (glowing) / `complete` (golden seal)
- Tapping a kingdom opens its dungeon list
- Details panel (slide-out button): shows level, total XP, XP to next level, inventory

### Streaks
- Daily streak counter, cosmetic only — flame icon on the HUD
- Missing a day resets the counter but no gameplay penalty

---

## Question Types

### Multiple Choice
- Question displayed with optional step-by-step breakdown shown below the math expression
- 4 answer options in a vertical list (letter A–D, value, checkmark on correct)
- Used for: concept questions, calculations with a single numeric answer

### Drag-and-Drop
- Used for: ordering proof steps, matching definitions, arranging matrix operations
- Worth double XP (harder, more engagement)

---

## UI Layout

### Lesson Room (primary screen)
- **Top bar:** dungeon name, kingdom, streak, XP reward for this room
- **Room progress dots:** 5 dots showing completed/remaining rooms
- **Split layout:** question card left (math expression + step hints), answer options right
- **Readability constraint:** KaTeX rendering at minimum 1.2rem, high contrast always, no scrolling during a lesson

### Overworld Map
- Full-screen, HUD overlay at top (level, XP bar, streak)
- 4 kingdom cards on the map: large, distinct, clearly labeled
- Locked kingdoms: dark, low opacity, skull icon
- "Details" button: slides in a panel with full stats and inventory slots

---

## Content JSON Schema

```json
{
  "id": "linear-algebra-04",
  "title": "Vector Caverns",
  "kingdom": "linear-algebra",
  "dungeonNumber": 4,
  "rooms": [
    {
      "type": "multiple-choice",
      "question": "What is [3, 4] · [2, −1]?",
      "latex": "\\vec{v} = [3,4], \\quad \\vec{w} = [2,-1]",
      "steps": ["= (3 \\times 2) + (4 \\times -1)", "= 6 + (-4)"],
      "answers": ["2", "10", "14", "−2"],
      "correct": 1,
      "xp": 10
    },
    {
      "type": "drag-and-drop",
      "question": "Order the steps to compute a dot product",
      "items": ["Multiply matching components", "List both vectors", "Sum the products"],
      "correctOrder": [1, 0, 2],
      "xp": 20
    }
  ],
  "boss": {
    "questions": [
      {
        "type": "multiple-choice",
        "question": "...",
        "answers": ["...", "...", "...", "..."],
        "correct": 0,
        "xp": 25
      }
    ],
    "passMark": 2
  },
  "lootTable": []
}
```

The `lootTable` array is reserved for Phase 2 (item drops with RNG rarity tiers).

---

## Phase 2 — Item Drop System (not in v1)

After a boss fight, roll for a loot drop:
- **Common (60%)** — Hint Scroll: reveals one step of a room question
- **Rare (25%)** — Focus Crystal: skips the step hints and shows a cleaner problem
- **Epic (10%)** — Scholar's Tome: shows full explanation after answering
- **Legendary (5%)** — Solution Orb: reveals the full worked solution for any one dungeon room

Items stored in `localStorage` under `inventory: []`. The JSON `lootTable` field on each dungeon configures which items can drop and at what weights.

---

## Visual Design

- **Palette:** Deep purple/navy backgrounds (`#0d0a1a`, `#120d24`), gold accents (`#ffd700`), violet highlights (`#7c3aed`, `#a78bfa`), green for correct (`#22c55e`)
- **Font:** Monospace throughout (`Courier New` fallback, pixel-art font as optional enhancement)
- **Style:** Dark fantasy RPG — dungeon aesthetic, glowing borders, locked states with skull icons
- **Pixel art:** Placeholder CSS mockups in v1; real pixel art asset pack (dark fantasy theme) as a Phase 2 visual upgrade
- **Readability rule:** All math rendered via KaTeX. Answer values minimum `1.3rem`. No horizontal or vertical scroll during lesson rooms.
