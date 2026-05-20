import type { Meta, StoryObj } from '@storybook/react'
import { ImpactGraph } from './ImpactGraph'
import { edpb_04_2026 } from './fixtures/edpb-04-2026'
import { marketingCategories } from './fixtures/marketing-categories'
import type { CategoryPalette, ImpactEntity } from './types'

// Spec: docs/specs/v2.1.0/01-ImpactGraph.md §2.5.
// 12 ImpactGraph stories — covering Default, edge cases, severity
// stress, configurability, interactivity, error/empty.
//
// MarketingImpactGraph has its own file (./MarketingImpactGraph.stories.tsx)
// so the Storybook tree segregates the primitive from the wrapper.

const meta: Meta<typeof ImpactGraph> = {
  title: 'Data-Viz / ImpactGraph',
  component: ImpactGraph,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof ImpactGraph>

// Helper datasets for the stress + configurability stories.
const categoryKeys = ['DPIA', 'ROPA', 'Vendor', 'Training']
const severities = ['very-high', 'high', 'medium', 'low'] as const
const glyphs: Record<string, string> = {
  DPIA: 'DPIA',
  ROPA: 'ROPA',
  Vendor: 'VEND',
  Training: 'CCL',
}

// ---- 1. Default — full Demo D fixture (EDPB Guidelines 04/2026) ------
export const Default: Story = {
  args: {
    ...edpb_04_2026,
    categories: marketingCategories,
  },
}

// ---- 2. EmptyCategories — all categories present, zero entities ------
export const EmptyCategories: Story = {
  args: {
    alert: edpb_04_2026.alert,
    entities: [],
    categories: marketingCategories,
    irisAttribution: { count: 0 },
  },
}

// ---- 3. SingleCategory — only DPIA entities; layout collapses --------
export const SingleCategory: Story = {
  args: {
    alert: edpb_04_2026.alert,
    entities: edpb_04_2026.entities.filter((e) => e.category === 'DPIA'),
    categories: marketingCategories,
    irisAttribution: {
      count: edpb_04_2026.entities.filter((e) => e.category === 'DPIA').length,
    },
  },
}

// ---- 4. ManyEntities — 30 entities; stress label collision -----------
const manyEntities: ImpactEntity[] = []
for (let i = 0; i < 30; i++) {
  const category = categoryKeys[i % 4]
  const severity = severities[i % 4]
  manyEntities.push({
    id: `stress-${i}`,
    category,
    glyph: glyphs[category],
    name: `${category}-${String(i + 1).padStart(2, '0')}`,
    severity,
    clauseLabel: `Art. ${30 + (i % 17)}`,
  })
}
export const ManyEntities: Story = {
  args: {
    alert: edpb_04_2026.alert,
    entities: manyEntities,
    categories: marketingCategories,
    irisAttribution: { count: manyEntities.length },
  },
}

// ---- 5. WithCascades — Demo D + 3 dashed cascade edges ---------------
export const WithCascades: Story = {
  args: {
    ...edpb_04_2026,
    categories: marketingCategories,
    cascades: [
      { from: 'vend-secucorp', to: 'dpia-footfall-retail' },
      { from: 'vend-biometriq', to: 'dpia-biometric-access', label: 'sub-processor' },
      { from: 'train-cctv-operator', to: 'dpia-cctv-acme-lobby' },
    ],
  },
}

// ---- 6. WithoutIrisAttribution — irisAttribution prop omitted -------
export const WithoutIrisAttribution: Story = {
  args: {
    alert: edpb_04_2026.alert,
    entities: edpb_04_2026.entities,
    cascades: edpb_04_2026.cascades,
    categories: marketingCategories,
    // irisAttribution intentionally omitted
  },
}

// ---- 7. ConfigurableCategories — 5 categories incl. "Policies" ------
const fiveCategories: CategoryPalette[] = [
  { key: 'DPIA',     color: 'var(--color-chart-cat-1)', sectorCentre: 0,   sectorWidth: 70, label: 'DPIA' },
  { key: 'ROPA',     color: 'var(--color-chart-cat-4)', sectorCentre: 72,  sectorWidth: 60, label: 'ROPA' },
  { key: 'Vendor',   color: 'var(--color-chart-cat-3)', sectorCentre: 144, sectorWidth: 60, label: 'Vendor' },
  { key: 'Training', color: 'var(--color-chart-cat-6)', sectorCentre: 216, sectorWidth: 60, label: 'Training' },
  { key: 'Policies', color: 'var(--color-chart-cat-2)', sectorCentre: 288, sectorWidth: 70, label: 'Policies' },
]
const fiveCategoryEntities: ImpactEntity[] = [
  ...edpb_04_2026.entities.slice(0, 10),
  { id: 'pol-cctv-policy',   category: 'Policies', glyph: 'POL', name: 'CCTV Policy v3.2',     severity: 'high',   clauseLabel: 'Art. 24' },
  { id: 'pol-bio-access',    category: 'Policies', glyph: 'POL', name: 'Biometric Policy',     severity: 'medium', clauseLabel: 'Art. 24' },
  { id: 'pol-visitor-mgmt',  category: 'Policies', glyph: 'POL', name: 'Visitor Mgmt Policy',  severity: 'low',    clauseLabel: 'Art. 24' },
]
export const ConfigurableCategories: Story = {
  args: {
    alert: edpb_04_2026.alert,
    entities: fiveCategoryEntities,
    categories: fiveCategories,
    irisAttribution: { count: fiveCategoryEntities.length },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Proves configurability: 5 categories (Marketing-canon 4 + Policies) render without any component-code change. RALIA-app preview path.',
      },
    },
  },
}

