# Code Complete Construction Discipline Skill

## Purpose

Apply Steve McConnell's construction-first quality principles — defensive programming, design for change, data-first design, precise naming — to produce AI-generated code that is correct by construction, not corrected by reviews.

## When to use

- Writing new functions, modules, or systems from scratch
- Handling external inputs, edge cases, or "impossible" conditions
- Designing data models and choosing data structures
- Reviewing variable, function, and class naming
- Before relying on code review or testing to catch bugs

## Inputs

- Function or module specification (expected behavior, inputs, outputs)
- External interface contracts (API schemas, file formats, user input shapes)
- Known invariants (assertions that must always hold)
- Existing naming conventions in the codebase

## Workflow

1. **Design for change first.** Before writing logic, identify what in this module is likely to change: configuration values, external service URLs, parsing formats, business rules. Extract these into parameters, configuration, or strategy objects. For AI: explicitly comment on what was parameterized and why.

2. **Choose data structures before algorithms.** Select the right collection type for each data flow before writing the processing logic. For AI: state the data model and justify type choices before implementing algorithms on top.

3. **Apply defensive programming.**
   - Add assertions for every invariant that must hold — not just for the happy path.
   - Validate all external inputs at the boundary (API params, file contents, user input).
   - Handle every error path: don't silently swallow, don't assume success.
   - Fail fast: detect bad state as early as possible and make the failure visible.
   For AI: generate input validation and invariant assertions as first-class code, not afterthoughts.

4. **Name with precision.** Before writing the body, name the function/class/variable as if someone else needs to understand it without comments. Names should be specific enough to make incorrect code look wrong. For AI: spend naming effort proportional to the scope of the identifier — a public API name deserves more care than a loop variable.

5. **Build quality in during construction.** Verify each code path as it is written, not in a separate review pass. Use assertions, unit tests, or structured walks for every branch. For AI: treat code generation as the quality gate — not later linting or review.

## Outputs

- Code with explicit input validation at all module boundaries
- Assertions documenting critical invariants (not just preconditions but also postconditions and class invariants)
- Data model declarations with type justifications before algorithm implementation
- Parameterized configuration points with change-rationale comments
- Precise, searchable, specific naming throughout

## Failure modes

- **Assertion overuse.** Assertions for trivial or obvious conditions reduce signal. Reserve for invariants whose failure would indicate a bug, not for routine validation.
- **Paranoid programming.** Validating the same input at every layer violates DRY and adds noise. Validate at trust boundaries once.
- **Naming tunnel vision.** Spending excessive time on perfect names while deferring structural decisions. Good names matter, but not before data model and module boundaries are settled.
- **Construction tunnel vision.** Believing that quality during construction eliminates the need for review and testing. Defensive coding reduces bugs but does not replace other quality mechanisms.
- **Premature parameterization.** Making everything configurable before understanding what actually varies. Parameterize on demonstrated need.

## Verification checklist

- [ ] All external inputs are validated at the trust boundary (not deeper)
- [ ] Critical invariants are documented with assertions (preconditions, postconditions, class invariants)
- [ ] Error paths are handled explicitly — no silent swallows or unchecked assumptions
- [ ] Data structures are chosen and justified before algorithm implementation
- [ ] Configuration points, external dependencies, and volatile business rules are parameterized
- [ ] All names are specific, searchable, and precise — incorrect usage would look wrong
- [ ] Quality gates (assertions, validation, error handling) are part of initial code generation, not later fixups
- [ ] No redundant validation at multiple layers (validate once per trust boundary)
- [ ] No over-parameterization of values that are genuinely stable

## Related skills

- [Philosophy of Software Design](../software-design-philosophy/SKILL.md) — deep modules complement defensive design by reducing interface complexity
- [Clean Code](../clean-code-discipline/SKILL.md) — naming and function purity overlap with construction quality
- [Legacy Code](../working-with-legacy-code/SKILL.md) — defensive programming techniques for working with untested code

## Constitution alignment

Construction-first quality reinforces the project's emphasis on verification and correctness. "Build quality in" during code generation aligns with the spec-driven principle that implementation follows specification — but adds the discipline of making that implementation correct at the point of creation.

## Ghi chú tiếng Việt

Chất lượng được xây dựng trong lúc viết code, không phải được review hay test vào sau. Luôn kiểm tra input biên, dùng assertion cho invariant, chọn cấu trúc dữ liệu trước khi viết thuật toán. Đặt tên chính xác và cụ thể — đặt tên tốt là kỹ thuật rẻ nhất và hiệu quả nhất. Tham số hóa những gì có thể thay đổi, nhưng đừng tham số hóa quá sớm khi chưa hiểu rõ biến thiên.

---

*Attribution: "Code Complete (Steve McConnell, Microsoft Press) — ideas adapted, original wording."*
