---
name: writing-skills
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: meta
tags:
  - meta
status: stable
---

# Skill: Writing Skills

## Purpose

Create or revise portable skill procedures that are original, discoverable, hard to misread under pressure, and safe across multiple coding-agent harnesses. Treat a skill as behavior-shaping documentation: it is judged by what an agent actually does after reading it, not by how complete it looks.

## When to use

Use when adding a new `SKILL.md`, materially editing an existing one, adapting an upstream methodology into original local wording, or standardizing a repeated workflow that agents keep getting wrong.

## Inputs

Skill purpose, the concrete behavior you want changed, real situations that should trigger it, expected inputs/outputs, local conventions, reference sources and their license constraints, and the validation/registry requirements that apply when the skill is user-facing.

## Core principle: skills are tested, not just written

A skill is only proven when you have watched an agent behave differently because of it. Writing a polished document and assuming it works is the most common failure. Apply a RED-GREEN-REFACTOR loop borrowed from test-driven development:

- **RED — capture the baseline.** Before writing the skill, run the triggering situation against an agent (a fresh subagent is ideal) *without* the skill. Record the exact decisions and, word for word, the rationalizations it uses to justify the wrong behavior. If you never saw it fail, you do not yet know what the skill must teach.
- **GREEN — write the minimal skill.** Write only enough to correct the specific failures you observed. Do not pad it with guidance for hypothetical cases. Re-run the same situation with the skill present and confirm the behavior changes.
- **REFACTOR — close loopholes.** Agents under pressure invent new escape hatches. Each new rationalization you observe becomes an explicit counter in the skill. Re-test until the behavior holds.

This loop applies to edits too, not only new skills. A "small addition" that was never tested is an untested change.

## When-to-use vs how-to-use discipline

A common failure in skill-writing is describing *how* to do something before establishing *when* to do it. An agent that loads a skill to learn the procedure but has not decided whether the procedure applies will either skip the body (if the description reads like a summary) or apply the skill in the wrong situation. The **when-to-use** test is simple: write only the triggering conditions and concrete symptoms in the description and "When to use" section. If the description needs a workflow step or an output example, it is describing *how*, not *when*. Reserve detailed procedures for the Workflow section and never preview them in the description.

A corollary: a skill with a rich "When to use" section can be shorter in the body because the agent already knows whether to load it. A skill that conflates when and how forces the agent to parse irrelevant detail before deciding relevance — which, under time pressure, means it guesses.

## Token-budget guidance

- Frequently-loaded meta skills: aim for ~300-500 words.
- Core skills: ~500-800 words.
- Reference-heavy skills (checklists): up to ~1200 words, but push detailed reference tables into separate files and link to them.
- Cross-reference sibling skills instead of duplicating their guidance. A one-line "See writing-skills for the RED-GREEN-REFACTOR loop" saves 200 words.
- Each token spent on a hypothetical scenario that was never observed is a token that could have been an observed-failure counter. Prefer evidence-based content over speculative padding.

## Pressure and rationalization testing

Discipline skills (rules the agent is tempted to skip) must survive pressure, because that is exactly when they get abandoned. Test under combined pressure, not just calm questioning:

- **Time pressure** — "this is urgent, just ship it."
- **Sunk cost** — "I already wrote the code, rewriting wastes work."
- **Authority** — "a senior dev said skip this step."
- **Exhaustion / batching** — "I'll do all the verification at the end."

Stack two or three pressures at once. Then collect every excuse the agent produced and answer it directly in a rationalization table inside the skill — the agent's own words on the left, the reality on the right. Add a short "stop and reconsider" red-flags list so an agent can self-detect the moment it is about to cut the corner. State plainly that following the letter while breaking the intent still counts as breaking the rule; this removes a whole class of "I'm honoring the spirit" escapes.

## Claude Search Optimization (CSO)

A skill that is never loaded teaches nothing. Optimize for discovery:

1. **Description = WHEN to use, never a workflow summary.** The description is read to decide whether to open the skill. If it summarizes the procedure, the agent treats the summary as the whole skill and skips the body — so a two-pass review collapses into one pass. Write triggering conditions only: start with "Use when…", name concrete symptoms and situations, third person. Describe the *problem* (race condition, ambiguous terms, unreviewed diff), not the steps.
2. **Keyword coverage.** Seed the words an agent would actually search: error strings, symptoms ("flaky", "ambiguous", "scope creep"), synonyms, and real tool/command/file names. Discovery is matching, so cover the vocabulary.
3. **Active, verb-first names.** Prefer `writing-skills`, `review-before-merge`, `prototype-before-commitment` over noun blobs like `skill-creation`.
4. **Token budget.** Frequently-loaded skills cost context on every conversation. Keep them tight — push exhaustive reference into separate files and link to it, cross-reference sibling skills instead of repeating them, and compress examples. Aim for well under ~500 words for ordinary skills, tighter for always-loaded ones. One excellent example beats five mediocre ones.

## Composability and discoverability requirements

Every skill should declare its relationships to other skills so an agent can assemble a coherent stack without loading contradictory guidance.

### Required frontmatter fields

Each skill entry in `registry/skills.json` MUST include:

