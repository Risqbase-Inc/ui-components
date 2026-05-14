import type { Meta, StoryObj } from '@storybook/react';
import { SectionEyebrow } from './';

const meta: Meta<typeof SectionEyebrow> = {
  title: 'Core / SectionEyebrow',
  component: SectionEyebrow,
  tags: ['autodocs'],
  argTypes: {
    children: { control: 'text' },
  },
  args: { children: 'Compliance · DPIA' },
};
export default meta;

type Story = StoryObj<typeof SectionEyebrow>;

export const Default: Story = {};

export const WithSibling: Story = {
  render: () => (
    <div style={{ maxWidth: 540 }}>
      <SectionEyebrow>Compliance · DPIA</SectionEyebrow>
      <h2
        style={{
          margin: 0,
          fontSize: '1.5rem',
          letterSpacing: '-0.015em',
          color: 'var(--color-text-default)',
        }}
      >
        Section heading
      </h2>
      <p style={{ marginTop: '0.75rem', color: 'var(--color-text-subtle)' }}>
        The eyebrow is the small label above a section heading. One of the four
        signature elements of the system.
      </p>
    </div>
  ),
};

// Print snapshot - applies @media print at capture time
export const Gallery: Story = {
  parameters: {
    chromatic: { modes: { print: { media: 'print' } } },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <SectionEyebrow>Foundations</SectionEyebrow>
      <SectionEyebrow>Compliance · DPIA</SectionEyebrow>
      <SectionEyebrow>Tokens · BRIEF-401 Phase 2.1</SectionEyebrow>
    </div>
  ),
};
