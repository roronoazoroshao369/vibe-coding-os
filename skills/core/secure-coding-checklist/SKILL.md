# Skill: Secure Coding Checklist

## Purpose

Provide an OWASP-mapped three-layer checklist (input validation at trust boundary, output encoding at sink boundary, identity & capability check at every privileged operation) for any code, config, or prompt that crosses a trust boundary. Complement our `red-team-bypass` and `defensive-detection` skills with a preventive layer that catches the same bug classes before merge.

## When to use

Use during code review, before merging a PR that touches a trust boundary (HTTP handler, SQL query, shell command, file write, IPC call), or when auditing a feature for the OWASP Top 10 (injection, broken auth, sensitive data exposure, XXE, broken access control, security misconfig, XSS, insecure deserialization, vulnerable components, insufficient logging). Choose this skill when you need a concrete checklist with explicit gates, not a generic security reminder.

## Inputs

- Code or config under review (file path or diff).
- Trust boundaries crossed (network ingress, egress to DB, file write, IPC, shell).
- Data classes handled (PII, secrets, credentials, payment, free-text).
- Identity context (anonymous, authenticated user, admin, service).
- Capability scope of the running code.

## Workflow

1. Identify every trust boundary the code crosses (network → app, app → DB, app → shell, app → file, app → IPC).
2. Apply **Layer 1 — Input validation**: every external input validated at the boundary (type, length, charset, range, allow-list). Reject invalid input with a 400/422-equivalent.
3. Apply **Layer 2 — Output encoding**: every value rendered to a sink (HTML, SQL, shell, JSON, file path, log) encoded for that sink's grammar. Reject encoded payloads that would re-decode to dangerous shapes.
4. Apply **Layer 3 — Identity & capability**: every privileged operation checks (a) who is asking (authn), (b) what they are allowed to do (authz), (c) what scope the operation has (least privilege).
5. Map findings to OWASP Top 10 2021 categories (A01–A10). Record the category and the gate that catches it.
6. Block merge if any layer fails a gate or if a gate is absent where the boundary demands one.

## Outputs

- A markdown table with one row per trust boundary crossed and the gate status for each layer.
- An OWASP A01–A10 mapping table for the code under review.
- A merge-block decision (ALLOW, BLOCK with reason, ALLOW_WITH_FOLLOWUPS).

## Failure modes

- Validating input but not encoding output (XSS still possible).
- Encoding output but not validating input (injection still possible).
- Checking authn but skipping authz (privilege escalation possible).
- Logging the request but not the authz decision (insufficient logging per A09).
- Treating "internal network" as a trust boundary skip — defense-in-depth fails on first breach.

## Verification checklist

- [ ] Every trust boundary identified has an entry in the layer table.
- [ ] Layer 1 gate present for every external input (regex test, type test, length test).
- [ ] Layer 2 gate present for every sink (HTML escape, parameterized SQL, shell-escape, JSON encode, path canonicalize).
- [ ] Layer 3 gate present for every privileged op (authn check, authz check, scope check).
- [ ] OWASP A01–A10 mapping documented; every applicable category has at least one gate.
- [ ] `npm run validate:secrets` and `npm run validate:injection` exit 0 before merge.
- [ ] Security findings recorded in `docs/security/<date>-<feature>.md`.

## Related skills

- `skills/core/red-team-bypass/SKILL.md` — adversarial testing of the same surface
- `skills/core/threat-model-driven-security/SKILL.md` — STRIDE 6-letter lens on the trust boundary
- `skills/core/verification-before-done/SKILL.md` — 5-axis verification includes security axis
- `templates/secure-coding-checklist-template.md` — review worksheet

## Attribution

Inspired by [RohitG00/awesome-claude-code-toolkit](https://github.com/RohitG00/awesome-claude-code-toolkit) (Apache-2.0). Adapted in original wording with Vibe Coding OS-specific OWASP mapping.
