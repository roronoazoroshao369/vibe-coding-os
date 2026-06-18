# Model Weakness Log

Track known failure patterns per model type. Update after each confirmed incident. Prune entries when model updates resolve the weakness.

## Log

| Model | Pattern Category | Example | Prevention | Last Seen |
| --- | --- | --- | --- | --- |
| claude-sonnet | Missing null-checks | Assumes DB query always returns a row; accesses `.id` without null guard | Verify every query result is null-checked before property access | 2026-06-15 |
| gpt-4 | Hallucinated imports | Generates `from nonexistent_package import helper` | Cross-check all imports against `requirements.txt` or `package.json` before accepting | 2026-06-10 |
| llama-3 | Off-by-one loops | Uses `range(len(arr))` and accesses `arr[i+1]` without bounds check | Validate loop bounds and confirm no out-of-range access on last iteration | 2026-06-08 |
| local-qwen | Incorrect error handling | Wraps entire function in bare `except` and silently passes | Ensure each `except` clause catches a specific exception and logs or re-raises | 2026-06-12 |
| claude-sonnet | API version mismatch | Uses deprecated v1 endpoint when v2 is documented | Check API version in imports and base URLs against current documentation | 2026-06-14 |
| gpt-4 | Missing async await | Calls async function without `await`, gets coroutine instead of result | Verify every async function call is awaited; lint for unawaited coroutines | 2026-06-11 |
| llama-3 | Regex injection | Builds regex from user input without escaping | Escape all user-supplied strings before embedding in regex patterns | 2026-06-09 |
| gpt-4 | Ignoring race conditions | Reads shared state and writes without lock or atomic operation | Identify shared mutable state and verify synchronization strategy | 2026-06-13 |

## How to update

1. After a model-generated bug is confirmed, add a row with the model type, pattern category, a concrete example, the prevention strategy, and today's date.
2. When a model update resolves a weakness, move the entry to an **Archived** section with the resolution date.
3. Review quarterly: remove archived entries older than 6 months, promote recurring patterns to higher priority.
