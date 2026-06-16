# Upstream Intake Scorecard

A filled example of the reference scorecard for evaluating an upstream source before adoption. This demonstrates how to use the scoring rubric, evidence collection, and decision matrix from `references/reference-scorecard.md`.

## Scoring rubric

Each criterion is scored **1–5** where the interpretation depends on the criterion type:

| Score | Benefit criteria (overlap, relevance, quality) | Risk criteria (lock-in, copy risk, maintenance) |
| --- | --- | --- |
| 5 | Excellent fit, high value, strong evidence | Very high risk, likely unacceptable |
| 4 | Good fit, solid evidence | High risk, needs strong mitigation |
| 3 | Moderate fit, mixed evidence | Moderate risk, manageable with process |
| 2 | Weak fit, limited evidence | Low risk, mostly safe |
| 1 | Poor fit, no evidence | Minimal risk |

**License compatibility** uses its own scale:

| Score | Meaning |
| --- | --- |
| 5 | MIT/Apache-2.0/BSD with standalone LICENSE file and clear copyright |
| 4 | MIT/Apache-2.0/BSD declared in README/package.json but no standalone LICENSE file |
| 3 | Permissive license declared ambiguously or with unusual clauses |
| 2 | Copyleft or restrictive license that complicates adaptation |
| 1 | No license, unclear license, or proprietary terms |

## Decision matrix

After scoring all dimensions, compute the weighted decision:

| Dimension | Weight | Score range | Decision signal |
| --- | --- | --- | --- |
| License compatibility | **Must-pass** | 1–2 → reject | If score < 3, classify as `blocked-license` regardless of other scores |
| Maintenance status | 15% | 1–5 | Low score → `defer` |
| Code quality indicators | 15% | 1–5 | Low score → `defer` or `inspiration-only` |
| Relevance to goals | 25% | 1–5 | High score drives `adopt` or `adapt` |
| Vendor lock-in risk | **Must-pass** | 4–5 → reject | If lock-in score ≥ 4, classify as `reject-runtime` |
| Attribution complexity | 15% | 1–5 | High score → `adapt` (rewrite in local language) |
| Import mode | Derived | — | Determined by aggregate of above |

### Import mode decision rules

| Aggregate score (excluding must-pass) | Recommended import mode |
| --- | --- |
| ≥ 3.8 average | `adopt` or `adapt` — bring ideas into local skills/commands/templates |
| 3.0 – 3.7 average | `adapt` — rewrite in original local language with attribution |
| 2.0 – 2.9 average | `inspiration-only` — study concepts, do not import directly |
| < 2.0 average | `reject` — do not pursue |

Override: If license compatibility < 3, override to `blocked-license` regardless of aggregate.
Override: If lock-in risk ≥ 4, override to `reject-runtime` for engine/runtime adoption.

---

## Filled example: mattpocock/skills

### Source metadata

- **Source**: `github.com/mattpocock/skills`
- **Default branch**: `main`
- **Last audited commit**: `a1b2c3d` (2026-05-20)
- **Last checked**: 2026-06-01
- **License**: MIT (standalone `LICENSE` file, copyright Matt Pocock)
- **Primary idea**: Skill-based agent workflow patterns (TDD, debugging, verification, review)

### Scorecard

| Criterion | Score | Evidence | Notes |
| --- | --- | --- | --- |
| License compatibility | **5** | Standalone `LICENSE` file with MIT text. Copyright clearly assigned to Matt Pocock. No additional restrictions. | Cleanest possible license posture. Safe for close adaptation with attribution. |
| Maintenance status | **4** | Active repository with commits through May 2026. Issues addressed promptly. Stable core concepts. | Some skills are more mature than others; newer ones may change. |
| Code quality indicators | **4** | Well-structured markdown skills with clear instructions. Consistent format across skills. Good inline examples. | Some skills are minimal one-pagers; others are more developed. Documentation quality varies by skill. |
| Relevance to Vibe Coding OS goals | **5** | Direct overlap with TDD, debugging, verification, review, and orchestration workflows. Multiple skills already adapted locally. | Primary inspiration source for real-engineering-skills layer. |
| Vendor lock-in risk | **1** | No runtime, no daemon, no hosted service, no database, no CLI dependency. Pure markdown guidance. | Ideal lock-in posture — portable ideas with no infrastructure coupling. |
| Attribution complexity | **2** | MIT license requires attribution. Attribution recorded in `references/sources/mattpocock-skills.md`, `ATTRIBUTIONS.md`, and `NOTICE.md`. | Low complexity — standard MIT attribution is straightforward. |
| **Aggregate** (excl. license & lock-in) | **4.0** | (4 + 4 + 5 + 2) / 4 = 3.75 → round to 4.0 | Strong candidate for `adapt` with attribution. |

### Decision

**Recommended action: `adapt`**

- Feature overlap and relevance are high (5/5).
- License is clean (5/5) — MIT with standalone file.
- Lock-in risk is minimal (1/5).
- Attribution complexity is low (2/5).
- Aggregate score (4.0) exceeds the `adopt`/`adapt` threshold.

