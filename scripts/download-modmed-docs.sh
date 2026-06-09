#!/usr/bin/env bash
# Download all ModMed API documentation from portal.api.modmed.com/llms.txt
# Usage: ./scripts/download-modmed-docs.sh [--dry-run]
#
# Outputs:
#   docs/modmed/official/*.md — all documentation files

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
OUTPUT_DIR="$PROJECT_DIR/docs/modmed/official"
LLMS_URL="https://portal.api.modmed.com/llms.txt"

DRY_RUN=false
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "[DRY RUN] No files will be downloaded."
fi

mkdir -p "$OUTPUT_DIR"

echo "Fetching doc index from $LLMS_URL..."
INDEX=$(curl -sL "$LLMS_URL")

if [[ -z "$INDEX" ]]; then
  echo "ERROR: Failed to fetch llms.txt"
  exit 1
fi

# Extract all URLs from the index
URLS=$(echo "$INDEX" | grep -oP 'https?://[^\)]+\.md' | sort -u)

TOTAL=$(echo "$URLS" | wc -l)
echo "Found $TOTAL documentation URLs."
echo ""

COUNT=0
SKIPPED=0
FAILED=0

while IFS= read -r url; do
  # Extract filename from URL path
  # e.g., https://portal.api.modmed.com/reference/familymemberhistory.md → familymemberhistory.md
  # e.g., https://portal.api.modmed.com/docs/getting-started.md → docs_getting-started.md
  PATH_PART=$(echo "$url" | sed 's|https\?://[^/]*/||')
  # Replace / with _ to flatten into single filename, but keep section prefix
  FILENAME=$(echo "$PATH_PART" | tr '/' '_')

  OUTFILE="$OUTPUT_DIR/$FILENAME"

  # Skip page-not-found and ux-test pages
  if [[ "$FILENAME" == *"page-not-found"* ]] || [[ "$FILENAME" == *"ux-test"* ]]; then
    ((SKIPPED++)) || true
    continue
  fi

  # Skip if already downloaded (unless forced)
  if [[ -f "$OUTFILE" ]]; then
    echo "  SKIP (exists): $FILENAME"
    ((SKIPPED++)) || true
    continue
  fi

  if $DRY_RUN; then
    echo "  WOULD DOWNLOAD: $url → $FILENAME"
    ((COUNT++)) || true
    continue
  fi

  # Download
  HTTP_CODE=$(curl -sL -o "$OUTFILE" -w "%{http_code}" "$url" 2>/dev/null || true)

  if [[ "$HTTP_CODE" == "200" ]]; then
    # Check if file has actual content (not just a redirect page)
    FILESIZE=$(stat -c%s "$OUTFILE" 2>/dev/null || echo "0")
    if [[ "$FILESIZE" -lt 50 ]]; then
      echo "  EMPTY ($FILESIZE bytes): $FILENAME — removing"
      rm -f "$OUTFILE"
      ((SKIPPED++)) || true
    else
      echo "  OK ($FILESIZE bytes): $FILENAME"
      ((COUNT++)) || true
    fi
  else
    echo "  FAIL (HTTP $HTTP_CODE): $FILENAME ← $url"
    rm -f "$OUTFILE"
    ((FAILED++)) || true
  fi

  # Small delay to be polite
  sleep 0.2

done <<< "$URLS"

echo ""
echo "========================================="
echo "Done! Downloaded: $COUNT | Skipped: $SKIPPED | Failed: $FAILED | Total: $TOTAL"
echo "Output: $OUTPUT_DIR/"
echo "========================================="

# List any resource overview docs found
echo ""
echo "Resource overview docs:"
ls -1 "$OUTPUT_DIR" 2>/dev/null | head -30
