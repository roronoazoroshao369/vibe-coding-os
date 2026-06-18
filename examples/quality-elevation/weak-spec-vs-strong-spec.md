# Before / After: Weak Spec vs Strong Spec

## Weak spec

> Add email validation.

Problems:
- no acceptance criteria
- no error behavior specified
- no mention of where it belongs in the request lifecycle
- agent must guess scope, output shape, and edge cases

The result is almost always inconsistent with what the requester actually wanted.

## Strong spec

> Add email validation to the user registration endpoint.
>
> Acceptance criteria:
> - field `email` is required
> - must contain `@` and at least one `.` after the `@`
> - leading and trailing whitespace must be trimmed before validation
> - empty string must be rejected
> - invalid email must return `422` with `{"error": "Invalid email format"}`
> - valid email must pass through unchanged
>
> Out of scope:
> - duplicate email checks
> - DNS / MX record lookups

What changed:
- the field and endpoint are named explicitly
- valid and invalid cases are concrete
- the error shape is specified
- scope is limited so the agent does not wander

## Why spec quality directly affects implementation quality

A weak spec forces the agent to invent requirements. Every invented requirement is a chance to build something the requester did not want, miss something that was implicitly expected, or add unnecessary complexity.

A strong spec reduces that ambiguity. With explicit acceptance criteria, the agent can write targeted tests, make the smallest correct change, and verify the result against a known contract.

If you do not know what "done" looks like yet, finish the spec first.
