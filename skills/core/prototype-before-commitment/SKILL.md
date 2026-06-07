# Skill: Prototype Before Commitment

## Purpose

Build or describe a throwaway experiment to reduce uncertainty before committing to architecture or UI direction. The kind of question being answered decides the shape of the prototype — a logic/state question and a look/feel question need very different artifacts.

## When to use

Use when options are unclear, when a data model or state machine is hard to reason about on paper, when UX/visual direction needs exploring, or when implementation cost is unknown. Triggers include "prototype this", "let me play with it", "try a few designs", "does this state model feel right", "what should this look like".

## Inputs

The question to answer, prototype boundaries, throwaway policy, success criteria, and a timebox.

## Route by question type

Before building, decide which question you are answering — from the prompt, the surrounding code, or by asking the user. Getting the branch wrong wastes the whole prototype.

- **State-model / logic question** ("does this logic or state machine feel right?") → build a tiny **interactive terminal prototype**. Drive the state machine through the cases that are hard to picture mentally: edge transitions, illegal moves, concurrent updates. After every action, print the full relevant state so the user can see exactly what changed. The goal is to *feel* the behavior, not to look at it.
- **Look / feel question** ("what should this look like?") → generate **multiple toggleable UI variants** on a single throwaway route. Make the variations genuinely different (not three shades of the same layout), switchable from one place — a URL search param plus a small floating switcher, or whatever the project's routing already supports. Surface the current variant name on switch. The goal is fast side-by-side comparison, not a finished screen.

If the question is genuinely ambiguous and the user is unreachable, default by context — a backend module leans logic, a page or component leans UI — and state the assumption at the top of the prototype.

## Rules for both branches

1. **Throwaway from day one, clearly marked.** Place the prototype next to what it prototypes so context is obvious, but name it so no one mistakes it for production. Obey the project's existing conventions; don't invent new top-level structure.
2. **One command to run.** Use whatever task runner the project already has so the user can start it without thinking.
3. **No persistence by default.** Keep state in memory. If the question itself is about persistence, hit a scratch store named so it's obviously disposable.
4. **Skip the polish.** No tests, no error handling beyond what makes it runnable, no abstractions. Learn fast, then delete.
5. **Surface the state.** Logic branch: print state after each action. UI branch: render the active variant clearly on each switch.
6. **Delete or absorb when done.** Either remove the prototype or fold the validated decision into real code — never leave it rotting in the repo.

## Workflow

1. State the uncertainty the prototype will answer and the timebox.
2. Route to the logic branch or the UI branch by question type.
3. Build the smallest experiment for that branch, isolated and clearly disposable.
4. Capture findings in `templates/prototype-report-template.md`.
5. Record the answer somewhere durable (commit message, ADR, issue, or a notes file beside the prototype) alongside the question it answered.
6. Decide: discard, adapt, or proceed to PRD/ADR.

## Outputs

A prototype plan or artifact on the correct branch, findings, the answer to the originating question, a recommendation, and cleanup/handoff notes.

## Failure modes

Routing to the wrong branch (a terminal app when the question was visual, or vice versa), accidentally shipping prototype code, overbuilding past the question, producing UI "variants" that barely differ, failing to surface state, or hiding the prototype's limitations.

## Verification checklist

- [ ] Question type identified and the matching branch chosen (logic → terminal; look → toggleable variants).
- [ ] Timebox respected and the result answers the question.
- [ ] State is surfaced (printed per action, or visible per variant).
- [ ] Disposable code is not silently merged; the next decision is clear.

## Ghi chú tiếng Việt

Prototype để học nhanh trước khi cam kết, và LOẠI CÂU HỎI quyết định hình dạng: câu hỏi về state/logic → app terminal tương tác in ra toàn bộ state sau mỗi hành động; câu hỏi về giao diện → nhiều biến thể UI khác biệt rõ rệt, bật/tắt được trên cùng một route. Luôn đánh dấu throwaway, một lệnh chạy, không persistence mặc định, và xóa hoặc hấp thụ khi xong. Nguồn cảm hứng: `mattpocock/skills` (MIT, Matt Pocock) — định tuyến prototype theo loại câu hỏi (logic vs UI); viết lại nguyên gốc, không sao chép.
