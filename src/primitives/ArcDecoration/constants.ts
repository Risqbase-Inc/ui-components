// Build-time constants for ArcDecoration ring geometry. Pinned per
// Spec 06 §3.1 — "marketing-site visual regressions on this artwork
// have been a touchy area (β P5 reviews); freezing the values in code
// makes Chromatic diffs unambiguous."
//
// All values grep-verified against
// `Marketing Demo B - Signature Surfaces.html` lines 195-203
// (corrected post-G4: ring 1 dasharray `130 1120` not `100 1156`;
// terminator accent dot added; opacities `1.0 / 0.7 / 0.55 / 1.0`).
//
// Each ring is a <circle> with a dasharray chosen so only a ~60° arc
// shows. Outermost (4) is the largest radius + thinnest stroke;
// innermost (1) is the terminator.

import type { ArcPalette } from './types'

export interface RingSpec {
  radius: number
  strokeWidth: number
  opacity: number
  dashArray: string
  rotation: number
}

/**
 * 4 ring fragments (outermost → innermost). Order is canonical:
 *   index 0 → ring 4 (radius 440, outermost)
 *   index 3 → ring 1 (radius 200, innermost = terminator)
 *
 * When `rings=3`, drop index 1 (the radius-360 ring).
 * When `rings=2`, drop indices 1 + 2 + the terminator dot.
 */
export const RING_SPECS: readonly RingSpec[] = [
  { radius: 440, strokeWidth: 1, opacity: 1.0,  dashArray: '260 2540', rotation: -130 }, // ring 4 — outermost
  { radius: 360, strokeWidth: 2, opacity: 0.7,  dashArray: '220 2040', rotation: -145 }, // ring 3
  { radius: 280, strokeWidth: 3, opacity: 0.55, dashArray: '170 1590', rotation: -158 }, // ring 2
  { radius: 200, strokeWidth: 4, opacity: 1.0,  dashArray: '130 1120', rotation: -170 }, // ring 1 — terminator
] as const

/**
 * Terminator accent dot — a small filled disc that sits at the leading
 * end of the innermost arc (Spec 06 §3.1 Annex). Renders whenever
 * ring 1 renders (i.e. rings=4 by default). Suppressed when rings=2 or
 * via the `hideTerminatorDot` prop.
 */
export const TERMINATOR_DOT = {
  cx: -200,
  cy: 0,
  radius: 4,
  rotation: -170, // matches the terminator ring's rotation seed
} as const

/**
 * Palette → ring CSS-variable mapping (outermost ring first).
 * Index alignment matches RING_SPECS.
 */
export const PALETTE_TOKENS: Record<ArcPalette, readonly string[]> = {
  teal: [
    'var(--color-palette-teal-600)',  // ring 4
    'var(--color-palette-teal-500)',  // ring 3
    'var(--color-palette-teal-300)',  // ring 2
    'var(--color-palette-stone-300)', // ring 1 — terminator
  ],
  'teal-on-dark': [
    'var(--color-palette-teal-300)',
    'var(--color-palette-teal-200)',
    'var(--color-palette-teal-100)',
    'rgba(255,255,255,0.4)',
  ],
  stone: [
    'var(--color-palette-stone-400)',
    'var(--color-palette-stone-300)',
    'var(--color-palette-stone-200)',
    'var(--color-palette-stone-400)',
  ],
} as const

/**
 * Terminator accent-dot fill token per palette.
 */
export const TERMINATOR_DOT_FILL: Record<ArcPalette, string> = {
  teal: 'var(--color-palette-teal-300)',
  'teal-on-dark': 'var(--color-palette-teal-100)',
  stone: 'var(--color-palette-stone-300)',
}
