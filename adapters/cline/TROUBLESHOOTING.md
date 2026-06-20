# Cline MCP Integration

> Configure the Vibe Coding OS tools as MCP servers in Cline.

## What this gives you

- `vibe_list_skills` — list all 142 skills grouped by category.
- `vibe_list_commands` — list all 111 commands grouped by phase.
- `vibe_list_templates` — list all 95 templates grouped by purpose.
- `vibe_validate_all` — run `npm run validate:all` and return the per-gate status.
- `vibe_quality_scorecard` — run the quality scorecard and return the per-axis score.
- `vibe_dashboard` — read `docs/DASHBOARD.md` and return a summary.

## Quick setup

1. Copy `adapters/cline/mcp_settings.example.json` to `.cline/mcp_settings.json` in your workspace.
2. Replace `${workspaceFolder}` and `${env:HOME}` paths with your actual paths.
3. Set `GITHUB_TOKEN` in your shell environment (or remove the GitHub MCP server block if not needed).
4. Restart Cline.
5. In Cline chat, ask: "List available skills." — the MCP tools should respond.

## Files

| File | Purpose |
| ---- | ------- |
| `mcp_settings.example.json` | Drop-in MCP config for Cline. |
| `MODE_ARTIFACTS.md` | Architect / Ask / Code mode `.clinerules-*` content. |
| `cline.json` | Machine-readable adapter metadata. |
| `TROUBLESHOOTING.md` | (below) Common Cline failures and fixes. |

## TROUBLESHOOTING

### Symptom: Cline does not see the MCP tools

**Diagnosis:** `.cline/mcp_settings.json` is in the wrong location or has a syntax error.

**Fix:**

1. Confirm file location: `ls -la .cline/mcp_settings.json`.
2. Validate JSON: `jq . .cline/mcp_settings.json`.
3. Restart Cline.
4. Check the Cline output panel for MCP server startup logs.

### Symptom: `vibe_validate_all` times out

**Diagnosis:** The validator takes ~30s for full repo scan; Cline default timeout is 60s.

**Fix:**

1. Increase the timeout in `mcp_settings.json`:
   ```json
   "vibe-coding-os": {
     "command": "node",
     "args": ["..."],
     "timeout": 120000
   }
   ```
2. Or run `npm run validate:all` directly in the terminal instead of via MCP.

### Symptom: Mode mismatch (Cline says "code" but I am reviewing)

**Diagnosis:** The active mode is set in the Cline UI; the rules file is `.clinerules-code`.

**Fix:**

1. Switch mode in the Cline UI (top-right dropdown).
2. Or rename your active rules file accordingly.

### Symptom: `autoApprove` is ignored

**Diagnosis:** Cline's auto-approve list is per-server, not per-tool in newer versions.

**Fix:**

1. Open Cline → Settings → MCP Servers → vibe-coding-os.
2. Confirm "Auto-approve" is enabled for the listed tools.
3. Restart Cline after changing the setting.

## See also

- `adapters/mcp/` — MCP server implementation files (server.mjs, tool catalog).
- `docs/marketplace/SUBMISSION.md` — how the marketplace lists these MCP tools.
