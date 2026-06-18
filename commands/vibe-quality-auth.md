---
description: "Run the authentication and permissions quality checklist before or after auth-related changes."
---

# vibe-quality-auth

## Purpose

Apply the Auth and Permissions Quality Checklist to a change involving identity, credentials, sessions, roles, or authorization so security risks and missing tests are found early.

## When to use

Run for login, registration, credential reset, API authentication, session management, token refresh, role changes, permission model updates, or any feature where protected access is added or modified.

## Required inputs

- Summary of the auth change and acceptance criteria.
- Affected endpoints, middleware, guards, forms, stores, and data models.
- Current session, role, credential, and security policy assumptions.
- Existing test coverage for protected and unprotected flows.

## Step-by-step behavior

1. Identify protected assets, actors, roles, and trust boundaries touched by the change.
2. Review credential and reset behavior: complexity or passphrase policy, reuse constraints where applicable, and safe error messaging.
3. Check MFA behavior if the product supports it: enrollment, challenge, recovery, and bypass prevention.
4. Verify brute-force protections and rate limiting for auth-sensitive endpoints.
5. Inspect session lifecycle: creation, expiry, refresh, revocation, logout, concurrent sessions, and disabled-user handling.
6. Review auth artifact handling: storage, transport security, rotation, invalidation, scope checks, and exposure in logs or URLs.
7. Confirm server-side authorization follows least privilege and default-deny behavior.
8. Add negative tests or confirm they exist for wrong credential input, expired auth data, disabled users, revoked sessions, insufficient permissions, and malformed requests.
9. Compare the implementation against OWASP authentication and authorization guidance.
10. Summarize passing items, gaps, required fixes, residual risks, and any manual verification steps.

## Outputs

- Completed auth quality checklist notes.
- Short list of required fixes, missing tests, or residual risks.
- Verification evidence: test results, manual checks, or explicit limitations.

## Stopping conditions

Stop before marking the change ready if brute-force protections are missing, server authorization is missing or bypassable, negative test coverage is absent, or auth artifacts may be exposed through logs, URLs, or client storage.
