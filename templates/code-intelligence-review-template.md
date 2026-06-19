# Code Intelligence Map: <Change Title>

## Scope

- **Diff base**: <commit/branch/tag>
- **Changed files**: <list>
- **Modules/packages touched**: <list>
- **Map boundary**: <modules included beyond the diff, with rationale>

---

## Dependency Graph

### Direct Imports per File

| File | Imports |
|------|---------|
| <path> | <module1>, <module2> |
| <path> | <module3>, <module4> |

### Transitive Dependency Risk

- <module> pulls in <framework/lib> — assess risk of this dependency.
- <module> has no external dependencies — low risk.

### Callers and Callees

| Function | Called by (callers) | Calls (callees) |
|----------|---------------------|-----------------|
| <func> | <caller1>, <caller2> | <callee1>, <callee2> |
| <func> | <caller3> | <callee3> |

### Data Flow

- **Types crossing the boundary**: <type1>, <type2>
- **Construction**: <where and how these types are created>
- **Consumption**: <where and how these types are used after the change>

---

## Call Graph

```
<function> → <callee>
  <function> → <callee>
<function> ← <caller>
```

- **Recursive paths**: <yes/no — list if yes>
- **Async chains**: <yes/no — list if yes>
- **Dynamic dispatch**: <methods where runtime type is unknown>

---

## Test Coverage

| Function / Path | Unit test | Covers change? | Integration test | Gap? |
|-----------------|-----------|----------------|------------------|------|
| <func> | <path> | Yes/No/Partial | <path> | <gap description> |
| <dependency chain> | — | — | <path> | <gap description> |

### Priority gaps

1. <highest priority gap>
2. <second priority gap>
3. <third priority gap>

---

## Code Intelligence Summary

<2–4 paragraph summary of the structural picture: what the change touches, how far it propagates, where risks concentrate, and which areas are well- or poorly-covered by tests. This goes into the review output.>
