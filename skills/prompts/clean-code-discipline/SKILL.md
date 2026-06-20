---
name: clean-code-discipline
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: prompts
tags:
  - prompts
status: stable
---

# Clean Code Discipline

## Purpose

Translate the core principles of Clean Code (Robert C. Martin) into actionable rules for AI-assisted coding: meaningful naming, small functions, comments discipline, error handling discipline, and formatting consistency. These five practices directly counter the most common quality gaps in AI-generated code — vague names, bloated functions, misleading comments, silent error handling, and inconsistent style — by giving the AI (and its human reviewer) a shared standard for what "clean" means.

## When to use

Apply during code review, when generating new functions, and whenever the codebase starts showing signs of "AI sprawl" — functions that do too much, names that obscure intent, comments that explain the obvious, or error handling that is absent or inconsistent. Use individual principles as lint-style checks on every AI-generated code block.

## Inputs

The code being written or reviewed, the team's prevailing style conventions, and whichever principle(s) the code quality issue calls for.

## Workflow

### 1. Meaningful Naming — Reveal Intent

*A name should answer: why does this exist, what does it do, and how is it used?*

**Concrete rules for AI:**

1. A name is good when another developer can guess what the code does without reading it. Test every name against this standard.
2. Avoid disinformation: do not use `list` for something that is not a `List`, or `UserData` for something that holds no user data.
3. Make meaningful distinctions: `getUser()` and `getUserData()` do not tell the reader enough to choose between them. Use `getActiveUser()` vs `getArchivedUser()` instead.
4. Use pronounceable names: `genIdx` → `generationIndex`. Code is read aloud in pairing and review.
5. Use searchable names: single-letter names (except loop counters in 3-line scopes) are not searchable. `e` appears in every other word; `userEmail` is grep-friendly.
6. Class names are nouns or noun phrases (`Customer`, `ErrorHandler`). Method names are verbs or verb phrases (`save`, `isValid`, `calculateTotal`).
7. For AI: when generating code, prefer longer descriptive names over short cryptic ones. AI can auto-fill long names; humans need the clarity.

### 2. Small Functions — One Thing, Well Named

*Functions should do one thing, be small, have no side effects, and have as few arguments as practical.*

**Concrete rules for AI:**

1. A function does one thing if you cannot extract another meaningful function from it. If a function has "and" in its description (`validate and save`), it does two things.
2. Prefer 5-15 lines per function. Any function over 30 lines is almost certainly doing more than one thing.
3. No side effects: a function named `saveOrder()` should not also log the user out, send an email, or mutate global state. Do only what the name promises.
4. Few arguments: 0 is ideal, 1 is fine, 2 is acceptable, 3 is a code smell (consider a parameter object). Avoid output arguments — the state being changed should be `this`.
5. Extract conditionals: `if (isEligibleForDiscount(customer))` is better than `if (customer.purchases > 5 && customer.status === 'active' && !customer.isBlocked)`.
6. For AI: after generating a function, ask "can this be split?" If the function has multiple `and` concepts or more than one level of abstraction, factor it.

### 3. Comments Discipline — Explain Why, Not What

*Comments should explain why the code exists, not what it does. Good code is self-documenting.*

**Concrete rules for AI:**

1. Do not comment what the code already says. `// increment counter` above `i++` adds zero information.
2. Write comments for *why*: `// retry with backoff because the upstream API has a known 503 spike at page boundaries`
3. Prefer expressive code over comments. Instead of `// check if user is 18 or older`, write `if (isAdult(user))`.
4. Do not comment bad code — rewrite it. A comment explaining confusing logic is an admission that the logic should be simpler.
5. Keep comments local. A comment attached to a specific line is useful; a paragraph at the top of a function explaining what the function does is often a signal the function should be renamed or split.
6. Avoid journal comments (`// 2024-01-15: fixed bug #123`), positional markers (`// --- Section ---`), and closing-brace comments (`} // end if`). Git tracks history; structure shows scope.

### 4. Error Handling — Exceptions Over Return Codes

*Use exceptions, not return codes or sentinel values. Provide context. Do not pass or return null.*

**Concrete rules for AI:**

1. Use exceptions instead of return codes. `if (save() == 1)` leaks the caller's flow into error handling. `save()` returns void and throws on failure.
2. Provide context with exceptions: include the operation that failed, the input that caused it, and any state that would help debugging. `throw new OrderException("Cannot ship order #{id}: address #{zip} is not in service area")`.
3. Define exception classes in the caller's terms, not the implementation's. `StorageException` is better than `IOException` when the caller thinks in terms of storage.
4. Do not return null. If a function might not find a result, return `Optional`, an empty collection, or a special case object (Null Object pattern).
5. Do not pass null. `save(null)` is an invitation to a `NullReferenceException`. If a parameter is optional, use an overload or a parameter object with sensible defaults.
6. Handle errors at the right level. Catch exceptions where you have enough context to handle them, not at the lowest level (which has no context) nor the top level (which cannot distinguish cases).
7. For AI: every generated function that can fail must specify its error behavior. Silent swallowing (`try { ... } catch (e) {}`) is never acceptable without a documented reason.

