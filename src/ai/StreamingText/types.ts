import type { ReactNode } from 'react'

export interface StreamingTextProps {
  /** Token sequence (strings or React nodes). The component reveals them one at a time. */
  tokens: ReactNode[]
  /** Tokens per second. v4.3 default: 35. */
  cadence?: number
  /** Show the blinking streamhead cursor while streaming. Default true. */
  showCursor?: boolean
  /** Called when the last token has been revealed. */
  onComplete?: () => void
  className?: string
}
