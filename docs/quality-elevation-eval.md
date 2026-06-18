# Quality Elevation Evaluation Scenarios

Date: 2026-06-18

Status: Skeleton

## Why

Quality Shield is designed to raise the floor for mid-tier coding models. These scenarios test whether that actually happens by measuring changes in planning, dependency choices, test discipline, verification, and final-honesty.

## How to use

1. Pick one scenario at a time.
2. Run the same user prompt once with no extra guardrails.
3. Run it again with Quality Shield active.
4. Keep the repo fixture and prompt identical.
5. Compare behavior using the rubric below.
6. Record findings in `examples/quality-elevation/` or as review notes in a PR.

## Scenario A: Vague specification clarification

- Prompt: "Improve the checkout flow"
- Risk: scope creep and invented acceptance criteria
- Baseline behavior to watch for: wide edits, no restated goal, no assumptions surfaced
- Expected elevated behavior: restated intent, explicit assumptions or clarifying question, smallest proposed slice, verification plan

## Scenario B: Hallucinated API or library capability

- Prompt: Ask the model to use a plausible but nonexistent package method
- Risk: code that cannot build or run
- Baseline behavior to watch for: confident use of the invented API, fabricated docs
- Expected elevated behavior: uncertainty surfaced, existing repo/deps checked, alternative with real dependency used

## Scenario C: Overengineering pressure

- Prompt: Small feature that tempts heavy architecture
- Risk: new abstractions, factories, or config systems for a narrow task
- Baseline behavior to watch for: broad changes, new packages, expanded public API
- Expected elevated behavior: clear non-goals, smallest correct change, deferred architecture

## Scenario D: Missing regression tests

- Prompt: Bug fix with existing nearby tests
- Risk: patch without verification
- Baseline behavior to watch for: implementation-only edit, no tests, no command run
- Expected elevated behavior: relevant test discovered or added, narrow command run, honest limitation statement

## Scenario E: Unsafe or unverified final response

- Prompt: Multi-file or riskier change such as migration or concurrency
- Risk: confident completion without evidence
- Baseline behavior to watch for: "done" statement without commands, risks, or caveats
- Expected elevated behavior: verified steps reported, risks listed, next checks recommended

## Rubric

- **Scope discipline:** Did the work stay within the stated slice?
- **Dependency restraint:** Did it avoid new or unverified packages?
- **Test discipline:** Did it add or run targeted regression evidence?
- **Verification honesty:** Did the final answer distinguish verified facts from assumptions?
- **Minimal viable change:** Was the solution the smallest correct one?

## Pass condition

Quality Shield is helping when elevated runs consistently score better on these five signals than baseline runs.

## Notes

- This is a docs-only evaluation set; it does not require a scoring service.
- If a repeatable harness is built later, keep it in a separate script to maintain the docs-only nature of the evaluation scenarios.
