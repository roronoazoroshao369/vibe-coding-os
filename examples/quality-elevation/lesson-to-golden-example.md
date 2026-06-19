# Lesson to Golden Example

> A v1.9 scenario showing how a real-world bug/failure is captured as a lesson entry, then canonized into a golden example that future agents can learn from to prevent recurrence.

## Scenario

During a database migration task, an agent generated code that used transactions incorrectly — committing the outer transaction before an inner atomic block could complete, causing partial data loss. The bug was caught in staging by a `SELECT COUNT(*)` assertion that expected 100 records but found 52.

## Step 1: Capture the lesson

Command: [`vibe-lessons-learned add`](../../commands/vibe-lessons-learned.md)

Template: [`templates/lesson-entry-template.md`](../../templates/lesson-entry-template.md)

### Raw lesson entry

```
---
date: 2026-06-19
severity: critical
model: claude-sonnet
area: database-migrations
---

# Lesson: Nested transaction outer-commit before inner-block completion

## Error

SQLite migration with nested transactions: the outer transaction was
committed before an inner SAVEPOINT block completed, causing partial
data loss. The migration script inserted 52 of 100 target records.
Detected by staging assertion `SELECT COUNT(*) = 100` that failed.

## Root cause

The agent assumed `sqlite3` transactions behaved like PostgreSQL
nested subtransactions. In SQLite, the autocommit mode means the
outer transaction can be committed by a DDL statement before the
inner block finishes, unless the connection is in explicit
non-autocommit mode or WAL mode is active.

## Fix

1. Set `conn.isolation_level = 'IMMEDIATE'` before starting the
   migration to prevent autocommit interference.
2. Use `conn.execute("BEGIN IMMEDIATE")` explicitly instead of
   relying on Python's context manager.
3. Reorder operations: create tables first (implicit commit in
   SQLite), then perform data operations inside the explicit
   transaction.

## Prevention rule

For SQLite migrations with nested write operations:
- NEVER rely on Python's `with conn:` context manager for
  multi-statement transactions.
- Always set `isolation_level = 'IMMEDIATE'` or `'EXCLUSIVE'`
  before the transaction.
- Create all schema before starting the transactional data
  migration, because DDL statements can implicitly commit open
  transactions in SQLite.
- Test the migration against a fresh SQLite database with
  row-count assertions before and after.
```

## Step 2: Canonize as a golden example

The lesson is valuable but lives in the lessons log — only searched when someone queries "sqlite", "migration", or "nested transactions". To make the pattern more broadly discoverable and teachable, canonize it as a before/after golden example in the Quality Elevation library.

### File name

`examples/quality-elevation/sqlite-migration-nested-tx-before-after.md`

### Golden example content

---

# Before: Broken nested transaction pattern

## What the agent wrote

```python
def run_migration(conn):
    # BAD: Assumes SQLite transactions work like PostgreSQL
    conn.execute("INSERT INTO events (name) VALUES ('init')")

    # This CREATE TABLE will implicitly COMMIT the outer transaction
    # in SQLite, leaving subsequent INSERTs outside the transaction.
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL
        )
    """)

    for i in range(100):
        conn.execute("INSERT INTO users (name) VALUES (?)", (f"user_{i}",))

    # By the time we get here, some rows may have been committed
    # and some may not, depending on SQLite's autocommit behavior.
    conn.commit()
```

## What went wrong

1. `CREATE TABLE` in SQLite is a DDL statement that implicitly commits any open transaction.
2. The `INSERT INTO events` row was committed by the `CREATE TABLE` before the migration intended to commit it.
3. The `for` loop `INSERT`s into `users` ran outside the intended transactional context.
4. If a failure occurred mid-loop, the database would have a partial insert — exactly 52 rows in this case.

## Why it matters

- **Silent partial failure:** No error was raised; the migration appeared to succeed.
- **Data loss:** Only 52 of 100 expected records were inserted.
- **Hard to debug:** The root cause (implicit DDL commit in SQLite) is not obvious without understanding SQLite's transaction model.

