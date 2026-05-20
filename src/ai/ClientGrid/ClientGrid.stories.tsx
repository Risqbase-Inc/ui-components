/* eslint-disable @typescript-eslint/no-empty-function -- no-op handlers in stories */
import type { Meta, StoryObj } from '@storybook/react'
import { ClientGrid } from './'
import type { ClientCardData } from './types'

const meta: Meta<typeof ClientGrid> = {
  title: 'AI / ClientGrid',
  component: ClientGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Practice Cockpit "Requires your attention" 3-up card grid. Composes `core/Card` (no card chrome re-implementation). Optional `onClientClick` makes each card a button; optional `onAlertClick` makes the alert pill a button. The two CANNOT be combined (engineering warns + falls back to card-click only). Delta colour is inverted by intent: positive `weeklyDelta` (risk rose) reads as alert; negative reads as improvement (semantic emerald via `--color-band-very-low-bg`, NOT raw palette).',
      },
    },
  },
  argTypes: {
    mode: { control: 'select', options: ['attention', 'all'] },
    desktopColumns: { control: 'select', options: [2, 3, 4] },
    bare: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof ClientGrid>

// Demo C 3-client attention fixture.
const attention3: ClientCardData[] = [
  {
    id: 'acme',
    name: 'Acme Health GmbH',
    subline: 'Healthcare · DE · 240 staff',
    avatarPalette: 1,
    residual: 58,
    weeklyDelta: 20,
    alertCount: 3,
    alertSeverity: 'high',
    secondaryStat: '14 DPIAs',
  },
  {
    id: 'forsyth',
    name: 'Forsyth & Co',
    subline: 'Finance · UK · 1,200 staff',
    avatarPalette: 4,
    residual: 71,
    weeklyDelta: 4,
    alertCount: 5,
    alertSeverity: 'high',
    secondaryStat: '3 incidents',
  },
  {
    id: 'northbridge',
    name: 'Northbridge Advisors',
    subline: 'Finance · HR · white-label',
    avatarPalette: 3,
    residual: 42,
    weeklyDelta: -3,
    alertCount: 1,
    alertSeverity: 'medium',
    secondaryStat: 'DPA 14d',
  },
]

// 12-client all-mode roster shared with PostureStrip.
const allMode12: ClientCardData[] = [
  ...attention3,
  { id: 'veridian', name: 'Veridian Bio', subline: 'Biotech · CH · 90 staff', avatarPalette: 2, residual: 28, weeklyDelta: -2, secondaryStat: '6 DPIAs' },
  { id: 'helix', name: 'Helix Labs', subline: 'AI · US · 45 staff', avatarPalette: 5, residual: 19, weeklyDelta: 0, secondaryStat: '0 incidents' },
  { id: 'quantica', name: 'Quantica', subline: 'Energy · NL · 320 staff', avatarPalette: 6, residual: 33, weeklyDelta: 5, secondaryStat: '4 DPIAs' },
  { id: 'aldershot', name: 'Aldershot LP', subline: 'Law · UK · 80 staff', avatarPalette: 2, residual: 47, weeklyDelta: -1, alertCount: 2, alertSeverity: 'medium', secondaryStat: '9 DPIAs' },
  { id: 'sentinel', name: 'Sentinel One', subline: 'SaaS · IE · 150 staff', avatarPalette: 4, residual: 22, weeklyDelta: -4, secondaryStat: '2 DPIAs' },
  { id: 'brightline', name: 'Brightline', subline: 'Education · DE · 220 staff', avatarPalette: 1, residual: 64, weeklyDelta: 12, alertCount: 4, alertSeverity: 'high', secondaryStat: '8 DPIAs' },
  { id: 'mercato', name: 'Mercato AG', subline: 'Retail · DE · 700 staff', avatarPalette: 5, residual: 36, weeklyDelta: 1, secondaryStat: '5 DPIAs' },
  { id: 'cloister', name: 'Cloister Bay', subline: 'Hospitality · IT · 60 staff', avatarPalette: 6, residual: 15, weeklyDelta: -7, secondaryStat: 'DPA 60d' },
  { id: 'ardent', name: 'Ardent Hold', subline: 'Investment · LU · 35 staff', avatarPalette: 3, residual: 51, weeklyDelta: 0, alertCount: 1, alertSeverity: 'medium', secondaryStat: '7 DPIAs' },
]

export const DefaultAttentionMode: Story = {
  args: { clients: attention3, mode: 'attention' },
}

export const AllMode12Clients: Story = {
  args: { clients: allMode12, mode: 'all' },
}

export const FourColumns: Story = {
  args: { clients: allMode12, mode: 'all', desktopColumns: 4 },
}

export const TwoColumns: Story = {
  args: { clients: attention3, mode: 'attention', desktopColumns: 2 },
}

export const WithHeadingAction: Story = {
  args: {
    clients: attention3,
    mode: 'attention',
    headingAction: { label: '+ Add client', onClick: () => {} },
  },
}

export const EmptyAttention: Story = {
  args: {
    clients: allMode12.map((c) => ({ ...c, alertCount: 0 })),
    mode: 'attention',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Attention mode with zero alerting clients renders the check-glyph empty state — reuses `--color-band-very-low-bg` for the glyph colour, consistent with the improving-delta colour-inversion.',
      },
    },
  },
}

export const EmptyAll: Story = {
  args: {
    clients: [],
    mode: 'all',
    headingAction: { label: '+ Add client', onClick: () => {} },
  },
}

export const Loading: Story = {
  args: { clients: [], mode: 'attention', loading: true },
}

export const InteractiveCards: Story = {
  args: {
    clients: attention3,
    mode: 'attention',
    onClientClick: () => {},
  },
}

export const InteractivePill: Story = {
  args: {
    clients: attention3,
    mode: 'attention',
    onAlertClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          'Alert pill becomes a `<button>` with `event.stopPropagation` so the inner click does not bubble — safe to combine with a card-wrapper that is presentational (which is the case here). Cannot be combined with `onClientClick`; the component warns in dev and falls back to card-click only.',
      },
    },
  },
}

export const BareNoChrome: Story = {
  args: { clients: attention3, bare: true },
}

// Responsive breakpoint stories — split into three so each can carry
// `chromatic.viewports` without conflicting with the preview's per-theme
// `modes` (Chromatic forbids both on the same story). Each story
// disables the per-theme `modes` and captures one viewport width.
// Spec §3.1 mandates 3-col / 2-col / 1-col responsive behaviour at
// 1024 / 640 / <640.

export const ResponsiveDesktop: Story = {
  args: { clients: attention3, mode: 'attention' },
  parameters: {
    chromatic: { viewports: [1280], modes: { light: { theme: 'light' } } },
    docs: {
      description: { story: 'Desktop (≥ 1024px) — `desktopColumns` (default 3) columns.' },
    },
  },
}

export const ResponsiveTablet: Story = {
  args: { clients: attention3, mode: 'attention' },
  parameters: {
    chromatic: { viewports: [768], modes: { light: { theme: 'light' } } },
    docs: {
      description: { story: 'Tablet (640–1023px) — collapses to 2 columns.' },
    },
  },
}

export const ResponsiveMobile: Story = {
  args: { clients: attention3, mode: 'attention' },
  parameters: {
    chromatic: { viewports: [375], modes: { light: { theme: 'light' } } },
    docs: {
      description: { story: 'Mobile (< 640px) — collapses to a single column.' },
    },
  },
}
