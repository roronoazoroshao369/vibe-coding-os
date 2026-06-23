# Task 04 — Robust fetch using the PROVIDED retry helper

You are given `helpers.py` (in context). It already provides:

- `fetch_once(url)` — may raise `TransientError`
- `retry(fn, attempts=3, on=(TransientError,))` — retry wrapper
- `TransientError`

Implement `solution.py` exposing:

```python
def robust_fetch(url, attempts=3):
    """Fetch `url`, retrying transient failures up to `attempts` times.
    Must use the existing helpers — do not write your own retry loop and
    do not import any third-party HTTP/retry library."""
```

Use ONLY what `helpers.py` provides. Do not invent functions that are
not in the given context. Return only `solution.py` in one code block.
