# Scanner rules R12–R14 (v4.4, GOV-DS-2026-03 §9)

**Status:** new in v4.4, CI-blocking in this repo; reference
implementations ship with the package for consumer scanners (same
lifecycle as [R11](../v4.3/scanner-rule-r11.md)).
**Numbering:** the brief numbers these R11–R13, unaware the shipped v4.3
R11 (`iris.accent-on` contrast guard, PR #52) had taken the slot.
Renumbered R12–R14 per §13 decision 2026-06-09·2; machine-readable
constraints for all of R1–R14 live in
[`scripts/scanner-rules/rules.json`](../../../scripts/scanner-rules/rules.json)
(served to agents via MCP `get_usage_rules`).

## R12 · Token source hygiene

`tokens/**` must pass DTCG 2025.10 validation:

- every token file uses the `.tokens.json` extension (§A1);
- every leaf carries `$value` / `$type` / `$description`; `$deprecated`,
  when present, is boolean or a string reason (§A2);
- color `$value`s are OKLCH — raw hex is rejected everywhere; legacy hex
  lives only in `$extensions['com.risqbase.legacyHex']` (§A3);
- theme sets may only override base-defined tokens, and the dark set may
  not leave any semantic/component color token resolving to its light
  value without an explicit `com.risqbase.themeInvariant` reason (§B5).

**Enforcement:** `npm run lint:tokens`
([`tools/tokens-build/lint.js`](../../../tools/tokens-build/lint.js)) —
CI-blocking on every PR.
**Severity:** error.
**Instead:** convert with `tools/tokens-build/lib/oklch.js`; add dark
overrides to `tokens/themes/dark.tokens.json`.

## R13 · Motion gating

Animated CSS in component-tier code must be gated on `[data-motion]`,
`prefers-reduced-motion`, or the `useReducedMotion()` hook (Workstream E
contract). Violations: ungated Tailwind `animate-*` classes; ungated
`animation:` with `infinite` iteration; ungated `transition` longer than
500 ms. Short functional transitions (hovers, the 300 ms gauge sweep) are
exempt — the rule text targets "raw ungated `animation:` / **long**
`transition:`".

**Enforcement:** `npm run scan:motion`
([`scripts/scanner-rules/r13-motion-gating.mjs`](../../../scripts/scanner-rules/r13-motion-gating.mjs))
— CI-blocking. Regex-based and intentionally narrow, like R11: obvious
violations error, ambiguity is left to review.
**Severity:** error.
**Instead:** consume `useReducedMotion()`, add
`motion-reduce:animate-none`, or rely on the central
`[data-motion="reduced"]` rules in `dist/tokens.css`.

## R14 · Agent-surface freshness

`public/agent/registry.json`, `mcp/registry.json`, `/llms.txt`,
`/llms-full.txt` and every `.md` mirror must be regenerated in the same
commit as any change to component types, tokens, recipes, lifecycle,
showcase entries or scanner rules — the agent surface is generated, never
hand-maintained (§C4).

**Enforcement:** `npm run agent:check`
([`tools/agent-surface/build.mjs`](../../../tools/agent-surface/build.mjs)
`check` mode) — CI-blocking; byte-diff against regeneration, the same
mechanism as `docs:check`.
**Severity:** error.
**Instead:** run `npm run build:agent-surface` and commit the artefacts.

## Negative checks (DoD-5)

Each rule is proven to **fail** on a deliberately violating fixture
before being proven to pass on clean source —
[`scripts/test-scanner-rules.mjs`](../../../scripts/test-scanner-rules.mjs),
fixtures under [`scripts/__fixtures__/`](../../../scripts/__fixtures__/),
wired into CI as the "Scanner-rule negative checks" step.
