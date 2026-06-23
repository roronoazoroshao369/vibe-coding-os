# CLAUDE-LITE.md — Mid-Tier Model Entry Point (≤32k context)

**Use this when you are a mid-tier model (Qwen3-30B, Llama 3.3 70B, GPT-OSS 20B) or when context budget is tight.**

Full guidance: [CLAUDE.md](CLAUDE.md). Use that when you have ≥64k context and high instruction-following.

## Hard rules (do not violate)

1. **Load ONE skill per session.** Do not chain 3+ skills. If `SKILL.md` references another skill, fetch it on demand only.
2. **Skip orchestration commands.** Do NOT load `vibe-orchestrate`, `vibe-align`, `vibe-flow`, `vibe-flow-parallel`. They require multi-step branching mid-tier cannot reliably follow.
3. **Use the linear path only:** `vibe-spec` → `vibe-plan` → `vibe-implement` → `vibe-verify`. No adaptive re-routing.
4. **Prefer checklist skills** (under 100 lines, single-purpose): `verification-before-done`, `verification-before-completion`, `karpathy-engineering-discipline`.
5. **Avoid** `guard-bypass-protocol`, `context-policy`, `crash-proof-planning`, `superagent-orchestration`, `advanced-orchestration` (all >160 lines, branchy).
6. **Use the confidence gate.** Before self-reviewing, run `node scripts/confidence-gate.mjs --json`. If it returns `BLOCK`, skip self-review entirely and run external validation (ESLint, `validate:all`). Self-audit is unreliable for mid-tier models.

## Minimum per-session load

| File | Why |
|---|---|
| `CLAUDE-LITE.md` | This file (≤15 lines) |
| 1× `commands/vibe-*.md` | The single command for your task |
| 1× `skills/<category>/<name>/SKILL.md` | The single skill you need |

**Token budget: ~2-3k.** Stays well within 32k context.

## When to escalate

If your task requires any of: multi-agent coordination, parallel exploration, security red-teaming, advanced orchestration → **stop and tell the user to use `CLAUDE.md` instead.**

## Next step

If you need more detail, read **[docs/MID-TIER-FLOW.md](docs/MID-TIER-FLOW.md)** — a hardcoded linear path with exact skill/template picks for each task type.