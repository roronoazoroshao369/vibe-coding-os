# Command: vibe-proficiency

## Purpose

Assess your current Vibe Coding OS proficiency level and get targeted guidance for level progression.

## When to use

- Starting a new session and unsure which workflow depth to use.
- After completing a significant milestone, to check if you are ready for the next level.
- When mentoring or onboarding another user.
- When you feel your workflow is either too light or too heavy for the task at hand.

## Inputs

- Self-reported experience with Vibe Coding OS skills, commands, subagents, and teams.
- Optional: a recent task you completed, to calibrate against level markers.

## Workflow

### 1. Answer the assessment questions

Rate each statement on a 1–5 scale (1 = never, 5 = always):

**Foundation:**
- I use `vibe-init` to orient new sessions.
- I know where skills, commands, and templates live.
- I run validation before claiming completion.
- I self-review my diff before submitting.

**Skill Design:**
- I have written and tested original skills.
- I use the RED-GREEN-REFACTOR loop to validate skill behavior.
- I consider composability (Works with / Conflicts with / Depends on) when writing skills.
- I check token budget for frequently-loaded skills.

**Workflow Discipline:**
- I use spec-driven development for non-trivial work.
- I run checkpoint gates before implementation.
- I practice TDD or equivalent test-first discipline.
- I delegate bounded subtasks to subagents with clear scopes.

**Orchestration:**
- I design multi-agent teams with clear roles and handoffs.
- I apply progressive disclosure to worker context.
- I use multiple orchestration patterns (fan-out, pipeline, supervisor, etc.).
- I conduct orchestration retrospectives.

### 2. Score calculation

- **Level 1 (Vibe Basics):** Foundation average ≥ 3.0. Lower levels not met.
- **Level 2 (Prompt Engineering):** Foundation ≥ 4.0 AND Skill Design ≥ 3.5.
- **Level 3 (Agentic Engineering):** Foundation ≥ 4.5 AND Skill Design ≥ 4.0 AND Workflow Discipline ≥ 3.5.
- **Level 4 (Orchestration):** Foundation ≥ 4.5 AND Skill Design ≥ 4.5 AND Workflow Discipline ≥ 4.0 AND Orchestration ≥ 3.5.

Scores are advisory. The most honest self-assessment is the most useful one.

### 3. Output level guidance

**If Level 1:**
Focus on completing bounded tasks with one agent pass. Read `skills/meta/using-vibe-coding-os/SKILL.md` for the skill discovery loop. Use `vibe-init`, `vibe-spec`, `vibe-implement`, and `vibe-review`. Avoid loading too many skills at once.

**If Level 2:**
Study `skills/meta/write-reusable-skill/SKILL.md` and the RED-GREEN-REFACTOR loop. Write three original skills and test them under pressure. Learn the composability sections and maturity-level convention. Run `vibe-write-skill` for format validation.

**If Level 3:**
Study `skills/core/superagent-orchestration/SKILL.md` and `docs/proficiency-path.md`. Practice task decomposition and subagent brief writing. Use `vibe-checkpoints` before every implementation. Read `skills/core/subagent-driven-development/SKILL.md` for error-handling patterns.

**If Level 4:**
Read `docs/workflows/hook-patterns.md` and `docs/workflows/team-agent-orchestration.md`. Design a multi-agent team for your next large task. Conduct a with-vs-without comparison after each team run. Mentor Level 1–3 users.

### 4. Next steps

- Record your level in a session note for future reference.
- Re-assess after completing a task at your current level's upper complexity bound.
- If mentoring, share the relevant proficiency-path markers with the mentee.

## Outputs

- Assessed proficiency level (1–4) with confidence note.
- Targeted reading and practice recommendations for the next level.
- Optional: session note recording the assessment.

## Failure modes

- Over-estimating your level because you understand the theory but lack practice.
- Under-estimating because you rarely answer questions with 5/5 on every criterion.
- Using the assessment as a permanent label instead of a current-state snapshot.
- Ignoring the output recommendations because they describe work (writing skills, practicing TDD) that feels optional.

## Verification checklist

- [ ] Questions answered honestly based on actual behavior, not intentions.
- [ ] Score calculated correctly from averages.
- [ ] Guidance read and at least one action item identified.
- [ ] Assessment recorded for future comparison, if useful.

## Related

- `docs/proficiency-path.md` — full detail on the four levels.
- `skills/meta/using-vibe-coding-os/SKILL.md` — level-appropriate guidance embedded.
- `skills/meta/write-reusable-skill/SKILL.md` — maturity-level guidelines.
- `skills/core/superagent-orchestration/SKILL.md` — expanded patterns for Level 3+.
- `docs/workflows/hook-patterns.md` — hook taxonomy for Level 4.
