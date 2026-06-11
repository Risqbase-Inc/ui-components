# Branch protection — `main`

> Owner: G6 — DevOps (G6 (DevOps))
> Status: Runbook for human-driven setup via the GitHub web UI
> Refs: GOV-DS-2026-02, audit U6.5

Branch protection on `main` cannot be expressed as configuration-as-code
in this repo (GitHub's API supports it, but applying it requires admin
credentials we don't ship in CI). This document describes the rules a
GitHub admin must apply via:

> **Settings → Branches → Branch protection rules → `main`**

Apply these settings exactly. Any deviation must be documented in a
follow-up PR to this file with rationale.

## Required rules

| Rule | Setting | Reason |
|---|---|---|
| Branch name pattern | `main` | The protected branch |
| Require a pull request before merging | **On** | No direct pushes |
| Required approving reviews | **1** | Single reviewer is sufficient at this team size |
| Dismiss stale approvals on new commits | **On** | Force re-review when changes land after approval |
| Require review from Code Owners | **On** | Enforce `.github/CODEOWNERS` routing |
| Require status checks to pass before merging | **On** | Block merge on red CI |
| Require branches to be up to date before merging | **On** | Avoid merge-from-stale-base regressions |
| Required status checks (exact names) | `Lint & Build`, `Chromatic / chromatic`, **`UI Tests`** (Chromatic app), `Vercel` | `UI Tests` and `Vercel` are commit statuses posted by their GitHub Apps, not Actions jobs — see "Chromatic gating model" below |
| Require conversation resolution before merging | **On** | No unresolved review threads |
| Require linear history | **On** | Disallow merge commits; squash or rebase only |
| Require deployments to succeed before merging | **Off** | Deferred to v4.3 (production-deploy gate) |
| Allow force pushes | **Off** | History is immutable on `main` |
| Allow deletions | **Off** | `main` cannot be deleted |
| Restrict who can push to matching branches | Optional, admin only | Defence-in-depth; not strictly required given the above |

## Required status check naming

Actions-provided checks appear in the GitHub UI as
`<workflow name:> / <jobs.<id>>`; app-provided checks appear under the
app's own status context. With the workflows shipped in this repo:

- `Lint & Build` (Actions: `ci.yml`)
- `Chromatic / chromatic` (Actions: `chromatic.yml` — build & upload only)
- `UI Tests` (commit status from the Chromatic GitHub App — the visual gate)
- `Vercel` (commit status from the Vercel GitHub App)

## Chromatic gating model (changed 2026-06-11)

`chromatic.yml` runs the locked `chromatic` CLI with
`--exit-zero-on-changes`: the Actions job asserts only "Storybook built
and uploaded" and goes green in a single run even when visual changes
are found. The merge gate for unreviewed visual changes is the
**`UI Tests`** commit status posted by Chromatic's GitHub App — it stays
*pending* while changes await review and flips to success **in place**
the moment baselines are accepted in the Chromatic UI. No Actions re-run
is ever needed.

> **Admin action required:** add **`UI Tests`** to the required status
> checks alongside `Chromatic / chromatic`. With the old
> `exitZeroOnChanges: false` model the Actions job carried the gate by
> failing; after this change, a green `Chromatic / chromatic` no longer
> implies the baselines were reviewed — only `UI Tests` does.

## Signed commits

Signed commits (GPG / Sigstore) are **deferred to v4.3**. The expected
addition will be:

| Rule | Setting (v4.3) |
|---|---|
| Require signed commits | **On** |

The deferral reason: the team's GPG key distribution is not finalised,
and forcing signing now would block PRs from machines without keys
configured. The v4.3 runbook update will accompany the org-wide GPG
rollout.

## Verification

After applying these rules, verify by:

1. Opening a throwaway PR that fails one of the required checks → merge
   button must be disabled.
2. Attempting to push directly to `main` from a non-admin account →
   GitHub must reject with "protected branch" error.
3. Attempting to force-push to `main` → must be rejected.
4. Attempting to delete `main` → must be rejected.

## Related

- `.github/workflows/ci.yml` — provides the `Lint & Build` check.
- `.github/workflows/chromatic.yml` — provides the `Chromatic / chromatic` check (build & upload); the `UI Tests` gate comes from the Chromatic GitHub App.
- The Vercel GitHub App — provides the `Vercel` check (preview deployments).
- `.github/CODEOWNERS` — routes the "review from code owners" rule.
- `secrets.md` — secrets needed for the workflows above to actually run.
