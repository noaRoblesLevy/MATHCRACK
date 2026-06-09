# ADR 0005 — Add a Course tier above Subject in the content hierarchy

**Date:** 2026-06-09  
**Status:** Accepted

## Context

The app launched with 13 Subjects in a flat list on the Subjects map. With the addition of college-level content sourced from multiple textbooks (Wang Algebra, DeGroot Probability & Statistics, time series analysis, quantitative trading, Python/data analysis), the total Subject count will grow to 50+ across distinct academic disciplines. A flat list at that scale becomes unnavigable.

## Decision

Introduce a **Course** as the top-level grouping above Subject. One Course = one academic discipline / textbook. The existing 13 pre-algebra Subjects are grouped under a "Pre-Algebra" Course. New college-level Subjects are grouped under their respective Courses (e.g. "Probability & Statistics", "Python & Data Analysis").

The Subject → Lesson → Room/Boss hierarchy is unchanged. Course is a navigation and grouping concern only.

## Rationale

Without a Course tier, the Subjects map would become a scrolling list of 50+ entries with no meaningful groupings. A Course tier lets learners navigate by discipline, see per-Course completion, and choose their level of study deliberately.

## Consequences

- `kingdoms.json` gains a `course` field per entry (or is restructured into course-keyed groups).
- The Subjects map (`OverworldMap`) renders Course sections rather than a flat kingdom list.
- `isKingdomComplete` and related progress hooks remain unchanged — they operate at the Subject level.
- The CONTEXT.md term **Subject** (internal: `kingdom`) is unchanged; Course is a new layer above it.

## Alternatives considered

- **Tags / difficulty filter on the flat list**: Does not solve discoverability at 50+ Subjects; just adds a filter UI.
- **Separate apps per discipline**: Rejected — defeats the purpose of a unified learning platform.
