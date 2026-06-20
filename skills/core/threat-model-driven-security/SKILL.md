# Skill: Threat-Model-Driven Security

## Purpose

Design security **before building** by mapping trust boundaries, applying the STRIDE 6-letter lens, and writing abuse cases alongside use cases. Counter the anti-pattern "auth checklist at the end" by forcing a threat-model-first workflow that surfaces attack surface, adversary capabilities, and mitigations during design rather than during a post-implementation review.

## When to use

Use when designing a new feature with auth, data access, external input, or any user-trust boundary. Also use when adding a new endpoint, changing a permission model, integrating with an external system, or reviewing an existing system for hidden attack surface. Triggers include:

- New endpoint, route, or API surface
- Permission model change (RBAC, ACL, scopes)
- External integration (third-party API, OAuth, webhooks)
- Sensitive data handling (PII, secrets, financial)
- Post-incident: "we should have threat-modeled this"

## Inputs

- Feature spec or in-progress implementation
- Data flow (who sends what to whom, where it is stored)
- Existing auth/authz model
- Trust boundaries list (or generated list — see step 1)
- External system list (and their threat models if available)

## Workflow

1. **Map trust boundaries.** Identify all boundaries where trust changes level:
   - User → frontend
   - Frontend → backend API
   - Backend → database
   - Backend → external service (third-party API, OAuth provider)
   - Backend → internal service (microservice, queue)
   - User → external system (e.g. user uploads to S3 directly)
   For each boundary, document: who is on each side, what data crosses, what auth/authz is applied, what the failure mode is if auth is bypassed.
2. **Enumerate assets.** For each trust boundary, list what is being protected:
   - **Data assets** (PII, secrets, financial records, intellectual property)
   - **Capability assets** (admin actions, irreversible operations, financial transfers)
   - **Availability assets** (rate limits, quotas, compute)
3. **Identify adversaries.** For each asset, list potential adversaries:
   - **Anonymous external** (no credentials)
   - **Authenticated low-privilege user**
   - **Authenticated high-privilege user** (admin, ops)
   - **Compromised internal service** (credential leak, supply chain)
   - **Malicious internal actor** (insider threat)
4. **Apply STRIDE 6-letter lens.** For each (boundary, asset, adversary) tuple, evaluate:
   - **S — Spoofing** — can the adversary pretend to be someone else?
   - **T — Tampering** — can the adversary modify data in transit or at rest?
   - **R — Repudiation** — can the adversary deny an action they took?
   - **I — Information Disclosure** — can the adversary read data they shouldn't?
   - **D — Denial of Service** — can the adversary degrade or block service?
   - **E — Elevation of Privilege** — can the adversary gain higher access than authorized?
5. **Write abuse cases alongside use cases.** For each use case, write at least 1 abuse case showing how an adversary would subvert it. Use `templates/threat-model-template.md`.
6. **Prioritize mitigations.** For each STRIDE finding, score: likelihood (1-3) × impact (1-3). Mitigations for score ≥6 are mandatory; 3-5 are recommended; ≤2 are tracked but not blocking.
7. **Wire mitigations into the design.** Place each mitigation in the design (not after). For each mitigation, document: control type (preventive/detective/corrective), implementation cost, residual risk.
8. **Plan the verification.** Specify how to prove each mitigation works: penetration test, automated test, manual code review, threat-model re-review after change.

## Outputs

- `templates/threat-model-template.md` filled with: trust boundaries, assets, adversaries, STRIDE matrix, abuse cases, mitigations, verification
- Optional ADR for non-obvious security decisions
- A pre-merge verification step in the feature's quality gate

## Failure modes

- Threat modeling after implementation (defensive cramming; misses design flaws)
- STRIDE applied to the system instead of to (boundary, asset, adversary) tuples (loses granularity)
- Adversaries limited to "external attacker" (misses insider threat, compromised services)
- Mitigations without verification (no proof they work)
- "Auth checklist at the end" (treats security as a layer, not a property)
- Threat model not updated when the design changes (decays)

