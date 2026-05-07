# Secrets — RisqBase Design System v4.2

> Owner: G6 — DevOps (Jordan Park)
> Status: Runbook for human-driven setup via GitHub + Vercel UIs
> Refs: GOV-DS-2026-02, audit U6.5

This document enumerates the secrets required for the v4.2 implementation
programme. Secrets must be created in the appropriate scope (org vs repo)
and rotated on the cadence below. Configuration-as-code in
`.github/workflows/*.yml` references these by name; this file is the
source of truth for what each one is for.

## Required secrets (v4.2)

| Name | Scope | Used by | Rotation (days) |
|---|---|---|---|
| `VERCEL_TOKEN` | Org | `preview-deploy.yml` (Vercel CLI auth for preview builds) | 90 |
| `VERCEL_ORG_ID` | Org | `preview-deploy.yml` (Vercel project linkage) | n/a (identifier; rotate only on org change) |
| `VERCEL_PROJECT_ID` | Repo | `preview-deploy.yml` (per-project linkage) | n/a (identifier; rotate only on project re-create) |
| `CHROMATIC_PROJECT_TOKEN` | Repo | `visual-regression.yml` (Chromatic auth) | 180 |
| `GITHUB_TOKEN` | Built-in (per-job, ephemeral) | `publish.yml` (GitHub Packages publish + Release create) | n/a (auto-rotated per workflow run by GitHub) |

### Notes

- **`VERCEL_TOKEN`** is org-scoped because the same token serves all
  RisqBase product repos (RALIA, risqbase.com, internal-tools, this
  package). Storing it once at the org level avoids per-repo rotation
  drift.
- **`VERCEL_ORG_ID` / `VERCEL_PROJECT_ID`** are identifiers, not
  credentials — they are not secret in the cryptographic sense, but are
  stored as secrets per Vercel's recommended practice so the workflow
  YAML stays free of environment-specific values.
- **`CHROMATIC_PROJECT_TOKEN`** is repo-scoped because Chromatic creates
  one project per repository.
- **`GITHUB_TOKEN`** is the auto-injected per-run token; we explicitly
  grant `packages: write` and `contents: write` in `publish.yml` so it
  can publish to GitHub Packages and create a Release. No PAT required.

## Telemetry secrets (intentionally absent)

Telemetry is **deferred to post-v4.2**. The following secrets that
appeared in the original Jordan-authored DevOps plan are **NOT
required** for the v4.2 launch:

| Name | Status |
|---|---|
| `SUPABASE_TELEMETRY_URL` | Not needed — `ds_telemetry` schema dropped from v4.2 |
| `SUPABASE_TELEMETRY_SERVICE_KEY` | Not needed — collector not deployed in v4.2 |
| `METABASE_API_KEY` | Not needed — Metabase dashboard dropped from v4.2 |
| `TELEMETRY_HMAC_SIGNING_KEY` | Not needed — endpoint not deployed in v4.2 |

These will be re-introduced when telemetry returns post-launch; the
runbook section here is reserved so the v4.3 update only has to fill
in the table.

## Rotation procedure

1. Generate the new secret in the upstream system (Vercel, Chromatic).
2. Update the GitHub Actions secret via Settings → Secrets and variables
   → Actions (org-scoped: org Settings; repo-scoped: repo Settings).
3. Trigger a manual workflow run on a throwaway PR to confirm the new
   value is accepted.
4. Revoke the old secret in the upstream system.
5. Update the "last rotated" tracker in the team's secrets register.

## Storage

- GitHub Actions secrets are encrypted at rest by GitHub and read-only
  once saved.
- Never commit any secret value (or a placeholder that looks like a
  real one) to the repo. Workflow files reference `${{ secrets.NAME }}`
  only.
- Pre-commit secret-scanning (Marcus's domain) is complementary, not
  a substitute, for proper secret hygiene.

## Out of scope for this document

- Production app secrets (Supabase URL/keys for non-telemetry use,
  Upstash Redis credentials, app-level signing keys) — those live in
  the consuming products' runbooks (RALIA, risqbase.com).
- Real secret values — this document only names them.
- Branch protection enforcement — see `branch-protection.md`.
