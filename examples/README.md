# Examples

Use this page to pick the smallest example that matches your current job. Start with one workflow, then borrow only the skills, commands, and templates you need.

## Pick an example by intent

| If you want to... | Start here | What it demonstrates |
|---|---|---|
| Fix a bug safely | [`bugfix-workflow/`](bugfix-workflow/) | Reproduce → diagnose → patch → verify |
| Add a feature from vague intent | [`feature-workflow/`](feature-workflow/) | Spec → plan → tasks → implementation-readiness |
| Improve legacy code without a rewrite | [`legacy-enhancement/`](legacy-enhancement/) | Small-slice modernization with guardrails |
| Coordinate multiple agents | [`multi-agent-task/`](multi-agent-task/) | Role split, handoff, review, integration |
| Refactor with discipline | [`refactor-workflow/`](refactor-workflow/) | Non-goals, safety checks, regression verification |
| Elevate AI output quality | [`quality-elevation/`](quality-elevation/) | Quality rubric, self-review, adversarial review |
| Run the Quality Shield end-to-end | [`quality-shield/`](quality-shield/) | Contract → context pack → minimal diff → self-review → scorecard |
| Use CLI-oriented workflows | [`cli-workflows/`](cli-workflows/) | `vibe spec`, `vibe plan`, `vibe memory`, install packs |
| See a product-style Next.js flow | [`react-nextjs-booking-workflow/`](react-nextjs-booking-workflow/) | Realistic app workflow and acceptance criteria |

## Recommended first path

1. Read [`docs/FIRST-WORKFLOW.md`](../docs/FIRST-WORKFLOW.md).
2. Choose the example closest to your task.
3. Copy only the relevant prompt/skill/template snippets into your AI coding tool.
4. Verify with the smallest meaningful test before claiming done.

## Non-goals

- Do not start with optional runtime unless the example explicitly needs runtime state.
- Do not load every skill or command at once.
- Do not treat examples as rigid process; adapt the lightest sufficient workflow.
