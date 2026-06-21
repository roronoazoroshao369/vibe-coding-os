---
name: software-design-philosophy
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: prompts
tags:
  - prompts
status: stable
---

# Software-Design-Philosophy Prompt

## Purpose

Apply John Ousterhout's design principles — deep modules, complexity management, strategic investment — to produce AI-generated code that is maintainable, not just functional.

## When to use

- Designing new modules, APIs, or abstractions
- Reviewing a system for complexity accumulation
- Deciding between tactical "just fix it" vs strategic design investment
- Choosing between deep vs shallow module boundaries
- Evaluating inheritance hierarchies vs composition

## Inputs

- Module or API surface description (current or desired)
- List of known change drivers (what is likely to evolve)
- Existing interface signatures and implementation sizes
- Complexity signals: how many lines to implement a simple feature? How many files must change?

## Workflow

1. **Assess module depth.** Compare interface complexity (parameters, types, preconditions) against implementation complexity. Flag shallow modules — those where the interface is nearly as complex as the implementation. For AI: avoid generating thin wrappers that expose all internals.

2. **Check for tactical acceleration.** Ask: am I taking the quickest path to make this work today? If yes, pause and identify the strategic alternative. Spend design time proportional to the expected lifespan of the code.

3. **Enforce information hiding.** Identify each design decision that is likely to change (the "secrets"). Verify those secrets are encapsulated behind stable interfaces, not leaked into callers. For AI: when generating code, explicitly note what is likely to change.

4. **Evaluate complexity accumulation.** Review the last 5–10 changes to the module. Is each change adding new parameters, new exposed state, or new caller-visible behavior? If complexity is trending upward, refactor before adding more. For AI: flag when a module needs simplification before extension.

5. **Prefer deep classes over deep hierarchies.** Before adding inheritance, ask: does this actually reduce caller complexity? If the hierarchy exists only to share implementation, prefer composition or a flatter design.

## Outputs

- Module depth report: interface vs implementation complexity ratio
- Identified "secrets" that are currently exposed
- List of tactical shortcuts that should be replaced
- Refactoring proposals for modules trending toward complexity
- Composition alternatives for proposed inheritance chains

## Failure modes

- **False depth.** A module with few parameters but complex hidden side effects is not deep — it's leaky. Side effects count as interface complexity.
- **Premature deepening.** Abstracting before understanding the variation domain creates wrong abstractions. Let concrete needs drive module shape.
- **Paralysis.** Not every decision needs strategic weight. Use the 80/20 heuristic: ~20% of modules deserve deep design thinking.
- **Dogmatic information hiding.** Hiding everything prevents extension points. Secrets = things likely to change; everything else can be reasonable to expose.

## Verification checklist

- [ ] Each module's interface is measurably simpler than its implementation
- [ ] No module exposes implementation details as API surface
- [ ] Design decisions likely to change are hidden behind interfaces
- [ ] Recent changes have not increased module complexity monotonically
- [ ] Inheritance hierarchies are shallow (≤ 2–3 levels) and justified per-level
- [ ] Composition is preferred over inheritance for code reuse
- [ ] Strategic improvements account for ~20% of development time
- [ ] Shallow modules have been identified and flagged for merging or deepening

## Related skills

- [Code Complete Construction Discipline](../code-complete-construction/SKILL.md) — defensive programming, naming, data-first design complement deep module design
- [Clean Code](../clean-code-discipline/SKILL.md) — naming and function shape interface concerns
- [Software Engineering at Google](../software-engineering-at-google/SKILL.md) — review and testing culture for managing complexity

## Constitution alignment

Aligns with the project's emphasis on clarity and maintainability over raw feature velocity. Deep modules directly serve the "what before how" principle by forcing interface design before implementation.

## Ghi chú tiếng Việt

Áp dụng tư duy "deep module" khi thiết kế API: interface đơn giản hơn implementation rõ rệt. Dành ~20% thời gian cho cải tiến cấu trúc thay vì chỉ thêm tính năng. Giấu thông tin dễ thay đổi sau interface ổn định. Phát hiện và tái cấu trúc module đang tích lũy độ phức tạp.

---

*Attribution: "A Philosophy of Software Design (John Ousterhout, Yaknyam Press) — ideas adapted, original wording."*
