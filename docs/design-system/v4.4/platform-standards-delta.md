# PLATFORM-STANDARDS.md delta — v4.4

`PLATFORM-STANDARDS.md` (§11.3 row G.3) does not exist in the
`ui-components` repo or its docs tree; it lives wherever the org-level
standards document is maintained (likely the RALIA or org meta repo).
Per the §13 protocol, the v4.4 standards changes are recorded here for
verbatim transplant into the canonical document. Ledger row G.3 stays
BLOCKED until that transplant lands.

## Additions

### MotionProvider (Layer 1, `core/`, beta)

- Products MUST mount `<MotionProvider>` at app root (alongside the
  theme init script) so user motion preference is respected everywhere.
- Resolution order: explicit user choice (`risqbase:motion` in
  localStorage, via `setMotionPreference()`) → OS
  `prefers-reduced-motion` → full motion. The OS signal is the default;
  user choice overrides it in both directions (D-110).
- Products SHOULD expose the documented `motion-preference` toggle
  recipe (design.risqbase.com/patterns/motion-preference.md) in their
  settings surface. The toggle is a documented pattern, not an exported
  control.
- New animated component CSS MUST be gated per scanner rule R13
  (`[data-motion]` / `prefers-reduced-motion` / `useReducedMotion()`).

### MCP server (`@risqbase-inc/ui-components-mcp`)

- Agents (Claude Code sessions, CI bots, design tooling) SHOULD consult
  the design-system MCP server before writing UI code:
  `npx @risqbase-inc/ui-components-mcp` (stdio) or
  `https://design.risqbase.com/mcp` (Streamable HTTP). Read-only (D-102).
- Layer-3 showcase entries returned by the server are
  `consumable: false`, `license: "RALIA-private"` (D-104): build from
  the Layer 1/2 primitives they compose, never copy the composition.
- The agent surface is generated, never hand-edited; freshness is
  CI-gated (scanner rule R14).

### ChartContainer taxonomy

- v4.4 ships `line` / `bar` / `sparkline` / `area` / `heatmap` /
  `metric-card` (choropleth → v4.4.1 per the §10.3 ladder, rung 1).
- All chart color consumption is token-only (`chart.*`); sequential
  encodings use `chart.seq.1..5`, no-data cells `chart.null`.
- Every chart renders a visually-hidden data-table fallback linked via
  `aria-describedby` — products MUST NOT strip it.

### Dark theme + tokens

- Dark coverage is complete and lint-enforced: any new
  semantic/component color token requires a dark value or an explicit
  `themeInvariant` reason (R12).
- Interactive TEXT on default surfaces uses `color.action.link`, not
  `color.action.primary` (whose dark contract is the ≥3:1 fill floor).
- Token sources are DTCG 2025.10: `.tokens.json`, OKLCH color values,
  resolver-driven theming. Raw hex is rejected.
- RALIA / marketing dark-mode adoption remains a product decision
  (D-108); nothing in v4.4 flips `data-theme` in products.
