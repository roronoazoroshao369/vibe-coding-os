description: "Run a simplicity check on a proposed design or implementation against the anti-overengineering skill."
---

# vibe-anti-overengineer

Challenge a proposed approach against the 5-step anti-overengineering workflow. Returns a structured review with scope assessment, trade-offs, and deferrals.

## Inputs

- `approach` — The proposed solution or design description (required)
- `spec_path` — Path to the spec or acceptance criteria (optional, for scope verification)
- `existing_pattern_path` — Path to a similar implementation if one exists (optional)

## Steps

1. Read the anti-overengineering skill: `skills/prompts/anti-overengineering/SKILL.md`
2. Read the proposed approach and any related spec.
3. Apply the 5-step workflow:
   - **Step 1:** State the smallest acceptable solution that meets all stated requirements.
   - **Step 2:** List any features in the proposed approach not required by the spec. Mark each as "reject" or "justify".
   - **Step 3:** Check if existing patterns in the repo can replace new frameworks or abstractions.
   - **Step 4:** List trade-offs with explicit rationale for each.
   - **Step 5:** Identify ideas that should be deferred to follow-ups.
4. Use `templates/anti-overengineering-review-template.md` for the structured output.
5. Mark each verification checklist item.

## Outputs

A completed `templates/anti-overengineering-review-template.md` with:
- Smallest acceptable solution
- Scope trim list
- Trade-offs with rationale
- Deferred follow-ups
- Verification checklist status

## Related commands

- `commands/vibe-self-review.md` — broader self-review before delivery
- `commands/vibe-critique-pass.md` — structured critique pass
- `commands/vibe-review.md` — general review

## Verification

- The review template is filled out completely.
- The verification checklist passes.
- The simplified approach still satisfies the acceptance criteria.
