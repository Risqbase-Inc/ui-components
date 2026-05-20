# Scanner rule R11 · `iris.accent-on` contrast guard

**Status:** new in v4.3, CI-blocking in consumer scanners (RALIA + marketing).
**Severity:** `error` for clear violations; `warn` for ambiguous (statically-undetermined font size).
**Closes:** the v4.3 §4.2 contrast contract enforcement gap surfaced in PR #51.
**Lives in:** consumer scanners — `scripts/lib/design-rules.mjs` and `scripts/design-system-check.mjs` in `Risqbase-Inc/Ralia` and the marketing-site repo. This document is the canonical rule definition; both consumer scanners reference it.

## Rule

Pairing `iris.accent-on` (white) with `iris.accent` (teal-600) computes to 3.74:1 — passes WCAG 2.2 AA Large + Non-Text (3:1) but fails AA Normal (4.5:1).

When `iris.accent-on` is used as a **text colour** on an `iris.accent` **surface**, the element must satisfy one of:

1. Render the text at a size that qualifies for AA Large (**≥18.66 px bold** or **≥24 px regular** — equivalent to Tailwind `text-2xl` regular or `text-xl` bold and larger).
2. Be a non-text element (icon stroke, arc, status dot, decorative chrome).

If neither holds, the consumer must swap to `iris.accent-on-dark` (= `stone-900`, ~4.67:1 on `iris.accent`).

## Detection

The rule walks `*.tsx` / `*.jsx` / `*.mdx` source. For each element it detects:

1. **Foreground signal.** Element resolves `iris.accent-on` for text: any of
   - `text-[var(--color-iris-accent-on)]`
   - `color: var(--color-iris-accent-on)` in inline style
   - Tailwind class equivalent if the consumer's preset wires `text-iris-accent-on`
2. **Background signal.** Same element (or its nearest ancestor with a background) resolves `iris.accent`: any of
   - `bg-[var(--color-iris-accent)]`
   - `background: var(--color-iris-accent)` / `background-color: var(--color-iris-accent)`
   - Tailwind class equivalent if wired
3. **Size signal.** Element's effective font-size is below AA Large.
   - Tailwind sizes: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl` (without `font-bold`) all flag.
   - `text-2xl` and above pass. `text-xl font-bold` (or `font-semibold`/`font-bold` on `text-lg` if the consumer treats semibold as bold for the threshold) passes.
   - Inline `font-size` below 24px regular / 18.66px bold flags.
   - When the element doesn't declare a font-size and inherits, the rule walks up to find one; if it can't resolve statically, emit `warn` rather than `error`.

The detection is best-effort. Three branches:

| Match | Action |
|---|---|
| Foreground + background + size below AA Large + bold/weight known | **error** (block CI) |
| Foreground + background + size below AA Large + weight statically unknown | **warn** (surface in CI summary, don't block) |
| Foreground + background but size cannot be resolved | **warn** |
| Anything else | no-op |

## Reference implementation

The canonical detection logic lives in this package at
[`scripts/scanner-rules/r11-iris-accent-on.mjs`](../../../scripts/scanner-rules/r11-iris-accent-on.mjs).
Consumer scanners can either:

1. **Copy** the function into `scripts/lib/design-rules.mjs` of their repo and adapt the file-walking glue.
2. **Import** it directly from the package once `@risqbase-inc/ui-components` is installed:
   ```js
   import { detectR11Violations } from '@risqbase-inc/ui-components/scripts/scanner-rules/r11-iris-accent-on.mjs'
   ```
   (The script is shipped under `files: ["dist", "scripts/scanner-rules", ...]` in `package.json` so consumer repos pull it through their normal npm install.)

The implementation is regex-based and intentionally narrow. It does not parse JSX into an AST — that would be heavier than the rule warrants. It surfaces obvious violations and warns when the surrounding context is ambiguous, leaving harder cases to human review.

## Baseline

First run against a consumer scanner's repo will surface existing violations. Per the v4.3 scanner-rule convention (R5 / R7 / R8 etc.), baseline them into `scripts/design-baseline.json`:

- Run the scanner with `--baseline` to record current violations.
- Subsequent runs ignore baselined hashes.
- When the underlying line changes (hash mismatch), the scanner errors with "this line used to be baselined — fix or rebaseline".

In RALIA, the known baseline candidates (from this PR's analysis of the Iris redesigns) are the sz-16 and sz-24 lettermark instances in `iris-redesign.html` §1 (lettermark scale) and §6 (panel chrome header). These are showcase pages, not runtime code; the structural fix is the sz-16 / sz-24 dark-glyph variant per §4.2. Baseline them with a `reason: "showcase — fix scheduled per v4.3 §4.2"` annotation if the consumer scanner supports it.

In marketing, the known baseline candidates are any small-lettermark light-glyph usages in `Marketing Demo *.html`. Same fix plan.

## Detection scope

| Path | In scope | Notes |
|---|:---:|---|
| `src/**/*.{ts,tsx}` (consumer-app source) | ✓ | Component-tier code — primary target |
| `docs/recipes/**/*.mdx` (recipe pages on docs site) | ✓ | Composed examples should be exemplary |
| `audit-deliverable/redesigns/*.html` (RALIA showcase) | ✓ for first audit | Baseline existing; fix per §4.2 |
| `Marketing Demo *.html` (marketing showcase) | ✓ for first audit | Same |
| Layer-3 showcase pages at `design.risqbase.com/products/ralia/*` | n/a | Showcase content; if it mirrors the runtime, the runtime catches first |
| `node_modules/**` | ✗ | Standard exclusion |
| `dist/**`, `storybook-static/**`, build outputs | ✗ | Standard exclusion |

## Why this lives outside the package

The v4.3 scanner rule set (R1–R11) is enforced by **consumer scanners**, not the `@risqbase-inc/ui-components` build. The package can't know whether `RALIA` is using `text-sm` on an `iris.accent` button — only the RALIA build does. This document is the contract; consumer scanners are the enforcement point.

The reference implementation in `scripts/scanner-rules/r11-iris-accent-on.mjs` ships with the package so consumer-side scanners pick up rule updates through their normal `@risqbase-inc/ui-components` version bump — same lifecycle as token updates.

## See also

- [`RisqBase-DS-v4.3-Comprehensive.md` §4.2](./RisqBase-DS-v4.3-Comprehensive.md#42-iris-contrast-contract) — the contrast contract this rule enforces
- [`docs/contributing/contrast-verification.md`](../../contributing/contrast-verification.md) — the package-side verifier (PR #51) that surfaces the contract failure at token-graph level
- v4.3 spec §10 — scanner rules R1–R10 (R11 added by this rule)
