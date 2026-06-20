---
skill: disciplined-diagnosis
example_id: 1
difficulty: standard
scenario: Diagnose a production bug by ranking hypotheses
---

# Example: Diagnose a production bug by ranking hypotheses

## Scenario

Diagnose a production bug by ranking hypotheses. The following invocation shows how to apply the skill in a typical scenario.

## Invocation

```bash
# Step 1: Apply the skill
vibe-disciplined-diagnosis

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
