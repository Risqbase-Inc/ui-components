---
name: Skeleton
domain: core
layer: 1
state: stable
consumable: true
---

# Skeleton

Shimmer at 1.4s linear infinite; respects the resolved motion preference via `useReducedMotion()` (DS v4.4 workstream E) — when reduced, the block renders as a static muted fill. The `motion-reduce:` variants stay on as the no-JS / no-provider CSS fallback. v4.3 §5.1, closes RALIA F-004. The shimmer is implemented as a CSS background-position animation against a 3-stop gradient — no JS, no layout thrash.

```ts
import { Skeleton } from '@risqbase-inc/ui-components/core'
```

## API

- `type SkeletonVariant = 'row' | 'card' | 'chart' | 'text' | 'circle'`
### `SkeletonProps`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `variant` | `SkeletonVariant` | no |  |
| `count` | `number` | no | Number of repeating skeleton blocks; defaults to 1. |
| `width` | `string` | no | Override width (e.g. `60%`). Ignored for `circle` / `card`. |
| `height` | `string` | no | Override height. Ignored for `circle`. |


Composes with: TelemetryBeacon

## Token chain

# Tokens — `Skeleton`

| Token | Used for |
|---|---|
| `color.surface.muted` | gradient stop 1/3 — base block colour |
| `color.surface.subtle` | gradient stop 2 — shimmer highlight |
| `dimension.radius.sm` | `row` / `text` block radius |
| `dimension.radius.md` | `chart` block radius |
| `dimension.radius.card.default` | `card` block radius |

The shimmer animation is `--motion-skeleton-shimmer` (defined in `tailwind.preset.js`): 1.4s linear infinite. Under reduced motion — resolved via `useReducedMotion()` from `MotionProvider` (DS v4.4 workstream E), or `prefers-reduced-motion: reduce` as the no-JS CSS fallback — the block is a static `color.surface.muted` fill with no animation classes.

## Accessibility contract

# Skeleton — accessibility

A purely visual loading affordance. Conveys progress to sighted users only.

## Contracts
- `role="presentation"` + `aria-hidden="true"` — assistive tech skips the skeleton entirely.
- The consumer is responsible for an `aria-busy="true"` on the *parent* container while skeletons are mounted, and an `aria-live="polite"` region elsewhere that announces "loaded" / data summary when content swaps in. Don't try to make the skeleton itself accessible.
- Animation respects the resolved motion preference (`useReducedMotion()` from `MotionProvider` — user override → `prefers-reduced-motion` → full; DS v4.4 workstream E). When reduced, the shimmer classes are not rendered at all; the surface remains a static muted block. The `motion-reduce:` Tailwind variants stay on as the no-JS / no-provider CSS fallback.

## Pair with
- Real content. A skeleton that approximates the eventual layout (matching block heights / line counts) prevents layout shift — a CLS win as much as an accessibility win.