### 5. Formatting & Consistency — Team Style Over Personal Style

*Formatting is communication. Vertical density, horizontal clarity, and team-wide consistency matter more than any individual preference.*

**Concrete rules for AI:**

1. Vertical formatting: read a file like a newspaper — the most important concepts at the top, details below. Related functions should be close together; the distance between a caller and its callee is a measure of abstraction leakage.
2. Group related concepts: variables used together should be declared together. Public methods before private. High-level before low-level.
3. Horizontal formatting: keep lines short (80-120 characters). Long lines are harder to read, especially in side-by-side diff views.
4. Team style over personal style: if the project uses 4-space indents, do not write 2-space code. If the project puts opening braces on the same line, do not put them on the next line. Configure the AI to match the project's linter and formatter config.
5. Consistent blank lines: one blank line between methods, two between classes. No blank lines inside a method body for "visual grouping" — extract a method instead.
6. For AI: before generating code in an existing project, read the surrounding files to infer the formatting conventions. Match them exactly, even when your default template would differ.

## Outputs

Code with clear intent (meaningful names), focused units (small functions), honest comments (why not what), robust error handling (exceptions with context, no null), and consistent style (team conventions, not personal preference).

## Failure modes

- Meaningful naming taken to extremes: `processBatchPaymentForPremiumCustomersOnTrialPlans` is long but gives no *new* information. Names should be long enough to be clear, not long enough to be paragraphs.
- Function splitting that destroys locality: breaking a 30-line function into six 5-line functions that must be read together is not an improvement. Extract when the split creates independently meaningful units.
- Comment paranoia: removing all comments in a misguided attempt at self-documenting code. Some comments (legal, performance rationale, public API contracts) are necessary.
- Exception overuse: throwing exceptions for control flow or for recoverable conditions that the caller should handle silently. Exceptions are for exceptional conditions.
- Formatting rigidity: enforcing style rules that fight the language's natural idioms. For example, keeping all functions under 15 lines in a language where pattern matching makes 8-line branches natural.
- For AI: generating code that looks clean but is incorrect. Clean code is a quality dimension, not a substitute for correctness.

## Verification checklist

- [ ] Do names reveal intent without requiring the reader to trace the code?
- [ ] Is every function doing one thing (5-15 lines, no side effects, few arguments)?
- [ ] Do comments explain only why — not what the code already says?
- [ ] Does error handling use exceptions with context (no null passing/returning, no silent swallowing)?
- [ ] Does formatting match the surrounding project conventions?
- [ ] Is the skill applied with judgment (not mechanically), avoiding the failure modes above?

## Related skills

- `skills/prompts/pragmatic-programmer/SKILL.md` — DRY, orthogonality, reversible decisions (complements naming and function separation)
- `skills/prompts/karpathy-engineering-discipline/SKILL.md` — Think before coding, surgical changes (reinforces comments discipline and formatting consistency)
- `skills/prompts/anti-overengineering/SKILL.md` — Simplicity first (counterweight to over-splitting functions or over-designing error hierarchies)
- `skills/prompts/readable-code/SKILL.md` — Readability heuristics for AI output (overlaps with naming and function size)
- `skills/core/goal-driven-execution/SKILL.md` — Goal-driven execution with per-step checks (ensures clean code choices are verified, not assumed)

## Constitution alignment

This skill supports the project's prime directive — building software quickly while preserving clarity and correctness — by giving both AI and human a shared definition of "clean." Clean Code's principles reduce cognitive load: meaningful naming removes the need to trace intent, small functions limit the surface area of any single bug, and disciplined error handling makes failures debuggable. The formatting rules ensure AI output blends into existing codebases rather than creating visual friction. When applied with judgment (not mechanically), these practices accelerate rather than slow development.

## Ghi chú tiếng Việt

Năm trụ: Đặt tên có ý nghĩa (tên tiết lộ ý định, không gây hiểu lầm), Hàm nhỏ (một việc, 5-15 dòng, không tác dụng phụ), Kỷ luật comment (tại sao — không phải cái gì, code tốt tự giải thích), Xử lý lỗi (exception kèm ngữ cảnh, không null), Format nhất quán (team style > personal style). Không áp dụng máy móc: tên quá dài = vô ích, tách hàm phá tính địa phương = phản tác dụng. Code sạch không thay thế code đúng.

*Tracked via Clean Code (Martin, Prentice Hall) — ideas adapted, original wording.*
