#!/usr/bin/env bash
# Demo script for recording the README gif.
# Builds warmstart, creates a throwaway sample repo, and runs `init` on it.
#
# Usage:  bash scripts/demo.sh
# Record this terminal with asciinema/terminalizer/vhs and export to docs/demo.gif.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "→ building warmstart"
( cd "$ROOT" && npm run build >/dev/null )

DEMO="$(mktemp -d)"
cat > "$DEMO/package.json" <<'JSON'
{
  "name": "sample-app",
  "scripts": {
    "test": "echo '  ✓ 12 tests passed'",
    "build": "echo '  ✓ built in 0.3s'",
    "lint": "echo '  ✓ no problems'"
  }
}
JSON
touch "$DEMO/package-lock.json"

cd "$DEMO"
echo
echo "→ a fresh repo your agent has never seen:"
echo "   $DEMO"
echo
echo "\$ npx warmstart init --yes"
node "$ROOT/dist/cli.js" init --yes
echo
echo "→ your agent now reads this instead of guessing:"
echo
cat AGENTS.md
