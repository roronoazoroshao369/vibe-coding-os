# Reference Scorecard

Use this scorecard during every upstream audit to make adoption decisions explicit, comparable, and license-aware. Score each criterion with evidence from the source repository, local reference docs, and Vibe Coding OS mappings before changing local skills, commands, templates, or registries.

## Rating scale

Use one of these values for each criterion unless the criterion defines a different scale:

- `high` — strong signal, high fit, or high risk depending on the criterion.
- `medium` — mixed signal, partial fit, or manageable risk.
- `low` — weak signal, low fit, or low risk.
- `unknown` — not enough evidence yet; investigate before adopting.

For risk criteria, `high` means the risk is high and should usually push the recommendation toward `defer` or `ignore` until mitigated.

## Criteria

| Criterion | What to assess | Evidence to collect |
| --- | --- | --- |
| Feature overlap with Vibe Coding OS | How directly the upstream idea maps to Vibe Coding OS goals, skills, commands, templates, adapters, or reference features. | `references/index.json`, `references/mappings/feature-to-local-files.md`, `references/mappings/source-to-local-skills.md`, impacted local files. |
| Activity/recent commit status | Whether the upstream source appears actively maintained or recently changed enough to justify audit attention. | Latest commit hash/date, release notes when available, upstream issue/PR activity when relevant. |
| License clarity | Whether the upstream license and attribution requirements are clear enough for the intended use. | Root license file, package metadata, NOTICE/attribution files, source doc license notes. |
| Documentation quality | Whether the source explains concepts, setup, behavior, and tradeoffs well enough to audit safely. | README, docs, examples, changelog, inline comments only when necessary. |
| Skill/command/template relevance | Whether the idea can be cleanly expressed as a Vibe Coding OS skill, command, or template without broad rewrites. | Existing files in `skills/`, `commands/`, `templates/`, and mapping docs. |
| Memory/privacy risk | Whether the idea could store secrets, personal data, stale context, or unsafe long-term memory. | Memory behavior, persistence defaults, examples, data-retention assumptions, privacy controls. |
| Multi-agent relevance | Whether the idea improves agent ownership, delegation, review, verification, or coordination. | Multi-agent workflows, handoff rules, role definitions, review gates, disjoint write-scope practices. |
| Copy/licensing risk | Whether local implementation would require copying protected expression, vendoring source, or closely adapting licensed text/code. | Exact upstream artifacts needed, amount of original wording/code required, attribution plan, license compatibility. |
| Maintenance cost | Ongoing effort to keep the adapted idea current, tested, documented, and compatible with local conventions. | Number of local files touched, validation needs, future sync burden, complexity added. |
| Recommended action | Final decision after balancing fit, value, risk, and maintenance cost. | One of `adopt`, `adapt`, `defer`, or `ignore`, with a short rationale. |

## Recommended action definitions

- `adopt` — bring the idea into Vibe Coding OS with minimal transformation because fit is high, license clarity is strong, and maintenance cost is acceptable.
- `adapt` — translate the idea into local wording, structure, or smaller primitives because the pattern is valuable but should not be copied directly.
- `defer` — revisit later because evidence, licensing, implementation readiness, or maintenance capacity is insufficient.
- `ignore` — do not pursue because the idea does not fit Vibe Coding OS goals or has unacceptable risk/cost.

## Scorecard format

Copy this section into audit notes or use `templates/reference-scorecard-template.md`.

```md
## Reference scorecard

| Criterion | Rating | Evidence | Notes |
| --- | --- | --- | --- |
| Feature overlap with Vibe Coding OS | <low/medium/high/unknown> | <files, docs, commits, mappings> | <short rationale> |
| Activity/recent commit status | <low/medium/high/unknown> | <commit hash/date, release, issue/PR signal> | <short rationale> |
| License clarity | <low/medium/high/unknown> | <license files, metadata, attribution notes> | <short rationale> |
| Documentation quality | <low/medium/high/unknown> | <README, docs, examples, changelog> | <short rationale> |
| Skill/command/template relevance | <low/medium/high/unknown> | <candidate local skills, commands, templates> | <short rationale> |
| Memory/privacy risk | <low/medium/high/unknown> | <storage, retention, examples, privacy controls> | <risk and mitigation> |
| Multi-agent relevance | <low/medium/high/unknown> | <handoff, roles, review, verification evidence> | <short rationale> |
| Copy/licensing risk | <low/medium/high/unknown> | <copying required, license compatibility, attribution plan> | <risk and mitigation> |
| Maintenance cost | <low/medium/high/unknown> | <files touched, validation burden, sync complexity> | <short rationale> |
| Recommended action | <adopt/adapt/defer/ignore> | <decision evidence> | <next step> |
```

## Decision guidance

- Prefer `adopt` only when feature overlap and local relevance are high, license clarity is high, and copy/privacy risks are low.
- Prefer `adapt` when the workflow pattern is valuable but local wording, scope, or implementation should differ.
- Prefer `defer` when evidence is incomplete, recent upstream movement needs more observation, or risks need review.
- Prefer `ignore` when the source adds little local value, requires unsafe memory behavior, or creates unacceptable licensing/maintenance risk.
