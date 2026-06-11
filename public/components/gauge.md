---
name: Gauge
domain: data-viz
layer: 2
state: stable
consumable: true
---

# Gauge

Generic stroked-arc primitive — the *configuration* that makes a RiskGauge (dual ring · teal · band-derived chip · delta pill) is RALIA-private (Layer 3). v4.3 §5.3, closes v4.2 audit U2.1.

```ts
import { Gauge } from '@risqbase-inc/ui-components/data-viz'
```

## API

- `type GaugeVariant = 'single' | 'dual'`
- `type GaugeSize = 'inline' | 'accessory' | 'summary' | 'headline'`
- `type GaugePalette = 'teal' | 'indigo' | 'stone'`
### `GaugeProps`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `value` | `number` | yes | Outer-ring value, 0–100. |
| `variant` | `GaugeVariant` | no |  |
| `innerValue` | `number` | no | Inner-ring value when `variant === 'dual'`. |
| `size` | `GaugeSize` | no |  |
| `palette` | `GaugePalette` | no | Outer-ring colour palette. Inner ring uses stone by convention. |
| `aria-label` | `string` | yes | Accessible name — required. |
| `label` | `string \| number` | no | Optional centre label (number or short text). |
| `caption` | `string` | no | Optional caption beneath label. |
| `className` | `string` | no |  |


Composes with: TelemetryBeacon

## Token chain

# Tokens — `Gauge`

| Token | Used for |
|---|---|
| `color.gauge-component.track` | unfilled background arc |
| `color.gauge-component.arc-teal` | outer arc, `palette="teal"` (default) |
| `color.gauge-component.arc-indigo` | outer arc, `palette="indigo"` |
| `color.gauge-component.arc-stone` | outer arc `palette="stone"` + dual-ring inner arc |
| `color.gauge-component.label` | centre numeric label |
| `color.gauge-component.caption` | unit / qualifier caption |
| `dimension.gauge.diameter.inline` | 48px |
| `dimension.gauge.diameter.accessory` | 80px |
| `dimension.gauge.diameter.summary` | 120px |
| `dimension.gauge.diameter.headline` | 160px |
| `dimension.gauge.stroke.default` | 6px |
| `dimension.gauge.stroke.inline` | 4px |

## Accessibility contract

# Gauge — accessibility

## Contracts
- Required `aria-label` — the gauge is a single visual unit, surfaced to assistive tech as `role="img"` with the consumer-provided name. Example: `"Residual risk 42 out of 100, inherent risk 78"`.
- The SVG is `aria-hidden="true"` — the wrapping `<span>` carries the name.
- The numeric label (when shown) uses `tabular-nums` so digits don't jiggle as the value animates.
- The arc transition is 300ms — slow enough to read, fast enough to feel responsive. Suppressed under `prefers-reduced-motion: reduce` via the consumer's Tailwind preset.
- Colour is the *visual* signal; the consumer-provided `aria-label` (or adjacent BandBadge) is the *semantic* signal. Don't encode the entire meaning in palette.

## Don't
- Don't use `palette="stone"` to indicate "good" — stone is the neutral comparator for dual-ring (inherent). Use `band-*` semantics in the surrounding label / chip.
