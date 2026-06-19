# Skill: Requesting Code Review

## Purpose

Package a change for useful review by making scope, intent, diff, risks, and verification evidence easy to inspect.

## When to use

Use after a patch is ready for another human or agent pass, before merge readiness, or when a risky decision needs independent scrutiny.

## Inputs

Spec or task, implementation plan, current diff, changed files, validation results, known risks, and questions for the reviewer.

## Workflow

1. Review your own diff first and remove unrelated changes.
2. Summarize intent, user-visible behavior, and non-goals.
3. List changed files by purpose instead of dumping the diff.
4. Provide exact tests/checks run and any failures or limitations.
5. Ask focused review questions for risky areas.
6. Stop claiming readiness if validation or attribution obligations are unresolved.

## Outputs

A review request containing scope, summary, changed files, risks, verification evidence, and specific questions.

## Optional: intelligence-map generation

When the change is non-trivial (multiple files, cross-module, shared interface changes), consider including a request for an **intelligence map** in the review request. Add a note that you would like the reviewer to run `code-intelligence-review` or `vibe-review-intelligence` before analysis. This gives the reviewer a structural understanding of the change's reach — call graph, dependency chains, data flow, and test gaps — and surfaces ripple effects that flat line-by-line review may miss.

## Optional: incremental mode

If this change has been reviewed before in an earlier iteration, indicate that the reviewer may use **incremental review** mode. Include the previous review output and baseline diff so the reviewer can compute only what changed since the last round. This avoids re-reading the full change surface and focuses the review on the new delta. Use `templates/incremental-review-template.md` for the incremental findings.

## Failure modes

- Sending a review request without validation status.
- Hiding known risks or failed checks.
- Asking for generic review when a focused question is needed.
- Including noisy or unrelated diff.
- Requesting an intelligence map for a trivial change where the overhead of map construction outweighs insight.

## Verification checklist

- [ ] Diff was self-reviewed first.
- [ ] Review request names scope and non-goals.
- [ ] Validation evidence is explicit.
- [ ] Open questions are actionable.
