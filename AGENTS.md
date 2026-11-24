# Agent guide

ESLint plugin with a single rule (`import-newlines/enforce`). It also runs under Oxlint's JS
plugins, so `lib/` must never import `eslint` at runtime (ESLint is an optional peer dependency).

## Development

- Package manager is **pnpm** (pinned via `packageManager`). `pnpm-workspace.yaml` sets a minimum
  release age of 2 weeks: newly published dependency versions are refused until they are 14 days
  old. If an install fails for that reason, pick an older version instead of disabling the setting.
- `pnpm run lint` and `pnpm test` must pass. The tests run the shared cases in `test/cases/` through
  the ESLint, typescript-eslint and Oxlint rule testers.
- `scripts/oxlint-smoke.sh` packs the plugin and checks it in an Oxlint-only project with no ESLint
  installed.
- Husky runs lint-staged on commit and the tests on push.
- GitHub Actions in `.github/workflows/` are pinned to full commit SHAs with the version in a
  trailing comment. Keep them that way when updating.

## Releasing

Releases are cut by `.github/workflows/release.yml` using npm trusted publishing (OIDC, no npm
token). The trusted publisher only allows **`npm stage publish`**, so CI stages the package and a
maintainer approves it with 2FA.

1. Make sure `main` is up to date and CI is green.
2. Bump `version` in `package.json` (e.g. `pnpm version patch --no-git-tag-version`), commit it as
   just the version number (e.g. `2.0.2`) and push `main`.
3. Create an annotated tag `v<version>` on that commit and push it. The tag must equal
   `v` + the `package.json` version, and the commit must be on `main`, or the workflow fails.
   ```
   git tag -a v2.0.2 -m 2.0.2
   git push origin main v2.0.2
   ```
4. The `Release` workflow (environment `npm`) re-runs lint, tests and the Oxlint smoke test, runs
   `npm stage publish`, then creates a **draft** GitHub Release with generated notes and the
   package tarball attached.
5. Approve the staged package on npm (prompts for 2FA, run by a human):
   ```
   npm stage list
   npm stage approve <stage-id>
   ```
6. Publish the draft GitHub Release (GitHub UI or `gh release edit v2.0.2 --draft=false`).

Notes:

- Release immutability is enabled: publishing the GitHub Release locks its tag and assets. That is
  why the release is a draft until npm approval is done. Never move or re-push a tag after its
  release is published; cut a new version instead.
- Before step 6 the tag can still be moved if staging failed, but a staged npm version can never be
  reused, so bump the version if a staged package was rejected.
- Agents should not run `npm stage approve` or publish the release unless the user asks; both are
  deliberate human steps.
