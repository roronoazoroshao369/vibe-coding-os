---
name: secure-coding-checklist
version: 1.0.0
introduced_in: v2.15.0
last_reviewed: 2026-06-20
category: core
tags:
  - core
  - security
status: stable
---

# Skill: Secure Coding Checklist

## Purpose

Provide an OWASP-mapped three-layer checklist (input validation at trust boundary, output encoding at sink boundary, identity & capability check at every privileged operation) for any code, config, or prompt that crosses a trust boundary. Cover both **OWASP Top 10 2021** (A01–A10) and **OWASP LLM Top 10** (LLM01–LLM10) for LLM-touching surfaces. Complements our `threat-model-driven-security` skill with a preventive layer that catches the same bug classes before merge.

## When to use

Use during code review, before merging a PR that touches a trust boundary (HTTP handler, SQL query, shell command, file write, IPC call, MCP tool, system prompt), or when auditing a feature for:
- **OWASP Top 10 2021**: A01 Broken Access Control, A02 Cryptographic Failures, A03 Injection, A04 Insecure Design, A05 Security Misconfig, A06 Vulnerable Components, A07 Identification & Auth Failures, A08 Software & Data Integrity, A09 Security Logging Failures, A10 SSRF.
- **OWASP LLM Top 10**: LLM01 Prompt Injection, LLM02 Sensitive Information Disclosure, LLM03 Supply Chain (training data + model artifacts), LLM04 Data & Model Poisoning, LLM05 Improper Output Handling, LLM06 Excessive Agency, LLM07 System Prompt Leakage, LLM08 Vector & Embedding Weaknesses, LLM09 Misinformation, LLM10 Unbounded Consumption.

Choose this skill when you need a concrete checklist with explicit gates, not a generic security reminder.

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
5. Map findings to **OWASP Top 10 2021** (A01–A10) and **OWASP LLM Top 10** (LLM01–LLM10) for LLM-touching surfaces. Record the category and the gate that catches it.
6. Block merge if any layer fails a gate or if a gate is absent where the boundary demands one.

### Layer mapping for LLM surfaces

For prompts, MCP tools, or any code that calls an LLM API:

| Layer | LLM gate | Catches |
|-------|----------|---------|
| L1 Input validation | Treat ALL tool output as untrusted. Strip or sandbox indirect-injection vectors before they reach the model context. | LLM01 Prompt Injection |
| L2 Output encoding | Validate model output against an expected schema BEFORE rendering. Refuse if schema fails. | LLM05 Improper Output Handling, LLM09 Misinformation |
| L3 Identity & capability | Scoped tokens per tool. Allowlist tools per agent role. Refuse requests outside capability scope. | LLM06 Excessive Agency, LLM10 Unbounded Consumption |
| L1+ secrets | Redact tokens, PII, system prompt fragments from logs. | LLM02 Sensitive Info Disclosure |
| L3 prompt integrity | Sign or hash the system prompt. Detect tampering. | LLM07 System Prompt Leakage |
| L1+ supply chain | Pin model version + embedding model + tokenizer. Verify hash before load. | LLM03 Supply Chain |
| L1+ retrieval | Sanitize retrieved documents (RAG) for adversarial content. | LLM08 Vector & Embedding Weaknesses |
| Audit | Log every prompt + response + tool call. | LLM04 Data & Model Poisoning |

## Outputs

- A markdown table with one row per trust boundary crossed and the gate status for each layer.
- An **OWASP A01–A10 mapping table** for the code under review.
- An **OWASP LLM01–LLM10 mapping table** (mandatory if the surface touches an LLM).
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
- [ ] **If the surface touches an LLM**: OWASP LLM01–LLM10 mapping documented; every applicable LLM category has at least one gate (prompt injection, output handling, supply chain, model poisoning, secrets, agency, prompt leakage, retrieval, misinformation, unbounded consumption).
- [ ] `npm run validate:secrets` and `npm run validate:injection` exit 0 before merge.
- [ ] Security findings recorded in `docs/security/<date>-<feature>.md`.
- [ ] Drive the review interactively with [`commands/vibe-secure-coding.md`](../../../commands/vibe-secure-coding.md) (companion command).

## Related skills and templates

- `templates/secure-coding-checklist-template.md` — review worksheet
- `templates/bypass-audit-trail.md` — fill in after every guard-bypass attempt (positive or negative)
- `templates/bypass-request.md` — authorization form for red-team engagements

## Attribution

Inspired by [RohitG00/awesome-claude-code-toolkit](https://github.com/RohitG00/awesome-claude-code-toolkit) (Apache-2.0). Adapted in original wording with Vibe Coding OS-specific OWASP mapping.
