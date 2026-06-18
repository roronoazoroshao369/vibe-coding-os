---
name: auth-quality
description: Authentication and permissions quality checklist for login, identity, session, and access-control changes.
version: 1.0.0
author: Hermes Agent
license: MIT
platforms:
  - portable
tags:
  - checklist
  - security
  - authentication
  - authorization
  - quality
---

# Skill: Auth and Permissions Quality Checklist

## Purpose

Review authentication, session, and authorization work for security, reliability, and test coverage before it ships. Use this checklist to catch common identity and access-control failures early, especially around credentials, sessions, roles, and permission boundaries.

## When to use

Use for changes involving login, registration, credential reset flows, API authentication, role or permission changes, session management, refresh flows, identity providers, account status handling, or any endpoint that changes who can access what.

## Inputs

- The auth-related change summary and acceptance criteria.
- Affected routes, endpoints, middleware, guards, stores, forms, and data models.
- Current auth policy, role model, session behavior, and relevant security requirements.
- Existing tests for successful and unsuccessful auth flows.

## Workflow

1. Define the protected assets, actors, roles, and trust boundaries affected by the change.
2. Confirm credential rules are explicit: minimum length, complexity or passphrase policy, reuse constraints if applicable, and safe reset behavior.
3. Check MFA behavior when the product supports it: enrollment, challenge, recovery, bypass prevention, and degraded states.
4. Verify brute-force protections: lockout or throttling strategy, abuse monitoring, and safe user-facing messages.
5. Review session lifecycle: creation, expiry, refresh, revocation, logout, concurrent sessions, and disabled-user behavior.
6. Review token handling: storage location, transport security, rotation, invalidation, audience or scope checks, and exposure through logs, URLs, browser storage, or error messages.
7. Confirm rate limiting exists on auth-sensitive endpoints, including login, registration, reset request, reset completion, MFA challenge, and refresh endpoints where applicable.
8. Compare the design against OWASP guidance for authentication, session management, and access control.
9. Apply least privilege: default deny, narrow scopes, role checks at the server boundary, and no client-only authorization decisions.
10. Inspect test coverage for positive flows, negative flows, edge cases, and regression coverage around permission boundaries.
11. Add or request negative tests for wrong credential input, expired session artifacts, disabled users, revoked sessions, insufficient role, malformed auth data, and replay attempts.
12. Record any residual risk, missing control, or manual verification step before marking the change ready.

## Outputs

- A completed auth quality checklist with pass/fail/needs-follow-up notes.
- Identified security gaps, missing tests, and required fixes before release.
- Verification evidence: test commands, manual checks, or explicit limitations.

## Failure modes

- Treating UI checks as sufficient authorization enforcement.
- Adding a happy-path login or permission test while skipping denial-path tests.
- Leaving sessions active after logout, account disablement, role changes, or credential reset.
- Storing sensitive auth artifacts in locations exposed to scripts, logs, URLs, analytics, or crash reports.
- Using vague role names without documenting exact capabilities and default-deny behavior.
- Returning error messages that reveal whether an account exists or which credential field failed.
- Assuming framework defaults cover OWASP expectations without verifying configuration.

## Verification checklist

- [ ] Credential rules and reset behavior are explicit and tested.
- [ ] MFA behavior is reviewed when applicable.
- [ ] Brute-force and rate-limiting protections are present for auth-sensitive endpoints.
- [ ] Session expiry, refresh, revocation, logout, and disabled-user handling are covered.
- [ ] Auth artifacts are stored and transported securely and are not leaked through logs or URLs.
- [ ] Server-side authorization follows least privilege and default-deny behavior.
- [ ] OWASP authentication, session, and access-control guidance has been considered.
- [ ] Positive and negative auth tests exist, including wrong credential input, expired auth data, disabled user, and insufficient permission cases.
