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
