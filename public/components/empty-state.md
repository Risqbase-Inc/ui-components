---
name: EmptyState
domain: core
layer: 1
state: stable
consumable: true
---

# EmptyState

Eight variants, all share the same layout. Variant is currently a hint for the consumer (and a telemetry tag once instrumentation lands) — the visual treatment is identical so designers can pick the semantically-correct variant without painting themselves into a corner. v4.3 §5.1, closes RALIA F-020 / F-055.

```ts
import { EmptyState } from '@risqbase-inc/ui-components/core'
```

## API

- `type EmptyStateVariant = | 'default' | 'filtered' | 'error' | 'no-data' | 'no-results' | 'no-permission' | 'first-run' | 'client-feature-disabled'`
### `EmptyStateProps`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `variant` | `EmptyStateVariant` | no |  |
| `icon` | `ReactNode` | no | Decorative illustration / icon node. |
| `title` | `ReactNode` | yes |  |
| `description` | `ReactNode` | no |  |
| `action` | `ReactNode` | no | Optional CTA (typically a `<Button>` from `core`). |
| `secondaryAction` | `ReactNode` | no | Secondary link / ghost action. |
| `className` | `string` | no |  |


Composes with: TelemetryBeacon

## Token chain

# Tokens — `EmptyState`

| Token | Used for |
|---|---|
| `color.text.default` | `title` |
| `color.text.subtle` | `description` + icon tint |

EmptyState has no surface of its own — it inherits the surface of its parent. This is deliberate: it should drop into cards, drawers, full-page routes, and chart containers without painting a new background.

Variant is exposed as `data-empty-variant="<variant>"` for telemetry / scanner inspection but does not change the visual treatment.

## Accessibility contract

# EmptyState — accessibility

EmptyState wraps a heading + supporting copy + optional actions in a stable layout. It deliberately doesn't pick an ARIA role — the consumer composes the semantics.

## Contracts
- The `title` renders as `<h3>`. Place EmptyState inside a section whose `<h2>` provides outer hierarchy; if EmptyState replaces a routed `<main>` (rare), wrap it in a higher heading.
- Decorative icon is `aria-hidden="true"` — meaning is in the text.
- If EmptyState is replacing tabular content as the result of filtering, set `aria-live="polite"` on the surrounding container so the new state is announced (don't put `aria-live` on EmptyState itself — replacing the wrapper would re-announce on every render).
- `action` / `secondaryAction` accept any node; for keyboard parity pass a `<Button>` from `core` rather than a plain `<a>`.
