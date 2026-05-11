# Post-PR-5-merge runbook — CI gate unblock

> Owner: G1 — Architecture (G1 (Architecture)). With: G6 (DevOps) (G6).
> Status: **Runbook only — do not execute until PR #5 merges to `main`.**
> Refs: GOV-DS-2026-02, `branch-protection.md`, `.github/workflows/{ci,visual-regression,preview-deploy}.yml`.

Sequenced unblock for the three CI gates guarded by `if: false`. Steps
depend on their predecessor — do **not** parallelise.

## Step 1 — `chore/unblock-ci` PR (after PR #5 merges)

- Branch `main` → `chore/unblock-ci`. Remove `if: false` from
  `ci.yml` `lint-build` job (line 18).
- Open PR. Verify `Lint & Build` runs and `npm run lint:tokens`,
  `npm run lint`, `npm run build` all pass. Merge once green.

## Step 2 — Re-add `CI / Lint & Build` to required status checks

After Step 1 merges:

- `gh api GET /repos/Risqbase-Inc/ui-components/branches/main/protection/required_status_checks` to read current rule.
- `gh api PUT …` adding `"CI / Lint & Build"` to the existing
  `contexts` array (do not clobber other entries).
- Verify on a throwaway failing-lint PR — merge must be disabled.
- Update `branch-protection.md` to reflect the now-active check.

## Step 3 — Repeat for `Visual Regression / Chromatic` (after S5 Storybook)

- `chore/unblock-chromatic` PR removes `if: false` from
  `visual-regression.yml` (line 22). Add the check to
  `required_status_checks` via `gh api PUT` (same as Step 2).
- Confirm `CHROMATIC_PROJECT_TOKEN` per `secrets.md`.

## Step 4 — Repeat for `Preview Deploy / Vercel Preview` (after S6 `apps/docs/`)

- `chore/unblock-vercel-preview` PR removes `if: false` from
  `preview-deploy.yml` (line 19). Add the check to
  `required_status_checks` via `gh api PUT`. Confirm `VERCEL_*` secrets
  per `secrets.md`.
