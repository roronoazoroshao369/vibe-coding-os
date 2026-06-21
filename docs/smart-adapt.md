# Smart Adapt (v1.9.0)

Smart Adapt is the v1.9.0 quality discipline layer that makes an agent's quality response proportional to task risk, model weaknesses, and project history. It extends Quality Shield (v1.7) and Expert Mode (v1.8) by adding model-aware memory, adaptive prompt selection, a lessons-learned database, and a golden-example library — all without runtime expansion.

> **Design principle:** An agent should not apply identical quality gates to every task. It should adapt based on what it knows about the model, the task type, the domain, past mistakes, and proven examples.

## Components

### 1. Model Weakness Memory

Tracks known failure patterns per model type (e.g., "Claude Sonnet misses null checks", "GPT-4 hallucinates imports", "Llama 3 makes off-by-one errors") and auto-injects targeted pre-flight checks before tasks.

- **Skill:** [`skills/core/model-weakness-memory/SKILL.md`](../skills/core/model-weakness-memory/SKILL.md)
- **Command:** [`commands/vibe-model-weakness.md`](../commands/vibe-model-weakness.md)
- **Template:** [`templates/model-weakness-log.md`](../templates/model-weakness-log.md)

**Workflow:**
1. Load the weakness log for the active model type.
2. Match known failure patterns against the current task description and domain.
3. Inject specific, actionable checks into the pre-flight checklist.
4. Execute the task with injected checks as mandatory gates.
5. Post-task: evaluate which checks caught issues, update the log with new evidence.
6. Prune stale entries when model updates resolve a weakness.

**Example:** If `claude-sonnet` has a logged weakness for "missing null-checks on database query results", any task touching a database automatically gets: _"Verify every query result is null-checked before property access."_

### 2. Adaptive Prompt Selection

Automatically classifies a task into a type (feature, bugfix, refactor, security, migration) and selects the most relevant quality packs from the skill registry. Replaces the "which checklists should I run?" decision with a data-driven lookup.

- **Skill:** [`skills/core/adaptive-prompt-selection/SKILL.md`](../skills/core/adaptive-prompt-selection/SKILL.md)
- **Command:** [`commands/vibe-adaptive-prompt.md`](../commands/vibe-adaptive-prompt.md)
- **Template:** [`templates/adaptive-prompt-matrix.md`](../templates/adaptive-prompt-matrix.md)

**Workflow:**
1. Classify the task type from the description and changed files.
2. Identify domain amplifiers — which systems the task touches (API, DB, auth, frontend, async).
3. Look up base quality packs from the adaptive-prompt matrix.
4. Add domain amplifiers not already in the base list.
5. Apply tier logic: tiny/small tasks get a light subset; medium+ get the full set.
6. Output the recommended prompt stack with skill paths ready to load.

**Domain amplifier example:** A `feature` that adds an auth endpoint gets: `API quality + Auth quality + Self-review + Adversarial review`.

### 3. Quality Scorecard Session & Report

Provides a structured, repeatable way to assess per-file quality outcomes during a coding session and aggregate them across sessions for trend analysis.

- **Templates:** [`templates/quality-scorecard.md`](../templates/quality-scorecard.md), [`templates/quality-scorecard-session.md`](../templates/quality-scorecard-session.md)
- **Scripts:** [`scripts/validate-skill-quality.mjs (replaced quality-scorecard v2.17)`](../scripts/validate-skill-quality.mjs (replaced quality-scorecard v2.17)), [`scripts/quality-scorecard-report.mjs`](../scripts/quality-scorecard-report.mjs)
- **Package scripts:** `npm run quality:scorecard`, `npm run quality:scorecard:report`

**Session template fields:**
- Per-file: file changed, tests added, quality checks run, warnings found, score (0–100)
- Aggregated: total files changed, tests added, checks run, average score, lowest-scoring file, trend notes

**Report workflow:**
1. Run `npm run quality:scorecard` to generate a per-session scorecard.
2. Run `npm run quality:scorecard:report` to aggregate historical scorecards.
3. Use the aggregated report to detect quality trends (improving, stable, declining).