- **tags[]**: at least two searchable keywords. Use lower-kebab-case. Prefer tags that match actual search terms: "database", "auth", "async", "tdd", "review", "bug", "security", "cli", "migration", "frontend", "api", "architecture", "quality", "memory", "orchestration", "prompt", "meta".
- **bundle**: bundle name (string) if the skill belongs to a domain bundle. Empty string if unaffiliated.
- **platforms[]**: list of supported agent harnesses. `["*"]` if universal. Otherwise list specific: `["claude-code", "codex", "cursor", "gemini", "copilot", "opencode"]`.

### Composability sections in SKILL.md body

The skill body SHOULD contain these sections when cross-references matter:

- **Works with**: sibling skills that complement this one. Example: "Works with `adversarial-code-review` — run after this checklist to catch security issues."
- **Conflicts with**: skills whose guidance may contradict. Example: "Conflicts with `prototype-before-commitment` — this skill assumes production rigor, not exploration."
- **Depends on**: prerequisite skills that must be loaded first.

### Failure-modes section format

Every skill MUST include a "Failure modes" section with bullet points describing what can go wrong. Each bullet should name a concrete failure pattern, not a generic risk. Use present tense and specific language ("Shipping an untested skill", not "Failure to test").

### Maturity-level guidelines

Every skill entry in `registry/skills.json` SHOULD include a `maturity` field that communicates stability and reliability to skill consumers. Use one of four levels:

- **stable** — The skill is well-tested, its behavior is documented and verified, and breaking changes are rare. Agents can rely on this skill for production-quality work. Example: `adversarial-code-review`, `brainstorming`.
- **beta** — The skill works in common scenarios but may have edge cases, incomplete refinements, or a small number of known gaps. Agents should use it but watch for surprising behavior and report issues. Example: `superagent-orchestration`, `adaptive-flow`.
- **experimental** — The skill is a new pattern or an unproven approach. It may change, break, or be removed without notice. Use for exploration only; do not depend on it for critical work. Example: `adaptive-prompt-selection`, `quality-telemetry`.
- **draft** — The skill is a placeholder or initial sketch. It exists in the catalog to signal intent but has not been tested, validated, or completed. Agents should skip draft skills unless explicitly directed to develop them. Example: `hook-based-memory`.

Assigning maturity requires honest assessment of the skill's test history, not ambition. A skill that has passed RED-GREEN-REFACTOR testing under stacked pressure is a candidate for `stable`. One that exists only as a written document without observed behavior change is at most `draft` or `experimental`.

## Workflow

1. Name the behavior the skill changes — not just a topic. If you cannot state the wrong behavior it prevents, you are not ready to write it.
2. RED: run the triggering situation without the skill; record decisions and verbatim rationalizations.
3. GREEN: write the minimal skill using the required sections (Purpose, When to use, Inputs, Workflow, Outputs, Failure modes, Verification checklist). Keep instructions original and harness-agnostic (Claude Code, Codex, Cursor, and similar).
4. Write the description as WHEN-to-use only; load it with keywords; pick an active name.
5. REFACTOR: re-test under stacked pressure; convert each new rationalization into an explicit counter and a red-flag.
6. Reference related skills or aliases only to prevent duplication.
7. Update `registry/skills.json`, mapping docs, and the Vietnamese indexes when the skill is user-facing; record attribution if external inspiration materially shaped it; run validation.

## Outputs

A complete, tested skill file plus registry, mapping, documentation, attribution, and validation updates as needed, with evidence that an agent's behavior actually changed.

## Failure modes

- Shipping an untested skill (or untested edit) and assuming it works.
- Writing a description that summarizes the workflow, causing agents to skip the body.
- Padding the skill with guidance for failures you never observed.
- Copying upstream skill text instead of writing original local procedure.
- Creating a duplicate skill instead of aligning an alias.
- Letting a frequently-loaded skill bloat the token budget.
- Skipping registry or index updates so the skill is undiscoverable.

## Verification checklist

- [ ] Baseline failure was observed before the skill was written or edited.
- [ ] Description states WHEN to use only — no workflow summary — and is keyword-rich.
- [ ] Required headings present; instructions original, actionable, and portable.
- [ ] Discipline skills include a rationalization table and red-flags list, tested under stacked pressure.
- [ ] Token budget respected; heavy reference split into linked files.
- [ ] Registry, indexes, attribution, and validation are complete where applicable.

## Ghi chú tiếng Việt

Viết skill là viết tài liệu định hình hành vi của agent: đánh giá bằng việc agent thực sự làm gì sau khi đọc, không phải tài liệu trông đầy đủ ra sao. Dùng vòng RED-GREEN-REFACTOR (quan sát agent làm sai trước → viết skill tối thiểu → bịt kẽ hở), kiểm thử dưới áp lực (gấp gáp, chi phí chìm, quyền uy) và lập bảng "lý do biện minh → sự thật". `description` chỉ mô tả KHI NÀO dùng, tuyệt đối không tóm tắt quy trình, và phải giàu từ khóa để dễ tìm. Giữ ngân sách token, tách phần tham chiếu nặng ra file riêng. Nguồn cảm hứng: `obra/superpowers` (MIT, Jesse Vincent) — phương pháp test skill và Claude Search Optimization; viết lại bằng văn phong địa phương, không sao chép nguyên văn.
