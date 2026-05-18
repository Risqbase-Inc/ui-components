import type { Meta, StoryObj } from '@storybook/react'
import { StreamingText } from './'

const SAMPLE = 'Records of processing activities under GDPR Art. 30 must be maintained and made available to supervisory authorities on request.'

const meta: Meta<typeof StreamingText> = {
  title: 'AI / StreamingText',
  component: StreamingText,
  tags: ['autodocs'],
  args: { tokens: SAMPLE.split(' '), cadence: 35 },
}
export default meta
type Story = StoryObj<typeof StreamingText>

// Default story renders the streaming animation. Chromatic captures a
// mid-stream frame — use the `delay` param to give it time to type
// some content before the snapshot.
export const Default: Story = {
  parameters: { chromatic: { delay: 500 } },
  render: (args) => (
    <p style={{ maxWidth: 480, lineHeight: 1.6 }}>
      <StreamingText {...args} />
    </p>
  ),
}

export const Fast: Story = {
  args: { cadence: 80 },
  parameters: { chromatic: { delay: 600 } },
  render: (args) => (
    <p style={{ maxWidth: 480, lineHeight: 1.6 }}>
      <StreamingText {...args} />
    </p>
  ),
}

export const Slow: Story = {
  args: { cadence: 12 },
  parameters: { chromatic: { delay: 600 } },
  render: (args) => (
    <p style={{ maxWidth: 480, lineHeight: 1.6 }}>
      <StreamingText {...args} />
    </p>
  ),
}

export const Complete: Story = {
  // Long delay so all tokens have been revealed by snapshot time.
  parameters: { chromatic: { delay: 2000 } },
  args: { tokens: SAMPLE.split(' ').slice(0, 12) },
  render: (args) => (
    <p style={{ maxWidth: 480, lineHeight: 1.6 }}>
      <StreamingText {...args} />
    </p>
  ),
}