// ---- 8. Severity_VeryHigh — centre alert + 4 very-high edges --------
export const Severity_VeryHigh: Story = {
  args: {
    alert: { ...edpb_04_2026.alert, severity: 'very-high' },
    entities: [
      { id: 'vh-1', category: 'DPIA',     glyph: 'DPIA', name: 'High-1', severity: 'very-high', clauseLabel: 'Art. 35(3)(c)' },
      { id: 'vh-2', category: 'ROPA',     glyph: 'ROPA', name: 'High-2', severity: 'very-high', clauseLabel: 'Art. 30' },
      { id: 'vh-3', category: 'Vendor',   glyph: 'VEND', name: 'High-3', severity: 'very-high', clauseLabel: 'Art. 28(3)(h)' },
      { id: 'vh-4', category: 'Training', glyph: 'CCL',  name: 'High-4', severity: 'very-high', clauseLabel: '§5 training' },
    ],
    categories: marketingCategories,
    irisAttribution: { count: 4 },
  },
}

// ---- 9. Severity_Low — centre alert + 8 low edges -------------------
export const Severity_Low: Story = {
  args: {
    alert: { ...edpb_04_2026.alert, severity: 'low' },
    entities: Array.from({ length: 8 }, (_, i) => {
      const category = categoryKeys[i % 4]
      return {
        id: `low-${i}`,
        category,
        glyph: glyphs[category],
        name: `Low-${i + 1}`,
        severity: 'low' as const,
        clauseLabel: `Art. ${30 + i}`,
      }
    }),
    categories: marketingCategories,
    irisAttribution: { count: 8 },
  },
}

// ---- 10. Interactive — click handlers wired -------------------------
export const Interactive: Story = {
  args: {
    ...edpb_04_2026,
    categories: marketingCategories,
    onEntityClick: (entity) => {
      // eslint-disable-next-line no-alert
      window.alert(`Entity clicked: ${entity.name} (${entity.category})`)
    },
    onAlertClick: () => {
      // eslint-disable-next-line no-alert
      window.alert('Centre alert clicked')
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'With `onEntityClick` and/or `onAlertClick` set, the graph becomes keyboard-navigable. Tab into the SVG to receive a focus ring; press Enter or Space to activate. Per accessibility spec §2.',
      },
    },
  },
}

// ---- 11. ErrorState — fetch-error fallback ---------------------------
export const ErrorState: Story = {
  render: () => (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <ImpactGraph
        alert={{
          source: 'EDPB · 2026-05-12',
          title: ['Guidelines', '04/2026'],
          severity: 'very-high',
        }}
        entities={[]}
        categories={marketingCategories}
        ariaLabel="Impact graph — could not load impact analysis."
      />
      <p
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, calc(-50% + 120px))',
          color: 'var(--color-text-subtle)',
          fontSize: 12,
          margin: 0,
        }}
      >
        Could not load impact analysis
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Per spec §2.3: when the data fetch fails, render the alert node with the very-high ring + an inline error message. Centre alert still resolves so the user knows what failed.',
      },
    },
  },
}

// ---- 12. EmptyState — alert with zero entities ----------------------
export const EmptyState: Story = {
  args: {
    alert: {
      source: 'EDPB · 2026-05-12',
      title: ['Guidelines', '04/2026'],
      severity: 'low',
      description: 'No entities currently affected by this alert.',
    },
    entities: [],
    categories: marketingCategories,
    irisAttribution: { count: 0 },
  },
  parameters: {
    docs: {
      description: {
        story:
          'When `entities` is empty, the alert still renders at the centre. The structured SR caption documents zero affected entities.',
      },
    },
  },
}
