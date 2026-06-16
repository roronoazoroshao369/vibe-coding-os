#!/usr/bin/env bash
# bump-version.sh — Update package.json version, CHANGELOG.md, commit, and tag.
#
# Usage:
#   bash scripts/bump-version.sh <version>
#
# Examples:
#   bash scripts/bump-version.sh 0.2.0
#   bash scripts/bump-version.sh 0.1.1
#   bash scripts/bump-version.sh 1.0.0
#
set -euo pipefail

VERSION="${1:-}"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PACKAGE_JSON="$REPO_ROOT/package.json"
CHANGELOG="$REPO_ROOT/CHANGELOG.md"
TODAY="$(date +%Y-%m-%d)"

# ── Helpers ──────────────────────────────────────────────

usage() {
  echo "Usage: bash scripts/bump-version.sh <version>"
  echo ""
  echo "Examples:"
  echo "  bash scripts/bump-version.sh 0.2.0"
  echo "  bash scripts/bump-version.sh 0.1.1"
  echo "  bash scripts/bump-version.sh 1.0.0"
  echo ""
  echo "Version must follow semver: X.Y.Z"
  exit 1
}

die() {
  echo "ERROR: $*" >&2
  exit 1
}

# ── Validate input ───────────────────────────────────────

if [[ -z "$VERSION" ]]; then
  usage
fi

# Validate semver format (X.Y.Z, allowing optional pre-release suffix)
if ! echo "$VERSION" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.]+)?$'; then
  die "Invalid version format: $VERSION (expected X.Y.Z or X.Y.Z-suffix)"
fi

# ── Pre-flight checks ───────────────────────────────────

[[ -f "$PACKAGE_JSON" ]] || die "package.json not found at $PACKAGE_JSON"
[[ -f "$CHANGELOG" ]]    || die "CHANGELOG.md not found at $CHANGELOG"

CURRENT_VERSION=$(grep -oP '"version"\s*:\s*"\K[^"]+' "$PACKAGE_JSON" 2>/dev/null \
  || grep '"version"' "$PACKAGE_JSON" | sed 's/.*"version": *"\([^"]*\)".*/\1/')
echo "Current version: $CURRENT_VERSION"
echo "New version:     $VERSION"
echo ""

# ── 1. Update package.json version ──────────────────────

# Use a portable sed replacement (works on both GNU and BSD sed)
if [[ "$OSTYPE" == "darwin"* ]]; then
  sed -i '' "s/\"version\": *\"$CURRENT_VERSION\"/\"version\": \"$VERSION\"/" "$PACKAGE_JSON"
else
  sed -i "s/\"version\": *\"$CURRENT_VERSION\"/\"version\": \"$VERSION\"/" "$PACKAGE_JSON"
fi

echo "✅ Updated package.json version to $VERSION"

# ── 2. Update CHANGELOG.md ──────────────────────────────

# Find the [Unreleased] header and check for content below it
UNRELEASED_LINE=$(grep -n '^\#\# \[Unreleased\]' "$CHANGELOG" | head -1 | cut -d: -f1)

if [[ -z "$UNRELEASED_LINE" ]]; then
  die "No [Unreleased] section found in CHANGELOG.md"
fi

# Extract content between [Unreleased] and the next ## header
# We'll build the new CHANGELOG with the versioned section inserted
TEMP_CHANGELOG=$(mktemp)

awk -v unreleased_line="$UNRELEASED_LINE" \
    -v version="$VERSION" \
    -v today="$TODAY" \
'
BEGIN { found_unreleased = 0; content_started = 0; content = "" }

