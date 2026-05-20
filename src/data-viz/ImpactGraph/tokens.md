# Tokens — `ImpactGraph` + `MarketingImpactGraph`

Spec: [`docs/specs/v2.1.0/01-ImpactGraph.md`](../../../docs/specs/v2.1.0/01-ImpactGraph.md) §2.4.

## Category palette (default mapping)

| Category | Token |
|---|---|
| DPIA | `color.chart.cat.1` (indigo-600) |
| ROPA | `color.chart.cat.4` (emerald-500) |
| Vendor | `color.chart.cat.3` (amber-500) |
| Training | `color.chart.cat.6` (rose-500) |

Consumers override via the `categories` prop on `ImpactGraph`;
`MarketingImpactGraph` locks them.

## Edge strokes (per-entity severity)

Edge strokes use the `-border` chain per REFINE 1.2 in the spec. The
`-bg` chain is reserved for the centre alert ring fill (halo).

| Severity | Token |
|---|---|
| very-high | `color.band.very-high.border` |
| high | `color.band.high.border` |
| medium | `color.band.medium.border` |
| low | `color.band.low.border` |
| cascade | `color.text.subtle` (dashed, opacity 0.4) |

## Centre alert

| Surface | Token |
|---|---|
| surface | `color.surface.inverse` |
| text | `color.text.on-inverse` |
| text-meta (eyebrow) | `color.text.on-inverse-subtle` |
| ring fill | `color.band.{severity}.bg` |

## Iris attribution badge

| Surface | Token |
|---|---|
| background | `color.iris.surface` |
| border | `color.iris.accent-subtle` |
| disc | `color.iris.accent` |
| text | `color.iris.accent-hover` |

## Loading state (v4.4 — derived addition)

| Surface | Token |
|---|---|
| skeleton fill | `color.skeleton.shimmer` (linear-gradient composition of `color.surface.muted` ↔ `color.surface.subtle`) |

Composes from existing v4.3 surface primitives; defined in
[`00b-v4.4-token-extension.md`](../../../docs/specs/v2.1.0/00b-v4.4-token-extension.md).

## MarketingImpactGraph chrome

| Surface | Token |
|---|---|
| chrome card surface | `color.surface.default` |
| chrome border | `color.border.subtle` |
| chrome bar background | `color.surface.muted` |
| chrome dots | `color.border.default` |
| URL pill text | `color.text.subtle` (mono font stack) |
| chrome card radius | `dimension.radius.2xl` |
| chrome card elevation | `shadow.floating` (v4.4) |

## Edge labels

| Surface | Token / value |
|---|---|
| font | system mono stack (`ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`), 9px, 0.04em letter-spacing |
| colour | `color.text.subtle` |

## Interactive states (only when `onEntityClick` / `onAlertClick` set)

| State | Treatment |
|---|---|
| focus-visible ring | `color.action.primary`, 2px solid, outline-offset 4px |
| hover (centre) | `prefers-reduced-motion: no-preference` only — 1.4s pulse |

## What is NOT in the v4.3 / v4.4 token chain

The category mapping for unknown categories (REFINE 1.1 fallback) uses
the inline fallback `color.text.subtle`. No new token introduced.
