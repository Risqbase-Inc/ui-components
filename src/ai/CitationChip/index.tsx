import type { ReactElement, ReactNode } from 'react'
import { TelemetryBeacon } from '../../core/TelemetryBeacon'
import type { CitationChipProps, CitationVariant } from './types'

// Nine variants resolve through the `citation.*` token chain (v4.3 §4.2).
// The variant changes the surface tint, the border treatment, and the
// glyph — but the *footprint* is constant so chips line-wrap predictably
// in flowing prose. v4.3 §5.2, closes RALIA F-012 / F-025.
//
// v2.1.0 (Spec 05 Actions B + C):
//  - Action B: aria-label combines variant description + visible label
//    so SR users hear "Verified source: Art. 35(3)(c)" not just
//    "Verified source". The sr-only suffix span was removed because its
//    content is now in the aria-label (avoids double-announcement).
//  - Action C (WCAG 2.5.8 Target Size — Minimum): the interactive chip
//    bumps to py-1 (~26px tall) to clear the 24×24 minimum. Static
//    (non-clickable) chips keep py-0.5 (~22px) for in-line typographic
//    rhythm — they are not interactive controls and 2.5.8 does not
//    apply. Gated on `typeof onOpen === 'function'`.

const variantDescription: Record<CitationVariant, string> = {
  verified:         'Verified source',
  pending:          'Verification pending',
  'low-confidence': 'Low-confidence source',
  retracted:        'Retracted source',
  external:         'External source',
  'multi-source':   'Multiple sources',
  'ai-inferred':    'AI-inferred (no citation)',
  'retrieval-failed': 'Retrieval failed',
  'user-pinned':    'Pinned by user',
}

const variantStyles: Record<CitationVariant, string> = {
  verified:
    'bg-[var(--color-citation-chip-surface)] text-[var(--color-citation-chip-text)] border-[var(--color-citation-chip-border)]',
  pending:
    'bg-[var(--color-citation-chip-surface)] text-[var(--color-citation-chip-text)] border-[var(--color-citation-chip-border)] border-dashed',
  'low-confidence':
    'bg-[var(--color-citation-chip-surface-low-conf)] text-[var(--color-citation-chip-text)] border-[var(--color-citation-chip-border)] border-dashed',
  retracted:
    'bg-[var(--color-citation-chip-surface)] text-[var(--color-citation-chip-text-retracted)] border-[var(--color-citation-chip-border-retracted)] line-through',
  external:
    'bg-[var(--color-citation-chip-surface)] text-[var(--color-citation-chip-text)] border-[var(--color-citation-chip-border)]',
  'multi-source':
    'bg-[var(--color-citation-chip-surface)] text-[var(--color-citation-chip-text)] border-[var(--color-citation-chip-border)]',
  'ai-inferred':
    'bg-[var(--color-iris-accent-subtle)] text-[var(--color-citation-chip-text)] border-[var(--color-iris-accent)] border-dashed',
  'retrieval-failed':
    'bg-[var(--color-citation-chip-surface-low-conf)] text-[var(--color-citation-chip-text-retracted)] border-[var(--color-citation-chip-border)] border-dashed',
  'user-pinned':
    'bg-[var(--color-citation-chip-surface)] text-[var(--color-citation-chip-text)] border-[var(--color-iris-accent)]',
}

// G1-NIT-8 (CEO 2026-05-20): React 19 hygiene — `JSX.Element` global is
// deprecated; prefer `ReactElement` imported from 'react'.
const variantGlyph: Record<CitationVariant, ReactElement | null> = {
  verified: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3"><polyline points="20 6 9 17 4 12" /></svg>
  ),
  pending: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
  ),
  'low-confidence': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
  ),
  retracted: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /></svg>
  ),
  external: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
  ),
  'multi-source': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
  ),
  'ai-inferred': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z" /></svg>
  ),
  'retrieval-failed': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
  ),
  'user-pinned': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3"><line x1="12" y1="17" x2="12" y2="22" /><path d="M5 17h14V9c0-3.87-3.13-7-7-7s-7 3.13-7 7v8z" /></svg>
  ),
}

