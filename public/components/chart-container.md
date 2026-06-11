---
name: ChartContainer
domain: data-viz
layer: 2
state: beta
consumable: true
---

# ChartContainer

v4.3 §5.3, status `beta`. Backed by visx@^3 (honouring the v4.2.1 audit row A1 pin). v4.4 (GOV-DS-2026-02 rev. v4.4 §F / D-112) completes the 7/7 taxonomy: `area` / `heatmap` / `metric-card` / `choropleth` join `line` / `bar` / `sparkline`. Choropleth was briefly descoped via the §10.3 ladder and RESTORED by the CEO on 10 Jun (brief §13); its design contract is docs/design-system/v4.4/choropleth-spec.html (D-115…D-119). A11y (brief F.3): every type renders a visually-hidden data table (`sr-only`) linked from the `<figure role="img">` via `aria-describedby`, so screen-reader users can read the underlying series / cell values instead of relying on the `aria-label` summary alone.

```ts
import { ChartContainer } from '@risqbase-inc/ui-components/data-viz'
```

## API

- `type ChartType = 'line' | 'bar' | 'sparkline' | 'area' | 'heatmap' | 'metric-card' | 'choropleth'`
- `type ChoroplethGeo = 'europe' | 'world'`
- `type ChoroplethMode = 'band' | 'seq'`
- `type ChoroplethBand = 'very-low' | 'low' | 'medium' | 'high' | 'very-high'`
### `ChoroplethDatum`

| Prop | Type | Required | Description |
|---|---|:---:|---|
| `id` | `string` | yes |  |
| `value` | `number \| null` | no | Numeric value — drives `mode="seq"` fills, tooltips, the table and chip ordering. |
| `band` | `ChoroplethBand` | no | Band — drives `mode="band"` fills. |

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
| `geo` | `ChoroplethGeo` | no | Packaged geography — only read when `type === 'choropleth'`. Default `'europe'`. |
| `mode` | `ChoroplethMode` | no | Encoding mode — only read when `type === 'choropleth'`. Default `'band'`. |
| `data` | `ChoroplethDatum[]` | no | Choropleth data — only read when `type === 'choropleth'`. |
| `unit` | `string` | no | Unit copy for aria-labels, tooltip and the table header, e.g. `"open alerts"`. |
| `thresholds` | `number[]` | no | Optional seq quantisation thresholds (4 cuts → 5 steps); default quintiles (D-117). |
| `selectedId` | `string \| null` | no | Controlled single-select — the selected jurisdiction id, or null. |
| `onSelect` | `(id: string \| null) => void` | no | Selection callback (click / Enter / Space toggles; Esc clears). |
| `width` | `number \| string` | no | Width (CSS value or number of px). |
| `height` | `number` | no | Height. Default 240 for line/bar/area/heatmap, 120 for metric-card, 40 for sparkline; choropleth sizes by its geometry's aspect ratio. |
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

`choropleth` is descoped to v4.4.1 (GOV-DS-2026-02 rev. v4.4 §10.3 rung 1).


## Choropleth (v4.4, D-115…D-119)

| Token | Used for |
|---|---|
| `color.band.*.bg` (5) | `mode="band"` region fills, chips, legend swatches (theme-stable per the spec §3) |
| `color.chart.seq.1..5` | `mode="seq"` quantised fills + legend ramp (dark ramp ascends dark→bright per B1) |
| `color.chart.null` | explicit no-data regions (`value: null`) |
| `color.surface.muted` | context regions (in geometry, absent from `data`) |
| `color.surface.default` | region separation strokes (crisp boundaries on both themes without a border color) |
| `color.text.subtle` | hover stroke, legend text, chip values |
| `color.border.focus` | keyboard focus stroke (2px) |
| `color.action.primary` | selected stroke (2px) |
| `color.chart.tooltip-surface` / `-border` / `-text` | tooltip |
| `shadow.floating` | tooltip elevation |

Geometry is pre-projected planar TopoJSON (`src/data-viz/geo/*.json`,
built by `tools/charts/build-geo.mjs` from Natural Earth — public
domain). Budget ≤ 80 KB gz combined, CI-gated via `npm run geo:check`.

## Accessibility contract

# ChartContainer — accessibility

Ships as `beta`. The line / bar / sparkline machinery is stable (visx-backed); v4.4 (GOV-DS-2026-02 rev. v4.4 §F) adds `area` / `heatmap` / `metric-card` and the table fallback. `choropleth` is descoped to v4.4.1 per §10.3 rung 1.

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


## Choropleth (spec §5 contract)

- **Table fallback** — jurisdiction · value · band per row, sorted by
  value descending; `aria-describedby`-linked sibling of the
  `role="img"` figure (table semantics survive). Data entries without
  renderable geometry still get a row (data-driven completeness).
- **Keyboard** — the map is one tab stop (roving tabindex); Arrow keys
  move between jurisdictions sorted by value, Enter/Space toggles
  selection, Esc clears. Small-jurisdiction chips are native buttons in
  the normal tab order (D-118) with `aria-pressed`.
- **Labels** — each region: `role="graphics-symbol"` +
  `aria-label="{name}, {value} {unit}, {band} band"`. The tooltip is
  `role="status"` and supplementary only — never the sole carrier of a
  value.
- **Color independence** — band/value is always recoverable from the
  table + labels + legend; never from fill alone. Under
  `forced-colors: active`, jurisdictions carry `data-fc="region"`
  (fill → `CanvasText`, boundary strokes → `Canvas`); the table carries
  the data.
- **Motion** — only 120 ms stroke transitions, suppressed via
  `useReducedMotion()` (R13); no entrance animation, no pan/zoom easing
  (zoom is out of scope for v4.4).
