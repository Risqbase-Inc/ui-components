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
| Required status checks (exact names) | `ci.yml / lint-build`, `visual-regression.yml / chromatic`, `preview-deploy.yml / vercel` | Match the `jobs.<name>` keys in each workflow once `if: false` guards lift |
| Require conversation resolution before merging | **On** | No unresolved review threads |
| Require linear history | **On** | Disallow merge commits; squash or rebase only |
| Require deployments to succeed before merging | **Off** | Deferred to v4.3 (production-deploy gate) |
| Allow force pushes | **Off** | History is immutable on `main` |
| Allow deletions | **Off** | `main` cannot be deleted |
| Restrict who can push to matching branches | Optional, admin only | Defence-in-depth; not strictly required given the above |

## Required status check naming

Each workflow's required check appears in the GitHub UI as
`<workflow-file-without-yml> / <jobs.<name>>`. With the workflow files
shipped in this PR, the names will be:

- `ci / lint-build`
- `visual-regression / chromatic`
- `preview-deploy / vercel`

GitHub may display them with the `.yml` suffix on first run; the
canonical form is workflow-name (the `name:` field at the top of each
YAML) slash job-id. Apply whichever the UI offers after the first PR
triggers all three workflows.

> **NB:** While the workflows are guarded with `if: false`, their jobs
> will appear in the UI as "Skipped" rather than "Success". GitHub's
> branch-protection requires checks to *succeed*. Therefore, **do not
> enable the required-status-checks rule until G1 confirms the
> `apps/docs` path and the `if: false` guards are removed.** Until then,
> the rest of the rules in this table can be applied as-is.

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

- `.github/workflows/ci.yml` — provides the `ci / lint-build` check.
- `.github/workflows/visual-regression.yml` — provides the `visual-regression / chromatic` check.
- `.github/workflows/preview-deploy.yml` — provides the `preview-deploy / vercel` check.
- `.github/CODEOWNERS` — routes the "review from code owners" rule.
- `secrets.md` — secrets needed for the workflows above to actually run.
