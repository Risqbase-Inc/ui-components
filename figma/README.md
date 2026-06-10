# Figma Code Connect (v4.4 Workstream D — BLOCKED, pipeline prepared)

**Status: BLOCKED on Figma access.** D-109 assumed "Figma library is
current and on Org/Enterprise plan". At implementation time the
authenticated Figma identity is `fiyinfoluwa.adeleke's team` —
**student tier, View seat** (verified via the Figma MCP `whoami`,
2026-06-10). Code Connect requires an Organization/Enterprise plan and
an editor/dev seat to publish; mapping files additionally need the real
library file key + node-ids, none of which are reachable from this
identity. Ledger rows D.1–D.3 carry this evidence; nothing here is
descoped — the §10.3 ladder (rung 4) was NOT used for D.

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
