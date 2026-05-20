import type { ImpactGraphProps } from '../types'

// EDPB Guidelines 04/2026 marketing fixture — 14 entities lifted from
// Demo D §2 verbatim. This is the canonical "regulatory intelligence"
// demonstration visual; consumers should never edit this file directly.
// Spec §4.
export const edpb_04_2026: Omit<ImpactGraphProps, 'categories'> = {
  alert: {
    source: 'EDPB · 2026-05-12',
    title: ['Guidelines', '04/2026'],
    severity: 'very-high',
    description:
      'EDPB Guidelines 04/2026 narrowed Article 35(3)(c) for public-area monitoring. ' +
      'Any DPIA whose scope includes CCTV, biometric access, or footfall analytics needs re-evaluation.',
  },
  entities: [
    // DPIA — 5 entities, very-high → medium
    { id: 'dpia-cctv-acme-lobby',  category: 'DPIA',     glyph: 'DPIA', name: 'CCTV-Acme-Lobby',  severity: 'very-high', annotation: '88 ↑34', clauseLabel: 'Art. 35(3)(c)' },
    { id: 'dpia-footfall-retail',  category: 'DPIA',     glyph: 'DPIA', name: 'Footfall-Retail',  severity: 'very-high', clauseLabel: 'Art. 35(3)(c)' },
    { id: 'dpia-biometric-access', category: 'DPIA',     glyph: 'DPIA', name: 'Biometric-Access', severity: 'high',      clauseLabel: 'Art. 35(3)(c)' },
    { id: 'dpia-visitor-logs',     category: 'DPIA',     glyph: 'DPIA', name: 'Visitor-Logs',     severity: 'high',      clauseLabel: 'Art. 35(3)(c)' },
    { id: 'dpia-lobby-cameras',    category: 'DPIA',     glyph: 'DPIA', name: 'Lobby-Cameras',    severity: 'medium',    clauseLabel: 'Art. 30' },

    // ROPA — 2 entities
    { id: 'ropa-physical-security', category: 'ROPA',    glyph: 'ROPA', name: 'Physical Security', severity: 'high',   clauseLabel: 'Art. 30' },
    { id: 'ropa-workforce-mgmt',    category: 'ROPA',    glyph: 'ROPA', name: 'Workforce-Mgmt',    severity: 'medium', clauseLabel: 'Art. 30' },

    // Vendor — 4 entities
    { id: 'vend-secucorp',    category: 'Vendor',   glyph: 'VEND', name: 'SecuCorp BV',     severity: 'high',   clauseLabel: 'Art. 28(3)(h)' },
    { id: 'vend-biometriq',   category: 'Vendor',   glyph: 'VEND', name: 'BiometriQ Ltd',   severity: 'medium', clauseLabel: 'Art. 28(3)(h)' },
    { id: 'vend-footfallai',  category: 'Vendor',   glyph: 'VEND', name: 'FootfallAI',      severity: 'medium', clauseLabel: 'Art. 28(3)(h)' },
    { id: 'vend-camerafleet', category: 'Vendor',   glyph: 'VEND', name: 'CameraFleet Co',  severity: 'low',    clauseLabel: 'Art. 47' },

    // Training — 2 entities
    { id: 'train-cctv-operator',  category: 'Training', glyph: 'CCL',  name: 'CCTV-Operator',  severity: 'medium', clauseLabel: '§5 training' },
    { id: 'train-dpo-refresher',  category: 'Training', glyph: 'CCL',  name: 'DPO-Refresher',  severity: 'low',    clauseLabel: '§5 training' },

    // Extra DPIA to round to 14 (matches Demo D §2 count)
    { id: 'dpia-meeting-rooms', category: 'DPIA', glyph: 'DPIA', name: 'Meeting-Rooms', severity: 'medium', clauseLabel: 'Art. 35(3)(c)' },
  ],
  cascades: [
    // SecuCorp BV (vendor) cascades to Footfall-Retail (DPIA) — Demo D §2 dashed line.
    { from: 'vend-secucorp', to: 'dpia-footfall-retail' },
  ],
  irisAttribution: { count: 14 },
}
