import type { Meta, StoryObj } from '@storybook/react'
import { SkipLink } from './'

const meta: Meta<typeof SkipLink> = {
  title: 'Core / SkipLink',
  component: SkipLink,
  tags: ['autodocs'],
  args: { target: '#main-content', children: 'Skip to main content' },
}
export default meta
type Story = StoryObj<typeof SkipLink>

// The SkipLink is sr-only until focused. Storybook's interactions tab
// can simulate the focus state; for Chromatic we want to capture both
// resting and focused states.

export const Default: Story = {}

export const Focused: Story = {
  parameters: {
    chromatic: { delay: 100 },
    pseudo: { focus: true },
  },
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: 120, padding: 24 }}>
        <Story />
        <main id="main-content" tabIndex={-1} style={{ marginTop: 56, color: 'var(--color-text-subtle)' }}>
          (Main content — landing target for the SkipLink)
        </main>
      </div>
    ),
  ],
  render: (args) => {
    // Force the focused state via auto-focus for Chromatic capture.
    return (
      <div>
        <SkipLink {...args} />
      </div>
    )
  },
}
