# ADR 0006 — Coins are a separate currency from XP

**Date:** 2026-06-09  
**Status:** Accepted

## Context

The app needed a spendable currency for the Shop (Streak Freezes, Flair, Cosmetics, consumable items). The existing XP system was a candidate: learners already accumulate it, and reusing it would avoid introducing a second number to track.

## Decision

Coins are a **distinct currency** from XP. XP is a permanent, never-decreasing record of mastery that drives Title progression. Coins are earned alongside XP and spent freely in the Shop without affecting XP or Title.

Earning rates:
- Correct Room answer: small Coin reward (alongside XP)
- Boss pass: lump-sum Coin reward
- Daily Goal met: daily Coin bonus
- Streak milestones (7 / 14 / 30 days): large one-time Coin payouts

## Rationale

If XP were spendable, purchasing a Streak Freeze or Flair would reduce the learner's Title rank — punishing engagement with the Shop. XP is a progress signal; it must be monotonically increasing to mean anything.

The cost of a second currency is a slightly more complex UI (two numbers on Profile/HUD). This is outweighed by the semantic clarity: XP = what you know, Coins = what you've earned for showing up.

## Alternatives considered

- **XP as spend currency**: Rejected — spending XP degrades Title rank, conflating mastery with economy.
- **Coins replace XP entirely**: Rejected — Title progression is a core motivation mechanic tied to a number the learner understands as "total correct answers worth of work."
