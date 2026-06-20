---
title: Threat Model
type: template
name: threat-model-template
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: security
tags:
  - template
  - security
status: stable
---

# Threat Model

Design security **before building** with the STRIDE 6-letter lens applied to (boundary, asset, adversary) tuples.

## 1. Trust boundaries

For each boundary, document: who is on each side, what data crosses, what auth/authz is applied, what the failure mode is if auth is bypassed.

| # | Boundary | From | To | Data crossing | Auth/authz | Bypass failure mode |
| --- | --- | --- | --- | --- | --- | --- |
| 1 |  |  |  |  |  |  |
| 2 |  |  |  |  |  |  |
| 3 |  |  |  |  |  |  |

## 2. Assets per boundary

For each boundary, list what's being protected.

| Boundary | Data assets | Capability assets | Availability assets |
| --- | --- | --- | --- |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

## 3. Adversaries

For each boundary, identify potential adversaries.

- **Anonymous external** — no credentials
- **Authenticated low-privilege user** — has account, minimal permissions
- **Authenticated high-privilege user** — admin, ops
- **Compromised internal service** — credential leak, supply chain
- **Malicious internal actor** — insider threat

For this threat model, relevant adversaries are: __________

## 4. STRIDE matrix

Apply STRIDE to each (boundary, asset, adversary) tuple.

| Boundary | Asset | Adversary | S | T | R | I | D | E | Score (L×I) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |  |  |
|  |  |  |  |  |  |  |  |  |  |

Legend: S=Spoofing, T=Tampering, R=Repudiation, I=Info Disclosure, D=DoS, E=Elevation of Privilege.

Score = Likelihood (1-3) × Impact (1-3). Score ≥6 = mandatory mitigation. 3-5 = recommended. ≤2 = tracked.

## 5. Use cases + abuse cases

For each use case, write at least 1 abuse case.

### Use case U1: `<name>`

- **Actor:** __________
- **Precondition:** __________
- **Steps:** __________
- **Postcondition:** __________

#### Abuse case A1: `<name>`

- **Adversary:** __________
- **Precondition:** __________
- **Steps (subverting U1):** __________
- **Impact:** __________
- **Mitigation:** __________

### Use case U2: `<name>`

- **Actor:** __________
- **Precondition:** __________
- **Steps:** __________
- **Postcondition:** __________

#### Abuse case A2: `<name>`

- **Adversary:** __________
- **Precondition:** __________
- **Steps (subverting U2):** __________
- **Impact:** __________
- **Mitigation:** __________

## 6. Mitigations

For each STRIDE finding, document the mitigation, type, cost, and residual risk.

| Finding | Mitigation | Type (preventive/detective/corrective) | Cost | Residual risk | Verification |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |
|  |  |  |  |  |  |

## 7. Verification plan

How will we prove each mitigation works?

- [ ] Penetration test (third-party or internal red team)
- [ ] Automated security test (unit/integration test for the control)
- [ ] Manual code review (security checklist)
- [ ] Threat model re-review after design change
- [ ] Other: __________

## 8. Quality gate

- [ ] All trust boundaries mapped
- [ ] STRIDE applied per (boundary, asset, adversary) tuple
- [ ] Abuse cases written for all use cases
- [ ] Mitigations scored and prioritized
- [ ] Score ≥6 mitigations in design
- [ ] Verification method defined for each mitigation
- [ ] Threat model updated for any design change
