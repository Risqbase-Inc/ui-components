# Accessibility gates (v4.4 A11Y-FIX, D-124)

Two permanent gates landed with the build-6a1c1e6f a11y remediation
(`docs/design-system/v4.4/a11y-fix-instruction.md`):

## 1 · Token-level: expanded `verify-contrast` (CI-blocking)

`npm run verify:contrast -- --strict` fails the build when:

- any **TEXT-role token** (semantic/component color with the `TEXT_FILL`
  Figma scope) lacks both `com.risqbase.contrastPair` and a documented
  `com.risqbase.contrastExempt` reason — the curated-8-pairs gap that let
  1,344 axe violations through is closed: the curated set now IS the
  complete set;
- any declared pair falls below its floor (4.5:1 body, or 3:1 with
  `contrastLevel: "aa-large"` for documented exceptions) — verified
  **per theme** via the resolver.

Negative proof (DoD-5): `scripts/__fixtures__/d124-bad-contrast/` +
`npm run test:scanner-rules`.

## 2 · Review-level: Chromatic a11y deltas are review-blocking

For any PR that touches the theme layer (`tokens/**`, the Tailwind
preset, `.storybook/`, or component color classes), the Chromatic
accessibility report is part of the review contract:

- **An increase in axe violations for any story×mode blocks the review**
  the same way a visual regression does. Compare against the previous
  build's a11y counts; "it's only dark mode" is not an accepted waiver.
- Exclusions must be **documented in-code** (story `a11y` parameters with
  a rationale comment — see `TelemetryBeacon.stories.tsx`) or carried as
  `contrastExempt` token annotations. Axe's page-level `region` rule is
  globally disabled for stories (components are fragments, not pages —
  see `.storybook/preview.ts`); landmark-duplication rules stay on.
- Local reproduction: `npm run build:storybook` then
  `node scripts/a11y-probe.mjs --all` (the same axe + theme-global setup
  Chromatic runs; per-story probes supported, see the script header).

History: the Chromatic Storybook ran **without a Tailwind pipeline**
until v4.4 — every utility class was unstyled, so axe audited
browser-default text against the theme canvas, and baseline a11y counts
were meaningless. If a count looks structurally absurd, check the
harness before the components.
