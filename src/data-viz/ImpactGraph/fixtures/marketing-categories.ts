import type { CategoryPalette } from '../types'

// Canonical category palette consumed by MarketingImpactGraph. Locked
// to the four marketing-canon categories (DPIA / ROPA / Vendor /
// Training) so the marketing fixture cannot drift from Demo D. Spec
// §3 + §4.
export const marketingCategories: CategoryPalette[] = [
  { key: 'DPIA',     color: 'var(--color-chart-cat-1)', sectorCentre: 0,   sectorWidth: 120, label: 'DPIA' },
  { key: 'ROPA',     color: 'var(--color-chart-cat-4)', sectorCentre: 90,  sectorWidth: 70,  label: 'ROPA' },
  { key: 'Vendor',   color: 'var(--color-chart-cat-3)', sectorCentre: 180, sectorWidth: 100, label: 'Vendor' },
  { key: 'Training', color: 'var(--color-chart-cat-6)', sectorCentre: 270, sectorWidth: 70,  label: 'Training' },
]