---

# After: Correct transaction pattern

## What a prevention-aware agent writes

```python
def run_migration(conn):
    # GOOD: Explicit isolation control for SQLite
    conn.isolation_level = 'IMMEDIATE'
    conn.execute("BEGIN IMMEDIATE")

    try:
        conn.execute("INSERT INTO events (name) VALUES ('init')")

        # Schema creation BEFORE transactional data operations
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL
            )
        """)

        # All DDL is done; now we can safely do data operations
        # inside the explicit transaction.
        for i in range(100):
            conn.execute("INSERT INTO users (name) VALUES (?)", (f"user_{i}",))

        conn.commit()
    except Exception:
        conn.rollback()
        raise
```

## Why this is better

1. **Explicit transaction control:** `BEGIN IMMEDIATE` prevents autocommit from stealing the outer transaction.
2. **Schema first, data second:** All DDL (which triggers implicit commits in SQLite) runs before transactional data writes.
3. **Proper error handling:** If anything fails, the migration rolls back cleanly instead of leaving partial state.
4. **Self-documenting:** The code structure makes the transaction intent clear.

## Verification

```bash
# Before the migration, assert clean state
sqlite3 db.sqlite "SELECT COUNT(*) FROM users"  # should be 0

# Run the migration
python migrate.py

# After the migration, assert expected count
sqlite3 db.sqlite "SELECT COUNT(*) FROM users"  # should be 100
sqlite3 db.sqlite "SELECT COUNT(*) FROM events"  # should be 1
```

---

## Step 3: Register the golden example

Add the new golden example to `examples/quality-elevation/README.md`:

```markdown
- SQLite Migration Nested Transaction (`./sqlite-migration-nested-tx-before-after.md`): shows how SQLite's DDL-implicit-commit can silently break nested transactions and how to structure migrations correctly
```

## Step 4: Link back from lessons log

Update the lesson entry in the lessons log with a reference to the golden example:

```
## Related golden example

See `examples/quality-elevation/sqlite-migration-nested-tx-before-after.md`
for a complete before/after pair demonstrating this pattern.
```

This way, a lessons-learned search returns both the prevention rule and an easy-to-copy golden example.

## Step 5: Inject the prevention rule into future SQLite migration tasks

Before starting any migration task that touches SQLite, the agent should:

1. **Search lessons:** Query for `sqlite`, `migration`, `transaction`.
2. **Find the lesson:** Returns the nested transaction lesson and the golden example link.
3. **Inject the prevention rule:**
   > For SQLite migrations: use `BEGIN IMMEDIATE`, not `with conn:`. Create all schemas before transactional data operations. Assert row counts before and after.
4. **Follow the golden example:** Read the "After" pattern and use it as a template for the migration code.

## Key takeaways

1. **Lesson first:** The bug is captured as a lesson entry with a specific prevention rule before any golden example is created.
2. **Golden example second:** The prevention rule is turned into a teachable before/after pair for broader reuse.
3. **Bidirectional link:** The lesson entry references the golden example, and the example is registered in the library README. Neither lives in isolation.
4. **Prevention injection:** On similar future tasks, the lesson is found via search and the prevention rule is injected automatically.
5. **No secrets:** Placeholder data used; no real tokens, keys, or credentials appear in the example.

## See also

- [`docs/smart-adapt.md`](../../docs/smart-adapt.md) — canonical Smart Adapt guide
- [`templates/lesson-entry-template.md`](../../templates/lesson-entry-template.md) — lesson entry template
- [`examples/quality-elevation/README.md`](README.md) — Golden Example Library home
- [`skills/core/lessons-learned-db/SKILL.md`](../../skills/core/lessons-learned-db/SKILL.md) — Lessons Learned DB skill
- [`commands/vibe-lessons-learned.md`](../../commands/vibe-lessons-learned.md) — lessons-learned command
