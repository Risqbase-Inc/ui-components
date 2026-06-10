---
name: ChartContainer
domain: data-viz
layer: 2
state: beta
consumable: true
---

# ChartContainer

v4.3 §5.3, status `beta`. Backed by visx@^3 (honouring the v4.2.1 audit row A1 pin). v4.4 (GOV-DS-2026-03 §F / D-112) completes the taxonomy: `area` / `heatmap` / `metric-card` join `line` / `bar` / `sparkline`. `choropleth` is descoped to v4.4.1 per §10.3 descope ladder rung 1 — 6/7 taxonomy ships in v4.4. A11y (brief F.3): every type renders a visually-hidden data table (`sr-only`) linked from the `<figure role="img">` via `aria-describedby`, so screen-reader users can read the underlying series / cell values instead of relying on the `aria-label` summary alone.

```ts
import { ChartContainer } from '@risqbase-inc/ui-components/data-viz'
```

## API

- `type ChartType = 'line' | 'bar' | 'sparkline' | 'area' | 'heatmap' | 'metric-card'`
### `SeriesPoint`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `x` | `number \| string` | yes |  |
| `y` | `number` | yes |  |

### `ChartSeries`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `id` | `string` | yes |  |
| `label` | `string` | yes |  |
| `data` | `SeriesPoint[]` | yes |  |

### `HeatmapCell`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `x` | `string` | yes |  |
| `y` | `string` | yes |  |
| `value` | `number \| null` | yes |  |

### `MetricDelta`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `value` | `string` | yes | Pre-formatted delta copy, e.g. `"+12%"` or `"−4 pts"`. |
| `direction` | `'up' \| 'down' \| 'flat'` | yes |  |
| `positive` | `boolean` | no | Whether the movement is *good* — risk metrics often invert the usual up-is-good reading. Defaults to `direction === 'up'`. Ignored for `'flat'`, which always renders neutral. |

### `ChartMetric`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `value` | `string` | yes | Pre-formatted headline value, e.g. `"78"` or `"£1.2m"`. |
| `label` | `string` | yes |  |
| `delta` | `MetricDelta` | no |  |

### `ChartContainerProps`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `type` | `ChartType` | yes |  |
| `series` | `ChartSeries[]` | yes | Plotted series. Required for every type; for `heatmap` (driven by `cells`) pass `series={[]}`, and for `metric-card` an optional `series[0]` renders as a sparkline beneath the headline. |
| `cells` | `HeatmapCell[]` | no | Grid data — only read when `type === 'heatmap'`. |
| `metric` | `ChartMetric` | no | Headline value / label / delta — only read when `type === 'metric-card'`. |
| `width` | `number \| string` | no | Width (CSS value or number of px). |
| `height` | `number` | no | Height. Default 240 for line/bar/area/heatmap, 120 for metric-card, 40 for sparkline. |
| `aria-label` | `string` | yes | Accessible name — required. |
| `header` | `ReactNode` | no | Optional content rendered above the chart (title / legend). |
| `footer` | `ReactNode` | no | Optional content rendered below the chart (caption / footnotes). |
| `className` | `string` | no |  |


Composes with: TelemetryBeacon

## Token chain

# Tokens — `ChartContainer`

Consumes the canonical chart-categorical palette:

| Token | Used for |
|---|---|
| `color.chart.cat.1` … `cat.8` | series colours, indexed by position — `line` / `sparkline` / `bar` strokes & fills, `area` stroke + reduced-opacity fill (same var, `fillOpacity`, no separate fill token), `metric-card` sparkline |
| `color.chart.seq.1` … `seq.5` | `heatmap` cell fills — 5-step sequential scale, linear binning over the value domain |
| `color.chart.null` | `heatmap` cells whose `value` is `null` (or missing from `cells`) |
| `color.chart.axis` | axis baseline |
| `color.chart.plot-area-bg` | container background |
| `color.risk.low` | `metric-card` delta chip when the movement is positive (default for `direction: 'up'`, or `positive: true`) |
| `color.risk.critical` | `metric-card` delta chip when the movement is negative (default for `direction: 'down'`, or `positive: false`) |
| `color.text.default` | header copy, `metric-card` headline value |
| `color.text.subtle` | footer / figcaption, `heatmap` row/column labels (10px), `metric-card` label and `flat` delta chip |

The 8-step categorical palette is sequenced for safe pairwise discrimination — `cat.1` (indigo) and `cat.2` (teal) are the strongest contrast pair and should be used for the two most important series.

The `metric-card` delta chip outline uses `border-current`, so the border resolves to the same risk/text token as the chip copy — no extra token bound.

`choropleth` is descoped to v4.4.1 (GOV-DS-2026-03 §10.3 rung 1).

## Accessibility contract

# ChartContainer — accessibility

Ships as `beta`. The line / bar / sparkline machinery is stable (visx-backed); v4.4 (GOV-DS-2026-03 §F) adds `area` / `heatmap` / `metric-card` and the table fallback. `choropleth` is descoped to v4.4.1 per §10.3 rung 1.

## Contracts
- Wrapped in `<figure role="img">` with a required `aria-label`. The SVG is `aria-hidden="true"`.
- The consumer must supply a meaningful `aria-label` summarising the chart — e.g. *"Risk score trend, 12 months, currently 42 (down from 78 in January)"*. Don't repeat the title; describe the *shape*.
- For `sparkline`, the label should always include the current value and the trend direction ("up 12% since last week").
- For `metric-card`, the label should carry the value, the delta, and its *valence* ("up 12 points — worsening"), since the chip encodes good/bad in colour.

## Table fallback (brief F.3 — all types)
Every instance renders a visually-hidden data table alongside the figure:

```html
<figure role="img" aria-label="…" aria-describedby="{useId}">…</figure>
<div id="{useId}" class="sr-only">
  <table>…series or cell data…</table>
</div>
```

- The `id` is generated with React `useId` and linked via `aria-describedby` on the figure, so screen-reader users get the label as the name and the raw data as the description / an adjacent navigable table.
- The table sits **outside** the figure: descendants of `role="img"` are presentational, which would strip the table semantics the fallback exists to provide.
- Hidden with the Tailwind `sr-only` utility (the repo-standard zero-pixel clip pattern — see `SkipLink`, `HeroVideo`). **Do not use `display: none`** — that hides it from screen readers too.
- Shape by type:
  - `line` / `bar` / `sparkline` / `area`: one column per series (header = `series[].label`), one row per x value.
  - `heatmap`: columns = unique `cells[].x`, rows = unique `cells[].y`; `null` / missing cells read "no data".
  - `metric-card`: a sentence with label, value and delta, plus the sparkline series table when `series[0]` is provided.

## Type-specific notes
- `heatmap` is driven by the `cells` prop; pass `series={[]}`. Row/column labels render at 10px in `color.text.subtle` inside the (hidden) SVG — the table fallback is the accessible copy of the grid.
- `metric-card` delta chip: `flat` is always neutral; `up`/`down` colour follows `delta.positive` when set, otherwise up-is-good. Never rely on the chip colour alone — put the valence in the `aria-label` (and ideally the visible copy).

## Don't
- Don't paint critical state in colour alone. Pair charts with a textual summary or a `BandBadge`.
- Don't suppress the table fallback by re-mounting with changing keys mid-session; the `aria-describedby` link must stay stable while the figure is on screen.
