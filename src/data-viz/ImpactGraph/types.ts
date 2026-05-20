import type { CitationVariant } from '../../ai/CitationChip'

// Spec: docs/specs/v2.1.0/01-ImpactGraph.md §2.1.
//
// ImpactGraph models a radial alert→affected-entity composition. The
// alert sits at centre; entities cluster in angular sectors per category;
// labelled edges (regulatory clauses) connect centre to each entity.
// Optional dashed cascade edges connect entities laterally.

export type ImpactSeverity = 'very-high' | 'high' | 'medium' | 'low'

/** Free-form category key. Consumers supply a `CategoryPalette[]` to map
 *  keys → colour + angular sector. The marketing canon uses
 *  DPIA / ROPA / Vendor / Training (see fixtures/marketing-categories). */
export type ImpactCategory = string

export interface ImpactAlert {
  /** Mono-eyebrow line above the title; e.g. "EDPB · 2026-05-12". */
  source: string
  /** Two-line node title; e.g. ["Guidelines", "04/2026"]. */
  title: [string, string]
  /** Severity ring colour around the centre node. */
  severity: ImpactSeverity
  /** Optional plain-language summary surfaced in the SR a11y label. */
  description?: string
}

export interface ImpactEntity {
  id: string
  category: ImpactCategory
  /** Two-to-four-letter glyph rendered in node body; e.g. "DPIA", "ROPA", "VEND", "CCL". */
  glyph: string
  /** Display name beneath node. */
  name: string
  /** Per-entity severity, drives edge colour + node size. */
  severity: ImpactSeverity
  /** Optional numeric annotation; e.g. "88 ↑34" rendered below name in mono. */
  annotation?: string
  /** Clause label rendered on the edge — uses CitationChip vocabulary. */
  clauseLabel: string
  /** Optional citation variant for the clause edge (default: 'verified'). */
  clauseVariant?: CitationVariant
}

export interface ImpactCascade {
  /** Source entity id. */
  from: string
  /** Target entity id. */
  to: string
  /** Optional label rendered on the cascade arc. Demo D's one cascade is unlabelled. */
  label?: string
}

export interface CategoryPalette {
  /** Category key (matches ImpactEntity.category). */
  key: ImpactCategory
  /** Token reference, e.g. "var(--color-chart-cat-1)". */
  color: string
  /** Angular sector centre, degrees clockwise from 12-o'clock. */
  sectorCentre: number
  /** Sector half-width in degrees; nodes scatter within this wedge. */
  sectorWidth: number
  /** Human label for the legend. */
  label: string
}

export interface ImpactGraphProps {
  alert: ImpactAlert
  entities: ImpactEntity[]
  cascades?: ImpactCascade[]
  categories: CategoryPalette[]
  /** "Iris analysed N entities" attribution badge; omit to suppress. */
  irisAttribution?: { count: number; verb?: string }
  /** width/height of the rendered SVG viewBox; defaults to 1100 × 460 (Demo D). */
  width?: number
  height?: number
  /** When true, suppress the chrome ring + legend (use inside a containing card). */
  bare?: boolean
  /** Click handler — fires with the entity that was clicked. Omit for static export. */
  onEntityClick?: (entity: ImpactEntity) => void
  /** Click handler for the centre alert node. */
  onAlertClick?: () => void
  className?: string
  /** Override the structured SR summary; useful for marketing-frozen renders. */
  ariaLabel?: string
  /**
   * G4 FU-5 (MIG-2): per-entity x/y position overrides keyed by entity id.
   * When present for a given id, bypasses the procedural sector-layout
   * for that entity (haloRadius / radius / clauseLabel positioning still
   * computed). Use sparingly for art-directed hero renders only; the
   * deterministic engine remains the default.
   */
  positionOverrides?: Record<string, { x: number; y: number }>
}
