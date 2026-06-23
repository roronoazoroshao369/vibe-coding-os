#!/usr/bin/env bash
#
# Archive per-version council / gap / readiness reports out of the
# tracked tree into docs/reports/council/archive/ (git-ignored).
#
# Files stay on disk for reference; Git just stops tracking them.
#
# Usage:
#   bash tools/p0-cleanup/archive-council-reports.sh            # dry-run
#   bash tools/p0-cleanup/archive-council-reports.sh --apply    # do it
#
set -euo pipefail

APPLY=0
[[ "${1:-}" == "--apply" ]] && APPLY=1

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

SRC="docs/reports"
DST="docs/reports/council/archive"
mkdir -p "$DST"

echo "==> Archiving per-version reports from $SRC -> $DST"
echo "==> Mode: $([[ $APPLY -eq 1 ]] && echo APPLY || echo dry-run)"
echo

shopt -s nullglob
moved=0

# Top-level per-version reports (v1.x / v2.x audit / gap / readiness / council).
for f in "$SRC"/v*-*.md "$SRC"/v*.md "$SRC"/council/v*.md; do
  [[ -e "$f" ]] || continue
  base="$(basename "$f")"
  # Don't move the policy README or anything already in archive.
  [[ "$f" == "$DST/"* ]] && continue
  echo "  - $f"
  if [[ $APPLY -eq 1 ]]; then
    if git ls-files --error-unmatch "$f" >/dev/null 2>&1; then
      git mv "$f" "$DST/$base" 2>/dev/null || { git rm --cached --quiet "$f"; mv "$f" "$DST/$base"; }
    else
      mv "$f" "$DST/$base"
    fi
  fi
  moved=$((moved+1))
done
shopt -u nullglob

echo
echo "==> $moved report(s) $([[ $APPLY -eq 1 ]] && echo archived || echo would be archived)."
if [[ $APPLY -eq 1 && $moved -gt 0 ]]; then
  echo "==> Review and commit:"
  echo "    git status"
  echo "    git commit -m 'chore(docs): archive per-version council reports out of tree (P0)'"
fi
