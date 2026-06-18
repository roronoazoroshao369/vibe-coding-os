# API Endpoint Quality Checklist

## Purpose

Validate the quality of any REST or GraphQL endpoint change before merge. This checklist ensures endpoints are secure, reliable, backwards-compatible, well-tested, and follow consistent conventions. It treats the endpoint contract as a specification and runs explicit quality checks against it.

## When to use

Use whenever a pull request or commit modifies an API endpoint — whether adding a new route, changing an existing one, adjusting request/response shapes, altering auth behavior, or updating GraphQL resolvers. Compose with `skills/core/acceptance-criteria/SKILL.md` and `skills/core/test-driven-development/SKILL.md`.

## Inputs

- API design doc or spec (OpenAPI, GraphQL schema, or inline documentation)
- The diff for the endpoint change
- Known consumers (mobile, web, third-party SDKs)
- Rate-limit and auth configuration context
- Current test suite and coverage

## Core principle: verify the contract, not just the code

Every checklist item asks whether the endpoint *contract* holds — method, path, request shape, response shape, error behaviour, auth, idempotency, pagination, and backwards compatibility. The implementation code is secondary; the observable behaviour is primary.

## Quality dimensions

Group checklist items by these dimensions:

- **HTTP Method / Path** — is the verb and URL correct and RESTful?
- **Request Validation** — are inputs validated with clear error messages?
- **Error Responses** — are all error cases documented and consistent?
- **Auth / Authorization** — are auth checks applied at the right level?
- **Rate Limiting** — are limits documented and enforced for the endpoint?
- **Idempotency** — do mutating endpoints handle retries safely?
- **Response Format Consistency** — is the body shape predictable and versioned?
- **Pagination Shape** — do listing endpoints follow a standard pagination contract?
- **Backwards Compatibility** — does the change break existing clients?
- **Test Coverage** — do tests cover status codes, error cases, and edge parameters?

## Workflow

1. Confirm intent. Ask clarifying questions about which endpoints changed, what the expected contract is, and whether any consumers need advance notice (deprecation window).
2. Load the relevant API spec or documentation for the changed endpoint(s).
3. Run each checklist item as a question about the endpoint contract. Tag findings with a dimension and a traceability marker (spec section reference, file/line, or `[Missing]` / `[Inconsistent]` / `[Breaking]` / `[Assumption]`).
4. Group findings under the quality dimension headings above.
5. Merge near-duplicates.
6. Output the checklist with pass/fail status per item.
7. Record resolved findings back into the spec or diff.

## Outputs

A completed API endpoint quality checklist with item-level pass/fail, a summary of findings, and any remediation steps required before merge.

## Failure modes

- Testing only the happy path while ignoring error and edge cases.
- Assuming backwards compatibility without checking actual consumer usage.
- Skipping rate-limit and auth checks because "the middleware handles it".
- Not documenting the pagination contract for listing endpoints.
- Overlooking idempotency for non-GET mutations.
- Writing tests that only cover status codes without validating response bodies.

## Verification checklist

- [ ] HTTP method and path are clearly documented and follow project conventions.
- [ ] Request body and query parameters are validated against a schema.
- [ ] Every error case has a documented HTTP status code and consistent error body shape.
- [ ] Auth/authorization requirements are documented and enforced at the endpoint level.
- [ ] Rate limits (global and per-endpoint) are documented and enforced.
- [ ] Mutating endpoints (POST, PUT, PATCH, DELETE) are idempotent or include idempotency keys.
- [ ] Response body format is consistent (envelope, error shape, field naming convention).
- [ ] Listing endpoints define page size, cursor/offset, total count, and next-page link.
- [ ] Backwards compatibility is assessed: no breaking changes without a documented deprecation window.
- [ ] Tests cover: happy-path status codes, each documented error case, edge parameters (empty lists, maximum page size, boundary values).
