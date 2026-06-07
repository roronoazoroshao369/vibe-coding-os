# Runtime Install

Set up the optional runtime layer in a local clone. The installer creates `.omc/runtime/`, writes config, initialises empty collections (tasks, memory, checkpoints, teams, sessions), and optionally registers an MCP server entry in `.mcp.json`.

## Usage

```bash
node scripts/runtime-install.mjs            # idempotent — skips existing files
node scripts/runtime-install.mjs --force    # overwrite existing config & collections
node scripts/runtime-install.mjs --mcp      # also register MCP server in .mcp.json
node scripts/runtime-install.mjs --dry-run  # preview without writing
```

Flags can be combined: `--dry-run --force --mcp` previews an overwrite with MCP enabled.

## Behaviour

| Flag | Effect |
|------|--------|
| *(none)* | Create `.omc/runtime/`; write config from template; create empty collections. Skips any existing file. |
| `--force` | Overwrite config and reset collections. |
| `--mcp` | Merge `vibe-runtime` server entry into `.mcp.json`. Existing servers preserved. |
| `--dry-run` | Print planned steps without any filesystem writes. |

The installer is a thin CLI over `runtime/install/installer.mjs`. Core logic lives in the `installer.mjs` module for reuse.

## Next steps

After installing, validate with `npm run runtime:validate` and create your first task:

```bash
npm run runtime:validate
npm run runtime:task -- create --title "Explore the runtime"
npm run runtime:task -- next
```

## Ghi chú tiếng Việt

Script runtime-install.mjs tạo runtime local trong `.omc/runtime/`. Dùng `--dry-run` để xem trước, `--force` để ghi đè, `--mcp` để tự động đăng ký MCP server trong `.mcp.json` mà không làm mất server hiện có.
