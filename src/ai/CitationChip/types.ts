import type { ReactNode } from 'react'

export type CitationVariant =
  | 'verified'
  | 'pending'
  | 'low-confidence'
  | 'retracted'
  | 'external'
  | 'multi-source'
  | 'ai-inferred'
  | 'retrieval-failed'
  | 'user-pinned'

export interface CitationChipProps {
  variant: CitationVariant
  /** Visible label, e.g. "EU AI Act Art. 6" or "[3]". */
  label: ReactNode
  /** Optional click handler — opens the source / preview. */
  onOpen?: () => void
  /** Optional accessible description; falls back to the variant. */
  'aria-label'?: string
  className?: string
}
