---
name: instinct-extraction
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: meta
tags:
  - meta
status: stable
---

# Skill: Instinct Extraction

## Purpose

Distill reusable engineering instincts from sessions so the agent builds a growing internal library of trigger-action rules with confidence scores, evidence, scope limits, and expiry. Connect pre-session instinct loading with post-session extraction into a continuous-learning loop.

## When to use

Use after a session reveals a durable pattern such as a recurring failure mode, a decision shortcut that worked, a verification habit, or a project-specific convention that should influence future work. Also use before starting a new session to load relevant instincts from the instinct store.

## Inputs

Conversation summary, repo context, decisions, mistakes avoided, failed attempts, successful fixes, verification output, any existing related skills or memory notes, and the current contents of the instinct store (`references/instincts/` or similar).

## Workflow

This skill operates as a two-phase continuous-learning loop across sessions.

### Phase A — Pre-session instinct loading

1. Before starting a task, check the instinct store for any instincts whose trigger conditions match the current situation.
2. Load matching instincts into working context as advisory guidance — not as hard rules unless the agent self-assesses that the instinct's confidence and scope fit the task.
3. Each loaded instinct carries its confidence score, so the agent can weigh advice versus contradictory instructions.
4. If the instinct store is empty or has not been reviewed recently (check the `last_reviewed` timestamp), suggest the user run `vibe-instinct --review` before proceeding.

### Phase B — Post-session instinct extraction

Run this phase after any session that produced actionable observations:

1. **Collect candidates.** Scan the session for:
   - Repeated triggers — situations that appeared more than once.
   - Actions that reliably improved outcomes (e.g., a specific test command, an ordering convention).
   - Pitfalls that changed the workflow (e.g., a common mistake the agent caught).
   - Checks that caught real issues before they reached production.
   - Patterns that surprised the agent or contradicted its initial guess.

2. **Filter and formulate.** For each candidate, ask:
   - Is this durable — likely to apply again in a similar context?
   - Is this specific enough to trigger on (concrete file names, error strings, command outputs)?
   - Is this actionable — does it say WHAT to do WHEN, not just "be careful"?
   
   Convert each passing candidate into a structured instinct record (see Output format).

3. **Score confidence 1—10.** Use this rubric:

   | Score | Label | Criteria |
   |-------|-------|----------|
   | 9—10 | **Certain** | Observed 3+ times with identical outcomes; backed by strong verification (all tests green). Treat as default behavior unless scoped out. |
   | 7—8 | **High** | Observed 2+ times with consistent results; verification evidence exists. Use as strong guidance. |
   | 5—6 | **Medium** | Observed once with clear evidence and low downside. Follow but stay alert for exceptions. |
   | 3—4 | **Low** | Plausible pattern, single observation, limited verification. Store as suggestion, not rule. |
   | 1—2 | **Speculative** | Untested intuition or incomplete observation. Label explicitly as hypothesis; do not follow without fresh verification. |

4. **Attach evidence.** For each instinct, record:
   - The file paths, commands, or decision notes that justify the confidence score.
   - A brief outcome summary (what worked or failed).
   - The session or agent that generated the evidence.

5. **Set scope and expiry.**
   - **Scope:** Where does this instinct apply (project, language, framework, task type)? Where does it NOT apply?
   - **Expiry:** After how many sessions or calendar days should this instinct be re-verified? Default: 30 days for 1-4 confidence, 90 days for 5-7, 180 days for 8-10.

6. **Store the instinct.**
   - Write to the instinct store as a structured markdown file: `references/instincts/<slug-name>.md`.
   - Each file follows the instinct template (see `templates/instinct-template.md`).
   - Update the instinct index if one exists.
   
7. **Determine placement.** Decide whether the instinct should also become:
   - A skill update (if the pattern is broad enough to warrant a full skill).
   - A project-memory note (if project-specific).
   - A session handoff entry (if relevant to the next agent on this task).
   - Discard if too vague, too narrow, or already covered.

