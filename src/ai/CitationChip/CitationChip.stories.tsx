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

// v2.1.0 Spec 05 Action A — pre-existing AllVariants is the same
// content as the new spec-canonical AllVariantsRow; kept for back-compat
// so existing Chromatic baselines do not churn.
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxWidth: 720 }}>
      <CitationChip variant="verified" label="EU AI Act Art. 6" />
      <CitationChip variant="pending" label="GDPR Art. 32" />
      <CitationChip variant="low-confidence" label="ISO 27001 §A.5.1" />
      <CitationChip variant="retracted" label="Old guidance" />
      <CitationChip variant="external" label="Risk register" />
      <CitationChip variant="multi-source" label="Multiple sources" sourceCount={3} />
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
      <CitationChip
        variant="multi-source"
        label="GDPR Art. 30(4) + EDPB Guidelines"
        sourceCount={2}
      />{' '}
      within a reasonable timeframe.
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
      <CitationChip variant="multi-source" label="[6]" sourceCount={4} />
      <CitationChip variant="ai-inferred" label="[7]" />
      <CitationChip variant="retrieval-failed" label="[8]" />
      <CitationChip variant="user-pinned" label="[9]" />
    </div>
  ),
}

// ──────────────────────────────────────────────────────────────────────────
// v2.1.0 Spec 05 §3 Action A — added stories
// ──────────────────────────────────────────────────────────────────────────

/**
 * Single regression snapshot for Chromatic in spec-canonical order.
 * This is the most useful single story Sarah G5 uses to detect
 * v4.3 citation-chip token drift.
 */
export const AllVariantsRow: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2" style={{ maxWidth: 640 }}>
      {(
        [
          'verified',
          'pending',
          'low-confidence',
          'retracted',
          'external',
          'multi-source',
          'ai-inferred',
          'retrieval-failed',
          'user-pinned',
        ] as const
      ).map((v) => (
        <CitationChip
          key={v}
          variant={v}
          sourceCount={v === 'multi-source' ? 3 : undefined}
          label={
            v === 'retracted'
              ? 'Retracted citation'
              : v === 'retrieval-failed'
                ? 'Source unavailable'
                : 'Art. 35(3)(c)'
          }
        />
      ))}
    </div>
  ),
}

/**
 * Per G4 REFINE 5.1 — flex-wrap regression-risk on mobile prose
 * layouts. 375px viewport (Storybook mobile1).
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const AllVariantsRow_Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: AllVariantsRow.render,
}

/**
 * Variant has no individual coverage; without a Chromatic snapshot the
 * regression risk is silent.
 */
export const RetrievalFailed: Story = {
  args: { variant: 'retrieval-failed', label: 'Source unavailable' },
}

/**
 * Variant has no individual coverage; without a Chromatic snapshot the
 * regression risk is silent.
 */
export const UserPinned: Story = {
  args: { variant: 'user-pinned', label: 'Internal memo 2026-Q1' },
}
