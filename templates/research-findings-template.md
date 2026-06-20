---
title: Research Findings
type: template
name: research-findings-template
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: template
tags:
  - template
status: stable
---

# Research Findings

## Task / Subtask

<!-- What goal or task this research supports -->

## Questions Researched

| # | Question | Answer | Source Citation |
|---|---|---|---|
| 1 | <!-- What does API X return for edge case Y? --> | <!-- Behavior documented and tested --> | `docs/api/X.md` §2.3 |
| 2 | | | |
| 3 | | | |

## Positive Prior Art

| File Path | Why to Mimic |
|---|---|
| `src/features/Foo.ts` | Handles error states with the same API library we're using |
| `src/utils/Bar.ts` | Naming conventions match our style guide |

## Negative Prior Art (Patterns to Avoid)

| File Path | Why to Avoid |
|---|---|
| `old/components/Baz.tsx` | Uses deprecated API method we should not repeat |
| `legacy/utils/Qux.ts` | Error handling is inconsistent with current conventions |

## Key Decisions from Research

| Decision | Rationale | Source |
|---|---|---|
| Use buffered response instead of streaming | Library X does not support streaming | `docs/api/X.md` §4.1 |
| Follow existing error pattern from Foo.ts | Matches repo conventions and test patterns | `src/features/Foo.ts` |

## Unresolved Questions

| Question | Impact if Unanswered | How to Resolve |
|---|---|---|
| Does the auth middleware accept our token format? | Could block integration | Test with a real instance or check middleware tests |

## Confidence Score

**Score**: <!-- 1–10 -->

**Rationale**: <!-- What context is solid, what is missing -->

## Sources Consulted

- `docs/` links (exact sections)
- Source files examined
- External references (API docs, specs, PRDs)
