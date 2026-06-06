# Skill: Prototype Before Commitment

## Purpose

Build or describe a throwaway experiment to reduce uncertainty before committing to architecture or UI direction.

## When to use

Use when options are unclear, UX/state behavior needs exploration, or implementation cost is unknown.

## Inputs

Question to answer, prototype boundaries, throwaway policy, success criteria, and timebox.

## Workflow

1. State the uncertainty the prototype will answer.
2. Choose the smallest experiment.
3. Keep it isolated and clearly disposable.
4. Capture findings in `templates/prototype-report-template.md`.
5. Decide whether to discard, adapt, or proceed to PRD/ADR.

## Outputs

Prototype plan or artifact, findings, recommendation, and cleanup/handoff notes.

## Failure modes

Accidentally shipping prototype code, overbuilding, failing to answer a question, or hiding prototype limitations.

## Verification checklist

Timebox is respected; result answers the question; disposable code is not silently merged; next decision is clear.

## Ghi chú tiếng Việt

Prototype dùng để học nhanh trước khi cam kết. Nhớ đánh dấu throwaway và không commit nếu không được chuyển hóa thành thiết kế thật.
