# Sandboxed Execution

## Purpose

Define explicit work-scoping boundaries for sub-agents or delegated passes so each worker operates within a declared sandbox: know which files are read-only, which are write-allowed, what side effects are permitted, and what isolation guarantees apply. The sandbox is a documentation and coordination contract, not a runtime enforcement mechanism.

## When to use

Use whenever delegation spans multiple files or agents, when the same file set could be touched by more than one worker, when a worker runs risky operations (bulk edits, schema changes, destructive tests), or when side-effect discipline protects integration. Skip for single-file, single-pass edits where the worker is the sole author.

## Inputs

- Full file tree or relevant paths for the task.
- Candidate subtask boundaries and file ownership assignments.
- Known side effects (file writes, process launches, network calls, test runs).
- Integration review plan and rollback strategy.

## Workflow

### 1. Declare the sandbox scope

Before any worker starts, write the scope declaration covering:
- **write zone**: files the worker may create or modify. Be explicit about directories, file patterns, and any files excluded from the write zone.
- **read-only zone**: files the worker may inspect for context but must not modify. Include API contracts, config files, shared types, and existing implementations to follow.
- **forbidden zone**: files the worker must not read or write. These are owned by other workers, are secrets, or are out of scope for this task.

### 2. Declare side effects

List every side effect the worker's execution may produce:
- file creations, modifications, or deletions;
- process launches or background jobs;
- network requests or external API calls;
- test database writes or seed data changes;
- log files, temporary directories, or build artifacts.

Mark each side effect as **intentional** (part of the task) or **incidental** (a consequence the integrator should know about). Intentional side effects in another worker's write zone are conflicts that must be resolved before starting.

### 3. Isolation checklist

Before the worker begins, confirm:
- [ ] Write zone does not overlap with any other worker's write zone.
- [ ] Read-only zone files are not in the write zone of any parallel worker.
- [ ] Forbidden zone is clearly documented and communicated.
- [ ] Side-effect declaration is complete and shared with integration.
- [ ] Rollback plan exists if the worker's changes need reverting.
- [ ] Validation gates the worker should run before declaring done.

### 4. Execute within boundaries

The worker implements within the declared write zone only. If a change requires touching a file outside the write zone, the worker must pause and request scope expansion from the orchestrator or integrator. Unauthorized scope expansion is a sandbox violation.

### 5. Review sandbox compliance

After the worker completes, an integrator or reviewer checks:
- Did the worker touch any file outside its write zone?
- Were any side effects undeclared?
- Is every changed file traceable to an intentional task requirement?
- Does the diff match the scope declaration?

### 6. Release the sandbox

Once the worker's output is reviewed and integrated, release the sandbox: affected files are now available for other workers in a new scope declaration.

## Outputs

- Sandbox scope declaration (write zone, read-only zone, forbidden zone, side effects).
- Isolation checklist output with pass/fail per item.
- Sandbox compliance review notes.
- Released sandbox after integration.

## Failure modes

- Overlapping write zones causing silent conflicts at integration time.
- Undeclared side effects that corrupt other workers' state or test data.
- Scope declaration too vague (entire repo as write zone) — scope must be concrete.
- Worker modifying a read-only or forbidden file without authorization.
- No rollback plan, making scope violations irreversible without git expertise.
- Treating the sandbox as runtime enforcement rather than a coordination contract — this is markdown guidance, not a container or permission system.

## Verification checklist

- [ ] Write zone is explicit (paths or file patterns).
- [ ] Read-only zone is explicit and justified.
- [ ] Side-effect declaration lists every operation outside pure file writes.
- [ ] Isolation checklist is completed before execution starts.
- [ ] Sandbox compliance review confirms no scope violations.
- [ ] Rollback strategy is documented.

## Related skills

- `skills/core/subagent-driven-development/SKILL.md` — delegation pattern that benefits from sandbox scoping.
- `skills/core/superagent-orchestration/SKILL.md` — orchestrator that assigns sandbox scopes to workers.
- `skills/core/context-rich-implementation/SKILL.md` — context-rich briefs that include scope declarations.
- `templates/sandbox-scope-template.md` — template for writing a scope declaration.
- `references/features/sandboxed-execution.md` — design rationale.

## Ghi chú tiếng Việt

Kỹ năng này định nghĩa phạm vi làm việc cho sub-agent: vùng ghi (write zone), vùng chỉ đọc (read-only zone), vùng cấm (forbidden zone), và khai báo tác dụng phụ (side effects). Đây là hợp đồng phối hợp markdown, không phải container hay runtime enforcement. Dùng kèm sandbox-scope template và isolation checklist trước khi chạy.
