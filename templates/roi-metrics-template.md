---
title: ROI Metrics Template
type: template
name: roi-metrics-template
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: template
tags:
  - template
status: stable
---

# ROI Metrics Template

> Vietnamese usage note: Dùng để đo ROI của vibe coding bằng tay. Khung này không có telemetry tự động; mọi số liệu phải tự ghi và không lưu secrets.

Use this template to measure the return on investment of AI-assisted ("vibe") coding for one team or repository. These are **manual** metrics. Vibe Coding OS ships **no automatic telemetry, instrumentation, or data collection** — every value below is filled in by a human reading PRs, logs, and timestamps. Track a fixed window (for example one sprint or one month) and compare against a baseline window from before the change you are evaluating.

## Context

- Team / repo: [name]
- Measurement window: [start date] → [end date]
- Baseline window: [start date] → [end date]
- What changed between baseline and now: [e.g. adopted AI pair-programming, new workflow]

## Lead time (idea → merged)

How to measure: for each change, record time from first commit or issue creation to merge; report the median.

- Baseline median lead time: [hours/days]
- Current median lead time: [hours/days]
- Sample size (changes counted): [N]
- Delta: [absolute or %]

## Defect-escape rate

How to measure: bugs found after merge (in QA, staging, or production) divided by total changes merged in the window.

- Baseline escape rate: [bugs post-merge] / [total merged] = [%]
- Current escape rate: [bugs post-merge] / [total merged] = [%]
- Delta: [percentage points]

## Review cost per PR

How to measure: estimate reviewer minutes per PR and count review iterations (review → changes-requested → re-review cycles); average across the window.

- Baseline avg reviewer minutes per PR: [minutes]
- Current avg reviewer minutes per PR: [minutes]
- Baseline avg review iterations per PR: [count]
- Current avg review iterations per PR: [count]

## Token / cost per change (optional)

How to measure: optional and manual — only if your assistant exposes usage. Sum tokens or billed cost over the window and divide by changes merged. Leave blank if not measurable; the repo provides no usage data.

- Tokens or cost per merged change: [value or "not measured"]
- Source of usage data: [assistant dashboard / billing export / n/a]

## AI-attributable rework

How to measure: of the lines or PRs that AI generated, what share was reverted or rewritten before or shortly after merge. Judgement-based; document how you attributed authorship.

- AI output reverted/rewritten: [reverted units] / [AI-generated units] = [%]
- Attribution method: [how you decided what was AI-generated]

## Summary

- Net effect on lead time: [improved / neutral / regressed]
- Net effect on quality (escape rate, rework): [improved / neutral / regressed]
- Net effect on review cost: [improved / neutral / regressed]
- Confidence in these numbers: [high / medium / low + why]
- Follow-up actions: [what to change or measure next]

## Honest measurement notes

- All metrics here are gathered manually; the framework does not auto-collect any of them.
- Small sample sizes make single-window comparisons noisy — prefer trends over point comparisons.
- Record assumptions (what counts as a "change", a "bug", "AI-generated") so future windows stay comparable.
- Never store secrets, tokens, or customer data in this report.

## Ghi chú tiếng Việt

Mọi chỉ số trong template này là thủ công; Vibe Coding OS không thu thập tự động. So sánh cửa sổ hiện tại với baseline, ưu tiên xu hướng thay vì một lần đo, ghi rõ giả định và không lưu dữ liệu nhạy cảm.
