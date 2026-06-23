#!/usr/bin/env node
/**
 * confidence-gate.mjs — Self-review confidence gate for mid-tier models.
 *
 * Mid-tier models (Qwen3-30B, Llama 3.3 70B, GPT-OSS 20B, etc.) produce
 * unreliable self-reviews.  This gate detects the model tier and context
 * and blocks self-review attempts, redirecting to external validation.
 *
 * Usage:
 *   node scripts/confidence-gate.mjs                # auto-detect
 *   node scripts/confidence-gate.mjs --tier=mid     # explicit mode
 *   node scripts/confidence-gate.mjs --tier=high    # bypass gate
 *   node scripts/confidence-gate.mjs --action=self-review
 *
 * Exit codes:
 *   0 = ALLOW  (self-review is safe — high-tier model)
 *   1 = WARN   (self-review allowed but questionable)
 *   2 = BLOCK  (self-review blocked — use external validation)
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MID_TIER_KEYWORDS = [
  'qwen3', 'qwen-3',
  'llama 3.3', 'llama-3.3',
  'gpt-oss', 'gpt4all',
  'deepseek-v2', 'deepseek v2',
  'mixtral', '8x22b',
  'command-r', 'command r',
  'hermes-3', 'hermes 3',
  'phi-3', 'phi3',
  'gemma-2', 'gemma2',
];

const MID_TIER_THRESHOLD_TOKENS = 32_000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readPackageJson(root) {
  try {
    const pkgPath = resolve(root, 'package.json');
    return JSON.parse(readFileSync(pkgPath, 'utf8'));
  } catch {
    return null;
  }
}

/**
 * Detect model tier from environment variables.
 *
 * Priority:
 *   MODEL_TIER=mid|high          (explicit)
 *   MODEL_NAME=...                (matched against known lists)
 *   CLAUDE_LITE=true              (mid)
 *   CONTEXT_BUDGET=<tokens>       (mid if < 32k)
 */
function detectTier() {
  // 1. Explicit tier env
  const explicitTier = process.env.MODEL_TIER?.toLowerCase();
  if (explicitTier === 'mid' || explicitTier === 'low') return 'mid';
  if (explicitTier === 'high') return 'high';

  // 2. CLAUDE_LITE flag
  if (process.env.CLAUDE_LITE === 'true' || process.env.CLAUDE_LITE === '1') return 'mid';

  // 3. Model name
  const modelName = (process.env.MODEL_NAME || process.env.HERMES_MODEL || '').toLowerCase();
  if (MID_TIER_KEYWORDS.some(kw => modelName.includes(kw))) return 'mid';

  // 4. Context budget heuristic
  const budget = parseInt(process.env.CONTEXT_BUDGET || '0', 10);
  if (budget > 0 && budget < MID_TIER_THRESHOLD_TOKENS) return 'mid';

  return 'unknown'; // not explicitly detected
}

/**
 * Determine the action the model is trying to take.
 */
function detectAction(args) {
  if (args.action) return args.action;

  // Check if CLAUDE.md or a vibe-self-review command is referenced
  const cwd = process.cwd();

  // Check for `.hermes/plans/` that might indicate deliberation
  const plansDir = resolve(cwd, '.hermes', 'plans');
  const hasPlans = existsSync(plansDir);

  // Check for active session hint file (written by vibify)
  const manifestPath = resolve(cwd, '.vibe', 'runtime', 'autopilot');
  const hasAutopilot = existsSync(manifestPath);

  // Check if running inside a post-tool hook
  const isPostHook = process.env.VIBE_POST_TOOL_RUN === 'true' ||
                     process.env.HERMES_POST_TOOL === 'true';

  if (isPostHook) return 'post-tool-self-review';

  // Check the note/plan files for deliberation signals
  const hasPlanContent = hasPlans;

  if (hasPlanContent && !hasAutopilot) return 'planning';
  if (hasAutopilot) return 'autopilot-supervised';
  return 'unknown';
}

/**
 * Build the gate decision.
 */
function evaluate(tier, action) {
  // High-tier models always pass
  if (tier === 'high') {
    return {
      status: 'ALLOW',
      exitCode: 0,
      reason: 'High-tier model — self-review is reliable.',
      tier,
      action,
    };
  }

  // Unknown tier — let it through but warn
  if (tier === 'unknown') {
    return {
      status: 'WARN',
      exitCode: 1,
      reason: 'Model tier unknown — self-review may be unreliable. ' +
              'Set MODEL_TIER=high to bypass or MODEL_TIER=mid for strict gating.',
      tier,
      action,
      recommendation: 'Run `npm run validate:all` after self-review.',
    };
  }

  // Mid-tier: when action isn't explicitly set, treat as self-review check
  if (tier === 'mid') action = action === 'unknown' || action === 'planning' || action === 'autopilot-supervised' ? 'self-review' : action;

  // Mid-tier: gate depends on action
  const riskyActions = ['self-review', 'post-tool-self-review', 'adversarial-review', 'quality-audit'];
  if (riskyActions.includes(action) || action === 'unknown') {
    // If the action isn't explicitly a review, still warn but don't block
    return {
      status: 'BLOCK',
      exitCode: 2,
      reason: `Mid-tier self-review is unreliable. Self-audits by models ≤32k context ` +
              `miss 40-60% of defects.`,
      tier,
      action,
      recommendation: 'Instead of self-review:\n' +
        '  1. Run `npx eslint .` — lint catches syntax + logic issues\n' +
        '  2. Run `npm run validate:all` — 12 gates including security + imports\n' +
        '  3. Run `node scripts/validate-runtime-errors.mjs` — runtime anomalies\n' +
        '  4. Run `node scripts/validate-mcp-tool-drift.mjs` — MCP tool drift',
      instruction: 'Do NOT run vibe-self-review. Trust external validation.',
    };
  }

  // Non-risky actions: warn but allow
  return {
    status: 'WARN',
    exitCode: 1,
    reason: `Mid-tier model performing "${action}" — proceed with caution.`,
    tier,
    action,
    recommendation: 'Prefer external validation tools over self-review.',
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const args = {};
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--tier=')) args.tier = arg.split('=')[1];
    else if (arg.startsWith('--action=')) args.action = arg.split('=')[1];
    else if (arg === '--json') args.json = true;
  }

  const tier = args.tier || detectTier();
  const action = detectAction(args);
  const result = evaluate(tier, action);

  // Read package version for report
  const pkg = readPackageJson(process.cwd());
  const version = pkg?.version || 'unknown';

  const output = {
    gate: 'confidence-gate/v1',
    version,
    timestamp: new Date().toISOString(),
    ...result,
  };

  if (args.json) {
    console.log(JSON.stringify(output, null, 2));
  } else {
    const icon = output.exitCode === 0 ? '✅' : output.exitCode === 2 ? '🛑' : '⚠️';
    console.log(`${icon} Confidence Gate — ${output.status}`);
    console.log(`   Model tier: ${output.tier}`);
    console.log(`   Action:     ${output.action}`);
    console.log(`   Reason:     ${output.reason}`);
    if (output.recommendation) {
      console.log(`\n   Recommendation:`);
      for (const line of output.recommendation.split('\n')) {
        console.log(`   ${line}`);
      }
    }
    if (output.instruction) {
      console.log(`\n   ⚡ ${output.instruction}`);
    }
    console.log(`\n   (exit ${output.exitCode})`);
  }

  process.exit(output.exitCode);
}

main();
