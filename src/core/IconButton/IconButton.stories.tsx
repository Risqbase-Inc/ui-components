import type { Meta, StoryObj } from '@storybook/react'
import { IconButton } from './'

// Inline glyphs — Storybook isn't aware of a project icon set.
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)
const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
  </svg>
)

const meta: Meta<typeof IconButton> = {
  title: 'Core / IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: { icon: <PlusIcon />, 'aria-label': 'Add', size: 'md', variant: 'ghost' },
  argTypes: {
    variant: { control: 'select', options: ['ghost', 'primary', 'secondary'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}
export default meta
type Story = StoryObj<typeof IconButton>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconButton icon={<PlusIcon />} aria-label="Add (sm)" size="sm" />
      <IconButton icon={<PlusIcon />} aria-label="Add (md)" size="md" />
      <IconButton icon={<PlusIcon />} aria-label="Add (lg)" size="lg" />
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <IconButton icon={<PlusIcon />} aria-label="Add (ghost)" variant="ghost" />
      <IconButton icon={<PlusIcon />} aria-label="Add (primary)" variant="primary" />
      <IconButton icon={<PlusIcon />} aria-label="Add (secondary)" variant="secondary" />
    </div>
  ),
}

export const Gallery: Story = {
  parameters: { chromatic: { modes: { print: { media: 'print' } } } },
  render: () => (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(3, auto)' }}>
      {(['sm', 'md', 'lg'] as const).flatMap((size) =>
        (['ghost', 'primary', 'secondary'] as const).map((variant) => (
          <IconButton
            key={`${size}-${variant}`}
            icon={variant === 'primary' ? <TrashIcon /> : <PlusIcon />}
            aria-label={`${variant} ${size}`}
            size={size}
            variant={variant}
          />
        )),
      )}
    </div>
  ),
}
