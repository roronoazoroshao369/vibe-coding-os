# Memory Provider Adapter

## Purpose

Use this workflow to plan optional external memory backends without adding required dependencies. Includes a decision flow for choosing between local-first and provider-backed memory.

## When to use

Use for non-trivial memory changes, before work that may depend on prior context, before storing sensitive-looking information, or before planning an optional provider integration.

## Step-by-step workflow

1. State the task, memory scope, and expected decision support.
2. Check `docs/memory-conventions.md`, relevant `skills/memory/` files, and reference mappings.
3. Run privacy filtering before ingesting or sharing candidate content.
4. Prefer local-first memory and record source, confidence, sensitivity, and staleness.
5. Retrieve or search only the context needed for the task.
6. Evaluate whether retrieved memory was relevant, fresh, and safe.
7. Record follow-ups, audit triggers, and any provider assumptions.

## Provider Decision Flow

When considering an external provider adapter, run this decision flow:

1. **Is a provider explicitly requested?** If no human or task explicitly asked for one, stop here — use local memory only. Document that provider was not requested.
2. **Run the cloud-vs-local rubric** (from `skills/memory/local-first-memory/SKILL.md`): evaluate privacy, latency, offline need, sovereignty, and cost. If any criterion blocks cloud use, stop — use local memory and document the blocking criterion.
3. **Check interface contract compliance** (from `skills/memory/memory-provider-adapter/SKILL.md`): can the provider implement the required operations (store, retrieve, search, delete)? If not, document the gap and use local memory.
4. **Document opt-in**: record that the human explicitly authorized external storage. List exactly what data leaves local storage. Map provider outputs to local citation, confidence, freshness, and scope labels.
5. **Define local fallback**: for every provider operation, document the local equivalent that activates when the provider is unavailable, too slow, or unsafe.
6. **Plan compliance level**: state whether the adapter will be full, partial, or planned. Implement only after spec and plan approval.

## Required inputs

- Task or decision.
- Candidate content or retrieval query.
- Source files, memory entries, and sensitivity constraints.
- Optional provider goals if explicitly requested.

## Outputs

- Provider adapter plan with decision flow outcome and compliance level.
- Privacy/data-flow note.
- Local fallback and troubleshooting checklist.
- Clear applied/not-applied decisions and validation status.

## Related skills

- memory-provider-adapter, local-first-memory

## Related commands

- vibe-memory-provider-plan

## Applied / Not applied

Applied: agent memory as an explicit local workflow, ingestion/retrieval/search separation, privacy rules, evaluation, optional provider abstraction, local fallback, and provider decision flow with five gates. Not applied: hosted service requirement, Supermemory SDK/client, dashboard clone, cloud auth, connector stack, database infrastructure, or vendor code.

## Maintenance notes

When `supermemoryai/supermemory` changes API, retrieval/search, privacy/security, integrations, evals, or self-hosting behavior, inspect this workflow plus `references/mappings/update-impact-map.md` before changing local behavior.

## Ghi chú tiếng Việt

Quy trình này giúp lập kế hoạch adapter bộ nhớ tùy chọn. Luôn chạy decision flow: kiểm tra xem provider có được yêu cầu không, chạy rubric cloud-vs-local, kiểm tra interface contract, ghi nhận opt-in, và định nghĩa fallback cục bộ. Giữ adapter bên ngoài ở trạng thái tùy chọn.
