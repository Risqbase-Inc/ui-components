/* eslint-disable @typescript-eslint/no-empty-function -- no-op handlers in stories */
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { CompliancePostureStrip } from './'
import type { ClientPosture, PostureSort } from './types'

const meta: Meta<typeof CompliancePostureStrip> = {
  title: 'AI / CompliancePostureStrip',
  component: CompliancePostureStrip,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Practice Cockpit "12 clients at a glance" strip — a list of summary statistics, NOT a chart. Each cell is wrapped in a `role="img"` div carrying a single structured aria-label; when `onClick` is supplied per-client, the cell additionally becomes a button. Sort-change announcement is the consumer\'s responsibility (the component cannot know what other surfaces re-sort in response). v4.4 derived `--color-skeleton-shimmer` powers the loading state.',
      },
    },
  },
  argTypes: {
    gaugePalette: { control: 'select', options: ['teal', 'indigo'] },
    sort: { control: 'select', options: [undefined, 'risk', 'name', 'alerts'] },
    bare: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof CompliancePostureStrip>

// Demo C 12-client cockpit fixture — Practice Cockpit canon.
const cockpit12: ClientPosture[] = [
  { id: 'c1', name: 'Acme Health', residual: 58, alertCount: 3, alertSeverity: 'high' },
  { id: 'c2', name: 'Northbridge', residual: 42, alertCount: 1, alertSeverity: 'medium' },
  { id: 'c3', name: 'Veridian Bio', residual: 28 },
  { id: 'c4', name: 'Forsyth & Co', residual: 71, alertCount: 5, alertSeverity: 'high' },
  { id: 'c5', name: 'Helix Labs', residual: 19 },
  { id: 'c6', name: 'Quantica', residual: 33 },
  { id: 'c7', name: 'Aldershot LP', residual: 47, alertCount: 2, alertSeverity: 'medium' },
  { id: 'c8', name: 'Sentinel One', residual: 22 },
  { id: 'c9', name: 'Brightline', residual: 64, alertCount: 4, alertSeverity: 'high' },
  { id: 'c10', name: 'Mercato AG', residual: 36 },
  { id: 'c11', name: 'Cloister Bay', residual: 15 },
  { id: 'c12', name: 'Ardent Hold', residual: 51, alertCount: 1, alertSeverity: 'medium' },
]

// 30-client roster used by ManyClients to exercise the auto-fit wrap.
const many30: ClientPosture[] = Array.from({ length: 30 }, (_, i) => ({
  id: `m${i + 1}`,
  name: `Client ${i + 1}`,
  residual: Math.round((Math.sin(i * 1.37) * 0.5 + 0.5) * 80 + 10),
  ...(i % 4 === 0
    ? { alertCount: (i % 3) + 1, alertSeverity: (i % 2 === 0 ? 'high' : 'medium') as 'high' | 'medium' }
    : {}),
}))

const few4: ClientPosture[] = cockpit12.slice(0, 4)

export const Default: Story = {
  args: { clients: cockpit12 },
}

export const SortedByRisk: Story = {
  args: { clients: cockpit12, sort: 'risk', onSortChange: () => {} },
}

export const SortedByAlerts: Story = {
  args: { clients: cockpit12, sort: 'alerts', onSortChange: () => {} },
}

export const ManyClients: Story = {
  args: { clients: many30 },
  parameters: {
    docs: {
      description: {
        story:
          '30 clients exercise the `repeat(auto-fit, minmax(72px, 1fr))` wrap — the grid pins to a single row at cockpit-canon width and overflows to additional rows when entry count exceeds the row capacity. No layout change beyond the data.',
      },
    },
  },
}

export const FewClients: Story = {
  args: { clients: few4 },
}

export const Empty: Story = {
  args: { clients: [] },
}

export const Loading: Story = {
  args: { clients: [], loading: true },
}

export const Interactive: Story = {
  args: {
    clients: cockpit12.map((c) => ({ ...c, onClick: () => {} })),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Each cell becomes a `<button>` whose aria-label supersedes the inner role="img". Focus ring is the platform-canon 2px `--color-action-primary` with 2px offset (focus-visible only).',
      },
    },
  },
}

export const BareNoChrome: Story = {
  args: { clients: cockpit12, bare: true },
}

export const IndigoPalette: Story = {
  args: { clients: cockpit12, gaugePalette: 'indigo' },
}

// Bonus: live-controlled sort + announcement region. Not in the spec story
// list, but it documents the recommended consumer wiring without
// adding cost — Chromatic baselines the resting state only.
export const WithLiveSortAndAnnouncer: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Reference wiring for the §7.3 sort-change announcement: the consumer owns the `role="status"` live region; the component just emits `onSortChange`.',
      },
    },
  },
  render: () => {
    const [sort, setSort] = useState<PostureSort | undefined>('risk')
    const [announcement, setAnnouncement] = useState<string>('')
    return (
      <div>
        <CompliancePostureStrip
          clients={cockpit12}
          sort={sort}
          onSortChange={(next) => {
            setSort(next)
            setAnnouncement(`Sorted ${next === 'name' ? 'by name, ascending' : `by ${next}, descending`}.`)
          }}
        />
        <div role="status" aria-live="polite" className="sr-only">
          {announcement}
        </div>
      </div>
    )
  },
}
