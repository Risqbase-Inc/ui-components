# Figma Code Connect (v4.4 Workstream D — BLOCKED, pipeline prepared)

**Status: BLOCKED on Figma access — gated per amended D-109 (CEO,
10 Jun).** The original D-109 premise ("library on Org/Enterprise plan")
failed in reality: the authenticated Figma identity is
`fiyinfoluwa.adeleke's team` — **student tier, View seat** (Figma MCP
`whoami`, 2026-06-10). Code Connect requires an Organization plan and
one full Org seat for the publishing identity; mappings additionally
need the real library file key + node-ids. **Amended D-109:** Workstream
D stays in v4.4, gated on Org access landing **by the release cut
(27 June)**. If access hasn't landed by then, the D rows auto-convert to
v4.4.1 (the patch doc returns) — no further decision needed. Nothing is
descoped via the §10.3 ladder.

## What is prepared

- `figma.config.json` — Code Connect config: parser `react`, include
  globs over `src/{core,ai,data-viz}/**`, label "React".
- The release pipeline (`.github/workflows/publish.yml`) carries a
  `figma connect publish` step gated on the `FIGMA_ACCESS_TOKEN` secret —
  inert until the org grants access, active the release after the secret
  lands.
- The token build already emits `dist/figma-tokens.json` with **light +
  dark modes** per variable (D.2 groundwork: Variables annotated so Dev
  Mode emits token-backed values, not raw hex).

## Unblocking checklist (admin)

1. Move the design library to the RisqBase Figma **Organization** plan;
   grant the publishing identity a Dev/Full seat.
2. Create a Figma personal access token with Code Connect scope; add it
   to repo secrets as `FIGMA_ACCESS_TOKEN`.
3. For each of the 25 Layer 1+2 components, create
   `figma/<Component>.figma.tsx` mapping the library component URL
   (file key + node-id) to the real package import — start with the
   spot-check set (Button, Badge, Card, Modal, CitationChip, Gauge),
   per the §10.3 rung-4 priority order.
4. Set variable code syntax on the org library's Variables (WEB →
   `var(--color-…)`) — `dist/figma-tokens.json` carries the canonical
   names.
5. Verify Dev Mode returns package imports for the spot-check set
   (ledger row D.3), then flip rows D.1–D.3 to PASS.

## Mapping template

```tsx
// figma/Button.figma.tsx
import React from 'react'
import figma from '@figma/code-connect'
import { Button } from '@risqbase-inc/ui-components/core'

figma.connect(Button, 'https://www.figma.com/design/<FILE_KEY>/?node-id=<NODE_ID>', {
  props: {
    label: figma.string('Label'),
    variant: figma.enum('Variant', { Primary: 'primary', Secondary: 'secondary', Ghost: 'ghost' }),
    disabled: figma.boolean('Disabled'),
  },
  example: ({ label, variant, disabled }) => (
    <Button variant={variant} disabled={disabled}>{label}</Button>
  ),
})
```

Layer-3 Figma components (Risk Gauge configuration, Iris) are **not**
mapped — they get a Figma component description pointing at the
showcase URL (design.risqbase.com/products/ralia/…) instead, per §6.
