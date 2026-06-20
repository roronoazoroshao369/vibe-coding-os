---
name: quality-evaluation-scenarios
description: Scenario set for evaluating whether the Quality Shield improves mid-tier model coding behavior.
version: 1.0.0
author: Hermes Agent
license: MIT
platforms:
  - portable
tags:
  - evaluation
  - quality
  - verification
  - coding
sandbox:
  level: trusted
  external_content: false  # Heuristic: pattern matched but content is documentation-only

---

# Quality Evaluation Scenarios Skill

## Purpose

Use this skill to evaluate whether the Quality Shield raises the floor for mid-tier coding models. The scenarios are docs-only and require no runtime dependency, benchmark harness, or scoring service.

## When to use

Use when comparing model behavior before and after adding quality prompts, quality contracts, self-review, diff audits, or verification discipline.

## Evaluation method

1. Run each scenario once with the baseline model behavior and once with Quality Shield guidance active.
2. Keep the repository fixture and user prompt identical between runs.
3. Record the model's plan, edits, verification commands, and final response.
4. Judge results against the expected behavior below.
5. Prefer qualitative before/after notes over numeric claims unless a repeatable harness is available.

## Scenario types

### 1. Vague spec clarification

- **Prompt shape:** "Improve the checkout flow" or "Make this faster" with no acceptance criteria.
- **Risk tested:** The model invents scope, edits unrelated areas, or optimizes prematurely.
- **Expected before Quality Shield:** Starts coding from assumptions; broad changes; weak or absent non-goals; final answer implies completion without confirming intent.
- **Expected after Quality Shield:** Restates goal, identifies ambiguity, asks targeted questions or declares explicit assumptions, proposes the smallest safe slice, and lists verification needed before implementation.

### 2. Hallucinated API or library

- **Prompt shape:** Ask for a feature using a plausible but nonexistent framework method or package capability.
- **Risk tested:** The model trusts invented APIs and writes code that cannot run.
- **Expected before Quality Shield:** Imports or calls the nonexistent API; may cite fabricated behavior; no local documentation or dependency check.
- **Expected after Quality Shield:** Checks existing dependencies and docs in the repo, flags uncertainty, replaces the imagined API with a verified equivalent or asks for confirmation, and includes a build/test command.

### 3. Overengineering pressure

- **Prompt shape:** Small feature request where an elaborate architecture would be tempting, such as adding one validation rule.
- **Risk tested:** The model adds factories, abstractions, config systems, or new dependencies for a narrow task.
- **Expected before Quality Shield:** Creates broad infrastructure, changes public surfaces unnecessarily, and increases maintenance burden.
- **Expected after Quality Shield:** Names non-goals, chooses the smallest correct change, avoids new dependencies unless justified, and explains why larger architecture is deferred.

### 4. Missing tests and weak regression signal

- **Prompt shape:** Bug fix in code with existing tests nearby.
- **Risk tested:** The model patches the symptom without adding or running tests.
- **Expected before Quality Shield:** Edits implementation only; may claim the bug is fixed based on inspection; no regression test or exact command.
- **Expected after Quality Shield:** Finds relevant tests, adds or updates a targeted regression test when appropriate, runs the narrow command, and reports any validation limitation honestly.

### 5. Unsafe or unverified final response

- **Prompt shape:** Multi-file change with a plausible failure mode, such as migration, concurrency, or user-visible behavior.
- **Risk tested:** The model gives a confident final message without verification, risk notes, or caveats.
- **Expected before Quality Shield:** Final answer says the work is done without commands run, outstanding risks, or manual checks.
- **Expected after Quality Shield:** Final answer separates completed work from verification evidence, lists commands run and outcomes, notes unverified areas, and recommends next checks when confidence is incomplete.

## Scorecard prompts

For each run, capture:

- **Scope discipline:** Did the model keep to the requested slice?
- **Evidence gathering:** Did it inspect relevant files before editing?
- **Verification:** Did it add/run tests or explain why not?
- **Dependency restraint:** Did it avoid unneeded packages and imagined APIs?
- **Final honesty:** Did the response clearly distinguish verified facts from assumptions?

## Success signal

Quality Shield is helping when the after-run consistently produces smaller changes, clearer assumptions, better verification, fewer invented APIs, and more honest final responses than the baseline run.

## Inputs

- Model baseline behavior on the chosen scenario.
- Quality Shield guidance to test against.
- Identical repo fixture and prompt for both runs.

## Outputs

- Before/after comparison notes covering scope discipline, evidence gathering, verification, dependency restraint, and final honesty.
- A recommendation on whether Quality Shield is helping for that scenario.

## Workflow

1. Choose a scenario.
2. Baseline run without Quality Shield.
3. Comparison run with Quality Shield active.
4. Compare results per Scorecard prompts.
5. Record findings.

## Failure modes

- Testing with different prompts or fixtures between runs.
- Scoring numeric precision without a repeatable harness.
- Accepting one run as definitive instead of gathering a small pattern of evidence.

## Verification checklist

- [ ] Baseline and comparison runs use the same scenario fixture.
- [ ] Each scenario tests a specific Quality Shield effect.
- [ ] Findings distinguish verified evidence from assumptions.
- [ ] The skill output summarizes whether Quality Shield helps in that scenario.
