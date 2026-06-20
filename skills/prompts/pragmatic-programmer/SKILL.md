---
name: pragmatic-programmer
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: prompts
tags:
  - prompts
status: stable
---

# Pragmatic Programmer Principles

## Purpose

Distill the five most impactful principles from The Pragmatic Programmer (Hunt & Thomas) into actionable rules for AI-assisted coding: DRY, orthogonality, reversible decisions, tracer bullets, and broken windows. These principles guard against the most common failure modes of AI-generated code — duplicated logic, implicit coupling, premature lock-in, uneven depth, and accumulating cruft — by replacing them with disciplined, maintainable habits.

## When to use

Apply at architecture decisions, code review, and any time the codebase starts to feel tangled or brittle. Reach for the individual principle that matches the symptom: rising duplication → DRY, unexpected cascading changes → orthogonality, fear of commitment → reversible decisions, half-baked polish → tracer bullets, spreading disrepair → broken windows.

## Inputs

The current code, the change being considered, any architectural constraints, and whichever principle(s) the situation calls for.

## Workflow

### 1. DRY — Don't Repeat Yourself

*Every piece of knowledge must have a single, unambiguous, authoritative representation within a system.*

**Concrete rules for AI:**

1. Before writing new logic, search the codebase for existing implementations of the same concept. Use semantic search or grep — the same idea often appears under different names.
2. Extract shared logic into a single function, class, or module. Do not copy-paste code with minor modifications.
3. When a change requires touching multiple locations, that is a signal that DRY was violated. Fix the duplication first, then make the change.
4. DRY applies to knowledge, not coincidental similarity. Two loops that happen to look the same but represent different domain concepts should not be unified.
5. Watch for duplication in: data schemas, validation logic, configuration paths, error handling patterns, test setup, and documentation.
6. When AI generates a new function, compare it against existing ones — LLMs frequently regenerate what already exists rather than reusing it.

### 2. Orthogonality — Independence of Concerns

*Changes in one area should not cascade to unrelated areas.*

**Concrete rules for AI:**

1. Design modules with narrow, well-defined interfaces. A module's internal changes should never leak through its public API.
2. Before adding a dependency between two modules, ask: "Does this create coupling that will make future changes harder?"
3. Keep business logic separate from infrastructure. Database schema changes should not require UI changes; API contract changes should not require database changes.
4. Test modules in isolation. If testing A requires setting up B and C, the system is not orthogonal.
5. When AI generates code that wires together multiple concerns (e.g., a function that queries a DB and formats HTML), split it into orthogonal layers.
6. Avoid global state and singletons — they create invisible coupling between everything they touch.

### 3. Reversible Decisions — Keep Options Open

*Prefer decisions that can be undone. The cost of change should stay low throughout the project.*

**Concrete rules for AI:**

1. Favor interfaces and abstractions over concrete implementations at integration points. Swap a library binding behind an interface rather than sprinkling its API calls everywhere.
2. Document the *why* behind decisions, not just the *what*. A comment explaining "why X was chosen" equips the next developer to evaluate whether the reason still holds.
3. When choosing between two viable approaches, prefer the one that is easier to reverse.
4. Use feature flags, dependency injection, or adapter patterns for decisions that touch multiple subsystems.
5. Keep the cost of change visible. If a decision starts feeling irreversible, that is a signal to create a flexibility point.
6. For AI: when you are unsure of the best approach, build a thin scaffold that can be thrown away rather than a deep one that locks the system in.

### 4. Tracer Bullets — End-to-End Skeleton First

*Build the full thin slice before polishing any part. Get a working system first, iterate in layers.*

**Concrete rules for AI:**

1. Implement the shortest end-to-end path first: a call that goes from user action through all layers to a visible result, even if every layer is shallow.
2. Do not perfect any single module before the whole flow is functional. A polished module that connects to nothing has zero value.
3. After the tracer bullet works, fill in layers: add error handling, edge cases, validation, optimization — in that order.
4. Tracer bullets are not prototypes. They are the start of the production system. The skeleton stays; only the muscle changes.
5. When AI suggests deep optimization before the full flow works, push back. The tracer bullet validates architecture before optimization.
6. Use the tracer bullet to discover integration surprises early — schema mismatches, API gaps, configuration errors — where they are cheap to fix.