{
  if (NR == unreleased_line) {
    found_unreleased = 1
    print $0
    print ""
    next
  }

  if (found_unreleased && !content_started) {
    # Skip blank lines between [Unreleased] header and content
    if ($0 ~ /^## / || $0 ~ /^### /) {
      content_started = 1
    } else if ($0 == "") {
      next
    } else {
      content_started = 1
    }
  }

  if (found_unreleased && content_started) {
    # Collect everything until the next ## header (not ### subsections)
    if ($0 ~ /^## [^#]/) {
      # Insert the versioned section before this line
      if (content != "") {
        printf "## [%s] — %s\n\n%s\n", version, today, content
      } else {
        # Empty unreleased section — still create versioned header
        printf "## [%s] — %s\n\n### Added\n\n", version, today
      }
      print ""
      print $0
      found_unreleased = 0
      content_started = 0
      next
    } else {
      content = content $0 "\n"
    }
  }

  if (!found_unreleased || !content_started) {
    print $0
  }
}

END {
  # Handle case where [Unreleased] content runs to end of file
  if (found_unreleased && content != "") {
    printf "## [%s] — %s\n\n%s\n", version, today, content
  }
}
' "$CHANGELOG" > "$TEMP_CHANGELOG"

# Check that something actually changed
if diff -q "$CHANGELOG" "$TEMP_CHANGELOG" > /dev/null 2>&1; then
  echo "⚠️  CHANGELOG.md content appears unchanged."
  echo "   If the [Unreleased] section has no entries, the script will still create"
  echo "   the versioned section. You may want to edit CHANGELOG.md manually."
fi

cp "$TEMP_CHANGELOG" "$CHANGELOG"
rm -f "$TEMP_CHANGELOG"

echo "✅ Updated CHANGELOG.md — moved [Unreleased] to [$VERSION] — $TODAY"

# ── 3. Update comparison links at bottom of CHANGELOG ────

# Remove old [Unreleased] comparison link and add new one
# Add new version link
if grep -q "^\[Unreleased\]:" "$CHANGELOG"; then
  # Replace existing [Unreleased] link
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|^\[Unreleased\]:.*|[Unreleased]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v${VERSION}...HEAD|" "$CHANGELOG"
  else
    sed -i "s|^\[Unreleased\]:.*|[Unreleased]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v${VERSION}...HEAD|" "$CHANGELOG"
  fi
fi

# Add [VERSION] comparison link if not already present
if ! grep -q "^\[${VERSION}\]:" "$CHANGELOG"; then
  # Insert before the [Unreleased] link
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "/^\[Unreleased\]:/i\\
[${VERSION}]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v${CURRENT_VERSION}...v${VERSION}
" "$CHANGELOG"
  else
    sed -i "/^\[Unreleased\]:/i\\
[${VERSION}]: https://github.com/roronoazoroshao369/vibe-coding-os/compare/v${CURRENT_VERSION}...v${VERSION}
" "$CHANGELOG"
  fi
fi

echo "✅ Updated CHANGELOG.md comparison links"

# ── 4. Git commit ────────────────────────────────────────

cd "$REPO_ROOT"

git add "$PACKAGE_JSON" "$CHANGELOG"
git commit -m "chore: release v${VERSION}" --no-verify

echo "✅ Created git commit: chore: release v${VERSION}"

# ── 5. Git tag ───────────────────────────────────────────

git tag -a "v${VERSION}" -m "Release v${VERSION}"

echo "✅ Created git tag: v${VERSION}"

# ── 6. Next steps ───────────────────────────────────────

echo ""
echo "════════════════════════════════════════════════════════"
echo "  Release v${VERSION} prepared!"
echo "════════════════════════════════════════════════════════"
echo ""
echo "  Next steps:"
echo ""
echo "  1. Review the commit:"
echo "     git log --oneline -1"
echo ""
echo "  2. Review the tag:"
echo "     git show v${VERSION}"
echo ""
echo "  3. Review CHANGELOG.md to ensure it looks correct"
echo ""
echo "  4. Push commit and tag:"
echo "     git push origin main --tags"
echo ""
echo "  5. Create a GitHub release:"
echo "     gh release create v${VERSION} --title \"v${VERSION}\" --generate-notes"
echo "     or visit https://github.com/roronoazoroshao369/vibe-coding-os/releases/new"
echo ""
echo "  6. Run the full pre-release checklist:"
echo "     docs/release-checklist.md"
echo ""
echo "════════════════════════════════════════════════════════"
