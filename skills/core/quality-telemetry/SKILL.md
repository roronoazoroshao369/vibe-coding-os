# Skill: Quality Telemetry & Analytics

## Purpose

Collect local-first quality telemetry from quality engine runs, sessions, and reviews to support trend analysis, model comparison, and continuous quality improvement.

## When to use

Use after quality engine runs, before merging, during periodic quality reviews, or when analyzing quality trends across time, tasks, or models. Choose this skill when you want to record, aggregate, or review quality signals instead of only viewing a single run result.

## Inputs

- Quality engine JSON results
- Model name or profile
- Task type or category
- Session context, repository path, or run timestamp
- Optional time window for scoped metrics

## Outputs

- Recorded quality event payloads
- Session-level aggregated metrics
- Trend reports with pass, warn, fail, timing, and model or task comparisons
- Recommended adjustments for quality config or model selection

## Workflow

1. Emit a quality event immediately after each meaningful quality engine run.
2. Capture session metrics from the collected events.
3. Generate a trend report over the selected time window or dataset.
4. Review insights for recurring failures, regressions, or improvements.
5. Adjust quality config, model profile selection, or workflow discipline based on evidence.

## Failure modes

- Emitting telemetry that includes secrets, credentials, or unnecessary personal data.
- Only reviewing the latest run and missing recurring patterns.
- Comparing runs across different task types without segmenting the analysis.
- Ignoring timing signals that indicate a profile is too light or too heavy.
- Treating telemetry as a replacement for quality gates instead of a feedback layer.

## Verification checklist

- [ ] Quality event emitted with model, task type, timestamps, and aggregated gate results.
- [ ] Metrics are scoped correctly by session, model, or task type.
- [ ] Trend report covers the requested time window and clearly shows regressions or improvements.
- [ ] No sensitive or private data is emitted in telemetry payloads.
- [ ] Recommended config adjustments are specific, actionable, and limited to quality behavior.

## Related skills

- `skills/core/quality-engine/SKILL.md`
- `skills/core/model-aware-config/SKILL.md`
