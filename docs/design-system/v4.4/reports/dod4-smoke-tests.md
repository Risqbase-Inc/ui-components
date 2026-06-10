# DoD-4 functional smoke tests — execution record (2026-06-10)

## (a) Fresh MCP session, packed package, the two §C5 prompts

Server run from the **packed npm tarball** (`npm pack` → extract → `node
stdio.mjs`, simulating `npx @risqbase-inc/ui-components-mcp` with zero
config; the bundled `registry.json` snapshot served the data). Raw
JSON-RPC transcript: [`mcp-smoke-transcript.json`](./mcp-smoke-transcript.json).

**Prompt 1 — "what do I use for an AI citation with low confidence?"**
`search("AI citation low confidence")` top hits: `color.citation-chip.surface-low-conf`,
`color.citation.surface-low-conf`, **`CitationChip`** →
`get_component("CitationChip")` returns the variant union containing
**`'low-confidence'`**, the `citation-chip.*` → `citation.*` token chain,
and `import { CitationChip } from '@risqbase-inc/ui-components/ai'`. ✓ expected answer.

**Prompt 2 — "build a risk band chip"**
`search("risk band chip")` top hit: **`Badge`** with `exports` surfacing
**`BandBadge`**; `get_component("Badge")` returns the `BandBadgeProps` /
`BadgeBand` API. ✓ expected answer (BandBadge, not a custom build).
The Layer-3 `risk-gauge-configuration` showcase entry ranks below the
consumable primitive by design (D-104 rank penalty).

Assertions are additionally pinned in CI: `mcp/test/server.test.mjs`
("search ranks the C5 smoke-test queries correctly").

## (b) Streamable HTTP transport

Local HTTP host of `mcp/http.mjs` (the same handler `api/mcp.js` deploys
behind the `/mcp` rewrite): `POST` with
`tools/call list_components {domain:"data-viz"}` → 200, JSON-RPC result
listing the data-viz components; `GET` → 405 as specified. Verified
2026-06-10 (see session log). **Live verification at
design.risqbase.com/mcp remains pending the docs-site deploy** — ledger
row C5.3/DS.2 is BLOCKED on that, not on the implementation.

## (c) llms.txt + mirror spot-check

`public/llms.txt`, `public/llms-full.txt` and the 60+ `.md` mirrors are
regenerated-and-diffed in CI (`agent:check`, R14); `components/citation-chip.md`
spot-checked against `src/ai/CitationChip/` source — frontmatter, API
table, token chain and a11y contract all match. Live serving pending the
same deploy as (b).

## (d) Figma Dev Mode spot-check

BLOCKED — student-tier View seat (see `figma/README.md`); no Code Connect
publish possible from this identity.

## (e) Docs-site theme switcher

Implemented (pre-paint init script + `[data-theme="dark"]` variable set +
localStorage persistence + `prefers-color-scheme` default) across all 7
pages; `docs:check` green. Browser-level toggle/persist verification
needs a real browser session — pending with the docs-site deploy review.

## (f) Reduced motion via provider override with OS at full motion

The mechanism is CSS-deterministic: `[data-motion="reduced"]` rules in
`dist/tokens.css` override the base animations regardless of the OS
media query (specificity + order verified in `tools/tokens-build/static.css`),
and `MotionProvider.stories.tsx` ships `Reduced*` stories driving each of
the four primitives through `forcedPreference="reduced"`. Storybook
builds green; visual confirmation in a browser is pending the same
review pass as (e).
