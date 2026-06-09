# ADR 0001 — Bidirectional chapter-lesson link

**Date:** 2026-06-08  
**Status:** Accepted

## Context

Each Library chapter covers the theory for exactly one Lesson. To let the UI surface "read companion chapter" from inside a Lesson, and "go to practice" from inside a Library chapter, the two need to reference each other.

One direction (Lesson → chapter) suffices for navigation from the learning flow. The reverse (chapter → Lesson) is only needed if the Library UI also wants to link out to the paired Lesson.

## Decision

Encode the link in both directions:

- Each Lesson JSON carries `"chapterRef": "ch-XX"` pointing to its companion chapter.
- Each Library chapter JSON carries `"lessonRef": "arith-XX"` pointing to its companion Lesson.

## Consequences

- Both surfaces can link to each other without runtime lookups or index scans.
- Authoring cost: every new Lesson and every new chapter must include the cross-reference field. Neither is authored yet, so the retrofit cost is zero now but grows with content volume.
- Risk of drift: if a chapter is renumbered or a Lesson ID changes, both files must be updated together. A content validation script should check that every `chapterRef` resolves to a real chapter and every `lessonRef` resolves to a real Lesson.
