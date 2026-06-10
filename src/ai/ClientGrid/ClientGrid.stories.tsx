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

export const ResponsiveBreakpoints: Story = {
  args: { clients: attention3, mode: 'attention' },
  parameters: {
    // FU-8 investigation outcome (2026-05-20, ADR-001 PR): the original
    // shipped comment said "Chromatic v11 forbids combining per-story
    // `viewports` with the global per-theme `modes`". This was a
    // misdiagnosis. Chromatic v11's Modes API explicitly STACKS
    // story-level modes on top of project-level modes — see
    // https://www.chromatic.com/docs/modes/ "Story Mode Stacking". The
    // mistake conflated the legacy `chromatic.viewports` parameter
    // (which IS incompatible with the modes API) with story-level
    // `chromatic.modes` containing viewport entries (which works
    // correctly).
    //
    // Coverage is now split:
    //   - This story (ResponsiveBreakpoints) stays as DOCUMENTATION —
    //     side-by-side width-pinned wrappers help reviewers reason
    //     about all three column counts at a glance, which a single
    //     viewport-pinned capture cannot. Note: width-pinned wrappers
    //     do NOT trigger the inner @media (min-width: …) breakpoint
    //     (the inner query reads viewport, not parent width). So this
    //     story is aspirational; the *real* breakpoint coverage lives
    //     in the three sibling stories below.
    //   - DesktopViewport / TabletViewport / MobileViewport — three
    //     viewport-pinned regression captures (FU-8 fix). Each uses
    //     story-level `chromatic.modes` to set a viewport; the
    //     project-level theme modes (light / dark / hc) stack on top,
    //     giving us 9 captures (3 viewports × 3 themes) per dispatch.
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Spec §3.1 mandates 3-col / 2-col / 1-col responsive behaviour at viewport widths 1024 / 640 / <640. The three wrappers below are width-pinned (NOT viewport-pinned) so reviewers can compare the column counts side-by-side. The genuine viewport regression captures live in the `DesktopViewport` / `TabletViewport` / `MobileViewport` sibling stories (FU-8).',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 16 }}>
      <div style={{ border: '1px dashed var(--color-border-subtle)', padding: 12 }}>
        <p style={{ fontSize: 11, color: 'var(--color-text-subtle)', margin: '0 0 6px' }}>
          ≥ 1024px — `desktopColumns` (default 3)
        </p>
        <ClientGrid {...args} />
      </div>
      {/* A11Y-FIX C5: the 2nd/3rd copies are presentational width demos —
          duplicate section landmarks are hidden from the a11y tree. */}
      <div inert aria-hidden="true" style={{ border: '1px dashed var(--color-border-subtle)', padding: 12 }}>
        <p style={{ fontSize: 11, color: 'var(--color-text-subtle)', margin: '0 0 6px' }}>
          640–1023px — 2 columns (resize the Storybook viewport to verify)
        </p>
        <ClientGrid {...args} />
      </div>
      <div inert aria-hidden="true" style={{ border: '1px dashed var(--color-border-subtle)', padding: 12 }}>
        <p style={{ fontSize: 11, color: 'var(--color-text-subtle)', margin: '0 0 6px' }}>
          &lt; 640px — single column (resize the Storybook viewport to verify)
        </p>
        <ClientGrid {...args} />
      </div>
    </div>
  ),
}

// FU-8 fix (G4 audit CG-1, 2026-05-20): three viewport-pinned snapshot
// stories that exercise the genuine inner @media (min-width: …) query
// path. Each adds a single `viewport` mode at story-level — the project
// preview.ts `light` / `dark` / `hc` theme modes stack on top, so the
// Chromatic dispatch captures 9 frames total across these three stories.
//
// Pinned viewport widths follow Spec §3.1 breakpoint canon:
//   - desktop: 1280px  → ≥ 1024 path → 3-column layout
//   - tablet:   768px  → 640..1023 path → 2-column layout
//   - mobile:   375px  → < 640 path → 1-column layout (RALIA platform
//                       low-end floor; matches CitationChip story canon)

export const DesktopViewport: Story = {
  args: { clients: attention3, mode: 'attention' },
  parameters: {
    chromatic: { modes: { 'viewport-desktop-1280': { viewport: { width: 1280 } } } },
    docs: {
      description: {
        story:
          'Viewport-pinned 1280px capture — exercises the `@media (min-width: 1024px)` desktop path. Expected: 3 columns. Combined with project-level theme modes, dispatch captures 3 frames (light / dark / hc).',
      },
    },
  },
}

export const TabletViewport: Story = {
  args: { clients: attention3, mode: 'attention' },
  parameters: {
    chromatic: { modes: { 'viewport-tablet-768': { viewport: { width: 768 } } } },
    docs: {
      description: {
        story:
          'Viewport-pinned 768px capture — exercises the 640–1023 path. Expected: 2 columns. Combined with project-level theme modes, dispatch captures 3 frames (light / dark / hc).',
      },
    },
  },
}

export const MobileViewport: Story = {
  args: { clients: attention3, mode: 'attention' },
  parameters: {
    chromatic: { modes: { 'viewport-mobile-375': { viewport: { width: 375 } } } },
    docs: {
      description: {
        story:
          'Viewport-pinned 375px capture — exercises the `<640px` mobile path (RALIA platform low-end floor). Expected: 1 column. Combined with project-level theme modes, dispatch captures 3 frames (light / dark / hc).',
      },
    },
  },
}