## STRIDE quick reference

| Letter | Threat | Question | Example mitigation |
| --- | --- | --- | --- |
| **S** | Spoofing | Can the adversary impersonate? | MFA, signed tokens, mTLS |
| **T** | Tampering | Can the adversary modify data? | Integrity hashes, signed payloads, append-only logs |
| **R** | Repudiation | Can the adversary deny actions? | Audit logs with non-repudiation, signed receipts |
| **I** | Information Disclosure | Can the adversary read data? | Encryption at rest/transit, access control, redaction |
| **D** | Denial of Service | Can the adversary degrade/block? | Rate limits, circuit breakers, capacity planning |
| **E** | Elevation of Privilege | Can the adversary gain higher access? | Least privilege, defense in depth, security boundaries |

## Common rationalizations to reject

| Rationalization | Why it's wrong | Counter |
| --- | --- | --- |
| "We use HTTPS, so it's secure" | HTTPS is one control; STRIDE has 6 dimensions. | Apply full STRIDE per boundary. |
| "Auth is in place, threat model is done" | Auth is one mitigation; many STRIDE threats remain. | Map each threat to a specific mitigation. |
| "It's an internal API, no threat model needed" | Internal APIs are the highest-risk surface (insider threat). | Trust boundary is still a boundary. |
| "We'll add security at the end" | End-of-pipeline security is a layer, not a property. | Threat model during design. |
| "STRIDE is too academic, we use OWASP" | STRIDE and OWASP are complementary, not alternatives. | STRIDE for design, OWASP for checklist. |
| "We don't have time for threat modeling" | Time pressure increases the cost of skipped threat modeling. | Minimum 30 minutes; surface 1-2 high-impact threats. |
| "Pen test will find the issues" | Pen test finds implementation flaws, not design flaws. | Threat model the design first. |

## Red flags (must produce remediation)

- Trust boundary without STRIDE coverage
- Adversary model limited to "external attacker" only
- Mitigation without verification
- Score ≥6 finding without a documented mitigation
- Abuse case not written for a use case
- Threat model not updated after a design change
- "We'll add it at the end" — no in-design threat model

## Verification checklist

- [ ] All trust boundaries mapped
- [ ] All assets enumerated
- [ ] Adversaries include at least: anonymous external, authenticated low-privilege, compromised internal
- [ ] STRIDE applied to (boundary, asset, adversary) tuples
- [ ] Abuse cases written for each use case
- [ ] Mitigations scored (likelihood × impact) and prioritized
- [ ] Score ≥6 mitigations are in the design
- [ ] Each mitigation has a verification method
- [ ] Threat model updated for any design change

## Source alignment

Inspired by `addyosmani/agent-skills` `security-and-hardening` category (MIT, verified 2026-06-20). Adapted into Vibe Coding OS with original wording, threat-model-first framing, STRIDE 6-letter lens, abuse-case requirement, and bilingual maintainability notes. Renamed from `security-and-hardening` to `threat-model-driven-security` to avoid collision with `skills/checklists/auth-quality/` (which is a review checklist) and `skills/core/guard-bypass-protocol/` (which is a prompt guard).

## Ghi chú tiếng Việt

Kỹ năng này dạy workflow **trust boundaries → assets → adversaries → STRIDE → mitigations**, không phải "auth checklist ở cuối". Mỗi use case phải có ít nhất 1 abuse case đi kèm. Mỗi mitigation phải có verification (pen test, automated test, manual review). Score ≥6 (likelihood × impact) là bắt buộc phải mitigate. Threat model phải update khi design thay đổi. Tên đổi từ `security-and-hardening` sang `threat-model-driven-security` để tránh trùng với checklist review (`auth-quality`) và prompt guard (`guard-bypass-protocol`).
