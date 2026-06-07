# Feature: Workflow extensions and presets

## Goal

Provide design guidance for extending or presetting the spec-driven workflow as
documentation, without building a heavyweight runtime engine.

## Reference sources

- github/spec-kit

## Local implementation

- `skills/meta/workflow-extension-design/SKILL.md`
- `docs/workflows/spec-driven-development.md`

## Applied upstream ideas

- The concept of workflow variants/presets for different project types.

## Not applied upstream ideas

- A full extension/preset runtime engine.
- An agent installer or language-specific project generators.

## Must-have behavior

- Variants are additive, optional, and documented (not code).
- The base workflow remains the default.
- Each variant states its purpose, applicable skills/commands, and selection criteria.

## Failure modes

- Variants duplicate the base workflow trivially.
- Presets become runtime that must be maintained.
- Too many variants confuse contributors.

## Update signals

- Upstream changes its extension/preset model.
- A real project type needs a stable, repeatable variant.

## Evaluation ideas

- Is each variant justified and additive?
- Does the base workflow remain the default?

## Ghi chú tiếng Việt

Extension/preset là tài liệu mô tả biến thể workflow, không phải runtime. Biến thể phải bổ
sung, tùy chọn, giữ workflow gốc làm mặc định. Học khái niệm từ `spec-kit`, không xây
engine hay installer.
