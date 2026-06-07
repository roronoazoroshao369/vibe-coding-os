# Skill: Session Summarizer

## Purpose

Compress a work session into useful handoff context.

## When to use

Use at the end of a session, before context reset, or before handing off to another agent.

## Inputs

Goal, changes made, commands run, decisions, blockers, follow-ups.

## Workflow

1. Summarize the original intent.
2. List completed changes and files touched.
3. Record verification results.
4. Capture decisions and unresolved questions.
5. For periodic digests, group observations by timeline window (daily, weekly, or sprint), summarize decisions and validation outcomes, flag superseded memories, and list follow-ups separately from completed work.
6. Recommend the next action.

## Outputs

A short handoff summary suitable for project memory or a PR note.

## Failure modes

- Including too much transcript detail.
- Omitting failed checks.
- Confusing planned work with completed work.

## Verification checklist

- [ ] Completed vs pending work is clear.
- [ ] Commands and results are included.
- [ ] Periodic digests distinguish timeline trends, superseded memories, and open follow-ups.
- [ ] Next action is actionable.
- [ ] No secrets are included.

## Applied / Not Applied

Applied from Supermemory-inspired design: durable memory should be scoped, searchable, source-aware, privacy-filtered, and useful for later retrieval. Applied from claude-mem-inspired persistent-context design: periodic timeline or weekly digest summaries that compress memory across a time window without storing raw transcripts. Not applied: hosted Supermemory service requirement, claude-mem worker/runtime, SDK client, cloud auth, dashboard, connector stack, database infrastructure, or storing full transcripts by default.

## Ghi chú tiếng Việt

Dùng kỹ năng này để lưu hoặc truy xuất ngữ cảnh bền vững một cách an toàn. Không lưu bí mật, token, khóa riêng tư hoặc dữ liệu cá nhân không cần thiết.
