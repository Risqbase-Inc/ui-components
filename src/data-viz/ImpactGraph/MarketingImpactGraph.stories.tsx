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
