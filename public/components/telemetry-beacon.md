---
name: TelemetryBeacon
domain: core
layer: 1
state: stable
consumable: true
---

# TelemetryBeacon

No-op stub for the adoption-telemetry contract (DS v4.3 §7.3, audit rows U4.2 / U4.3). Components emit mount events regardless of whether the collector is alive — instrument first, route later. Same pattern as Segment / Amplitude / OpenTelemetry. Behaviour today: - production: no-op - development with NEXT_PUBLIC_TELEMETRY_DEBUG=1: console.debug When the collector lands, it replaces the emit call with a real dispatch — no component code changes. The Beacon itself stays a client component so server-rendered primitives can keep their RSC posture (they just render `<TelemetryBeacon/>` as a child).

```ts
import { TelemetryBeacon } from '@risqbase-inc/ui-components/core'
```

## API

### `TelemetryBeaconProps`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `component` | `string` | yes | Component name — e.g. `"IconButton"`. |
| `version` | `string` | no | Package version. Defaults to `"2.0.0"` (current package version). |
| `variant` | `string` | no | Optional variant — e.g. `"primary"` for Button. |
| `meta` | `Record<string, string \| number \| boolean>` | no | Additional structured metadata to include in the emission. |


## Token chain

# Tokens — `TelemetryBeacon`

No tokens consumed. The Beacon renders no DOM.

## Accessibility contract

# TelemetryBeacon — accessibility

Renders `null`. Not visible to assistive tech and never emits an `aria-live` announcement. There is nothing to test.

If the collector lands and starts surfacing telemetry data in the UI, that surface gets its own accessibility contract — the Beacon stays invisible.