### 5. Broken Windows — No Decay Tolerance

*Don't leave bad code unfixed. Disorder invites more disorder.*

**Concrete rules for AI:**

1. Fix technical debt the moment you encounter it, provided the fix is small and contained. A five-minute fix now saves an hour later.
2. Leave code cleaner than you found it — but surgically. If a function is confusing, improve its naming or add a clarifying comment. Do not refactor the entire module.
3. When a fix is too large for the current change, file a ticket or add a `TODO` with an owner and date. A broken window that is *tracked* is less likely to spread.
4. The "broken window" is often a pattern: inconsistent naming, dead comments, unhandled errors, skipped tests. Fixing the pattern prevents the next broken window.
5. For AI: when generating code, do not leave placeholder comments (`// TODO: implement this`) without adding them to a tracking system. Every placeholder is a broken window.
6. Resist the "just this once" shortcut. A single shortcut in a clean codebase is more damaging than the same shortcut in an already-messy one.

## Outputs

Code that avoids duplication, keeps concerns independent, preserves reversibility, builds end-to-end before polishing, and resists decay. A codebase that stays maintainable as it grows.

## Failure modes

- Over-applying DRY: unifying two things that happen to look alike but represent different concepts, creating artificial coupling.
- Orthogonality as dogma: pure separation is impossible in any real system. The goal is *manageable* coupling, not zero coupling.
- Using reversible decisions as an excuse to defer every decision forever. Some decisions must be made; the skill is choosing *which* ones to keep flexible.
- Tracer bullets mistaken for prototypes: a tracer bullet that is thrown away was not a tracer bullet — it was wasted work.
- Fixing every broken window immediately without regard to priority. Not all windows matter equally; a typo in a comment is not the same as a security hole.
- Applying principles mechanically without understanding the trade-offs. Each principle has a cost; the practitioner knows when to pay it.

## Verification checklist

- [ ] Is every piece of knowledge represented exactly once (no duplication of logic, schema, or config)?
- [ ] Can each module change independently without cascading to unrelated modules?
- [ ] Have irreversible architectural decisions been flagged and documented with their rationale?
- [ ] Does the system have a working end-to-end path (tracer bullet) before deep polishing?
- [ ] Are broken windows (technical debt, shortcuts, placeholders) tracked and scheduled — or fixed immediately if small?
- [ ] Are the principles applied with judgment, not mechanically? (Trade-offs considered and documented?)

## Related skills

- `skills/prompts/clean-code-discipline/SKILL.md` — Meaningful naming, small functions, comments discipline (complements DRY and broken windows)
- `skills/prompts/karpathy-engineering-discipline/SKILL.md` — Think before coding, surgical changes (complements tracer bullets and reversible decisions)
- `skills/prompts/anti-overengineering/SKILL.md` — Simplicity first (counterweight to over-applying DRY and orthogonality)
- `skills/prompts/software-design-philosophy/SKILL.md` — Deep modules, complexity management (deepens orthogonality and coupling concepts)
- `skills/core/goal-driven-execution/SKILL.md` — Goal-driven execution with per-step checks (applies tracer bullet approach at task level)

## Constitution alignment

This skill aligns with the project's prime directive of building and maintaining software quickly while preserving clarity and correctness. DRY and orthogonality directly support maintainability at scale; reversible decisions and tracer bullets support rapid iteration without fear; broken windows preserves the long-term health of the codebase. The principles are universal enough that they do not override project constraints — they adapt to any language, framework, or domain. The localization notes below reflect the Vietnamese-language considerations in the project's CLAUDE.md.

## Ghi chú tiếng Việt

Năm nguyên lý: DRY (không lặp — mỗi kiến thức một chỗ), Orthogonality (độc lập — thay đổi module không lan sang module khác), Reversible Decisions (quyết định có thể đảo — giữ option luôn mở), Tracer Bullets (xương sống trước — làm full thin slice rồi mới trau chuốt), Broken Windows (cửa vỡ — không để code dở dang, sửa ngay khi thấy). Áp dụng có chọn lọc, không máy móc. Mỗi nguyên lý đều có chi phí; người thực hành giỏi biết khi nào nên trả.

*Tracked via Pragmatic Programmer (Hunt & Thomas, Addison-Wesley) — ideas adapted, original wording.*
