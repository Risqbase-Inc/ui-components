---
name: RiskGauge
domain: data-viz
layer: 2
state: stable
consumable: true
---

# RiskGauge

RiskGauge composes the generic `Gauge` primitive with compliance semantics: dual-ring (inherent → residual), band derivation from residual, delta pill, locked teal palette to preserve the Iris signature. v4.3 §5.3 — RiskGauge component is Layer-2 generic; the RiskGauge *configuration* (this composition) is Layer-3 RALIA-private. We ship it from the package as a convenience but it is documented as product-private in the showcase. Closes v4.2 audit U2.2.

```ts
import { RiskGauge } from '@risqbase-inc/ui-components/data-viz'
```

## API

- `type RiskGaugeRole = 'headline' | 'detail' | 'list'`
### `RiskGaugeProps`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `inherent` | `number` | yes |  |
| `residual` | `number` | yes |  |
| `role` | `RiskGaugeRole` | yes |  |
| `label` | `string` | yes | Accessible label, e.g. "GDPR Art. 32 — residual 42 of 100". |
| `bandOverride` | `BadgeBand` | no | Override the auto-derived band if you need custom thresholds. |
| `className` | `string` | no |  |


Composes with: Gauge, TelemetryBeacon

## Token chain

# Tokens — `RiskGauge`

Consumes:
- `Gauge` tokens (see `../Gauge/tokens.md`)
- `Badge` band-* tokens (`color.badge.band.*`)
- `color.surface.muted` + `color.text.default` for the delta pill
- `dimension.radius.sm` for the delta pill

Band derivation (default thresholds, override via `bandOverride`):

| Residual | Band |
|---|---|
| 0–20 | `very-low` |
| 21–40 | `low` |
| 41–60 | `medium` |
| 61–80 | `high` |
| 81–100 | `very-high` |

## Accessibility contract

# RiskGauge — accessibility

A higher-level configuration over `Gauge`. The accessible name combines the consumer label, residual, and inherent in one string so screen-reader users hear the whole context at once.

## Contracts
- Renders `Gauge` with a derived `aria-label` like *"GDPR Art. 32 — residual 42 of 100, inherent 78 of 100"*.
- The band chip uses `BandBadge` which carries its own accessible label.
- The delta pill is annotated with `aria-label="Delta: −36"` — sign-aware ("−" / "+" / "No change").
- Use `bandOverride` when the consumer enforces non-default thresholds (regulatory regime, jurisdictional cut-points). The visual band still tracks the override; the underlying residual numeric is unchanged.
