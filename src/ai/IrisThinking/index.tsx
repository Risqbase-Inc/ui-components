import { TelemetryBeacon } from '../../core/TelemetryBeacon'
import type { IrisThinkingProps } from './types'

// Concentric-arc rotation: outer 2.4s · middle 1.8s reversed · inner
// 1.4s. Under `prefers-reduced-motion: reduce`, all three arcs hold
// position and pulse opacity instead. v4.3 §5.2, closes RALIA F-011 /
// F-051.
const sizeMap = {
  sm: 24,
  md: 40,
  lg: 64,
}

export function IrisThinking({ size = 'md', label = 'Thinking', className = '' }: IrisThinkingProps) {
  const d = sizeMap[size]
  const stroke = size === 'sm' ? 2 : size === 'md' ? 3 : 4
  // Three concentric circles with stroke-dasharray to draw arcs (~75% of perimeter).
  const radii = [d / 2 - stroke, d / 2 - stroke * 2.5, d / 2 - stroke * 4]
  return (
    <>
    <TelemetryBeacon component="IrisThinking" meta={{ size }} />
    <span
      role="status"
      aria-label={label}
      className={`inline-block iris-thinking iris-thinking-${size} ${className}`}
      style={{ width: d, height: d }}
    >
      <svg viewBox={`0 0 ${d} ${d}`} width={d} height={d} className="iris-thinking-svg" aria-hidden="true">
        <circle
          cx={d / 2}
          cy={d / 2}
          r={radii[0]}
          fill="none"
          stroke="var(--color-iris-thinking-outer)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * radii[0] * 0.75} ${2 * Math.PI * radii[0]}`}
          className="iris-thinking-arc iris-thinking-arc-outer"
        />
        <circle
          cx={d / 2}
          cy={d / 2}
          r={radii[1]}
          fill="none"
          stroke="var(--color-iris-thinking-mid)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * radii[1] * 0.6} ${2 * Math.PI * radii[1]}`}
          className="iris-thinking-arc iris-thinking-arc-mid"
        />
        <circle
          cx={d / 2}
          cy={d / 2}
          r={radii[2]}
          fill="none"
          stroke="var(--color-iris-thinking-inner)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * radii[2] * 0.5} ${2 * Math.PI * radii[2]}`}
          className="iris-thinking-arc iris-thinking-arc-inner"
        />
      </svg>
    </span>
    </>
  )
}

export type { IrisThinkingProps, IrisThinkingSize } from './types'
