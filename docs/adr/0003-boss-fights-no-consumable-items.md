# ADR 0003 — Boss fights do not allow consumable item use

**Date:** 2026-06-09  
**Status:** Accepted

## Context

The app has four Loot item types. Two are consumable per-question: Hint Scroll (reveals a step) and Solution Orb (reveals the correct answer). Two are session-level toggles: Focus Crystal and Scholar's Tome.

The Boss fight reuses the `LessonRoom` component for its questions but does not pass `hintScrolls` or `solutionOrbs` props, so consumables cannot be used during a Boss fight. This was initially an accidental omission.

## Decision

Keep consumable items disabled during Boss fights, permanently. Make this explicit rather than an oversight.

## Rationale

The Boss is a skill checkpoint — its purpose is to verify that the learner retained the material, not to reward item accumulation. Allowing Hint Scrolls or Solution Orbs during the fight would let a learner bypass the pass mark with stored inventory rather than knowledge.

The trade-off is that learners with many items saved up get no benefit at the game's hardest moment. This is acceptable: items are aids for learning (Rooms), not shortcuts past assessment (Boss).

Focus Crystal and Scholar's Tome are not consumable and affect display only; they may remain active during a Boss fight without affecting the outcome.
