import type {
  CategoryPalette,
  ImpactEntity,
  ImpactGraphProps,
  ImpactSeverity,
} from './types'

// Pure layout engine — separated from the component so it can be unit-
// tested in isolation and reused by the static MarketingImpactGraph
// fixture generator without React in the loop. Spec §2.2.

/** Severity → node radius (px in viewBox units). Spec §2.2. */
export const SEVERITY_RADIUS: Record<ImpactSeverity, number> = {
  'very-high': 24,
  high: 18,
  medium: 14,
  low: 11,
}

/** Severity → edge stroke width (px). Spec §2.2. */
export const SEVERITY_STROKE: Record<ImpactSeverity, number> = {
  'very-high': 2.5,
  high: 2,
  medium: 1.5,
  low: 1.5,
}

/** Edge stroke colours — `-border` chain per Spec §2.2 REFINE 1.2. */
export const SEVERITY_EDGE_STROKE: Record<ImpactSeverity, string> = {
  'very-high': 'var(--color-band-very-high-border)',
  high: 'var(--color-band-high-border)',
  medium: 'var(--color-band-medium-border)',
  low: 'var(--color-band-low-border)',
}

/** Centre alert ring fill — `-bg` chain (halo fill, not edge stroke). */
export const SEVERITY_RING_FILL: Record<ImpactSeverity, string> = {
  'very-high': 'var(--color-band-very-high-bg)',
  high: 'var(--color-band-high-bg)',
  medium: 'var(--color-band-medium-bg)',
  low: 'var(--color-band-low-bg)',
}

/** Severity ordering for in-sector sorting (highest first, per a11y spec
 *  §2.2 "within a sector, entities ordered by severity descending"). */
const SEVERITY_ORDER: Record<ImpactSeverity, number> = {
  'very-high': 0,
  high: 1,
  medium: 2,
  low: 3,
}

/** Deterministic 32-bit hash over a string. Used to derive stable
 *  perturbations (edge curve, radial jitter) from entity.id so the
 *  layout is stable across renders. Spec §2.2 Q2. */
export function stableHash(s: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return h >>> 0
}

/** Map a hash to a value in [-1, 1) — used for deterministic jitter. */
export function hashToUnit(s: string): number {
  return (stableHash(s) / 0xffffffff) * 2 - 1
}

/** Convert degrees-clockwise-from-12-o'clock to radians-from-positive-x.
 *  SVG y grows downward, so 90° clockwise from 12 o'clock is +x in SVG
 *  space and we offset by -90° (subtract π/2). */
export function degToRad(deg: number): number {
  return (deg - 90) * (Math.PI / 180)
}

/** Centre coordinate of the alert node for a given viewBox. The radius
 *  scales proportionally with the viewBox width (spec §2.2: "default
 *  radius 68px at 1100×460; scales proportionally with width"). */
export function getCentre(width: number, height: number): { cx: number; cy: number } {
  return { cx: width / 2, cy: height / 2 }
}

export function getCentreRadius(width: number): number {
  return Math.round((width / 1100) * 68)
}

/** Resolved per-entity layout. The component renders directly from this. */
export interface EntityLayout {
  entity: ImpactEntity
  category: CategoryPalette
  /** SVG x in viewBox units. */
  x: number
  /** SVG y in viewBox units. */
  y: number
  /** Node body radius (px). */
  radius: number
  /** Halo radius (px). */
  haloRadius: number
  /** Sector index — for arrow-key navigation grouping. */
  sectorIndex: number
  /** In-sector ordinal — for arrow-key navigation. */
  withinSectorIndex: number
  /** Quadratic bezier control point for the clause edge. */
  edgeControl: { x: number; y: number }
  /** Mid-edge point — used to anchor the clause label. */
  edgeMid: { x: number; y: number }
  /** Edge perturbation sign (+1 / -1) — for label-collision avoidance to
   *  know which way to shift if labels overlap. */
  perturbDirection: 1 | -1
}

/** Group entities by category, then sort within category by severity
 *  descending. */
function bucketEntities(
  entities: ImpactEntity[],
  categories: CategoryPalette[]
): Map<string, ImpactEntity[]> {
  const buckets = new Map<string, ImpactEntity[]>()
  for (const cat of categories) buckets.set(cat.key, [])
  for (const e of entities) {
    const bucket = buckets.get(e.category)
    if (bucket) {
      bucket.push(e)
    } else {
      // REFINE 1.1: dev throws; prod renders with default colour. The
      // throw happens during component render so React error boundaries
      // can catch it. Here we just route to an _unknown bucket and let
      // the component decide.
      const unknown = buckets.get('__unknown__') ?? []
      unknown.push(e)
      buckets.set('__unknown__', unknown)
    }
  }
  for (const list of buckets.values()) {
    list.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])
  }
  return buckets
}

/** Compute layout for every entity. Pure; idempotent given inputs.
 *  G4 FU-5 (MIG-2): optional `positionOverrides` map bypasses procedural
 *  placement for entities whose id is present — used for art-directed
 *  hero fixtures where exact pixel placement matters. Radius / halo /
 *  edge derivations still compute from the (now-fixed) x,y. */
