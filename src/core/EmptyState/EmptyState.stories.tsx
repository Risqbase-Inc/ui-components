import type { Meta, StoryObj } from '@storybook/react'
import { EmptyState } from './'
import { Button } from '../Button'

const FolderIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
)
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <circle cx={11} cy={11} r={8} />
    <line x1={21} y1={21} x2={16.65} y2={16.65} />
  </svg>
)

const meta: Meta<typeof EmptyState> = {
  title: 'Core / EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    variant: 'default',
    icon: <FolderIcon />,
    title: 'Nothing here yet',
    description: 'Once you upload data, it will appear in this panel.',
    action: <Button variant="primary">Upload data</Button>,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'filtered',
        'error',
        'no-data',
        'no-results',
        'no-permission',
        'first-run',
        'client-feature-disabled',
      ],
    },
  },
}
export default meta
type Story = StoryObj<typeof EmptyState>

export const Default: Story = {}

export const Filtered: Story = {
  args: {
    variant: 'filtered',
    icon: <SearchIcon />,
    title: 'No matches',
    description: 'Try clearing the active filters or broaden your search.',
    action: <Button variant="secondary">Clear filters</Button>,
    secondaryAction: undefined,
  },
}

export const NoAction: Story = {
  args: { action: undefined, secondaryAction: undefined },
}

export const Gallery: Story = {
  parameters: { chromatic: { modes: { print: { media: 'print' } } } },
  render: () => (
    <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr 1fr', width: 800 }}>
      <EmptyState
        variant="default"
        icon={<FolderIcon />}
        title="Nothing here yet"
        description="Once you upload data, it will appear in this panel."
        action={<Button variant="primary">Upload data</Button>}
      />
      <EmptyState
        variant="filtered"
        icon={<SearchIcon />}
        title="No matches"
        description="Try clearing the active filters."
        action={<Button variant="secondary">Clear filters</Button>}
      />
    </div>
  ),
}
