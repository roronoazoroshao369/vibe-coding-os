# Example: React / Next.js Booking Workflow

This example shows how to apply Vibe Coding OS to a real-world React/Next.js feature: adding a clinic appointment booking flow. It is designed for product-style web apps where UI quality, accessibility, and verification matter.

## 1. Initial user intent

> Add a patient appointment booking page where Vietnamese users can choose a service, date, time slot, and submit contact information.

Assumptions to confirm before implementation:

- The project uses Next.js App Router, React, TypeScript, and Tailwind or a component library.
- Existing design tokens and components should be reused before creating new UI primitives.
- The first version can store submissions through the project's existing API/database layer.
- The booking form must be usable on mobile and desktop.

## 2. Recommended command/skill order

1. `vibe-init` — inspect project conventions, package scripts, UI library, and data layer.
2. `vibe-spec` — define booking behavior, constraints, validation, and non-goals.
3. `vibe-plan` — break implementation into UI, validation, API, persistence, and tests.
4. `vibe-implement` — implement one layer at a time, checking after each layer.
5. `vibe-review` — review accessibility, data validation, error states, and scope creep.
6. `vibe-memory` — save durable project decisions like date/time formatting and validation rules.
7. `vibe-merge` — confirm acceptance criteria and validation before shipping.

## 3. Sample spec

```markdown
# Spec: Clinic appointment booking flow

## Intent

Patients need a simple way to book clinic appointments from mobile or desktop without calling the clinic.

## Goals

- Users can select a service, date, and available time slot.
- Users can enter name, phone number, and an optional note.
- Required fields show clear validation errors in Vietnamese.
- Successful submission shows a confirmation message with booking details.
- The page works at mobile, tablet, and desktop widths.

## Non-goals

- Do not build a full staff scheduling dashboard.
- Do not add online payment.
- Do not add SMS sending unless the project already has that service.

## Acceptance criteria

1. `/booking` renders the booking form.
2. Required fields cannot be submitted empty.
3. Phone number validation rejects obviously invalid values.
4. Selecting a date updates the visible time slots.
5. Submitting valid data creates a booking through the existing server/API pattern.
6. Success and failure states are visible and understandable.
7. Keyboard navigation and labels work for form controls.
8. Existing tests and lint checks pass.
```

## 4. Sample plan

```markdown
# Plan: Clinic appointment booking flow

## Task 1 — Inspect existing app structure

- Read `app/`, `components/`, `lib/`, `db/`, and package scripts.
- Identify form, button, input, select, toast, and card components.
- Identify existing server action/API route conventions.

Verification:
- Summarize discovered conventions before editing.

## Task 2 — Add booking schema and validation

- Create or update a validation module for booking input.
- Validate service, date, slot, name, phone, and note.
- Keep error messages in Vietnamese.

Verification:
- Add unit tests if the project already has a test runner.
- Otherwise run TypeScript and lint checks.

## Task 3 — Build booking page UI

- Create `/booking` page.
- Use existing design tokens and components.
- Include responsive layout and accessible labels.

Verification:
- Check mobile, tablet, and desktop layout.
- Check keyboard navigation.

## Task 4 — Add submit path

- Wire form submission to the existing API/server action/database pattern.
- Return structured success and error states.

Verification:
- Submit valid and invalid examples.
- Confirm persisted data shape.

## Task 5 — Review and polish

- Run project validation.
- Review against spec.
- Remove unused code and overbuilt abstractions.
```

## 5. Prompt to give your AI assistant

```text
Use Vibe Coding OS for this feature. First inspect the project, then create a spec and plan before implementation.
Feature: add a Vietnamese clinic appointment booking flow.
Constraints: reuse existing components and data layer; do not add payments or SMS; keep validation messages in Vietnamese; verify mobile and desktop layouts.
```

## 6. Verification checklist

- [ ] Spec exists and captures goals, non-goals, constraints, and acceptance criteria.
- [ ] Plan lists exact files and verification commands.
- [ ] UI follows existing design tokens and component conventions.
- [ ] Form controls have labels and keyboard-friendly behavior.
- [ ] Required fields and invalid phone number show Vietnamese errors.
- [ ] Success and failure states are visible.
- [ ] Project lint/type/test commands pass.
- [ ] Review pass was performed before merge.

## 7. Common pitfalls

- Jumping straight to UI before defining appointment data shape.
- Inventing a new component system instead of using existing components.
- Hardcoding time slots in multiple places.
- Forgetting empty, loading, and failure states.
- Claiming accessibility without checking labels and keyboard behavior.

Use this example as a starting point, not as a fixed implementation. The actual files and commands should come from the target project's conventions.
