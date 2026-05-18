import type { Meta, StoryObj } from '@storybook/react'
import { CitationChip } from './'
import type { CitationVariant } from './types'

const meta: Meta<typeof CitationChip> = {
  title: 'AI / CitationChip',
  component: CitationChip,
  tags: ['autodocs'],
  args: { variant: 'verified', label: 'EU AI Act Art. 6' },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'verified',
        'pending',
        'low-confidence',
        'retracted',
        'external',
        'multi-source',
        'ai-inferred',
        'retrieval-failed',
        'user-pinned',
      ] satisfies CitationVariant[],
    },
  },
}
export default meta
type Story = StoryObj<typeof CitationChip>

export const Default: Story = {}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxWidth: 720 }}>
      <CitationChip variant="verified" label="EU AI Act Art. 6" />
      <CitationChip variant="pending" label="GDPR Art. 32" />
      <CitationChip variant="low-confidence" label="ISO 27001 §A.5.1" />
      <CitationChip variant="retracted" label="Old guidance" />
      <CitationChip variant="external" label="Risk register" />
      <CitationChip variant="multi-source" label="Multiple sources" />
      <CitationChip variant="ai-inferred" label="Inferred" />
      <CitationChip variant="retrieval-failed" label="Retrieval failed" />
      <CitationChip variant="user-pinned" label="Pinned" />
    </div>
  ),
}

export const Interactive: Story = {
  args: { onOpen: () => alert('opened') },
}

export const InProse: Story = {
  render: () => (
    <p style={{ maxWidth: 640, lineHeight: 1.7 }}>
      Records of processing activities must be kept{' '}
      <CitationChip variant="verified" label="GDPR Art. 30" /> and accessible to supervisory
      authorities{' '}
      <CitationChip variant="multi-source" label="GDPR Art. 30(4) + EDPB Guidelines" /> within a
      reasonable timeframe.
    </p>
  ),
}

export const Gallery: Story = {
  parameters: { chromatic: { modes: { print: { media: 'print' } } } },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxWidth: 720 }}>
      <CitationChip variant="verified" label="[1]" />
      <CitationChip variant="pending" label="[2]" />
      <CitationChip variant="low-confidence" label="[3]" />
      <CitationChip variant="retracted" label="[4]" />
      <CitationChip variant="external" label="[5]" />
      <CitationChip variant="multi-source" label="[6]" />
      <CitationChip variant="ai-inferred" label="[7]" />
      <CitationChip variant="retrieval-failed" label="[8]" />
      <CitationChip variant="user-pinned" label="[9]" />
    </div>
  ),
}
