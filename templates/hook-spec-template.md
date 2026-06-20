---
title: Hook Specification Template
type: template
name: hook-spec-template
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: spec
tags:
  - template
  - specification
status: stable
---

# Hook Specification Template

Use this to specify a custom hook for an agent adapter or runtime.

## Header

- **Hook name:** `<short name, e.g., session-init, pre-implement>`
- **Event:** `<event name from the hook contract, e.g., before_implementation>`
- **Version:** `<semver>`
- **Agent/Adapter:** `<which agents or runtimes this applies to>`

## Purpose

What the hook does and when it fires. Why it exists — what problem it solves, what risk it mitigates, or what behavior it enforces.

## Input

List the fields the hook expects. At minimum: event, timestamp, session id. Add event-specific fields such as plan path, file list, or validation commands.

## Output

List the fields the hook returns. At minimum: status, summary. Add event-specific output (e.g., warnings, suggestions, block reason).

## Behavior

- On success: what happens, what the agent should do next.
- On failure: what happens, whether it blocks the pipeline, fallback behavior.
- On timeout: what the agent should assume.

## Configuration

- Required settings
- Optional settings (with defaults)
- Enable/disable flag
- Warn-only mode (if supported)

## Example

A short input/output example showing the hook in action.

## Testing

How to verify the hook works correctly — test commands, expected output, edge cases.
