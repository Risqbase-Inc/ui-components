# ESLint config location — `package.json#eslintConfig`

> Owner: G1 — Architecture (Alex Chen). Refs: GOV-DS-2026-02.

## Why the config lives in `package.json`

The shared `config-protection` pre-commit hook blocks any file whose
basename matches `.eslintrc.*`. Until the hook policy is amended, the
only ESLint config location available is the `eslintConfig` key in
`package.json` — ESLint's documented fallback the hook does not match.

## Trade-off

Less discoverable: the canonical location is `.eslintrc.json`, and
contributors will not find one. Diff hygiene is worse — rule edits
appear alongside unrelated `package.json` metadata.

## Recommended fix (out of scope for this PR)

One-line tweak to the `config-protection` hook policy to allowlist
`.eslintrc.json`, shipped as a separate PR against the hook-policy
repo with that owner's sign-off.

## How to add or change a rule

1. Edit `package.json#eslintConfig.rules` — keys are rule names; values
   are `"off"`, `"warn"`, `"error"`, or `[severity, options]`.
2. Run `npm run lint`. Unknown rule names error on every file — confirm
   the rule exists in the installed `@typescript-eslint/eslint-plugin`
   version first (currently `^8.59.2`).

## Plugin version

`@typescript-eslint/eslint-plugin` and `@typescript-eslint/parser` are
pinned to `^8.59.2` (cleanup-3-arch, OEF v4.2 §4.4 dep upgrade). The
v8 line ships `no-empty-object-type`, `no-unsafe-function-type`, and
`no-wrapper-object-types` (the v8 split of the deprecated v6
`ban-types`), plus `no-require-imports` and `prefer-namespace-keyword`
in the recommended preset. ESLint itself stays on the v8 line
(`^8.57.0`) — the typescript-eslint v8 plugin supports both legacy
`eslintConfig` and flat config; we use the legacy form because the
shared `config-protection` hook blocks `.eslintrc.*`.
