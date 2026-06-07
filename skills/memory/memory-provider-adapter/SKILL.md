# Skill: Memory Provider Adapter

## Purpose

Plan optional memory provider integrations without making the provider mandatory or copying upstream runtime code.

## When to use

Use when a user asks about external memory backends, vector stores, hosted search, MCP memory tools, or provider-specific configuration.

## Inputs

- Provider goal, constraints, and data categories.
- Local-first fallback requirements.
- Privacy policy, auth needs, retention, export/delete support, and failure behavior.

## Workflow

1. Define the provider capability needed: store, search, summarize, sync, or citations.
2. List data that would leave local storage and whether it includes sensitive content.
3. Require explicit opt-in for external storage/search.
4. Define local fallback and provider-down behavior.
5. Document auth handling without recording secrets.
6. Map provider outputs back to local citation, confidence, freshness, and scope labels.
7. Treat upstream SDKs/daemons as inspiration only unless the project explicitly becomes a runtime.

## Outputs

- Provider adapter plan.
- Privacy/data-flow note.
- Local fallback and troubleshooting checklist.

## Failure modes

- Making hosted memory a hidden dependency.
- Storing tokens or provider secrets in memory.
- Losing citation/confidence metadata at provider boundaries.
- Copying upstream implementation code into this docs framework.

## Verification checklist

- [ ] External provider use is explicit and optional.
- [ ] Local fallback is documented.
- [ ] Data leaving local storage is listed.
- [ ] Secret handling avoids memory/log storage.
- [ ] Provider output preserves citation, confidence, and freshness labels.

## Ghi chú tiếng Việt

Khi lập kế hoạch nhà cung cấp bộ nhớ, hãy ghi rõ dữ liệu nào rời khỏi máy, fallback cục bộ là gì, và không lưu bí mật. Không copy runtime upstream.
