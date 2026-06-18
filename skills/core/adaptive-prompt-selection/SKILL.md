# Skill: Adaptive Prompt Selection

## Purpose

Automatically classify a task into a type (feature, bugfix, refactor, security, migration) and select the most relevant quality packs from the skill registry so the agent applies proportional quality gates without manual curation each time. This replaces the "which checklists should I run?" decision with a data-driven lookup.

## When to use

Use at the start of any non-trivial coding task to determine which quality packs (checklists, review prompts, specialized skills) should be composed into the working context. Triggers include "what quality checks should I run", "which packs apply to this task", or any time the agent begins implementation without having selected its quality gates.

## Inputs

- **Task description** — what the user asked for
- **Changed files / blast radius** — which files or systems are affected
- **Task type** — classified as one of: `feature`, `bugfix`, `refactor`, `security`, `migration`
- **Quality pack registry** — the full list of available quality packs from `registry/skills.json` and checklist skills

## Quality pack matrix

The matrix maps task types to recommended quality packs. Use `templates/adaptive-prompt-matrix.md` as the canonical reference.

| Task Type | Recommended Quality Packs |
| --- | --- |
| **feature** | API quality (if endpoint added) · DB migration (if schema change) · Frontend state (if UI state involved) · Async jobs (if background processing) · Self-review · Adversarial review |
| **bugfix** | Bug-fix lifecycle · Disciplined diagnosis · Self-review · Diff audit (if risky area) |
| **refactor** | Self-review · Diff audit · Quality rubric · Adversarial review (if architecture-sensitive) |
| **security** | Auth quality · Adversarial review · Privacy filter · Diff audit |
| **migration** | DB migration quality · API quality (if endpoints change) · Self-review · Adversarial review |

**Domain amplifiers:** If the task touches a specific domain, add that domain's quality pack regardless of task type. Example: a `feature` that adds an auth endpoint gets `API quality + Auth quality + Self-review + Adversarial review`.

## Workflow

1. **Classify the task.** Read the task description and changed files. Assign a primary task type from the matrix above. If the task spans multiple types, use the heavier type and add domain amplifiers.
2. **Identify domain amplifiers.** Check which systems the task touches: API endpoints, database schema, authentication, frontend state, async/background jobs. Each match adds its quality pack.
3. **Look up the matrix.** For the classified task type, retrieve the base quality pack list from the matrix.
4. **Apply domain amplifiers.** Add any domain-specific packs not already in the base list.
5. **Prioritize.** If the resulting list is long (6+ packs), apply the `adaptive-flow` tier logic: tiny/small tasks get the lightest subset; medium+ get the full set.
6. **Output the recommended prompt stack.** List the packs with their skill paths so the agent can load them.
7. **Compose into the task context.** The agent loads each recommended pack and runs it as part of the task workflow.

## Outputs

A recommended stack of quality packs (skill names and paths) tailored to the specific task type and domain, ready to be loaded and executed.

## Failure modes

- Classifying a security-critical feature as plain "feature" and missing the auth quality pack
- Over-loading quality packs for tiny tasks, adding unnecessary overhead
- Ignoring domain amplifiers and only using the base matrix row
- Never updating the matrix when new quality packs are added to the registry
- Applying all packs unconditionally without considering task tier

## Verification checklist

- [ ] Task type is classified and stated explicitly.
- [ ] Domain amplifiers are identified based on changed files or systems.
- [ ] Base quality packs are selected from the matrix for the task type.
- [ ] Domain-specific packs are added when relevant.
- [ ] Pack count is proportional to task tier (not too many for small tasks).
- [ ] Each recommended pack has a valid skill path in the registry.
- [ ] The recommended stack is confirmed with the user before execution.

## Related skills/commands

- `commands/vibe-adaptive-prompt.md` — command entry point for classifying and selecting packs
- `templates/adaptive-prompt-matrix.md` — the canonical task-type-to-pack matrix
- `skills/core/adaptive-flow/SKILL.md` — tier-based workflow selection
- `skills/core/model-weakness-memory/SKILL.md` — complementary weakness-aware checks
- `skills/core/quality-execution-contract/SKILL.md` — pre-coding quality contract
- `skills/prompts/quality-rubric/SKILL.md` — universal quality baseline

## Ghi chú tiếng Việt

Tự động phân loại task (feature, bugfix, refactor, security, migration) và chọn các quality pack phù hợp nhất từ registry. Ma trận task-type → quality-pack được lưu trong `templates/adaptive-prompt-matrix.md`. Workflow: phân loại task → xác định domain amplifiers → tra cứu ma trận → ưu tiên theo tier → output prompt stack. Kết hợp với `adaptive-flow` để đảm bảo số lượng pack tỷ lệ với độ phức tạp task.
