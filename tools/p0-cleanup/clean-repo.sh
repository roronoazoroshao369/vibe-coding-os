#!/usr/bin/env bash
#
# P0 repo cleanup — vibe-coding-os
# -------------------------------------------------------------------
# Removes vendored binaries and machine-generated state from Git
# tracking, and verifies .gitignore covers them going forward.
#
# Idempotent: safe to run multiple times. Makes NO commits — it stages
# changes and prints the suggested commit command so a human reviews
# the diff first.
#
# Usage:
#   bash tools/p0-cleanup/clean-repo.sh            # apply (stage only)
#   bash tools/p0-cleanup/clean-repo.sh --dry-run  # show what would change
#
set -euo pipefail

DRY_RUN=0
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=1

# Resolve repo root from this script's location.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "ERROR: not a git work tree: $ROOT" >&2
  exit 1
fi

echo "==> Repo: $ROOT"
echo "==> Mode: $([[ $DRY_RUN -eq 1 ]] && echo dry-run || echo apply)"
echo

# Paths/patterns that should never be tracked.
# Concrete files first, then glob patterns resolved against the index.
TRACKED_TARGETS=(
  "cloudflared-linux-amd64.deb"
  ".todo_state.json"
)
PATTERN_TARGETS=(
  "*.deb"
  ".omc"
  ".vibe"
  ".trash-*"
)

removed_any=0

untrack() {
  local path="$1"
  # Is it actually tracked?
  if git ls-files --error-unmatch "$path" >/dev/null 2>&1; then
    echo "  - untracking: $path"
    if [[ $DRY_RUN -eq 0 ]]; then
      git rm -r --cached --quiet "$path"
    fi
    removed_any=1
  fi
}

echo "==> Untracking known artifacts"
for p in "${TRACKED_TARGETS[@]}"; do
  untrack "$p"
done

echo "==> Untracking pattern matches in the index"
for pat in "${PATTERN_TARGETS[@]}"; do
  # List tracked files matching the pattern (handles dirs like .omc/).
  while IFS= read -r f; do
    [[ -n "$f" ]] && untrack "$f"
  done < <(git ls-files -- "$pat" 2>/dev/null || true)
done

# Remove the working-tree copy of the big binary if present.
if [[ -f "cloudflared-linux-amd64.deb" ]]; then
  echo "==> Deleting working-tree binary cloudflared-linux-amd64.deb"
  [[ $DRY_RUN -eq 0 ]] && rm -f "cloudflared-linux-amd64.deb"
  removed_any=1
fi
# Remove any leftover trash backups created during cleanup.
shopt -s nullglob
for t in .trash-*; do
  echo "==> Deleting leftover trash backup: $t"
  [[ $DRY_RUN -eq 0 ]] && rm -rf "$t"
done
shopt -u nullglob

echo
echo "==> Verifying .gitignore coverage"
MISSING=()
for needle in "*.deb" ".omc/" ".todo_state.json" ".trash-*"; do
  if ! grep -qF "$needle" .gitignore 2>/dev/null; then
    MISSING+=("$needle")
  fi
done
if [[ ${#MISSING[@]} -gt 0 ]]; then
  echo "  WARNING: .gitignore missing entries: ${MISSING[*]}" >&2
  echo "  (The committed .gitignore in this branch already adds them — pull latest.)" >&2
else
  echo "  OK: .gitignore covers all cleanup targets."
fi

echo
if [[ $removed_any -eq 1 ]]; then
  echo "==> Done. Review staged changes, then commit:"
  echo
  echo "    git status"
  echo "    git commit -m 'chore(cleanup): untrack binaries and machine state (P0)'"
  echo
  echo "    NOTE: this removes files from future commits only. To purge the"
  echo "    18MB .deb from HISTORY (recommended), run AFTER this commit:"
  echo "      git filter-repo --invert-paths --path cloudflared-linux-amd64.deb"
  echo "    (or use 'git-filter-repo' / BFG; coordinate a force-push with the team)."
else
  echo "==> Nothing to clean. Repo is already tidy."
fi
