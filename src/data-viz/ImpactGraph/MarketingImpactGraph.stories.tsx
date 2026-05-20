import type { Meta, StoryObj } from '@storybook/react'
import { MarketingImpactGraph } from './MarketingImpactGraph'

// Spec: docs/specs/v2.1.0/01-ImpactGraph.md §3.4.
// 4 MarketingImpactGraph stories. The wrapper locks the fixture +
// 1100×460 viewBox + categories, so prop variation here is purely
// chrome / legend toggling.

const meta: Meta<typeof MarketingImpactGraph> = {
  title: 'Data-Viz / MarketingImpactGraph',
  component: MarketingImpactGraph,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof MarketingImpactGraph>

// ---- 1. Default — chrome on, legend on ------------------------------
export const Default: Story = {
  args: { fixture: 'edpb-04-2026', withChrome: true, withLegend: true },
  parameters: {
    docs: {
      description: {
        story:
          'The marketing-canonical render: screenshot chrome (browser dots + URL pill) wraps the SVG, category legend strip sits below. Pixel-match target: Demo D §2 graph composition at 1100×460.',
      },
    },
  },
}

// ---- 2. WithoutChrome — bare graph, no browser frame ----------------
export const WithoutChrome: Story = {
  args: { fixture: 'edpb-04-2026', withChrome: false, withLegend: true },
  parameters: {
    docs: {
      description: {
        story:
          'For consumers that supply their own framing surface (e.g. an article body or a section already inside a Card).',
      },
    },
  },
}

// ---- 3. WithoutLegend — chrome on, legend off -----------------------
export const WithoutLegend: Story = {
  args: { fixture: 'edpb-04-2026', withChrome: true, withLegend: false },
  parameters: {
    docs: {
      description: {
        story:
          'Tighter embed for hero composition where vertical real-estate is at a premium.',
      },
    },
  },
}

// ---- 4. BareEmbed — chrome off, legend off, for inside-card use ----
export const BareEmbed: Story = {
  args: { fixture: 'edpb-04-2026', withChrome: false, withLegend: false },
  parameters: {
    docs: {
      description: {
        story:
          'The most minimal render. Use inside an existing Card that already supplies its own surface, border, and legend.',
      },
    },
  },
}

// ---- 5. DemoDFidelitySnapshot — design-canon Chromatic baseline -----
//
// FU-4 (G4 audit MIG-1, 2026-05-20): the procedural layout engine
// generates entity positions via category-sector polar layout + a
// deterministic `stableHash`-driven jitter keyed off `entity.id`.
// Because the layout is deterministic on (fixture, categories, viewBox),
// the canvas is stable across renders — but a future layout refactor
// (different polar formula, different jitter amplitude, different
// category sector mapping) would silently shift every entity position.
//
// This story exists *purely* to lock the current canvas as the design
// canon. Once the Chromatic baseline is accepted, any future drift in
// MarketingImpactGraph's procedural output requires an explicit
// re-acceptance click. That gives us a regression net that Demo D
// pixel-comparison (rejected as too brittle — see G4 §2.2 adjudication)
// would never give cleanly.
//
// DO NOT change this story's args. If you need a different fixture
// captured, add a new `DemoEFidelitySnapshot` etc. — never re-aim the
// existing snapshot.
export const DemoDFidelitySnapshot: Story = {
  args: { fixture: 'edpb-04-2026', withChrome: true, withLegend: true },
  parameters: {
    // Pause animation at end so the Chromatic capture is
    // frame-deterministic (no centre-ring pulse mid-flight).
    chromatic: { pauseAnimationAtEnd: true },
    docs: {
      description: {
        story:
          '**Design-canon fidelity snapshot (FU-4 / G4 audit MIG-1).** Captures the current `edpb-04-2026` fixture render as the marketing-canvas canon. Any future drift in the layout engine (different polar formula, jitter amplitude, sector mapping) will fail this Chromatic baseline and require explicit re-acceptance. Do not change args; add a new snapshot story for additional fixtures.',
      },
    },
  },
}