// Action C (WCAG 2.5.8): interactive variant ≥ 24×24 CSS px. Padding
// classes pinned as named constants so future spec authoring + Sarah
// G5's a11y regression sweep have a single grep target.
const INTERACTIVE_PADDING = 'py-1' // ~26px tall — meets WCAG 2.5.8 Target Size — Minimum
const STATIC_PADDING = 'py-0.5' // ~22px tall — typographic in-line rhythm; not a control

/**
 * Compose the SR-only accessible name from the variant description and
 * the visible label content. v2.1.0 Action B: lead with the variant
 * framing ("Verified source") then the citation content. Multi-source
 * appends the `, N sources` suffix.
 *
 * If `label` is a non-string ReactNode (e.g. JSX), it is omitted from
 * the announcement and only the variant description is read — the
 * consumer should pass an explicit `aria-label` override in that case.
 */
function buildAccessibleName(
  variant: CitationVariant,
  label: ReactNode,
  sourceCount: number | undefined,
): string {
  const description = variantDescription[variant]
  const labelText = typeof label === 'string' ? label : ''
  const base = labelText ? `${description}: ${labelText}` : description
  if (variant === 'multi-source' && typeof sourceCount === 'number' && sourceCount > 0) {
    return `${base}, ${sourceCount} sources`
  }
  return base
}

export function CitationChip({
  variant,
  label,
  sourceCount,
  onOpen,
  'aria-label': ariaLabel,
  className = '',
}: CitationChipProps) {
  const isInteractive = typeof onOpen === 'function'
  const padding = isInteractive ? INTERACTIVE_PADDING : STATIC_PADDING
  const base = `inline-flex items-center gap-1 px-2 ${padding} text-xs font-medium rounded-[var(--dimension-radius-sm)] border align-middle transition-colors`
  const interactive = isInteractive
    ? `hover:bg-[var(--color-citation-chip-hover)] active:bg-[var(--color-citation-chip-active)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]`
    : ''
  const styles = `${base} ${variantStyles[variant]} ${interactive} ${className}`
  const accessibleName = ariaLabel ?? buildAccessibleName(variant, label, sourceCount)

  // v2.1.0 Action B: visible body is glyph + label only. The variant
  // description is in the aria-label; an sr-only suffix would
  // double-announce. The multi-source count pill is rendered
  // aria-hidden because the count is already in the aria-label.
  const content = (
    <>
      <span aria-hidden="true" className="text-[var(--color-citation-chip-icon)]">
        {variantGlyph[variant]}
      </span>
      <span>{label}</span>
      {variant === 'multi-source' && typeof sourceCount === 'number' && sourceCount > 0 && (
        <span
          aria-hidden="true"
          className="bg-[var(--color-surface-muted)] rounded-sm px-1 text-[10px] font-mono text-[var(--color-text-default)]"
        >
          {sourceCount}
        </span>
      )}
    </>
  )

  const beacon = (
    <TelemetryBeacon component="CitationChip" variant={variant} meta={{ interactive: isInteractive }} />
  )

  if (isInteractive) {
    return (
      <>
        {beacon}
        <button type="button" onClick={onOpen} aria-label={accessibleName} className={styles}>
          {content}
        </button>
      </>
    )
  }
  return (
    <>
      {beacon}
      {/*
        G4 FU-10 (CC-1): `role="note"` removed from the non-interactive
        variant. `note` is an ARIA 1.2 landmark; a single page of prose
        with 20+ inline chips would pollute the landmark list in NVDA /
        JAWS landmark-jump navigation. The chip is still announced by
        AT — `aria-label` gives it an accessible name on the bare span —
        but it no longer registers as a landmark.
      */}
      <span aria-label={accessibleName} className={styles}>
        {content}
      </span>
    </>
  )
}

export type { CitationChipProps, CitationVariant } from './types'
