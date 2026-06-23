# Task 01 — Parse a CSV line with quoted commas

Implement a single file `solution.py` exposing:

```python
def parse_row(line: str) -> list[str]:
    """Split one CSV row into fields.

    Commas inside double-quoted fields must NOT split the field.
    Surrounding double quotes are removed from the returned values.
    A doubled double-quote ("") inside a quoted field is a literal quote.
    """
```

Example:
- `parse_row('a,"b,c",d')` -> `['a', 'b,c', 'd']`
- `parse_row('"x""y",z')` -> `['x"y', 'z']`

Return only the contents of `solution.py` in a single code block.
