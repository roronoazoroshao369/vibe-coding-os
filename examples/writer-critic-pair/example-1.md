---
skill: writer-critic-pair
example_id: 1
difficulty: standard
scenario: Co-write documentation
---

# Example: Co-write documentation

## Scenario

Co-write documentation. The following invocation shows how to apply the skill in a typical scenario.

## Invocation

```bash
# Step 1: Apply the skill
vibe-writer-critic-pair

# Step 2: Provide context
# - Target: <target file/module/PR>
# - Constraint: <specific constraint>
# - Risk: <known risk>
```

## Expected output

- A structured analysis or implementation
- A verification checklist
- A list of failure modes

## Failure modes

- **Insufficient context**: skill returns vague result. Mitigation: provide more specific inputs.
- **Out-of-scope target**: skill tries to do too much. Mitigation: split into separate invocations.
