---
id: risk-gauge-configuration
consumable: false
license: RALIA-private
layer: 3
---

# Risk Gauge — RALIA configuration

> **Not consumable.** This is a Layer-3 product-showcase entry (license: RALIA-private).
> Build with the Layer 1/2 primitives it composes instead.

The RALIA signature risk dial: a dual-ring Gauge configuration with teal outer arc (current risk), stone inner arc (30-day delta), a band-derived chip and a delta pill. The composition is RALIA-private; every part it is built from is a consumable Layer 1/2 primitive.

## Composed of (all consumable)

- **Gauge** — {"variant":"dual","palette":"teal","size":"headline"}
- **BandBadge** — {"band":"derived from gauge value via the band.* thresholds"}
- **Badge** — {"variant":"subtle","role":"delta pill"}

Tokens: color.gauge.arc-teal, color.gauge.arc-stone, color.gauge.track, color.band.*

What to build instead: Compose <Gauge variant="dual" palette="teal"> with <BandBadge> — do not copy the RALIA configuration wholesale; its thresholds and copy are product decisions.

Showcase: https://design.risqbase.com/products/ralia/risk-gauge
