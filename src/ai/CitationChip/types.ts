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
  /** Visible label, e.g. "EU AI Act Art. 6" or "[3]". When passed as a
   *  string the value is also folded into the chip's accessible name
   *  ("Verified source: EU AI Act Art. 6"). When passed as a non-string
   *  ReactNode (e.g. JSX), the consumer should also pass an explicit
   *  `aria-label` so the chip remains self-describing to SR users. */
  label: ReactNode
  /** For variant='multi-source': how many sources back the citation.
   *  Renders as a small count pill and is appended to the accessible
   *  name ("Multiple sources: Art. 30, 3 sources"). */
  sourceCount?: number
  /** Optional click handler — opens the source / preview. Presence of
   *  this prop is what makes the chip interactive; interactive chips
   *  render as a `<button>` and use the larger `py-1` padding (WCAG
   *  2.5.8). */
  onOpen?: () => void
  /** Optional accessible description override. When unset, the chip
   *  computes its own from `variantDescription[variant] + ': ' + label`
   *  (v2.1.0 Spec 05 Action B). */
  'aria-label'?: string
  className?: string
}
