# Workflow Extension Design

## Purpose

Provide design guidance for extending or presetting the spec-driven workflow (variants for
different project types) without building a heavyweight runtime engine.

## When to use

Use when a team wants a tailored workflow variant (e.g., a lighter path for small fixes,
or a stricter path for safety-critical work), or when evaluating whether an upstream
extension/preset idea is worth adopting locally.

## Inputs

The base workflow (constitution → spec → plan → tasks → implement), the variation needed,
and the constraints that make a variant useful.

## Workflow

1. State why a variant is needed and which base phases change.
2. Describe the variant as a documented preset: which skills, commands, and gates apply.
3. Keep variants additive and optional; the base workflow remains the default.
4. Avoid building a runtime preset engine; presets are documentation, not code.
5. Define when to use each variant and how to switch.
6. Record the variant and its rationale; cross-link the affected skills/commands.

## Outputs

A documented workflow variant (preset) describing phases, applicable skills/commands,
gates, and selection criteria.

## Failure modes

- A variant duplicates the base workflow with trivial differences.
- Presets become code/runtime that must be maintained.
- Too many variants confuse contributors.
- The default workflow is weakened to accommodate a niche variant.

## Verification checklist

- [ ] The variant has a clear, justified purpose.
- [ ] It is additive and optional.
- [ ] It is documentation, not a runtime engine.
- [ ] Selection criteria and affected skills are recorded.

## Applied / Not Applied

- Applied: the extension/preset concept from `github/spec-kit`, as design guidance only.
- Not applied: a full extension/preset runtime, agent installer, or language-specific
  generators. Presets remain documented variants.

## Ghi chú tiếng Việt

Hướng dẫn thiết kế biến thể/preset cho workflow spec-driven dưới dạng tài liệu, không xây
runtime. Biến thể phải bổ sung và tùy chọn, giữ workflow gốc làm mặc định. Học khái niệm
extension/preset từ `spec-kit` nhưng không tạo engine. Liên kết:
`references/features/workflow-extensions-and-presets.md`.
