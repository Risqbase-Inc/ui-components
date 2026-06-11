// R15 fixture — deliberately violating component. Never imported; exists so
// scripts/test-scanner-rules.mjs can prove the rule FAILS before trusting it.
export function BadBrand() {
  return (
    <a href="/" style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <svg viewBox="0 0 160 160" aria-hidden="true">
        <text x="80" y="120" textAnchor="middle" fontSize="120">
          r|ↄ
        </text>
      </svg>
    </a>
  )
}
