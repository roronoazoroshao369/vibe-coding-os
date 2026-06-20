# Skill: Doubt-Driven Development

## Purpose

Challenge in-progress decisions before they harden into code, surfacing uncertainty, anti-rationalizations, and loading-constraint risks while the work is still malleable. Pairs with `code-review-and-quality` (which judges finished artifacts) and `critique-pass-protocol` (single-shot review) by adding an **in-flight doubt posture** that runs continuously during planning, implementation, and verification stages.

## When to use

Use when a non-trivial decision is being made mid-task, when an implementation is starting to feel "obvious", when the agent is about to commit to a stack/library/pattern, when requirements feel vague, or when a previous rationalization ("it's fine", "tests pass", "the user probably wants X") is about to go unchallenged. Triggers include:

- "I think we should just use X" (before any evidence)
- "This is a small change, no need to..." (rationalization warning)
- "The tests pass so we're done" (premature closure)
- "We can refactor later" (debt-acceptance warning)
- "The user obviously wants X" (intent guessing)

## Inputs

- Current decision point or in-progress artifact (code, plan, spec, registry entry)
- Project context (stack, conventions, existing patterns)
- Anti-rationalization log from prior doubt sessions
- Loading constraints: which skills/personas are currently active in the agent's context

## Workflow

1. **State the doubt trigger.** Name what just happened (decision, code, plan change) and why it warrants doubt. If you cannot name the trigger, do not invoke this skill.
2. **Run CLAIM → LOCATE → SCRUTINIZE → DOUBT → ADJUDICATE → RECORD (CLS-DAR).**
   - **CLAIM** — what is being asserted (e.g. "Use Postgres for this").
   - **LOCATE** — where in the codebase/context the claim lives (file, line, ADR, registry).
   - **SCRUTINIZE** — list 3 evidence-backed reasons FOR and 3 evidence-backed reasons AGAINST. Sources required.
   - **DOUBT** — apply the anti-rationalization table below to the strongest FOR reason and the strongest AGAINST reason.
   - **ADJUDICATE** — pick keep/modify/reverse/drop with explicit confidence level (0-100%).
   - **RECORD** — write a 3-line entry to `templates/doubt-log.md` (decision, evidence, adjudication).
3. **Apply loading constraints.** Before adding this skill to any persona's `skills:` frontmatter, verify:
   - The persona does not spawn another persona (anti-pattern: persona-calls-persona).
   - The doubt session will not consume the persona's remaining context budget beyond 30%.
   - The session is interactive (doubt requires dialogue or explicit log writes; do not invoke in autonomous CI/loop contexts).
4. **Check red flags.** If any red flag from the table below fires, the doubt session MUST produce an explicit remediation step or escalate to a human.
5. **Stop condition.** End the doubt session when: (a) adjudication is recorded, (b) all 3+1 evidence points are cited, (c) confidence level is stated, (d) next action is explicit.

## Outputs

- `templates/doubt-log.md` entry (decision, evidence, adjudication, confidence, next action)
- Optional inline `// DOUBT:` marker in code if a specific line/branch is being flagged
- A 1-line summary added to the agent's `## Active doubts` section for the session

## Failure modes

- Skipping CLAIM (vague "this feels right") — produces no evidence to scrutinize
- Skipping LOCATE (claim not anchored to a file/line) — produces unfalsifiable doubt
- Using 0 confidence / "100% sure" without evidence — bypasses the scrutiny gate
- Adding this skill to a persona that spawns other personas — infinite doubt recursion
- Invoking doubt in autonomous CI/loop contexts — produces noise without dialogue partner
- Treating doubt as a blocker (it is a posture, not a gate) — slows work without adding signal

## Common rationalizations to reject

| Rationalization | Why it's wrong | Counter |
| --- | --- | --- |
| "It's obvious, no need to doubt" | Obvious decisions are the highest-risk ones because they skip scrutiny. | Name 2 non-obvious consequences. |
| "We can fix it later" | "Later" rarely arrives; debt compounds. | State the migration cost now. |
| "Tests pass so we're done" | Tests passing ≠ requirements met. | Map each acceptance criterion to a test. |
| "The user probably wants X" | Probability ≠ evidence. | Ask, or mark as explicit assumption. |
| "I've seen this pattern work elsewhere" | Contexts differ; the pattern may not transfer. | Cite 1 concrete local analog with file path. |
| "It's a small change" | Small changes have large blast radius when they're wrong. | Estimate worst-case blast radius. |
| "The deadline is tight" | Deadline pressure increases rationalization rate. | Reduce scope instead of skipping doubt. |
| "Everyone else does it this way" | Bandwagon ≠ correctness. | Cite 1 counter-example. |

## Red flags (must produce remediation)

- Confidence <50% on a non-reversible decision (architecture, security, data model)
- Decision contradicts an existing ADR without a new ADR
- Decision introduces a new dependency without license/security check
- Doubt session cannot cite any local file/line (LOCATE failed silently)
- Multiple personas attempting doubt on the same decision (orchestration confusion)

## Verification checklist

- [ ] Trigger was named explicitly (CLAIM step completed)
- [ ] At least 3 evidence-backed FOR and 3 AGAINST points were produced
- [ ] Loading constraints were verified before invocation
- [ ] No red flags fired silently (or remediated explicitly)
- [ ] Adjudication is recorded with confidence level 0-100%
- [ ] Next action is explicit and owned by a single persona
- [ ] Doubt log entry exists at `templates/doubt-log.md`

## Loading constraints (anti-pattern catalog)

| Anti-pattern | Why it fails | Avoid by |
| --- | --- | --- |
| Adding this skill to a persona's `skills:` frontmatter | Persona spawns other personas; doubt recurses | Invoke doubt at orchestration layer, not in persona context |
| Invoking doubt in autonomous CI/loop | No dialogue partner; produces noise | Use `verification-before-done` instead |
| Doubting every decision | Decision paralysis; signal-to-noise collapses | Apply trigger list; skip obvious calls |
| Skipping evidence (gut-feel doubt) | Unfalsifiable; not actionable | Require 3 evidence points per claim |
| Recording doubt without confidence level | Cannot be re-evaluated | Always state 0-100% confidence |

## Source alignment

Inspired by `addyosmani/agent-skills` `doubt-driven-development` category (MIT, verified 2026-06-20). Adapted into Vibe Coding OS with original wording, in-flight posture naming (CLS-DAR), and bilingual maintainability notes. Local equivalent: `skills/core/critique-pass-protocol` (single-shot review, no in-flight posture). Complements `code-review-and-quality` (post-implementation) and `verification-before-done` (completion gate).

## Ghi chú tiếng Việt

Kỹ năng này dạy thói quen **hoài nghi trong lúc làm** (in-flight doubt), không phải review sau khi xong. Khi agent sắp ra quyết định — chọn stack, đặt tên biến, commit plan — hãy chạy CLS-DAR trước khi quyết định cứng lại. Loading Constraints là phần quan trọng nhất: KHÔNG add skill này vào `skills:` frontmatter của persona nếu persona đó spawn persona khác (recursion). Không dùng trong autonomous CI/loop — dùng `verification-before-done` thay thế. Còn lại 6 RED FLAGS mà bất cứ doubt session nào cũng phải check trước khi đóng.
