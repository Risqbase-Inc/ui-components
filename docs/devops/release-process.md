# Release process

**Owner:** G6 (DevOps) · **Last updated:** 2026-05-13

Releases of `@risqbase-inc/ui-components` are automated via [release-please](https://github.com/googleapis/release-please). Conventional-commit messages on `main` are the single source of truth for version bumps and changelog entries.

---

## Flow

```
feat / fix commit         release-please PR              release-please tag
landed on main      →     opened / updated         →     created on merge
                          (chore: release X.Y.Z)         (vX.Y.Z)
                                                                ↓
                                                         publish.yml fires
                                                         (npm publish to
                                                         GitHub Packages)
```

1. **Feature work merges to `main`.** Use conventional commits: `feat:`, `fix:`, `perf:`, `refactor:`, `docs:`, `chore:`. `feat:` → minor bump. `fix:` / `perf:` → patch bump. `feat!:` or `BREAKING CHANGE:` footer → major bump.
2. **`release-please.yml` runs on every push to `main`.** It reads `release-please-config.json` and `.release-please-manifest.json`, scans commits since the last release, and **opens or updates a `chore: release X.Y.Z` PR** with:
   - `package.json` version bump
   - `CHANGELOG.md` entry (sectioned per `changelog-sections` in the config)
   - Manifest update to the proposed version
3. **Review the release PR like any other PR.** Multiple feature merges accumulate into the same release PR until you merge it — that's the batching value vs. fire-on-merge semantic-release.
4. **Merge the release PR.** release-please then pushes a `vX.Y.Z` tag and creates a GitHub Release with the auto-generated changelog body.
5. **`publish.yml` fires on the tag.** It runs `npm ci` → `npm run build` → `npm publish` to GitHub Packages (`https://npm.pkg.github.com/@risqbase-inc/`). No GitHub Release creation step — release-please owns that.

## Conventional commits — quick reference

| Prefix | Effect | Shown in CHANGELOG? |
|---|---|---|
| `feat:` | Minor bump | ✓ "Features" |
| `fix:` | Patch bump | ✓ "Bug Fixes" |
| `perf:` | Patch bump | ✓ "Performance" |
| `revert:` | Patch bump | ✓ "Reverts" |
| `refactor:` | Patch bump | ✓ "Refactors" |
| `docs:` | Patch bump | ✓ "Documentation" |
| `chore:` | Patch bump | hidden |
| `build:` | Patch bump | hidden |
| `ci:` | Patch bump | hidden |
| `test:` | Patch bump | hidden |
| `style:` | Patch bump | hidden |
| `feat!:` / `BREAKING CHANGE:` footer | Major bump | ✓ "Features" |

Pre-1.0 behaviour is governed by `bump-minor-pre-major: true` + `bump-patch-for-minor-pre-major: false`. After 1.0 the standard semver rules apply.

## Bootstrap state (initial setup)

When this workflow first lands, `release-please-config.json` carries `"bootstrap-sha": "5d2bd1e..."` — the `main` HEAD at the moment release-please was enabled. release-please treats every commit at or before that SHA as "already released as 1.3.0" (per `.release-please-manifest.json`). The next `feat:` or `fix:` after that SHA is the first one release-please will count toward a new version.

Once a release lands, `bootstrap-sha` becomes redundant — release-please uses its own release tags as the boundary. The line can be removed in a follow-up cleanup but is harmless if left in.

## Making CI a required check

`ci.yml` (Lint & Build) runs on every PR but is **not yet a required status check** for merge. After CI has been green on a handful of PRs and you're confident the workflow is stable, add it to the `main` ruleset via:

```bash
# 1. Inspect the current required_status_checks list
gh api repos/Risqbase-Inc/ui-components/rulesets/16111489 \
  --jq '.rules[] | select(.type=="required_status_checks") | .parameters.required_status_checks'

# 2. PATCH the ruleset to add `Lint & Build`. Keep Vercel in the list.
gh api repos/Risqbase-Inc/ui-components/rulesets/16111489 \
  --method PUT \
  --input - <<'JSON'
{
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    { "type": "pull_request", "parameters": { "required_approving_review_count": 0, "require_code_owner_review": true, "allowed_merge_methods": ["merge", "squash", "rebase"] } },
    { "type": "code_scanning", "parameters": { "code_scanning_tools": [{ "tool": "CodeQL", "security_alerts_threshold": "medium_or_higher", "alerts_threshold": "errors_and_warnings" }] } },
    { "type": "code_quality", "parameters": { "severity": "errors" } },
    { "type": "creation" },
    { "type": "update" },
    {
      "type": "required_status_checks",
      "parameters": {
        "strict_required_status_checks_policy": false,
        "do_not_enforce_on_create": false,
        "required_status_checks": [
          { "context": "Vercel", "integration_id": 8329 },
          { "context": "Lint & Build" }
        ]
      }
    }
  ]
}
JSON
```

After this, any PR with failing lint or build will show a red merge button. Admin bypass remains available for emergencies but should be rare — the point of the gate is to catch regressions before they hit main.

## Troubleshooting

- **release-please opened no PR.** Check the commits since the last release (or since `bootstrap-sha`) — if every commit is `chore:` / `build:` / `ci:` / `test:` / `style:` (all hidden), release-please considers there to be no user-visible change and stays quiet. Land a `feat:` / `fix:` / `docs:` / `perf:` / `refactor:` / `revert:` commit and the release PR will appear on the next push.
- **release-please opened a major-bump PR unexpectedly.** A `feat!:` prefix or a `BREAKING CHANGE:` footer in any commit since the last release triggers a major bump. Audit `git log` for the offending commit.
- **`publish.yml` failed with `403` / auth error.** The workflow uses `secrets.GITHUB_TOKEN` with `packages: write` permission. If a token rotation broke it, check the workflow's `permissions:` block.
- **Tag exists but no GitHub Release.** release-please creates the GH release inline with the tag push, but a stale cache or rate-limit can cause a gap. Re-run the release-please workflow.
