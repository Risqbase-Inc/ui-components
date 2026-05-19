# Tokens — `Callout`

Five intents × four properties = 20 component-tier tokens, wrapping the matching semantic roles.

| Intent | Resolves to | Surface tint |
|---|---|---|
| `info` | `palette.sky.500` | 10% alpha over surface |
| `warning` | `palette.amber.500` | 10% alpha |
| `danger` | `palette.red.600` | 10% alpha |
| `success` | `palette.emerald.500` | 10% alpha |
| `tip` | `iris.accent` (= `palette.teal.600`) | 10% alpha |

Body text always resolves to `color.text.default` — sufficient contrast against the tinted surface is verified at token-build time.

Radius is `dimension.radius.md` (8px). The left-border accent pattern that the marketing site used pre-v4.3 is intentionally avoided — colour is conveyed by the full perimeter border + surface tint.
