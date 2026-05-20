import type { Meta, StoryObj } from '@storybook/react'
import { Footer } from './'

const meta: Meta<typeof Footer> = {
  title: 'Core / Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    // Footer is full-width — let it span the canvas.
    layout: 'fullscreen',
  },
}
export default meta

type Story = StoryObj<typeof Footer>

/**
 * Canonical marketing footer with all five nav sections rendered.
 * This is the shape consumed by deployments where every linked page has shipped.
 */
export const Default: Story = {}

/**
 * Pre-launch marketing-site posture: a number of pages referenced by the canonical
 * link map haven't yet shipped to production. Pass `hiddenLinks` to suppress them.
 * Sections that end up empty after filtering collapse entirely.
 *
 * The list below mirrors the actual production-vs-staging delta on `risqbase.com`
 * as of 2026-05-20 (CEO directive Footer Option C). Verified via:
 *   `git ls-tree -r --name-only origin/main src/app/ | grep page.tsx`
 */
export const WithHiddenLinks: Story = {
  args: {
    hiddenLinks: [
      // Platform group — none shipped on production yet
      '/platform',
      '/platform/ai-compliance',
      '/platform/privacy-compliance',
      '/platform/horizon-iris',
      '/platform/operations',
      // Practice group — none shipped
      '/practice',
      '/practice/get-started',
      '/pricing/practice',
      // Solutions group — not shipped
      '/solutions',
      // Company group — partial
      '/pricing',
      '/founding-members',
    ],
  },
}

/**
 * Mobile viewport snapshot. The 5-column nav grid collapses to 2 cols at base,
 * 3 at `sm`, 5 at `lg`. Brand column stacks above nav at sub-`lg`.
 */
export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

/**
 * Bottom-bar-only render: every nav section is hidden. The brand column,
 * copyright line, and bottom-bar legal triad still render — these are
 * structurally required on any production marketing surface.
 */
export const AllNavHidden: Story = {
  args: {
    hiddenLinks: [
      '/platform',
      '/platform/ai-compliance',
      '/platform/privacy-compliance',
      '/platform/horizon-iris',
      '/platform/operations',
      '/practice',
      '/practice/get-started',
      '/pricing/practice',
      '/solutions',
      '/about',
      '/pricing',
      '/founding-members',
      '/security',
      '/contact',
      '/privacy',
      '/terms',
      '/cookies',
      '/governance',
      '/responsible-ai',
      '/responsible-use',
    ],
  },
}

/**
 * Custom sections override. Use when a downstream consumer needs a bespoke
 * link map (e.g. partner co-brand surface).
 */
export const CustomSections: Story = {
  args: {
    sections: [
      {
        title: 'Product',
        links: [
          { label: 'Overview', href: '/product' },
          { label: 'Pricing', href: '/product/pricing' },
        ],
      },
      {
        title: 'External',
        links: [
          { label: 'Docs', href: 'https://docs.example.com', external: true },
          { label: 'Status', href: 'https://status.example.com', external: true },
        ],
      },
    ],
  },
}

// Print snapshot — applies @media print at capture time
export const PrintGallery: Story = {
  parameters: {
    chromatic: { modes: { print: { media: 'print' } } },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <Footer />
      <Footer
        hiddenLinks={['/platform', '/practice', '/solutions', '/pricing', '/founding-members']}
      />
    </div>
  ),
}
