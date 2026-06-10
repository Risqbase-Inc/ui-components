// R13 negative fixture (DoD-5): every animated declaration below is
// deliberately ungated and must be flagged by the motion-gating scanner.
export function ViolatingSpinner() {
  return (
    <div className="animate-spin h-4 w-4">
      <span style={{ animation: 'pulse 2s linear infinite' }} />
      <span style={{ transition: 'transform 800ms ease-in-out' }} />
    </div>
  )
}
