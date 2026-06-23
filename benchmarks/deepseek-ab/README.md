# DeepSeek A/B Quality Benchmark

**The single most important thing in this repo.** Everything else
(115 skills, 80 validators, CI) measures the framework against *itself*.
This measures the only thing that matters to the original goal:

> Does a mid-tier model (DeepSeek) produce **better code** when it runs
> *with* vibe-coding-os than *without* it?

If we can't show that, the framework's value is unproven no matter how
green the CI is.

## What it measures

For each of 10 fixed tasks we run the model in two arms:

| Arm | System prompt |
|-----|----------------|
| **A — control** | Bare model. A minimal "you are a coding assistant" prompt. |
| **B — framework** | The same model, primed with the vibe-coding-os core context (CONSTITUTION + grounding + plan/verify protocol + relevant skill). |

Each task is run `N` times per arm (default 3) to average out variance.

## The 5 metrics

| # | Metric | How it's scored | Direction |
|---|--------|-----------------|-----------|
| 1 | **First-try pass rate** | Generated code runs the task's hidden test suite; % of runs passing on the first attempt. | higher |
| 2 | **Hallucination rate** | Output references APIs/files/symbols not present in the provided context or the language's stdlib. Scored by `score-hallucination.mjs` against an allowlist + the task's known symbols. | lower |
| 3 | **Token cost** | Total tokens (prompt + completion) reported by the API per task. | lower |
| 4 | **Edit locality / diff size** | Lines changed vs. the minimal reference diff. Bloated output = worse. | lower |
| 5 | **Rubric quality (0–5)** | Clean-code rubric: naming, error handling, no dead code, comments-where-needed, follows stated conventions. Scored by `score-rubric.mjs` (deterministic checks) + optional judge model. | higher |

## Files

```
benchmarks/deepseek-ab/
├── README.md                 <- you are here
├── config.example.json       <- copy to config.json, add model + key env
├── run-benchmark.mjs         <- orchestrates A/B runs, calls the model
├── score-firsttry.mjs        <- runs hidden tests in a sandbox
├── score-hallucination.mjs   <- symbol/API allowlist check
├── score-rubric.mjs          <- deterministic clean-code rubric
├── aggregate.mjs             <- combines runs -> results/report.md + .json
├── prompts/
│   ├── arm-a-control.md      <- bare baseline system prompt
│   └── arm-b-framework.md    <- vibe-coding-os primed system prompt
├── tasks/                    <- 10 tasks, each a folder (see tasks/README.md)
└── results/                  <- generated; git-ignored
```

## Quick start

```bash
cp benchmarks/deepseek-ab/config.example.json benchmarks/deepseek-ab/config.json
# edit config.json: set model id + which env var holds the API key
export DEEPSEEK_API_KEY=sk-...

# dry-run wiring (no API calls) to validate tasks + scorers:
node benchmarks/deepseek-ab/run-benchmark.mjs --dry-run

# real run:
node benchmarks/deepseek-ab/run-benchmark.mjs --runs 3
node benchmarks/deepseek-ab/aggregate.mjs
open benchmarks/deepseek-ab/results/report.md
```

## Honesty rules (so this stays evidence, not theater)

1. **Tasks are frozen before runs.** No editing a task after seeing a
   model fail it. Add tasks; don't tune them.
2. **Hidden tests are not shown to the model** in either arm.
3. **Same model, same temperature, same N** for both arms. The ONLY
   difference is the system prompt.
4. **Report the deltas, not just B.** If B isn't clearly better than A,
   say so — that's a finding, and it tells you which skills to cut.
5. **Commit the results JSON**, not just the prose summary.
