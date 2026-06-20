---
description: Run an OWASP Top 10-mapped secure coding review across a feature or PR.
---

# vibe-secure-coding

## What this command does

Generates a per-trust-boundary review worksheet using the three-layer secure-coding checklist (input validation, output encoding, identity & capability). Maps findings to OWASP Top 10 2021 (A01–A10) and emits a merge decision.

## When to use

Run when a PR touches a trust boundary (HTTP handler, SQL query, shell command, file write, IPC call), before merging security-sensitive changes, or during a periodic security audit. Use after adopting the `secure-coding-checklist` skill.

## Inputs

- PR diff or file list under review.
- Trust boundaries crossed (network ingress, egress to DB, file write, shell, IPC).
- OWASP Top 10 categories in scope (default: all A01–A10).
- Optional identity context for the review (anonymous, authenticated, admin, service).

## Outputs

- `docs/security/<date>-<feature>.md` with the per-boundary layer table.
- An OWASP A01–A10 mapping table for the diff under review.
- A merge decision: ALLOW, BLOCK (with reason), or ALLOW_WITH_FOLLOWUPS.

## Steps

1. Run `npm run vibe-secure-coding -- --diff=path/to/diff --boundaries=network,db,shell,file,ipc`.
2. Walk the diff for every trust boundary crossing; mark each row in the layer table.
3. Map each finding to the OWASP A01–A10 category that captures it.
4. Apply the merge-decision rubric: any Layer 1/2/3 gate absent → BLOCK.
5. Persist the worksheet under `docs/security/<date>-<feature>.md`.
6. Run `npm run validate:secrets` and `npm run validate:injection` before approving.

## Failure modes

- Skipping boundary identification (the checklist cannot protect against an unlisted boundary).
- Treating "internal network" as a trust boundary skip.
- Logging only the request, not the authz decision (insufficient logging per A09).

## Verification checklist

- [ ] Every trust boundary has an entry in the layer table.
- [ ] Every Layer 1 input gate tested with at least one valid and one invalid input.
- [ ] Every Layer 2 sink encoding tested with a sample payload that would re-decode dangerously if dropped.
- [ ] Every Layer 3 privileged op has authn + authz + scope check recorded.
- [ ] OWASP A01–A10 mapping covers every applicable category.
- [ ] Worksheet saved to `docs/security/<date>-<feature>.md`.
- [ ] `npm run validate:secrets` and `npm run validate:injection` exit 0.
