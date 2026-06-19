# Expert Mode

Expert Mode is the v1.8.0 extension of Quality Shield for high-risk, ambiguous, or easy-to-rubber-stamp work. It adds adversarial review, explicit critique passes, task-specific quality packs, and multi-agent review patterns while staying markdown-first.

Expert Mode does **not** expand runtime scope. It uses skills, commands, templates, and registries only. No daemon, runner, telemetry service, model scoring service, or new validation gate is required for v1.8.0.

## When to escalate from Quality Shield

Start with [`docs/quality-shield.md`](quality-shield.md): intent, context, smallest safe diff, verification honesty, self-review, and scorecards.

Escalate to Expert Mode when any of these are true:

- The change is security-sensitive, auth-related, data-migration-related, or user-impacting.
- A normal self-review feels too likely to rubber-stamp the patch.
- The task spans multiple files, state transitions, background jobs, or external contracts.
- Tests pass, but coverage of edge cases, compatibility, or failure modes is unclear.
- A separate writer/critic or council-style review would materially reduce risk.
- You need a domain checklist for APIs, database migrations, auth, frontend state, or async jobs.

## Expert Mode components

### 1. Adversarial Code Review

Use Adversarial Code Review when a patch needs a skeptical red-team pass before merge or release.

- Skill: [`skills/core/adversarial-code-review/SKILL.md`](../skills/core/adversarial-code-review/SKILL.md)
- Command: [`commands/vibe-red-team-review.md`](../commands/vibe-red-team-review.md)

Focus areas:

- Correctness and edge cases.
- Security, safety, privacy, and permission boundaries.
- Meaningful tests and validation evidence.
- Compatibility, migrations, public contracts, and supported environments.
- Minimal diff discipline and scope control.

Expected output: severity-ranked findings plus a verdict: `Request changes`, `Approve with reservations`, or `Approve`.

### 2. Critique Pass Protocol

Use the Critique Pass Protocol when a draft, plan, implementation summary, patch, or final response needs a structured second look but a full red-team review would be too heavy.

- Skill: [`skills/core/critique-pass-protocol/SKILL.md`](../skills/core/critique-pass-protocol/SKILL.md)
- Related prompt skill: [`skills/prompts/critique-pass/SKILL.md`](../skills/prompts/critique-pass/SKILL.md)
- Command: [`commands/vibe-critique-pass.md`](../commands/vibe-critique-pass.md)
- Template: [`templates/critique-pass-template.md`](../templates/critique-pass-template.md)

Core loop:

1. Writer states the intended solution and evidence.
2. Critic challenges task fit, assumptions, scope, tests, safety, and verification.
3. Writer fixes critical/important findings or explicitly defers them.
4. Critic re-reviews changed risk areas.
5. Final verdict states residual risk honestly.

### 3. Task-specific quality packs

Quality packs are focused checklists for recurring risky task types. They extend the universal Quality Shield rubric with domain-specific failure modes.

- API endpoints:
  - Skill: [`skills/checklists/api-endpoint-quality/SKILL.md`](../skills/checklists/api-endpoint-quality/SKILL.md)
  - Command: [`commands/vibe-quality-api.md`](../commands/vibe-quality-api.md)
- Database migrations:
  - Skill: [`skills/checklists/db-migration-quality/SKILL.md`](../skills/checklists/db-migration-quality/SKILL.md)
  - Command: [`commands/vibe-quality-db-migration.md`](../commands/vibe-quality-db-migration.md)
- Auth and permissions:
  - Skill: [`skills/checklists/auth-quality/SKILL.md`](../skills/checklists/auth-quality/SKILL.md)
  - Command: [`commands/vibe-quality-auth.md`](../commands/vibe-quality-auth.md)
- Frontend state:
  - Skill: [`skills/checklists/frontend-state-quality/SKILL.md`](../skills/checklists/frontend-state-quality/SKILL.md)
  - Command: [`commands/vibe-quality-frontend-state.md`](../commands/vibe-quality-frontend-state.md)
- Async/background jobs:
  - Skill: [`skills/checklists/async-job-quality/SKILL.md`](../skills/checklists/async-job-quality/SKILL.md)
  - Command: [`commands/vibe-quality-async-job.md`](../commands/vibe-quality-async-job.md)

Use these packs before final review, not as replacements for project tests. A checklist finding should become either a fix, a test, a documented deferral, or a clarification question.

- Template: [`templates/quality-pack-scorecard.md`](../templates/quality-pack-scorecard.md)

### 4. Writer-Critic Pair

Use Writer-Critic Pair when one role should create the artifact and another should independently challenge it before delivery.

- Skill: [`skills/agents/writer-critic-pair/SKILL.md`](../skills/agents/writer-critic-pair/SKILL.md)

This pattern works with one model using separated phases or two separate agents. Keep ownership explicit: the writer changes the artifact, the critic reviews against the original task and evidence, and the final owner decides whether to ship, revise, or ask for clarification.

### 5. Quality Council

Quality Council is the heavier multi-agent pattern for high-stakes work where more than one critic lens is valuable. Use it for releases, architecture-sensitive changes, security-sensitive changes, or contentious trade-offs.

- Skill: [`skills/agents/quality-council/SKILL.md`](../skills/agents/quality-council/SKILL.md)

Recommended council lenses:

- Correctness and edge cases.
- Security/safety and privacy.
- Tests and verification evidence.
- Maintainability, compatibility, and minimal scope.
- Product/user impact and documentation readiness.

The council should produce a concise decision record: findings, required fixes, explicit deferrals, verification evidence, and final release posture. It should not become an open-ended debate or a runtime orchestration requirement.

## Recommended Expert Mode workflow

1. Start with Quality Shield: define intent, acceptance criteria, constraints, and verification plan.
2. Select the smallest relevant Expert Mode layer:
   - Use a task-specific quality pack for known domains.
   - Use a critique pass for normal non-trivial work.
   - Use adversarial review for risky code or pre-merge confidence.
   - Use Writer-Critic Pair or Quality Council for multi-agent review needs.
3. Fix critical and important findings with the smallest safe diff.
4. Rerun the most relevant verification.
5. Final response states changed files, checks run, checks not run, residual risks, and any deferrals.

## Boundary with Quality Engine and runtime

Expert Mode is part of the portable core. It extends Quality Shield by adding stronger review protocols and specialized checklists, but it remains plain markdown content.

- No v1.8.0 runtime expansion.
- No new validation gate for v1.8.0.
- No dependency on Quality Engine runners.
- No remote telemetry or model-scoring service.
- No secret-shaped examples in docs or templates.

Future Quality Engine work may automate selection or reporting, but Expert Mode must remain usable by reading and applying the linked skills, commands, and templates directly.
