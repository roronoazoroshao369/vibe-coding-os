# Skill: Agent Handoff

## Purpose

Condense active work into a durable handoff so another agent or session can continue safely.

## When to use

Use before context reset, agent switch, long pause, review handoff, or unfinished branch transfer.

## Inputs

Goal, current status, changed files, decisions, commands run, failures, risks, next steps, and open questions.

## Workflow

1. Summarize objective and scope.
2. List changed files and why.
3. Record validation commands and outcomes.
4. Capture decisions, assumptions, blockers, and next actions.
5. Use `templates/handoff-template.md` and remove secrets.

## Outputs

Handoff document or message with continuation-ready state and verification evidence.

## Failure modes

Writing a transcript instead of a summary, omitting failed checks, losing next steps, or storing secrets.

## Verification checklist

Another agent can resume; exact commands are included; risks/open questions are named; sensitive data is absent.

## Ghi chú tiếng Việt

Handoff giúp chuyển phiên/agent không mất ngữ cảnh. File liên quan: `templates/handoff-template.md`, `commands/vibe-handoff.md`, `skills/memory/project-memory/SKILL.md`.
