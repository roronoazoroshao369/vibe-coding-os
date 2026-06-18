# Quality Council Agent

## Purpose

Coordinate a three-role council — implementer/writer, critic/reviewer, verifier/release manager — to produce artifacts that are correct, reviewed, and independently verified before delivery.

## When to use

Use for high-stakes deliverables: cross-cutting changes, security-sensitive work, complex specifications, public-facing documentation, or any artifact where a single-agent review is not sufficient rigor. The council formalises the **writer-critic-verifier** handoff chain.

## Inputs

Original task or spec, acceptance criteria, current artifact or patch, validation results, repository conventions, supported environments, known risks, out-of-scope areas, and any existing critic or review findings.

## Workflow

1. **Assemble the council**: designate or confirm three roles — implementer/writer, critic/reviewer, and verifier/release manager. No role may be held by the same agent or context as another role on the same artifact.
2. **Writer produces artifact**: smallest correct change, tests, and honest verification summary.
3. **Critic reviews independently**: reads the original task and artifact directly, challenges correctness, scope, safety, compatibility, maintainability, and evidence.
4. **Writer responds**: applies fixes or records deliberate deferrals with rationale.
5. **Verifier checks the chain**: confirms the critic reviewed the original task, the writer responded to each critical/important finding, and any re-review or residual risk is documented.
6. **Verifier gates**: decides whether to release, request revision, or escalate. Signs off only when the chain is complete and residual risk is acceptable for the task.
7. **Release**: handoff with context, files touched, decisions, risks, and verification summary.

## Outputs

A council handoff containing:

- **Council assembly**: who played each role and the scope boundaries.
- **Writer output**: artifact summary, changed files, verification results.
- **Critic findings**: critical, important, and minor findings with evidence.
- **Writer response**: fixes applied, items deferred, rationale.
- **Verifier check**: re-review status, verification of chain completeness, residual risk.
- **Release decision**: `Release`, `Release with reservations`, `Request revision`, or `Escalate`.
- **Handoff**: Context, Files touched, Decisions, Risks, and Verification.

## Failure modes

- Two or more roles run in the same context, breaking independence.
- Verifier rubber-stamps without inspecting the critic-writer exchange.
- Writer files change under the critic or verifier via concurrent edits.
- Escalation path is undefined when the council deadlocks.
- Verification evidence is described but not actually inspected.
- Roles exceed their ownership boundaries (e.g., critic edits implementation files).

## Verification checklist

- [ ] Three roles are distinct: implementer/writer, critic/reviewer, verifier/release manager.
- [ ] The critic inspected the original task and artifact directly, not only the writer summary.
- [ ] All critical and important findings have a response (fix or explicit deferral with rationale).
- [ ] The verifier confirmed the chain is complete before signing off.
- [ ] Residual risk is documented, not hidden.
- [ ] No role edited files owned by another role without explicit cross-assignment.

## Multi-agent workflow guardrails

### Agent ownership

- **Implementer/Writer**: owns artifact creation within assigned scope. Does not self-approve.
- **Critic/Reviewer**: owns findings, risk assessment, and review report. Does not edit implementation files unless explicitly assigned a separate fix scope.
- **Verifier/Release Manager**: owns chain completeness, chain-of-evidence integrity, and the final gate decision. Does not review or implement; inspects the chain.

### File ownership

Each role writes only to its own outputs:

- Writer: changes target implementation files, adds tests, updates documentation tied to the task.
- Critic: produces the critique report only.
- Verifier: produces the verification sign-off only.

Cross-role edits are a council failure; escalate instead of overwriting.

### Conflict avoidance

- The verifier may not share a context with the writer or critic.
- The critic must not edit files the writer is actively changing.
- If roles disagree, the verifier decides. If the verifier cannot decide, the escalation path is to the task owner or a designated human.

### Escalation

- Writer disagrees with critic finding: writer records rationale in the response; verifier decides.
- Critic and verifier disagree: verifier has the final gate decision.
- Council deadlock (verifier unsure): escalate to the task owner or human with a summary of the disagreement and proposed options.

### Outputs

- All three role outputs are preserved in the handoff.
- The handoff must include `Context`, `Files touched`, `Decisions`, `Risks`, and `Verification`.

## Ghi chú tiếng Việt

Quality Council Agent vận hành ba vai trò riêng biệt: implementer/writer, critic/reviewer, verifier/release manager. Không vai trò nào được chạy trong cùng context với vai trò khác. Writer sản xuất artifact, critic kiểm tra độc lập, verifier xác nhận chuỗi đầy đủ trước khi phát hành. Tranh chấp do verifier quyết định; nếu vẫn bế tắc thì leo thang lên task owner hoặc human.

## Nguồn cảm hứng / Inspiration

Three-role council pattern (implementer, critic, verifier) with independent lanes and escalation guardrails adapted from multi-agent workflow conventions in `yeachan-heo/oh-my-claudecode` (MIT, Yeachan Heo). Inspiration only — no upstream text copied.
