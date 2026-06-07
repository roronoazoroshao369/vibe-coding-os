#!/usr/bin/env bash
# Vibe Coding OS — one-command Claude Code plugin installer.
#
# Adds the Vibe Coding OS marketplace and enables the plugin by merging into
# your Claude Code settings.json. No SSH key required (uses the HTTPS-backed
# "github" plugin source). Re-running is safe (idempotent).
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/roronoazoroshao369/vibe-coding-os/main/install.sh | bash
#
# Then restart Claude Code. It will prompt to trust + install the plugin.

set -euo pipefail

REPO="roronoazoroshao369/vibe-coding-os"
MARKETPLACE="vibe-coding-os-marketplace"
PLUGIN="vibe-coding-os"
CONFIG_DIR="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
SETTINGS="$CONFIG_DIR/settings.json"

echo "Vibe Coding OS installer"
echo "  config dir : $CONFIG_DIR"
echo "  settings   : $SETTINGS"

if ! command -v node >/dev/null 2>&1; then
  echo "error: node is required to merge settings.json safely." >&2
  echo "Install Node.js, or follow the manual steps in the README." >&2
  exit 1
fi

mkdir -p "$CONFIG_DIR"
[ -f "$SETTINGS" ] || echo '{}' > "$SETTINGS"

REPO="$REPO" MARKETPLACE="$MARKETPLACE" PLUGIN="$PLUGIN" SETTINGS="$SETTINGS" node <<'NODE'
const fs = require('fs');

const { REPO, MARKETPLACE, PLUGIN, SETTINGS } = process.env;

let settings = {};
try {
  const raw = fs.readFileSync(SETTINGS, 'utf8').trim();
  settings = raw ? JSON.parse(raw) : {};
} catch (err) {
  console.error(`Could not parse ${SETTINGS}: ${err.message}`);
  console.error('Fix or remove the file, then re-run.');
  process.exit(1);
}

settings.extraKnownMarketplaces ||= {};
settings.extraKnownMarketplaces[MARKETPLACE] = {
  source: { source: 'github', repo: REPO },
};

settings.enabledPlugins ||= {};
settings.enabledPlugins[`${PLUGIN}@${MARKETPLACE}`] = true;

// Backup once, then write.
try { fs.copyFileSync(SETTINGS, `${SETTINGS}.bak`); } catch {}
fs.writeFileSync(SETTINGS, JSON.stringify(settings, null, 2) + '\n');

console.log('  marketplace registered: ' + MARKETPLACE + ' -> github:' + REPO);
console.log('  plugin enabled        : ' + PLUGIN + '@' + MARKETPLACE);
console.log('  backup written        : ' + SETTINGS + '.bak');
NODE

echo
echo "Done. Restart Claude Code — it will prompt to trust and install the plugin."
echo "Verify with:  claude plugin list"
