export type ClientScopeState = 'workspace' | 'client' | 'white-label' | 'switching'

export interface ClientScopeBannerProps {
  state: ClientScopeState
  /** When `state === 'client'`, the active client name. */
  client?: string
  /** ISO timestamp of the most recent tenant-isolation verification. */
  isolationVerifiedAt?: string
  /** Optional handler when the user clicks "Switch". */
  onSwitch?: () => void
  /** Optional secondary action (e.g. open isolation report). */
  onDetails?: () => void
  className?: string
}
