#!/bin/bash
set -euo pipefail

DEST="../codespaces-react/apps/links/"

echo "=== 5 Most Recent Commits ==="
git log --oneline -5
echo "============================="

mkdir -p "$DEST"
rsync -av --delete --exclude='node_modules' --exclude='dist' app/ "$DEST"
rsync -av README.md "$DEST"
rsync -av docs/ "$DEST/docs/"

