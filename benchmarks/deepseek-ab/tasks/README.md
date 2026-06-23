# Benchmark Tasks

10 frozen tasks. Each task is a folder:

```
tasks/<NN-slug>/
├── task.json          # metadata + prompt + scoring config
├── prompt.md          # the user request shown to the model (both arms)
├── context/           # files the model is "given" (read-only context)
├── tests/             # hidden test suite (NEVER shown to the model)
└── reference.diff     # optional: minimal reference solution for locality scoring
```

## task.json shape

```json
{
  "id": "01-parse-csv",
  "language": "python",
  "title": "Parse a CSV with quoted commas",
  "difficulty": "easy",
  "entrypoint": "solution.py",
  "knownSymbols": ["csv", "open", "list", "dict"],
  "testCmd": "python -m pytest tests/ -q",
  "referenceLoc": 18
}
```

- `knownSymbols`: stdlib + context symbols the model may legitimately
  use. The hallucination scorer flags imports/symbols outside this set
  plus the language allowlist.
- `testCmd`: run inside an ephemeral sandbox dir that contains the
  model's output + `tests/`.

## The 10 tasks (balanced)

| NN | Lang | Type | Tests for |
|----|------|------|-----------|
| 01 | py | bugfix | reads real context before editing |
| 02 | ts | feature | follows stated conventions |
| 03 | py | refactor | no behavior change + smaller diff |
| 04 | ts | feature | no invented API (anti-hallucination) |
| 05 | py | feature | edge-case handling |
| 06 | go | bugfix | minimal localized diff |
| 07 | ts | refactor | error handling added |
| 08 | py | feature | uses provided helper, not a new one |
| 09 | ts | bugfix | reproduce-then-fix discipline |
| 10 | py | feature | input validation + clear errors |

Two starter tasks (01, 04) are scaffolded in this commit as working
examples; fill 02–03 and 05–10 following the same shape before the
official run. Keep tasks frozen once a run is recorded.
