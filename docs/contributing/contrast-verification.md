# Contrast verification

`scripts/verify-contrast.mjs` walks the token graph, finds every leaf annotated with `$extensions['com.risqbase.contrastPair']`, resolves both sides through the primitive layer, and computes WCAG 2.2 contrast ratios. v4.3 §11.1 row 8.

## Run locally

```bash
npm run verify:contrast            # warn-only, exit 0 even on failures
npm run verify:contrast -- --strict # exit 1 on any AA-body failure
npm run verify:contrast -- --quiet  # exit code only, no table
```

## CI integration

Wired into `.github/workflows/ci.yml` as a non-blocking informational step (`continue-on-error: true`). Surfaces failures in the CI summary without gating merge. Once baseline failures are resolved, drop `continue-on-error` to promote to a blocking check.

## What gets checked

Only tokens with an explicit `$extensions['com.risqbase.contrastPair']` annotation. The pair is itself a token reference — `{color.surface.default}`, `{color.iris.accent}`, etc. — which the script resolves through the same primitive layer the runtime uses.

| Threshold | WCAG | When it applies |
|---|---|---|
| 4.5:1 | AA body | Default — text below ~24 px regular / ~19 px bold |
| 3.0:1 | AA large | Headings / large body text |
| 7.0:1 | AAA body | Highest grade — informational only |

## Adding annotations

To bring a new token into the check, add `contrastPair` to its `$extensions`:

```json
"on-something": {
  "$value": "{color.neutral.white}",
  "$type": "color",
  "$extensions": {
    "com.risqbase.role": "semantic",
    "com.risqbase.contrastPair": "{color.something.background}"
  }
}
```

The pair should be the *adjacent* token the value is meant to render on top of (or under, for a label). Bidirectional: both `text.default → surface.default` and the reciprocal can carry the annotation; the script computes the same ratio either way.

## Known pre-existing failures (tracked separately)

Per v4.2 contrast verification work, the following pairs fail AA body at body weight but are *retained intentionally* for branding / status semantics:

- `risk.low` against `surface.default` — emerald-500 on white
- `risk.medium` against `surface.default` — amber-500 on white
- `risk.high` against `surface.default` — orange-500 on white
- `band.very-low.text` against `band.very-low.bg` — white on emerald-500

These tokens currently lack the `contrastPair` annotation (so the script doesn't report them). The decision is logged separately and the tokens carry usage guidance in `tokens/README.md` recommending pairing with adjacent labels (`BandBadge` always carries text on saturated swatches; the chip wraps an `<svg>` icon, not the entire control's accessible name).

## New finding (v4.3)

`iris.accent-on` (white) on `iris.accent` (teal-600 `#0D9488`) lands at **3.74:1** — passes AA large but fails AA body. Two paths:

1. Darken `iris.accent` to teal-700 (`#0F766E`), which yields ~5.48:1 vs white. Visually a deeper teal; signature recognition impact TBC.
2. Keep teal-600 but pair white text only at large weights (≥ 24 px regular / 19 px bold). Document the constraint in component-level docs.

Tracked for Claude Design / Elena's call before v4.4.

## Methodology

Standard WCAG 2.2 calculation:

```
sRGB channel c (0–1) → linear:
  c_lin = c ≤ 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ^ 2.4

Luminance L = 0.2126 R_lin + 0.7152 G_lin + 0.0722 B_lin

Ratio = (L_hi + 0.05) / (L_lo + 0.05)
```

The script uses light-mode primitive values. Dark / HC themes ship token overrides; they need separate verification once those layers populate (v4.4).
