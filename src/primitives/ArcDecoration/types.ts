export type ArcPosition =
  | 'bottom-right' // centre at (100% + 0px, 100% + 0px) from the parent box
  | 'top-right'    // centre at (100%, 0)
  | 'top-left'     // centre at (0, 0)
  | 'bottom-left'  // centre at (0, 100%)

export type ArcPalette = 'teal' | 'teal-on-dark' | 'stone'

export interface ArcDecorationProps {
  /** Off-canvas anchor of the implicit centre — defaults 'bottom-right' (Demo B canonical). */
  position?: ArcPosition
  /** Number of ring fragments — defaults 4 (per v4.3 §20 + BRIEF-429 V2 M-08). When 4, the terminator accent dot also renders. */
  rings?: 2 | 3 | 4
  /** Palette — 'teal' on light substrates, 'teal-on-dark' for inverse substrates, 'stone' for muted decorative use. */
  palette?: ArcPalette
  /** SVG canvas size in px; defaults 480. */
  size?: number
  /** Override opacity for the outermost ring; the rest of the ramp scales proportionally. Default 1.0. */
  baseOpacity?: number
  /** Optional rotation seed (degrees) for the outermost ring; subsequent rings shift by Demo B's progression (-15°, -13°, -12°). */
  rotationSeed?: number
  /** When true, render in motion (slow 60s ease rotation) — reserved for IrisThinking, not used in v2.1.0 marketing. */
  animated?: boolean
  /** When true, suppress the terminator accent dot even at rings=4. Default false. */
  hideTerminatorDot?: boolean
  className?: string
}