export function layoutEntities(
  props: Pick<ImpactGraphProps, 'entities' | 'categories'> & {
    width: number
    height: number
    positionOverrides?: Record<string, { x: number; y: number }>
  }
): EntityLayout[] {
  const { entities, categories, width, height, positionOverrides } = props
  const { cx, cy } = getCentre(width, height)
  const centreR = getCentreRadius(width)
  const baseRadial = centreR * 1.6 // default radial distance per spec §2.2
  const maxRadial = Math.min(width, height) / 2 - 40 // keep nodes inside frame

  const buckets = bucketEntities(entities, categories)
  const layouts: EntityLayout[] = []

  categories.forEach((cat, sectorIndex) => {
    const list = buckets.get(cat.key) ?? []
    if (list.length === 0) return
    const halfWidth = cat.sectorWidth / 2
    // Even one-entity sectors land at the sector centre; multi-entity
    // sectors distribute uniformly across the sector wedge.
    list.forEach((entity, i) => {
      const t = list.length === 1 ? 0.5 : i / (list.length - 1)
      const angleDeg = cat.sectorCentre - halfWidth + t * cat.sectorWidth
      // Stable per-entity radial jitter — pushes some nodes out and some
      // in so the layout doesn't look like a perfect ring. Magnitude is
      // 30% of baseRadial, derived from entity.id hash.
      const radialJitter = hashToUnit(entity.id) * baseRadial * 0.3
      const r = Math.min(maxRadial, baseRadial + Math.abs(radialJitter) + i * 6)
      const rad = degToRad(angleDeg)
      const proceduralX = cx + r * Math.cos(rad)
      const proceduralY = cy + r * Math.sin(rad)
      // G4 FU-5 (MIG-2): per-entity position override escape hatch.
      const override = positionOverrides?.[entity.id]
      const x = override ? override.x : proceduralX
      const y = override ? override.y : proceduralY

      // Quadratic bezier control point: at half-distance along the
      // radial line, perpendicular-perturbed by ±8px. The perturbation
      // direction comes from the hash so adjacent entities in the same
      // sector tend to alternate.
      const midX = (cx + x) / 2
      const midY = (cy + y) / 2
      const perturbDirection: 1 | -1 = stableHash(entity.id) % 2 === 0 ? 1 : -1
      // Perpendicular vector to the (cx,cy)→(x,y) radial:
      const dx = x - cx
      const dy = y - cy
      const len = Math.sqrt(dx * dx + dy * dy) || 1
      const perpX = -dy / len
      const perpY = dx / len
      const perturbAmt = 8
      const edgeControl = {
        x: midX + perpX * perturbAmt * perturbDirection,
        y: midY + perpY * perturbAmt * perturbDirection,
      }

      // Mid-point on a quadratic bezier B(0.5) = 0.25*P0 + 0.5*P1 + 0.25*P2.
      const edgeMid = {
        x: 0.25 * cx + 0.5 * edgeControl.x + 0.25 * x,
        y: 0.25 * cy + 0.5 * edgeControl.y + 0.25 * y,
      }

      const baseRadius = SEVERITY_RADIUS[entity.severity]
      layouts.push({
        entity,
        category: cat,
        x,
        y,
        radius: baseRadius,
        haloRadius: baseRadius * 1.6,
        sectorIndex,
        withinSectorIndex: i,
        edgeControl,
        edgeMid,
        perturbDirection,
      })
    })
  })

  return layouts
}

/** Adjust clause-label positions to reduce overlap within a sector.
 *  Strategy: bucket layouts by sectorIndex; for each pair whose
 *  midpoints are within 40×16px, shift the *longer* label 12px along
 *  the edge toward the entity end. Returns label anchor positions, not
 *  the layout itself (so layout stays pure). Spec §2.2. */
export function computeLabelPositions(
  layouts: EntityLayout[],
  centre: { cx: number; cy: number }
): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>()
  for (const l of layouts) {
    positions.set(l.entity.id, { ...l.edgeMid })
  }

  // Group by sector for collision check.
  const bySector = new Map<number, EntityLayout[]>()
  for (const l of layouts) {
    const list = bySector.get(l.sectorIndex) ?? []
    list.push(l)
    bySector.set(l.sectorIndex, list)
  }

  for (const list of bySector.values()) {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i]
        const b = list[j]
        const pa = positions.get(a.entity.id)!
        const pb = positions.get(b.entity.id)!
        const dx = pa.x - pb.x
        const dy = pa.y - pb.y
        if (Math.abs(dx) < 40 && Math.abs(dy) < 16) {
          // Longer clause label loses the midpoint; shift it 12px along
          // its edge toward the entity end (entity dir = entity - centre).
          const loser = a.entity.clauseLabel.length >= b.entity.clauseLabel.length ? a : b
          const lp = positions.get(loser.entity.id)!
          const ex = loser.x - centre.cx
          const ey = loser.y - centre.cy
          const elen = Math.sqrt(ex * ex + ey * ey) || 1
          positions.set(loser.entity.id, {
            x: lp.x + (ex / elen) * 12,
            y: lp.y + (ey / elen) * 12,
          })
        }
      }
    }
  }

  return positions
}

/** Build the structured SR summary string for the figure caption.
 *  Spec §2.5 + accessibility §1.1: "{alert.title}: {N} affected
 *  entities — {category counts}." */
export function buildAriaLabel(
  alert: ImpactGraphProps['alert'],
  entities: ImpactEntity[],
  categories: CategoryPalette[],
  cascades: ImpactGraphProps['cascades']
): string {
  const titleJoined = alert.title.join(' ')
  const counts: string[] = []
  for (const cat of categories) {
    const n = entities.filter((e) => e.category === cat.key).length
    if (n > 0) counts.push(`${n} ${cat.label}${n === 1 ? '' : 's'}`)
  }
  const cascadeSuffix =
    cascades && cascades.length > 0
      ? `. ${cascades.length} cascade${cascades.length === 1 ? '' : 's'}.`
      : '.'
  return (
    `Impact graph showing ${titleJoined}: ${entities.length} affected entit${entities.length === 1 ? 'y' : 'ies'} ` +
    `— ${counts.join(', ')}${cascadeSuffix}`
  )
}
