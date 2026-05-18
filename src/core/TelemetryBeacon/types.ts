export interface TelemetryBeaconProps {
  /** Component name — e.g. `"IconButton"`. */
  component: string
  /** Package version. Defaults to `"2.0.0"` (current package version). */
  version?: string
  /** Optional variant — e.g. `"primary"` for Button. */
  variant?: string
  /** Additional structured metadata to include in the emission. */
  meta?: Record<string, string | number | boolean>
}
