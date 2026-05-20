import {
  PALETTE_TOKENS,
  RING_SPECS,
  TERMINATOR_DOT,
  TERMINATOR_DOT_FILL,
} from './constants'
import type { ArcDecorationProps, ArcPosition } from './types'

// Pure-decoration SVG primitive. 2–4 concentric arc fragments sharing
// an off-canvas centre. Visual signature that ties the marketing site
// to the RALIA product (Spec 06 §1).
//
// A11y: aria-hidden + role="presentation"; no semantics, no tab stop.
//
// Motion: animated=true rotates the outermost ring 60s linear infinite.
// Gated on `prefers-reduced-motion: no-preference` via CSS — when
// reduced, the animation is suppressed and the static frame remains.
// This component is server-renderable (no useState, no useEffect).

// Centre-translate per position. The SVG canvas is `size × size`; we
// translate the ring-group to put the implicit centre off-canvas in the
// chosen corner. Marketing default is 'bottom-right' (Demo B).
function centreFor(position: ArcPosition, size: number): { tx: number; ty: number } {
  switch (position) {
    case 'top-left':
      return { tx: 0, ty: 0 }
    case 'top-right':
      return { tx: size, ty: 0 }
    case 'bottom-left':
      return { tx: 0, ty: size }
    case 'bottom-right':
    default:
      return { tx: size, ty: size }
  }
}

// Per-ring rotation deltas relative to the seeded outermost ring. Demo
// B uses [-130, -145, -158, -170] which equals seed + [0, -15, -28, -40]
// (steps of -15, -13, -12). When a consumer overrides rotationSeed, we
// apply the same progression.
const ROTATION_DELTAS = [0, -15, -28, -40] as const

// Ring opacity ramp baseline (outermost → innermost). Multiplied by
// baseOpacity when overridden.
const OPACITY_RAMP = [1.0, 0.7, 0.55, 1.0] as const

// G4 FU-15 (AD-1): dead `ANIMATION_STYLE` empty-object constant + its
// `style={ANIMATION_STYLE}` prop removed. The actual animation lives
// in the inline `<style>` keyframe block below; the empty constant was
// a vestigial scaffold from an earlier iteration that consumers
// (correctly) ignored.

export function ArcDecoration({
  position = 'bottom-right',
  rings = 4,
  palette = 'teal',
  size = 480,
  baseOpacity = 1,
  rotationSeed,
  animated = false,
  hideTerminatorDot = false,
  className = '',
}: ArcDecorationProps) {
  const { tx, ty } = centreFor(position, size)
  const tokens = PALETTE_TOKENS[palette]

  // Slice the rings array from the outermost down to the requested
  // count. RING_SPECS is ordered outermost-first.
  // rings=4 → indices 0..3 (all)
  // rings=3 → drop index 1 (the radius-360 mid ring) per Spec 06 §3.1
  // rings=2 → drop indices 1 + 2 (keep outermost + terminator)
  const activeRingIndices: number[] = (() => {
    if (rings === 4) return [0, 1, 2, 3]
    if (rings === 3) return [0, 2, 3]
    return [0, 3]
  })()

  // Terminator dot renders only when ring 1 (index 3) is in the active
  // set AND rings === 4 AND not explicitly hidden (Spec 06 §3.1: "When
  // rings=2 or rings=3, the accent dot is suppressed along with the
  // rings it terminates.").
  const showTerminatorDot = rings === 4 && !hideTerminatorDot

  return (
    <>
      {animated && (
        <style>{`
          @keyframes risqbase-arc-rotate {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          .risqbase-arc-ring--animated {
            transform-origin: center;
            animation: risqbase-arc-rotate 60s linear infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .risqbase-arc-ring--animated { animation: none; }
          }
        `}</style>
      )}
      <svg
        aria-hidden="true"
        role="presentation"
        focusable="false"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={className}
      >
        <g transform={`translate(${tx} ${ty})`}>
          {activeRingIndices.map((ringIdx) => {
            const spec = RING_SPECS[ringIdx]
            const stroke = tokens[ringIdx]
            const seededRotation =
              typeof rotationSeed === 'number'
                ? rotationSeed + ROTATION_DELTAS[ringIdx]
                : spec.rotation
            const opacity = OPACITY_RAMP[ringIdx] * baseOpacity
            const isOuter = ringIdx === 0
            return (
              <circle
                key={ringIdx}
                r={spec.radius}
                fill="none"
                stroke={stroke}
                strokeWidth={spec.strokeWidth}
                strokeDasharray={spec.dashArray}
                opacity={opacity}
                transform={`rotate(${seededRotation})`}
                className={animated && isOuter ? 'risqbase-arc-ring--animated' : undefined}
              />
            )
          })}
          {showTerminatorDot && (
            <circle
              cx={TERMINATOR_DOT.cx}
              cy={TERMINATOR_DOT.cy}
              r={TERMINATOR_DOT.radius}
              fill={TERMINATOR_DOT_FILL[palette]}
              transform={`rotate(${TERMINATOR_DOT.rotation})`}
            />
          )}
        </g>
      </svg>
    </>
  )
}

export type {
  ArcDecorationProps,
  ArcPalette,
  ArcPosition,
} from './types'
