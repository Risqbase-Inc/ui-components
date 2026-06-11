# dist/tokens.css diff conformance — v4.3-era build vs v4.4 (DoD-3a / §A5 row 5)

Baseline: `dist/tokens.css` built from commit eabad23 (pre-migration, archived before Workstream A).
Current: built from the v4.4 source.

## Findings

| Category | Result |
|---|---|
| Light block (`:root, [data-theme="light"]`) | **byte-identical** except 1 added line(s), 0 removed |
| Added light line(s) | `--color-action-link: #4f46e5;` — the Workstream-B `action.link` semantic token (B2 dark text-contract fix; resolves to the same value as `action.primary` in light) |
| Removed light line(s) | none |
| Dark block | grown from 105 to 183 declarations — §A5 allowed category (b), the Workstream-B full dark set |
| OKLCH notation | 2 `@supports (color: oklch(0% 0 0))` blocks adding 453 oklch() declarations — §A5 allowed category (a). Hex fallbacks in the base blocks are the round-trip-exact originals (see oklch-roundtrip.md) |
| `[data-theme="hc"]` stub comment | removed — inherent to §A4 ("themes/{dark,hc}.json stubs deleted") |
| Static utility CSS | appended motion/forced-colors block (tools/tokens-build/static.css) — required by Workstream E ("tokens.css gains [data-motion=reduced] rules") and B3; documented as category (c) |

## Verdict

Every difference falls into §A5's allowed categories (a)/(b), the
§A4-inherent hc-stub removal, the documented B2 token addition, or the
Workstream-E/B3 static block the brief itself mandates. **Zero value
changes to any pre-existing custom property in any theme.**
