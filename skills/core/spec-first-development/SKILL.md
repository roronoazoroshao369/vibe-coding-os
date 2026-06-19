# Spec-First Development

## Purpose

Turn intent into a compact specification before non-trivial code changes.

## When to use

Use for new features, behavior changes, public APIs, data changes, or risky refactors.

## Inputs

Intent, constraints, users, existing behavior, acceptance criteria.

## Workflow

1. Create or update a spec using the template.
2. Define goals, non-goals, and constraints.
3. Describe expected behavior, user scenarios, and edge cases.
4. Add acceptance criteria that can be verified.
5. Apply what-before-how: keep technical choices out of the spec.
6. Review the spec for missing assumptions before planning, then clear the spec checkpoint.

## Outputs

A concise spec with goals, non-goals, behavior, edge cases, and acceptance criteria.

## Scenario pattern taxonomy

User scenarios in a spec should be classified by what they test, not by who writes them. Each category demands a different kind of scrutiny:

- **Happy path** — the intended, sunny-day flow. Validates that the feature works when everything goes right. Every spec must have at least one happy-path scenario that traces from trigger to expected outcome without deviations.
- **Error path** — what happens when inputs are invalid, dependencies fail, or preconditions are unmet. Error paths must name the specific error condition, the observable failure signal (exception, error code, degraded UI), and the recovery or fallback behavior.
- **Edge case** — boundary conditions, empty states, maximums, minimums, concurrency races, or timezone/corner inputs. Edge cases reveal assumptions the happy path hides. List concrete boundary values, not abstract descriptions.
- **Performance expectation** — throughput, latency, or resource-usage bounds under stated load. Quantified with a specific measurement (e.g., "response under 200 ms at 1000 req/s") rather than vague quality claims.
- **Security boundary** — authorization checks, data isolation, injection resistance, or rate-limiting behavior. Security scenarios describe what an attacker or untrusted caller must NOT be able to do, and what observable signal is produced when a boundary is crossed.

A well-formed spec covers at least the happy path and at least one error path. Omitting a category is a deliberate choice that must be recorded as a non-goal.

## Scenario validation checklist

For each scenario in the spec, verify:

- [ ] The actor, trigger, and expected outcome are concretely named.
- [ ] The scenario belongs to a recognized category (happy, error, edge, performance, security) — or the omission is explained in non-goals.
- [ ] Acceptance criteria for the scenario are observable and can be verified by a test or inspection.
- [ ] The scenario does not assume a particular technical implementation (what-before-how).
- [ ] Error-path scenarios describe both the failure signal and the recovery or fallback behavior.

Apply this checklist during the spec-review checkpoint. A scenario that fails any check should be reworked or explicitly deferred before the plan phase begins.

## Failure modes

- Spec becomes too broad.
- Acceptance criteria are not testable.
- Implementation starts before agreement on behavior.
- Scenarios describe implementation details instead of observable behavior.
- A scenario category is missing without an explicit non-goal.
- Performance expectations are stated without measurement criteria.

## Verification checklist

- [ ] Goals and non-goals are explicit.
- [ ] Acceptance criteria are observable.
- [ ] Open questions are listed.
- [ ] Spec matches the user request.
- [ ] Scenario validation checklist has been applied to every scenario.

Related mattpocock-inspired skill: `skills/core/prd-from-context/SKILL.md` for product-shaped specs from existing conversation context.

## Spec-driven development layer (github/spec-kit inspiration)

This skill is the `specify` phase of the local spec-driven workflow. For the full lifecycle, compose with:

- `skills/core/project-constitution/SKILL.md` — principles that constrain the spec.
- `skills/core/what-before-how/SKILL.md` — keep technical choices out of the spec.
- `skills/core/acceptance-criteria/SKILL.md` — observable, verifiable criteria.
- `skills/core/plan-from-spec/SKILL.md` — turn the agreed spec into a plan.
- `skills/core/task-breakdown-from-plan/SKILL.md` and `skills/core/dependency-aware-task-ordering/SKILL.md` — decompose and order tasks.
- `skills/core/checkpoint-validation/SKILL.md` — the implementation-readiness gate.
- `skills/core/brownfield-spec-enhancement/SKILL.md` — spec discipline for existing systems.

Inspiration source and mapping: `references/sources/github-spec-kit.md`, `references/features/spec-driven-development.md`. No upstream content is vendored, and the Specify CLI is not required.

### Ghi chú tiếng Việt

Skill này là pha `specify`. Kết hợp với các skill spec-driven khác (constitution, what-before-how, acceptance-criteria, plan-from-spec, task breakdown, checkpoint) để có vòng đời đầy đủ. Học ý tưởng từ `spec-kit`, không copy, không bắt buộc Specify CLI.
