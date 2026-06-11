---
name: Callout
domain: core
layer: 1
state: stable
consumable: true
---

# Callout

Replaces the AI-slop left-border-accent pattern. v4.3 §5.1, closes RALIA F-002 + marketing C-05. Each intent gets a 1px border, a faint tinted surface (5% alpha over white via custom property + opacity), and an icon glyph drawn from the matching role.

```ts
import { Callout } from '@risqbase-inc/ui-components/core'
```

## API

- `type CalloutIntent = 'info' | 'warning' | 'danger' | 'success' | 'tip'`
### `CalloutProps`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `intent` | `CalloutIntent` | no |  |
| `title` | `ReactNode` | no |  |
| `icon` | `ReactNode \| null` | no | Override the default per-intent icon. Pass `null` to omit. |
| `children` | `ReactNode` | yes |  |
| `className` | `string` | no |  |


Composes with: TelemetryBeacon

## Token chain

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

## Accessibility contract

# Callout — accessibility

The role applied to the wrapper depends on `intent`:

| Intent | ARIA role | Rationale |
|---|---|---|
| `info` | `status` | Polite live region — announce when content appears mid-flow |
| `warning` | `alert` | Assertive — needs immediate attention |
| `danger` | `alert` | Assertive — same |
| `success` | `status` | Polite — confirmation, not a warning |
| `tip` | (none — plain `div`) | Decorative; the body is the message |

## Contracts
- Icon is `aria-hidden="true"` — the visible text carries the meaning. WCAG 1.4.1 (Use of Color) is satisfied because intent is conveyed in the surrounding `title` / body copy as well as the colour.
- Pass `icon={null}` to omit the glyph entirely (text-only callout).
- For `danger` / `warning` content that *changes* during the page lifetime (e.g. a streaming validation error), keep the wrapper mounted and update its children — replacing the wrapper re-fires the `alert` announcement.
