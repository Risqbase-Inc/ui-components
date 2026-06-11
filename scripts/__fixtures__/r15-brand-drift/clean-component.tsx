// R15 fixture — clean-component: lawful uses the rule must NOT flag.
// System-first stack with named fallbacks + a chart data label in <text>.
const MONO = 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace'

export function CleanComponent({ value }: { value: string }) {
  return (
    <svg viewBox="0 0 100 100" style={{ fontFamily: 'system-ui, "Segoe UI", Roboto, sans-serif' }}>
      <text x={50} y={50} textAnchor="middle" fontFamily={MONO}>
        {value}
      </text>
    </svg>
  )
}
