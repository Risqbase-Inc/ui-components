import type { Meta, StoryObj } from '@storybook/react'
import { ArcDecoration } from './'

const meta: Meta<typeof ArcDecoration> = {
  title: 'Primitives / ArcDecoration',
  component: ArcDecoration,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Pure-decoration SVG primitive (Spec 06). 2–4 concentric arc fragments sharing an off-canvas centre, drawn against a teal palette by default. `aria-hidden="true"` and `role="presentation"`; no semantics, no tab stop. Used as the marketing-site visual signature (Demo B §1 hero, Demo I §5 video close-frame).',
      },
    },
  },
  argTypes: {
    position: {
      control: 'select',
      options: ['bottom-right', 'top-right', 'top-left', 'bottom-left'],
    },
    rings: { control: { type: 'inline-radio' }, options: [2, 3, 4] },
    palette: { control: 'select', options: ['teal', 'teal-on-dark', 'stone'] },
    size: { control: { type: 'number', min: 120, max: 960, step: 40 } },
    baseOpacity: { control: { type: 'number', min: 0, max: 1, step: 0.05 } },
    rotationSeed: { control: { type: 'number', min: -360, max: 360, step: 5 } },
    animated: { control: 'boolean' },
    hideTerminatorDot: { control: 'boolean' },
  },
  args: {
    position: 'bottom-right',
    rings: 4,
    palette: 'teal',
    size: 480,
  },
}
export default meta
type Story = StoryObj<typeof ArcDecoration>

// Wrapper that draws a 480×480 light card so the off-canvas geometry
// is visually legible in Storybook (without it, only the visible arc
// fragment shows and the framing is lost).
const HeroFrame = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      position: 'relative',
      width: 480,
      height: 320,
      borderRadius: 16,
      background: 'var(--color-surface-default)',
      border: '1px solid var(--color-border-default)',
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
)

export const Default: Story = {
  render: (args) => (
    <HeroFrame>
      <div style={{ position: 'absolute', inset: 0 }}>
        <ArcDecoration {...args} />
      </div>
    </HeroFrame>
  ),
}

export const ThreeRings: Story = {
  args: { rings: 3 },
  render: Default.render,
}

export const TwoRings: Story = {
  args: { rings: 2 },
  render: Default.render,
}

export const TopRight: Story = {
  args: { position: 'top-right' },
  render: Default.render,
}

export const TopLeft: Story = {
  args: { position: 'top-left' },
  render: Default.render,
}

export const BottomLeft: Story = {
  args: { position: 'bottom-left' },
  render: Default.render,
}

export const OnDarkSubstrate: Story = {
  args: { palette: 'teal-on-dark' },
  render: (args) => (
    <div
      style={{
        position: 'relative',
        width: 480,
        height: 320,
        borderRadius: 16,
        background: 'var(--color-palette-teal-700, #115e59)',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        <ArcDecoration {...args} />
      </div>
    </div>
  ),
}

export const StoneOnly: Story = {
  args: { palette: 'stone' },
  render: Default.render,
}

export const Animated: Story = {
  args: { animated: true },
  render: Default.render,
  parameters: {
    docs: {
      description: {
        story:
          'Animated variant — 60s linear rotation on the outermost ring. Respects `prefers-reduced-motion: reduce` (animation suppressed when the system flag is on).',
      },
    },
  },
}

export const SmallSize: Story = {
  args: { size: 240 },
  render: (args) => (
    <div
      style={{
        position: 'relative',
        width: 240,
        height: 200,
        borderRadius: 12,
        background: 'var(--color-surface-default)',
        border: '1px solid var(--color-border-default)',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        <ArcDecoration {...args} />
      </div>
    </div>
  ),
}

export const LargeSize: Story = {
  args: { size: 720 },
  render: (args) => (
    <div
      style={{
        position: 'relative',
        width: 720,
        height: 480,
        borderRadius: 24,
        background: 'var(--color-surface-default)',
        border: '1px solid var(--color-border-default)',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        <ArcDecoration {...args} />
      </div>
    </div>
  ),
}

export const InsideHero: Story = {
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Composed with a Demo B-style hero card to verify visual integration. The default `<ArcDecoration />` (no props) should drop into the hero with no extra positioning work.',
      },
    },
  },
  render: () => (
    <div
      style={{
        position: 'relative',
        margin: 24,
        padding: '64px 48px',
        borderRadius: 24,
        background:
          'linear-gradient(135deg, var(--color-iris-surface) 0%, var(--color-surface-default) 100%)',
        border: '1px solid var(--color-border-default)',
        overflow: 'hidden',
        maxWidth: 960,
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        <ArcDecoration />
      </div>
      <div style={{ position: 'relative', maxWidth: 480 }}>
        <p
          style={{
            margin: '0 0 12px',
            fontFamily: 'ui-monospace, Menlo, monospace',
            fontSize: 11,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-text-subtle)',
          }}
        >
          Hero · Demo B
        </p>
        <h1
          style={{
            margin: '0 0 16px',
            fontSize: 48,
            lineHeight: 1.05,
            color: 'var(--color-text-default)',
          }}
        >
          The signature surface.
        </h1>
        <p style={{ margin: 0, color: 'var(--color-text-subtle)', fontSize: 16, lineHeight: 1.6 }}>
          Concentric arcs anchor the marketing brand. They tie the marketing site to the product
          surfaces.
        </p>
      </div>
    </div>
  ),
}
