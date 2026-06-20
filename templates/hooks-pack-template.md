# Hooks Pack Template

> Use this template to declare one Claude Code hook. Each entry in
> `.claude/settings.json` should have a corresponding row in the table below.

## JSON snippet

```json
{
  "hooks": {
    "<EVENT>": [
      {
        "matcher": "<TOOL_REGEX_OR_*>",
        "hooks": [
          {
            "type": "command",
            "command": "<SHELL_COMMAND_OR_SCRIPT_PATH>",
            "timeout": 5000
          }
        ]
      }
    ]
  }
}
```

## Hook table

| # | Event | Matcher | Type | Command / Script | Exit code | Intent | Tested on |
| - | ----- | ------- | ---- | ---------------- | --------- | ------ | --------- |
| 1 | PreToolUse | Bash | command | `~/.claude/hooks/block-rm-rf.sh` | 0=allow, 2=block | Block `rm -rf /` and similar destructive patterns | 2026-06-20 |
| 2 | PostToolUse | Edit\|Write | command | `~/.claude/hooks/log-edit.sh` | 0=allow | Append every Edit/Write to `.claude/audit.jsonl` | 2026-06-20 |
| 3 | SessionStart | * | command | `~/.claude/hooks/load-context.sh` | 0=allow | Load `AGENTS.md` + `docs/integrations/claude-code-hooks.md` into the session | 2026-06-20 |
| 4 | Stop | * | command | `~/.claude/hooks/persist-session.sh` | 0=allow | Snapshot session state to `runtime/sessions/<id>.json` | 2026-06-20 |

## Notes

- **Exit code semantics**: `exit 0` = allow, `exit 2` = block (stderr captured), other = warn.
- **Matcher regex** matches against the tool name (`Bash`, `Edit`, `Write`, `Read`, etc.). `*` matches all tools.
- **Timeout** defaults to 60s; set explicitly for hooks that block on network or large file I/O.
- **Async hooks** (fire-and-forget) use `"async": true` and never block the tool call.

## Verification

- [ ] Every hook tested with a synthetic trigger in a sandbox session.
- [ ] Every `exit 2` path captured in `.claude/audit.jsonl` with the rejection reason.
- [ ] Every `exit 0` path verified with `time` measurement < 5s p95.
- [ ] `jq . .claude/settings.json` exits 0 (valid JSON).
