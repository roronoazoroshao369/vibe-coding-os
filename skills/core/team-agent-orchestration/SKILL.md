# Skill: Team-Agent Orchestration

## Purpose

Design and coordinate a temporary agent team for large or risky work without turning Vibe Coding OS into a runtime. Use this when one agent cannot safely hold the whole domain, but keep final integration, verification, and attribution under one accountable owner.

## When to use

Use for `large` or `risky` Adaptive Flow tasks, multi-domain implementation, migration sweeps, adversarial review, or any change that benefits from separate producer, reviewer, tester, architect, or domain-analysis lanes.

Do not use for tiny/small work, tightly coupled edits to the same files, or tasks where orchestration overhead exceeds value.

## Inputs

Task intent, spec/plan/tasks if available, affected domains, risk surfaces, validation commands, expected deliverables, write ownership, integration owner, and handoff format.

## Team patterns

Choose the smallest pattern that fits:

| Pattern | Use when | Shape |
| --- | --- | --- |
| Pipeline | Work has ordered phases. | domain analysis → design → implementation → verification. |
| Fan-out / fan-in | Multiple independent areas need coverage. | several explorers/implementers → one integrator. |
| Expert pool | Different lenses matter. | architecture, security, test, UX, docs. |
| Producer-reviewer | Quality risk is high. | author pass → separate skeptical pass. |
| Supervisor | Many tasks need routing. | coordinator owns task list and integration. |
| Hierarchical delegation | Scope is broad enough for sub-teams. | lead splits domains; each domain returns structured handoff. |

## Workflow

1. Classify with Adaptive Flow. Only proceed if team value is clear.
2. Run domain analysis: list systems, files, risks, tests, and unknowns.
3. Design the team: roles, pattern, file ownership, message channels, stop conditions.
4. Generate role briefs in original wording: goal, scope, forbidden edits, inputs, outputs, validation.
5. Generate supporting skills or checklists only when reused beyond the current task.
6. Orchestrate work through visible tasks and structured handoffs.
7. Fan results back to one integrator; never let workers merge blindly.
8. Validate with dry-run reasoning first, then with the chosen checks on the integrated result.
9. Compare “with team” vs “without team” cost/risk; record if team use was worthwhile.

## Role routing

- Domain analyst: read-only map of business/domain boundaries.
- Architect: design and trade-off pass; no code ownership unless explicitly assigned.
- Implementer: focused write scope; minimal diff.
- Reviewer/critic: separate lane; tries to reject unsafe or incomplete work.
- Tester/verifier: proves acceptance criteria and reports gaps.
- Integrator: owns final diff, conflicts, registry/reference updates, and final verification.

## Handoff contract

Each role returns:

```markdown
## Scope
- Role, files/domains, and exclusions.

## Findings or changes
- What was learned or changed.

## Decisions
- Material choices and rejected options.

## Risks
- Correctness, coordination, attribution, validation, or rollback concerns.

## Verification
- Exact checks run, results, and limits.

## Next action
- What the integrator should do now.
```

## Guardrails

- Use progressive disclosure: give each worker only needed spec, files, constraints, and validation.
- Keep shared registries, migrations, global docs, and generated artifacts serialized unless one integrator owns them.
- Prefer worktrees for parallel write lanes when the harness supports them.
- Add watchdog rules for long-running teams: idle timeout, blocked-task escalation, and stop-on-conflict.
- Dynamic scaling is allowed only by explicit need: add roles for uncovered risk, remove roles once they stop adding evidence.
- No upstream runtime, tmux layer, mailbox, hook daemon, installer, or generated `.claude/agents`/`.claude/skills` files are required by this skill.
- Native team spawning exists only when a separate runtime such as the OMC plugin is installed; this repo provides markdown guidance, not that runtime.

## Outputs

Team architecture note, role briefs, task ownership table, handoffs, integrated patch or docs, validation evidence, and an orchestration retrospective.

## Failure modes

- Spawning a team for tiny/small work where solo flow is faster and safer.
- Workers editing shared files, registries, or references without one integrator.
- Authoring and approval happening in the same lane (self-approval).
- Handoffs that omit validation status or rejected options.
- Documenting upstream runtime behavior as if Vibe Coding OS can enforce it.
- Adding roles that duplicate each other and produce noise instead of evidence.

## Verification checklist

- [ ] Team pattern selected and justified.
- [ ] Domain analysis completed before role assignment.
- [ ] Write scopes and integrator are explicit.
- [ ] Review/test lanes are separate from authoring lanes.
- [ ] Dry-run validation found no obvious coordination gap.
- [ ] Final integrated result was verified, not only per-agent outputs.
- [ ] Attribution says inspiration-only; no upstream text/code/runtime was copied.

## Related artifacts

- `commands/vibe-team.md`
- `templates/team-architecture-template.md`
- `docs/workflows/team-agent-orchestration.md`
- `skills/core/subagent-driven-development/SKILL.md`
- `docs/workflows/adaptive-flow.md`

## Constitution alignment

This skill keeps teams proportional, accountable, original, and verified. It adapts orchestration ideas as markdown guidance only; it does not vendor or require any upstream engine.
