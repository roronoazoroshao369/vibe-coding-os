# Skill: Review Before Merge

## Purpose

Catch correctness, maintainability, security, and attribution issues before merge by reviewing the change along two independent axes — **Standards** (does it follow this repo's conventions?) and **Spec** (does it do what the originating PRD/spec/issue asked?) — run as separate passes so neither masks the other.

## When to use

Use after implementation and verification, before merge or PR. Use whenever a diff needs review against a fixed point (a branch, commit, tag, or `main`), or when asked to "review since X".

## Inputs

The diff and its fixed point, the commit list, the originating spec/PRD/issue, the repo's standards sources (`CLAUDE.md`, `AGENTS.md`, `CONSTITUTION.md`, `CONTEXT.md`, ADRs under `docs/adr/`, style/lint configs), test results, and the attribution registry.

## Why two axes

A change can pass one axis and fail the other, and a single blended review hides this:

- Code that obeys every convention but implements the wrong behavior → **Standards pass, Spec fail.**
- Code that does exactly what the spec asked but breaks repo conventions → **Spec pass, Standards fail.**

Keeping the axes separate stops a clean Standards pass from making a Spec failure look reviewed, and vice versa. The two passes must not share context — run them so each forms its judgment independently, then report side by side without merging or reranking.

## Workflow

1. **Pin the fixed point.** Use whatever the user named (SHA, branch, tag, `main`, `HEAD~n`). If none was given, ask before proceeding. Capture the diff with a merge-base comparison (`git diff <fixed-point>...HEAD`) and the commit list (`git log <fixed-point>..HEAD --oneline`).
2. **Identify the spec source.** Look in order: issue references in commit messages; a path the user gave; a PRD/spec under `docs/`, `specs/`, or the plan files matching the branch/feature. If none exists, the Spec pass reports "no spec available" rather than inventing acceptance criteria.
3. **Identify the standards sources.** Collect the repo's documented conventions. Note machine-enforced rules (lint, formatter, tsconfig) but do not re-check what tooling already enforces.
4. **Run the two passes independently and in parallel.** For multi-agent harnesses, dispatch one subagent per axis so their contexts stay clean; otherwise run them as two deliberately separate review sweeps over the same diff.
   - **Standards pass:** read the standards docs, then the diff. Report each place the diff violates a documented convention, citing the rule (file + which rule). Separate hard violations from judgement calls. Skip anything tooling enforces.
   - **Spec pass:** read the spec, then the diff. Report (a) spec requirements that are missing or partial, (b) behavior present in the diff that the spec did not ask for (scope creep), and (c) requirements that look implemented but appear wrong. Quote the spec line for each finding.
5. **Check attribution and secrets** as part of the sweep: no secrets in the diff, and any upstream-inspired content carries its attribution entry.
6. **Aggregate side by side.** Present findings under `## Standards` and `## Spec` headings, kept separate. End with a one-line summary: finding counts per axis, the single worst issue, and an explicit approval / blockers / follow-ups verdict.

## Outputs

A review note with the two axes reported separately, blockers, risks, follow-ups, attribution status, and an explicit approval decision.

## Failure modes

- Rubber-stamp review with no specific findings.
- Blending the two axes so a Standards pass hides a Spec failure (or the reverse).
- Letting the two passes share context so they bias each other.
- Inventing a spec when none exists instead of reporting its absence.
- Re-flagging issues that tooling already enforces; only checking style.
- Missing secret leakage or license/attribution implications.

## Verification checklist

- [ ] Fixed point pinned and diff/commit list captured.
- [ ] Standards pass cites specific rules; judgement calls separated from hard violations.
- [ ] Spec pass quotes spec lines and flags missing, extra, and wrong behavior — or reports "no spec available".
- [ ] The two passes ran independently and are reported side by side, not merged.
- [ ] No secret or attribution issue; follow-ups and an approval verdict are explicit.

## Superpowers alignment

Use with `requesting-code-review` and `receiving-code-review` for the review exchange.

## Ghi chú tiếng Việt

Review trước khi merge theo HAI TRỤC độc lập: **Standards** (đúng quy ước repo chưa?) và **Spec** (có đúng việc PRD/spec yêu cầu không?). Chạy hai lượt riêng biệt, không trộn ngữ cảnh, rồi báo cáo song song để một trục đạt không che giấu trục kia hỏng. Nếu không có spec thì ghi "không có spec", không tự bịa tiêu chí. Kiểm tra cả rò rỉ secret và attribution. Nguồn cảm hứng: `mattpocock/skills` (MIT, Matt Pocock) — review hai trục bằng subagent song song; viết lại nguyên gốc, không sao chép.
