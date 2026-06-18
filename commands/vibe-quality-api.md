---
description: "Run the API Endpoint Quality Checklist on a changed endpoint."
---

# vibe-quality-api

## Purpose

Run the API endpoint quality checklist against a pull request or commit that modifies one or more REST or GraphQL endpoints. This validates the endpoint contract — method, path, request validation, error responses, auth, rate limiting, idempotency, pagination, backwards compatibility, and test coverage.

## When to use

Use when a PR or commit adds, removes, or modifies any API endpoint — new route, changed request/response shape, altered auth, updated GraphQL resolver, or adjusted rate-limit configuration. Backs `skills/checklists/api-endpoint-quality/SKILL.md`.

## Required inputs

- The API diff (changed files and the surrounding endpoint spec or inline documentation)
- Known consumers (mobile, web, third-party SDKs) if relevant
- Rate-limit and auth configuration context if available
- Current test suite location

## Step-by-step behaviour

1. Confirm which endpoints changed and whether a spec or API doc exists for them.
2. Load the relevant endpoint spec, diff, or inline documentation.
3. Run each quality dimension from the checklist:
   - HTTP method and path correctness and RESTful conventions
   - Request body and query parameter validation
   - Error responses for every documented failure mode
   - Auth/authorization at the endpoint level
   - Rate-limit documentation and enforcement
   - Idempotency for mutating endpoints (POST, PUT, PATCH, DELETE)
   - Response format consistency (envelope, errors, field naming)
   - Pagination shape for listing endpoints
   - Backwards compatibility assessment
4. For each dimension, record a pass/fail with evidence or a finding marker (`[Missing]`, `[Inconsistent]`, `[Breaking]`, `[Assumption]`).
5. Merge near-duplicate findings.
6. Output a completed checklist with per-item status and a remediation section for any failures.

## Outputs

A completed API endpoint quality checklist with item-level pass/fail, traceability markers, and a summary of required fixes before merge.

## Stopping conditions

Stop and ask when no endpoint diff is identifiable, when the endpoint contract is undocumented and cannot be inferred from the diff, or when auth/rate-limit configuration is unknown and cannot be determined from the project.

## Verification checklist

- [ ] HTTP method and path are documented and correct.
- [ ] Request validation schema exists and is applied.
- [ ] Every error case has a documented HTTP status and body.
- [ ] Auth is documented and enforced at endpoint level.
- [ ] Rate limits are documented and enforced.
- [ ] Mutating endpoints handle idempotency.
- [ ] Response format is consistent.
- [ ] Pagination shape is documented (if listing).
- [ ] Backwards compatibility is assessed.
- [ ] Tests cover status codes, error cases, and edge parameters.

## Related skills/commands

- `skills/checklists/api-endpoint-quality/SKILL.md`
- `skills/core/acceptance-criteria/SKILL.md`
- `skills/core/test-driven-development/SKILL.md`
- `commands/vibe-spec.md`

## Handoffs / next-step suggestion

- Failures in the migration → update the API spec or diff to resolve findings, then re-run.
- All items pass → proceed with `commands/vibe-request-review.md` or merge preparation.
