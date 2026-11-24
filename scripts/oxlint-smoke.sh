#!/usr/bin/env bash
# Installs the packed plugin into a fresh project that only has Oxlint (no ESLint) and makes sure
# the rule loads, reports and autofixes. Mirrors the setup described in the README.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

oxlint_version="$(node -p "require('$root/package.json').devDependencies.oxlint")"
tarball="$(cd "$root" && npm pack --silent --ignore-scripts --pack-destination "$work" | tail -1)"

cd "$work"
npm init -y >/dev/null
npm install --silent --no-audit --no-fund --ignore-scripts --save-dev "oxlint@$oxlint_version" "./$tarball"

if [ -e node_modules/eslint ]; then
  echo "FAIL: eslint was installed, the peer dependency should be optional" >&2
  exit 1
fi

cat > .oxlintrc.json <<'JSON'
{
  "jsPlugins": ["eslint-plugin-import-newlines"],
  "rules": {
    "import-newlines/enforce": ["error", { "items": 2, "max-len": 100, "semi": false }]
  }
}
JSON

printf "import { a, b, c } from './x'\nimport { d } from './y'\nconsole.log(a, b, c, d)\n" > sample.js

if output="$(npx oxlint -c .oxlintrc.json sample.js 2>&1)"; then
  echo "FAIL: expected oxlint to report an error" >&2
  echo "$output" >&2
  exit 1
fi
echo "$output"
grep -q "import-newlines(enforce)" <<<"$output" || { echo "FAIL: rule did not report" >&2; exit 1; }

npx oxlint -c .oxlintrc.json --fix sample.js >/dev/null 2>&1 || true
[ "$(head -n 1 sample.js)" = "import {" ] || { echo "FAIL: autofix did not split the import" >&2; cat sample.js >&2; exit 1; }
npx oxlint -c .oxlintrc.json sample.js >/dev/null || { echo "FAIL: output still has errors after --fix" >&2; exit 1; }

echo "OK: plugin works under Oxlint without ESLint installed"
