# ChartContainer — accessibility

Ships as `beta` in v4.3 — the line / bar / sparkline machinery is stable; the screen-reader treatment is still maturing.

## Contracts
- Wrapped in `<figure role="img">` with a required `aria-label`. The SVG is `aria-hidden="true"`.
- The consumer must supply a meaningful `aria-label` summarising the chart — e.g. *"Risk score trend, 12 months, currently 42 (down from 78 in January)"*. Don't repeat the title; describe the *shape*.
- For `sparkline`, the label should always include the current value and the trend direction ("up 12% since last week").
- Future: `metric-card` will pair a numeric headline with a sparkline and an explicit trend chip — until then, compose with `Gauge` + `ChartContainer type="sparkline"` manually.

## Don't
- Don't paint critical state in colour alone. Pair charts with a textual summary or a `BandBadge`.
