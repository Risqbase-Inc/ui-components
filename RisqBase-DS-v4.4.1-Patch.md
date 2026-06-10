# RisqBase DS v4.4.1 — patch backlog (descope ladder record)

**Created per GOV-DS-2026-03 §10.4** — this file exists because the §10.3
descope ladder was used during the v4.4 build. **Target: 31 July 2026 ·
package 2.x patch/minor per release-please.**

Cuts were taken in ladder order with no skips (DoD-6):

| Rung | Cut | §11 row(s) | Ships in v4.4 instead | v4.4.1 work |
|---|---|---|---|---|
| 1 | `choropleth` chart type | F.1 (partial — 6/7) | 6/7 taxonomy: `line` / `bar` / `sparkline` / `area` / `heatmap` / `metric-card` | Add `choropleth` to `ChartContainer`: UK + EU region geometries as static package assets (no external map service), `chart.seq.*` fills, `chart.null` no-data regions, table fallback per the §F3 pattern, Chromatic light + dark baselines. Geometry sourcing (Natural Earth simplification pass) is the bulk of the effort — the reason this rung is first on the ladder. |

Rungs 2–5 were **not** used: `metric-card`, the remote MCP endpoint
(implemented; live-verification pending the docs-site deploy — tracked as
a BLOCKED ledger row, not a descope), the full 25-component Code Connect
set (BLOCKED on Figma access, not descoped — see ledger row D.1) and the
forced-colors audit all ship in v4.4.

No other §11 row was cut. Rows reported BLOCKED in
`RisqBase-DS-v4.4-DoD-Ledger.md` are environment/deploy/admin
constraints, not scope cuts, and stay on the v4.4 ledger until resolved.