### 4. Lessons Learned DB

Maintains a structured, searchable record of coding mistakes, root causes, fixes, and prevention rules. Agents learn from local project history instead of repeating the same mistakes.

- **Skill:** [`skills/core/lessons-learned-db/SKILL.md`](../skills/core/lessons-learned-db/SKILL.md)
- **Command:** [`commands/vibe-lessons-learned.md`](../commands/vibe-lessons-learned.md)
- **Template:** [`templates/lesson-entry-template.md`](../templates/lesson-entry-template.md)

**Workflow:**
1. After a fix or audit finding, determine if the mistake is a repeatable pattern.
2. Record: error description, root cause, fix, prevention rule, metadata (date, severity, model, area).
3. Before similar tasks, search the log by area, keyword, or severity.
4. Inject matching prevention rules into the implementation plan or review checklist.
5. After implementation, verify the prevention rule was satisfied.

**Key rule:** Record the root cause, not just the symptom. Keep entries free of secrets and sensitive logs. Do not record every minor fix as a durable lesson.

### 5. Golden Example Library v2

The Golden Example Library in [`examples/quality-elevation/`](../examples/quality-elevation/) provides concrete before/after pairs that demonstrate quality discipline. Average and mid-tier models often learn more reliably from specific examples than from abstract rules.

**v2 additions (Smart Adapt scenarios):**

| File | Purpose |
| --- | --- |
| [`smart-adapt-scored-session.md`](../examples/quality-elevation/smart-adapt-scored-session.md) | Full task flow: weakness injection → adaptive pack → quality pack → scorecard |
| [`lesson-to-golden-example.md`](../examples/quality-elevation/lesson-to-golden-example.md) | Bug/failure capture → lesson entry → golden example → prevention prompt |

**Existing v1 examples:**

| File | Purpose |
| --- | --- |
| [`before-after-bad-vs-good.md`](../examples/quality-elevation/before-after-bad-vs-good.md) | Unsupported completion claims vs. verified work |
| [`weak-spec-vs-strong-spec.md`](../examples/quality-elevation/weak-spec-vs-strong-spec.md) | Clear acceptance criteria improving implementation |
| [`overengineering-vs-minimal.md`](../examples/quality-elevation/overengineering-vs-minimal.md) | Avoiding unnecessary abstractions |
| [`hallucination-correction.md`](../examples/quality-elevation/hallucination-correction.md) | Inspecting project context preventing invented APIs |

## How Smart Adapt combines with Quality Shield + Expert Mode

Smart Adapt is not a replacement — it layers on top of the existing quality discipline.

```
Quality Shield (v1.7) — universal baseline: intent, context, smallest safe diff, self-review, scorecard
    ↑
Expert Mode (v1.8) — escalation paths: adversarial review, critique pass, quality packs, writer-critic, council
    ↑
Smart Adapt (v1.9) — adaptive layer: model weakness memory, adaptive prompt selection,
                      lessons learned DB, golden example library v2
```

### Combined workflow

1. **Start with Quality Shield:** define intent, acceptance criteria, constraints, and verification plan ([`docs/quality-shield.md`](quality-shield.md)).

2. **Run Smart Adapt pre-flight:**
   - Load model weakness memory for the active model → inject targeted checks.
   - Classify task type and select adaptive prompt stack.
   - Search lessons learned for relevant prevention rules.
   - Browse the Golden Example Library for calibration.

3. **Escalate if needed** to Expert Mode components:
   - Adversarial review for risky code.
   - Critique pass for structured second look.
   - Task-specific quality packs for domain-heavy work.
   - Writer-Critic Pair or Quality Council for high-stakes work.

4. **Execute with injected gates:** every injected check, pack, and prevention rule is a mandatory gate. Mark each as pass, fail, or not applicable.

5. **Post-task evaluation:**
   - Scorecard the session with `templates/quality-scorecard-session.md`.
   - Update model weakness log if new failure patterns were observed.
   - Add a lesson entry if a new repeatable mistake pattern was identified.
   - Optionally add a new golden example pair to the library.

