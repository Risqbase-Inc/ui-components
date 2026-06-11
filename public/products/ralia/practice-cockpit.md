---
id: practice-cockpit
consumable: false
license: RALIA-private
layer: 3
---

# Practice Cockpit — RALIA dashboard composition

> **Not consumable.** This is a Layer-3 product-showcase entry (license: RALIA-private).
> Build with the Layer 1/2 primitives it composes instead.

RALIA's practice-level dashboard: a card grid of risk gauges, chart containers, client-scope banner and wizard-driven flows. The layout, thresholds and copy are RALIA product decisions; every building block is a consumable Layer 1/2 primitive.

## Composed of (all consumable)

- **Card** — {"role":"panel chrome"}
- **Gauge** — {"role":"per-practice risk dials"}
- **ChartContainer** — {"types":["line","bar","heatmap","metric-card"]}
- **ClientScopeBanner** — {"role":"active-client scoping"}
- **WizardProgress** — {"role":"assessment flows"}

Tokens: color.surface.*, color.band.*, color.chart.*, shadow.*

What to build instead: Compose Card + Gauge + ChartContainer from the package; the cockpit's grid and band thresholds are not part of the design system contract.

Showcase: https://design.risqbase.com/products/ralia/practice-cockpit
