# Before / After: Hallucination Correction

## The problem

Agents sometimes invent APIs, library methods, or file structures that do not exist in the project. This happens when they generate code from training data patterns instead of inspecting the actual codebase. The result looks plausible but fails at runtime.

## Hallucinated version

The agent is asked to add a query for all users. Without inspecting the project, it generates:

```ts
import { db } from "../db";

const users = await db.query("SELECT * FROM users WHERE active = true");
```

Problems:
- the project uses Drizzle ORM, not raw SQL
- `db.query()` does not exist in this codebase
- the `users` table has a different schema than assumed
- the code compiles silently in some setups or fails at runtime

## Corrected version

After inspecting the existing database setup, the agent finds:
- `src/db/index.ts` exports a Drizzle client
- `src/db/schema.ts` defines the `users` table with `drizzle-orm/pg-core`
- the project convention is typed queries through Drizzle

The correct code:

```ts
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const activeUsers = await db
  .select()
  .from(users)
  .where(eq(users.active, true));
```

What changed:
- uses the existing Drizzle client and schema import
- uses Drizzle's typed query builder instead of raw SQL
- matches the actual table and column names in the schema
- follows the query conventions already present in the codebase

## How to prevent hallucination

1. Before writing database or API code, inspect the existing database client, ORM setup, and schema files.
2. Before calling a library function, confirm the method exists in the installed version.
3. Search the codebase for similar calls and follow the same pattern.
4. If you are unsure whether an API exists, say so and check before generating code.

Context gathering is the most reliable defense against hallucination. Never generate code that depends on an API you have not verified exists.
