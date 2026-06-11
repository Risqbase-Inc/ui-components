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
