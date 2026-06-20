---
title: Quality Telemetry Trend Report
type: template
name: quality-trend-report
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: template
tags:
  - quality
status: stable
---

# Quality Telemetry Trend Report

Generated: [YYYY-MM-DDTHH:mm:ss.sssZ]
Source: `[docs/metrics/quality-events.ndjson or other local path]`

## Filters

- Since: [all available events | ISO timestamp | relative window]
- Until: [latest available event | ISO timestamp]
- Model: [all models | model/profile id]
- Task type: [all task types | task category]

## Executive summary

- Events: [count]
- Sessions: [count]
- Gate runs: [count]
- Gate pass rate: [percent] ([passed]/[run])
- Event result mix: [pass count] pass, [warn count] warn, [fail count] fail
- Average event duration: [duration]

## Trend over time

- [YYYY-MM-DD]: [event count] event(s), [session count] session(s), gate pass rate [percent], fail rate [percent], avg duration [duration]
- [YYYY-MM-DD]: [event count] event(s), [session count] session(s), gate pass rate [percent], fail rate [percent], avg duration [duration]

## Gate-level breakdown

- `[gate-id]`: [event count] event(s), [passed]/[run] gates passed ([percent]), [fail count] fail event(s), avg duration [duration]
- `[gate-id]`: [event count] event(s), [passed]/[run] gates passed ([percent]), [fail count] fail event(s), avg duration [duration]

## Model-level comparison

- `[model-or-profile]`: [session count] session(s), [event count] event(s), gate pass rate [percent], fail rate [percent], avg duration [duration]
- `[model-or-profile]`: [session count] session(s), [event count] event(s), gate pass rate [percent], fail rate [percent], avg duration [duration]

## Task-type breakdown

- [task type]: [event count] event(s), gate pass rate [percent], avg duration [duration]
- [task type]: [event count] event(s), gate pass rate [percent], avg duration [duration]

## Insights and recommended follow-up

- [Summarize pass/fail movement over the reporting window.]
- [Call out gates with repeated failures or rising duration.]
- [Call out model/profile differences that should change routing, prompting, or quality gate configuration.]
- [List the next concrete improvement action and owner.]

## Warnings

- [Optional: invalid event lines skipped, missing event file, unsupported filter, or other data quality issue.]

## Privacy review

- Confirm this report contains only aggregate telemetry.
- Remove raw task details, sensitive paths, prompts, model outputs, secrets, or private event payloads before sharing outside the local team.