**Why `adapt` and not `adopt`**: The local project has its own domain language, folder structure, and conventions. Upstream skills should be rewritten in original Vibe Coding OS language rather than copied verbatim, even though the license permits copying. This preserves local identity and avoids accidental dependency on upstream wording.

### Local impact

| Local file | Change type | Description |
| --- | --- | --- |
| `skills/core/test-driven-development/SKILL.md` | Adapted | TDD workflow rewritten in local language with Vibe Coding OS conventions |
| `skills/core/disciplined-diagnosis/SKILL.md` | Adapted | Debugging workflow adapted with local domain terms |
| `skills/core/review-before-merge/SKILL.md` | Adapted | Review workflow with local verification gates |
| `references/sources/mattpocock-skills.md` | Created | Source documentation with license status and audit history |
| `ATTRIBUTIONS.md` | Updated | MIT attribution for Matt Pocock |
| `references/mappings/source-to-local-skills.md` | Updated | Mapping from upstream skills to local adaptations |

---

## Filled example: multica-ai/andrej-karpathy-skills

### Source metadata

- **Source**: `github.com/multica-ai/andrej-karpathy-skills`
- **Default branch**: `main`
- **Last audited commit**: `e4f5g6h` (2026-04-15)
- **Last checked**: 2026-06-01
- **License**: MIT declared in README metadata only (no standalone `LICENSE` file, no copyright notice)
- **Primary idea**: Anti-overengineering heuristics, practical guardrails for AI coding

### Scorecard

| Criterion | Score | Evidence | Notes |
| --- | --- | --- | --- |
| License compatibility | **3** | MIT declared in README and package.json metadata. No standalone `LICENSE` file. No copyright holder named. | Metadata-only claim is insufficient for vendoring per UPSTREAM_ADOPTION_POLICY.md. Treat as inspiration-only for close adaptation. |
| Maintenance status | **3** | Some commits in early 2026, but activity has slowed. Issues open for weeks. | Stability is acceptable for now but could degrade. |
| Code quality indicators | **3** | Concise, opinionated guardrails. Good practical advice. Format is less structured than mattpocock/skills. | Value is in the ideas, not the structure. Local adaptation benefits from reformatting. |
| Relevance to Vibe Coding OS goals | **4** | Anti-overengineering, scope discipline, and practical guardrails align with Vibe Coding OS principles of simplicity and verification. | Less direct skill overlap than mattpocock/skills, but high principle overlap. |
| Vendor lock-in risk | **1** | Pure markdown guidance. No runtime, daemon, or hosted service. | No lock-in concerns. |
| Attribution complexity | **3** | MIT claimed but incomplete — no standalone LICENSE file means attribution requirements are ambiguous. | Must default to `inspiration-only` until license posture is clarified per policy. |
| **Aggregate** (excl. license & lock-in) | **3.25** | (3 + 3 + 4 + 3) / 4 = 3.25 | Meets `adapt` threshold, but license limits to `inspiration-only` for close work. |

### Decision

**Recommended action: `inspiration-only`**

- Aggregate score (3.25) meets the `adapt` threshold.
- However, license compatibility (3/5) triggers the override: metadata-only MIT claim without a standalone LICENSE file means close adaptation is not safe.
- Per UPSTREAM_ADOPTION_POLICY.md: "A metadata-only license claim is not enough for vendoring."

**What this means in practice**:
- Study the general ideas (anti-overengineering, scope discipline).
- Rewrite any useful principles in original local language.
- Do NOT copy exact wording, structure, or code.
- Revisit if the upstream adds a standalone LICENSE file with clear copyright.

### Local impact

| Local file | Change type | Description |
| --- | --- | --- |
| `references/sources/multica-ai-andrej-karpathy-skills.md` | Created | Source documentation with license concern noted |
| `skills/core/scope-discipline/SKILL.md` | Inspired | General anti-overengineering principle re-expressed in local language |
| No direct file copies | — | No upstream content copied directly |

---

## Quick reference: import mode definitions

| Mode | Meaning | When to use |
| --- | --- | --- |
| `adopt` | Bring idea into local skills/commands/templates with minimal transformation | High fit, clean license, low maintenance cost |
| `adapt` | Rewrite idea in original local language with proper attribution | Good fit, but local conventions differ from upstream |
| `inspiration-only` | Study concepts only; rewrite from first principles if useful | License incomplete, or idea is valuable but structure differs significantly |
| `defer` | Revisit later when more evidence is available | Insufficient data, recent upstream changes need observation |
| `reject` | Do not pursue | Poor fit, unacceptable risk, or minimal value |
| `blocked-license` | Cannot adapt closely until license is resolved | License is missing, unclear, or incompatible |
| `reject-runtime` | Do not vendor as runtime/engine; may adapt portable ideas | Engine/runtime adds unacceptable lock-in or maintenance burden |

## How to use this scorecard

1. Copy the empty scorecard format from `references/reference-scorecard.md`.
2. Fill in the evidence columns by inspecting the upstream repository, local reference docs, and feature mappings.
3. Score each criterion 1–5 using the rubric above.
4. Apply the decision matrix to determine the recommended import mode.
5. Record the decision in `references/sources/<source-id>.md` and `references/mappings/adoption-classification.md`.
6. Run `npm run validate:references` to confirm the scorecard is properly recorded.
