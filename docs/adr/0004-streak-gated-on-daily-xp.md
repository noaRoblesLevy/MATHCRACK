# ADR 0004 — Streak advances only when the Daily Goal is met

**Date:** 2026-06-09  
**Status:** Accepted

## Context

The Streak counter previously advanced whenever the learner opened the app on a new calendar day — no actual study was required. This made the Streak a vanity counter: a learner who opened the app each morning without answering a single question accumulated the same streak as one who completed full lessons daily.

## Decision

Streak only advances when the learner earns at least **N XP** (the Daily Goal) in a calendar day. Opening the app without earning XP does not extend the Streak.

The Daily Goal threshold is set low enough to be achievable in ~5 minutes of study (roughly 3–5 correct Room answers). The exact value is a product decision, not an architectural one.

## Rationale

A Streak that requires real engagement is a meaningful retention signal and a motivating daily target. A Streak that requires only an app open is neither.

The trade-off: learners on very light days (commute, tired) may lose a long streak over a small shortfall. This is mitigated by keeping the Daily Goal low — the goal is a floor, not a quota.

## Alternatives considered

- **Keep app-open semantics, add a separate daily goal UI**: Decouples streak from goal but adds complexity with two overlapping engagement counters.
- **Require a full Lesson completion per day**: Too high a bar for daily use; would punish casual learners.