8. **Re-check privacy and noise.** Remove secrets, personal data, raw transcripts, and temporary paths unless the path itself is essential to the trigger.

## Instinct lifecycle

```
Created (with confidence score + expiry)
  → Loaded in sessions (with confidence-weighted prominence)
  → Re-verified at expiry (confidence may increase, decrease, or drop to zero)
  → Archived if confidence drops below 2 or scope becomes obsolete
  → Removed if archived for 2+ review cycles without relevance
```

- **Re-verify** by running `vibe-instinct --review` or by manually inspecting the store before session start.
- **Archive** by moving the file to `references/instincts/archived/`. Do not delete — archived instincts preserve audit trail.
- **Promote** a high-confidence instinct to a formal skill if its trigger-action pattern repeats across projects.

## Output format (compact)

```text
Instinct: <short name>
Trigger: <situation that should trigger the action>
Action: <next move when trigger fires>
Scope: <where it applies / does not apply>
Confidence: <1-10>
Evidence: <file/command/outcome summary>
Expiry: <YYYY-MM-DD or session-count>
Placement: skill update | memory note | handoff | discard
```

For full structured records, use the template at `templates/instinct-template.md`.

## Outputs

A list of confidence-scored instincts with scope, expiry, and evidence; updates to the instinct store; placement recommendations for additional skill, memory, or handoff artifacts.

## Failure modes

- Treating one lucky fix as a universal rule (confidence inflation).
- Storing sensitive context (secrets, raw transcripts, personal data).
- Writing vague advice with no concrete trigger or action.
- Marking low-evidence ideas as high confidence (rubric violation).
- Implying automatic enforcement when only a manual workflow exists.
- Skipping expiry dates, causing stale instincts to be loaded forever.
- Creating duplicate instincts that contradict each other.
- Overloading the instinct store with hundreds of low-value entries (aim for quality over quantity).

## Verification checklist

- [ ] Pre-session loading: instinct store checked before starting the task.
- [ ] Post-session extraction: candidates scanned, filtered, and formulated.
- [ ] Each instinct has a trigger, action, scope, confidence (1-10), evidence, and expiry.
- [ ] Confidence scoring follows the rubric (Certain / High / Medium / Low / Speculative).
- [ ] Low-confidence items (1-4) are labeled as suggestions, not rules.
- [ ] Private/noisy details are removed before storage.
- [ ] Expiry date is set and reasonable for the confidence level.
- [ ] Any enforcement claim is explicitly avoided (manual workflow only).
- [ ] Duplicate or contradictory instincts are resolved before storage.

## Works with

- `skills/memory/session-capture/SKILL.md` — session observations feed instinct candidates.
- `skills/memory/agent-handoff/SKILL.md` — instincts worth passing to the next agent.
- `commands/vibe-instinct.md` — CLI to extract, review, or apply instincts.
- `templates/instinct-template.md` — structured record format.
- `skills/meta/writing-skills/SKILL.md` — if an instinct is promoted to a formal skill.

## Ghi chú tiếng Việt

Kỹ năng này rút "instinct" tái sử dụng từ phiên làm việc: tình huống kích hoạt → hành động → phạm vi → confidence 1-10 → bằng chứng → hết hạn. Hoạt động theo vòng lặp hai pha: tải instinct trước phiên, rút instinct sau phiên. Lưu vào `references/instincts/` dưới dạng file markdown cấu trúc. Đây chỉ là workflow thiết kế/thủ công; muốn tự động áp dụng cần runtime hoặc hệ thống memory riêng. Không lưu secret, raw transcript, hoặc dữ liệu nhạy cảm.

## Nguồn cảm hứng / Inspiration

Pattern adapted as original wording from `affaan-m/ECC` (MIT, Affaan Mustafa) continuous-learning and instinct workflows. Inspiration only — no upstream runtime, scripts, or text copied.