6. **Report honestly:** state what changed, what checks ran, what checks did not run, residual risks, and any deferrals.

### Decision matrix

| If | Then |
| --- | --- |
| Task is tiny (single-file, no risk) | Quality Shield baseline only; skip Smart Adapt heavy load |
| Task is medium (multi-file, normal risk) | Quality Shield + Smart Adapt (weakness memory + adaptive pack + lessons search) |
| Task is risky or security-sensitive | Quality Shield + Smart Adapt + Expert Mode escalation |
| New model type is being used | Seed the weakness log with initial entries; run with all checks on |
| Same mistake happens twice | Must add lesson entry and update weakness log before continuing |
| No relevant lessons found | State "no relevant lessons found" and proceed |

## Comparison: Smart Adapt vs. Quality Engine

| Dimension | Smart Adapt (v1.9) | Quality Engine (future) |
| --- | --- | --- |
| **Execution** | Markdown-first — read skills, run commands, fill templates | Structured runner with gate orchestration |
| **Portability** | Works in any adapter that reads markdown instructions | Requires runtime scripts and gate manifests |
| **Adaptation basis** | Task type + domain + model type + project history | Task type + model type + scoring/history + runtime state |
| **Dependency** | No runtime dependencies; plain skills + templates | Requires quality engine config and gate manifests |
| **Threshold** | Use Smart Adapt first; add Quality Engine automation when the protocol is stable | Future — not required for v1.9 |

Smart Adapt is **not** the Quality Engine. It is the portable, human-readable adaptive quality layer that works in any environment. Quality Engine work is separate and future-scoped.

## Verification checklist

- [ ] Model weakness log is loaded and matched against the current task type.
- [ ] Task type is classified and adaptive prompt stack is selected.
- [ ] Domain amplifiers are identified and their packs are added.
- [ ] Lessons learned DB is searched for relevant prevention rules.
- [ ] Golden Example Library is consulted for relevant before/after pairs.
- [ ] Injected checks are specific, actionable, and confirmed with the user.
- [ ] All checks are evaluated post-task: pass, fail, or N/A.
- [ ] New weaknesses or lessons are recorded with evidence.
- [ ] Scorecard is generated for the session.
- [ ] Final response lists changed files, checks run, checks not run, residual risks, and deferrals.

## See also

- [`docs/quality-shield.md`](quality-shield.md) — Quality Shield v1.7 universal baseline
- [`docs/expert-mode.md`](expert-mode.md) — Expert Mode v1.8 escalation paths
- [`docs/quality-elevation-eval.md`](quality-elevation-eval.md) — Quality elevation evaluation scenarios
- [`examples/quality-elevation/README.md`](../examples/quality-elevation/README.md) — Golden Example Library
- [`examples/multi-repo-learning/README.md`](../examples/multi-repo-learning/README.md) — Cross-repo lesson exchange and golden-example promotion workflow
- [`skills/core/model-weakness-memory/SKILL.md`](../skills/core/model-weakness-memory/SKILL.md) — Model Weakness Memory skill
- [`skills/core/adaptive-prompt-selection/SKILL.md`](../skills/core/adaptive-prompt-selection/SKILL.md) — Adaptive Prompt Selection skill
- [`skills/core/lessons-learned-db/SKILL.md`](../skills/core/lessons-learned-db/SKILL.md) — Lessons Learned DB skill

## Ghi chú tiếng Việt

Smart Adapt là lớp chất lượng thích ứng v1.9, giúp agent chọn mức kiểm tra phù hợp với độ rủi ro của task, loại model, và lịch sử dự án. Ba thành phần chính: (1) **Model Weakness Memory** — ghi nhớ lỗi thường gặp của từng model và tự động chèn kiểm tra; (2) **Adaptive Prompt Selection** — phân loại task và chọn quality pack phù hợp; (3) **Lessons Learned DB** — lưu bài học từ lỗi để tránh lặp lại. Kết hợp với Quality Shield (nền tảng) và Expert Mode (nâng cao) để tạo quy trình chất lượng toàn diện. Không yêu cầu runtime mới.
