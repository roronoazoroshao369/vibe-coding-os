---
description: "Run a STRIDE threat model on a feature or system during design."
---

# Command: Vibe Threat Model

## When to use

Invoke when designing a new feature with auth, data access, external input, or any user-trust boundary. Also when adding a new endpoint, changing permissions, integrating with external systems, or post-incident review for "we should have threat-modeled this".

## Required inputs

- Feature spec or in-progress implementation
- Data flow (who → what → whom → where stored)
- Existing auth/authz model
- Trust boundaries list (or generate from data flow)

## Step-by-step behavior

1. Map all trust boundaries (user/frontend, frontend/backend, backend/db, backend/external, etc.).
2. Enumerate assets per boundary (data, capability, availability).
3. Identify adversaries (anonymous external, authenticated low-priv, authenticated high-priv, compromised internal, malicious insider).
4. Apply STRIDE 6-letter lens to each (boundary, asset, adversary) tuple.
5. Write abuse cases alongside use cases (≥1 abuse case per use case).
6. Score mitigations: likelihood (1-3) × impact (1-3). Score ≥6 mandatory; 3-5 recommended.
7. Wire mitigations into the design (preventive/detective/corrective controls).
8. Plan verification: pen test, automated test, manual review, re-review on change.

## Outputs

- Filled `templates/threat-model-template.md` (boundaries, assets, adversaries, STRIDE, abuse cases, mitigations, verification)
- Pre-merge security verification step in the feature's quality gate

## Stopping conditions

Stop when: (a) all boundaries mapped, (b) STRIDE applied per tuple, (c) abuse cases written, (d) score ≥6 mitigations in design, (e) verification method defined for each mitigation.

## Verification checklist

- [ ] Trust boundaries complete
- [ ] Assets enumerated per boundary
- [ ] Adversaries include ≥3 types (external, low-priv, compromised)
- [ ] STRIDE matrix complete
- [ ] Abuse cases written for all use cases
- [ ] Mitigations scored and prioritized
- [ ] Score ≥6 mitigations in design
- [ ] Verification method per mitigation
- [ ] Threat model updated for design changes

## Anti-patterns to avoid

- Threat modeling after implementation (defensive cramming)
- STRIDE on the system only (loses tuple granularity)
- Limited adversary model (only "external attacker")
- Mitigations without verification
- "Auth at the end" (treats security as a layer)
- Threat model not updated on design change

## Related skills

- `skills/core/threat-model-driven-security/SKILL.md` — full STRIDE + abuse-case protocol
- `skills/checklists/auth-quality/SKILL.md` — review-time auth checklist (different scope)
- `skills/core/guard-bypass-protocol/SKILL.md` — prompt guard (different scope)
- `templates/threat-model-template.md` — boundaries + STRIDE + abuse cases template
