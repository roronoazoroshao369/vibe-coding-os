# Feature: Agent Handoff

## Goal

Make work resumable across agent/session boundaries.

## Reference sources

Upstream handoff productivity concept; local memory system.

## Local implementation

Implemented by `skills/memory/agent-handoff/SKILL.md`, `commands/vibe-handoff.md`, and `templates/handoff-template.md`.

## Must-have behavior

Summarize goal, status, changed files, commands, failures, decisions, and next steps.

## Failure modes

Transcript dumps, omitted failed checks, secrets in handoff.

## Update signals

Upstream changes handoff format.

## Evaluation ideas

Ask a new agent to resume from handoff and identify missing context.

## Ghi chú tiếng Việt

Handoff giữ ngữ cảnh khi đổi phiên/agent. File ảnh hưởng: memory skill, command, template.
