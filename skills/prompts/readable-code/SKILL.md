# Readable Code

## Purpose

Optimize AI-generated code for human reading, not cleverness. Apply five readability heuristics from Boswell & Foucher's *The Art of Readable Code* so output is clear, unsurprising, and maintainable by the next developer.

## When to use

Apply this skill whenever generating, reviewing, or refactoring code — especially when:
- Writing code others (or your future self) will read.
- Reviewing diffs for clarity and surprise-free behavior.
- Naming variables, functions, classes, or modules.
- Deciding whether to add a comment.
- Choosing between equivalent implementations where one is clearer.

## Inputs

A block of code, a diff, or a naming decision, plus knowledge of the surrounding project conventions.

## Principles

### 1. Code Is Read Far More Than Written

Optimize for reading, not writing. Humans spend less time producing code than understanding it. For AI: generate code that prioritizes clarity over cleverness; write for the next developer reading it at 2am.

### 2. Pack Intent into Names

A name should answer: *what is this?* (and sometimes *why*). Avoid generic names (`data`, `info`, `thing`, `manager`). Use specific, descriptive names that reveal intent. For AI: reject vague names; name variables, methods, and functions so they don't need a comment.

### 3. Comments Tell WHY Not WHAT

Good code documents the *why* — reasoning, trade-offs, assumptions, non-obvious behavior. Bad code documents *what* (which should be readable from code). For AI: generate comments for non-obvious design decisions, invariants, and side effects only.

### 4. Consistency Over Correctness

Consistent style is more important than "best" style. Follow the project's existing conventions even when you prefer different ones. For AI: match surrounding code style exactly — don't introduce your own formatting preferences.

### 5. Surprise Principle

Code should not surprise the reader. It should do exactly what the name and signature suggest. Side effects in functions, unexpected type changes, and silent failures are violations. For AI: avoid surprising behavior, make side effects explicit, prefer pure functions when possible.

## Workflow

1. Identify the code, name, or comment under consideration.
2. Run each principle against it:
   - **Readability** — is this harder to read than a simpler alternative?
   - **Naming** — does the name reveal intent? Would another name eliminate the need for a comment?
   - **Comments** — does the comment explain *why* or just restate *what*? Remove the latter.
   - **Consistency** — does this match the surrounding project style?
   - **Surprise** — does the code do exactly what its signature suggests?
3. Apply the correction that satisfies the most principles with the smallest change.

## Outputs

Code that is more readable, consistently styled, and free of surprises — with comments that explain *why* and names that reveal intent.

## Failure modes

- Sacrificing clarity for brevity (terse code is not always readable).
- Over-naming (names that are too long or try to capture too much context).
- Adding *why* comments for trivial decisions instead of real trade-offs.
- Forcing pure functions where mutation is the natural idiom in the codebase.
- Measuring consistency at the wrong level (matching a bad convention instead of improving it).

## Verification checklist

- [ ] Does the code read naturally? Could someone understand it at ~25% speed?
- [ ] Do names reveal intent without requiring a comment?
- [ ] Are there comments that only restate the code? Remove them.
- [ ] Does this code match the style of adjacent code?
- [ ] Would the code surprise someone reading only the function/class signature?
- [ ] Are side effects explicit in the signature or name?

## Related skills

- `skills/prompts/clean-code-discipline/SKILL.md` — naming, functions, comments (Martin). Complements readability with deeper function-level discipline.
- `skills/prompts/karpathy-engineering-discipline/SKILL.md` — think before coding, surgical changes. Use before generating readable code to clarify intent.
- `skills/prompts/anti-overengineering/SKILL.md` — simplicity-first. Readability and simplicity are close cousins.

## Constitution alignment

Promotes clear, maintainable output that is easy for humans to verify — supporting the project's verification-forward, spec-driven ethos. Consistency-over-correctness maps to the project's preference for matching local conventions over imposing global ideals.

## Attribution

*The Art of Readable Code* (Boswell & Foucher, O'Reilly) — ideas adapted, original wording.

## Ghi chú tiếng Việt

Năm nguyên tắc từ *The Art of Readable Code* (Boswell & Foucher): (1) code được đọc nhiều hơn viết — ưu tiên rõ ràng, (2) đặt tên bộc lộ ý định — không dùng tên chung chung, (3) comment giải thích *tại sao* — không giải thích *cái gì*, (4) nhất quán quan trọng hơn "đúng nhất" — theo style dự án, (5) nguyên tắc bất ngờ — code làm đúng như chữ ký hứa. Áp dụng khi sinh code hoặc review.
