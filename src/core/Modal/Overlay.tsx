'use client'

import { useEffect, useRef } from 'react'
import type { BaseOverlayProps } from './types'

// Shared focus-trap + Esc-to-close + scrim machinery used by Modal,
// Drawer, and Sheet. v4.3 §5.1, closes RALIA F-046.
//
// `inertBackground` toggles the `inert` attribute on `<body>` siblings
// (everything outside the overlay portal). Nested overlays should pass
// `inertBackground={false}` so the outer overlay stays interactive
// behind the inner one.

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

interface OverlayProps extends BaseOverlayProps {
  /** Surface element classes — distinguishes Modal/Drawer/Sheet visually. */
  surfaceClassName: string
  /** Container classes positioning the surface inside the scrim. */
  containerClassName: string
}

export function Overlay({
  open,
  onClose,
  title,
  'aria-label': ariaLabel,
  children,
  inertBackground = true,
  dismissOnBackdrop = true,
  dismissOnEsc = true,
  surfaceClassName,
  containerClassName,
  className = '',
}: OverlayProps) {
  const surfaceRef = useRef<HTMLDivElement | null>(null)
  const lastFocusedRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    lastFocusedRef.current = document.activeElement as HTMLElement | null

    // Focus the first focusable inside the surface, falling back to the surface itself.
    const surface = surfaceRef.current
    const first = surface?.querySelector<HTMLElement>(FOCUSABLE)
    ;(first ?? surface)?.focus()

    if (inertBackground) {
      const siblings = Array.from(document.body.children).filter((el) => el !== surface?.parentElement) as HTMLElement[]
      siblings.forEach((el) => el.setAttribute('inert', ''))
      return () => {
        siblings.forEach((el) => el.removeAttribute('inert'))
        lastFocusedRef.current?.focus?.()
      }
    }
    return () => {
      lastFocusedRef.current?.focus?.()
    }
  }, [open, inertBackground])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && dismissOnEsc) {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const surface = surfaceRef.current
      if (!surface) return
      const focusables = Array.from(surface.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (focusables.length === 0) {
        e.preventDefault()
        return
      }
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (e.shiftKey && active === first) {
        last.focus()
        e.preventDefault()
      } else if (!e.shiftKey && active === last) {
        first.focus()
        e.preventDefault()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose, dismissOnEsc])

  if (!open) return null

  return (
    <div className={`fixed inset-0 z-50 ${className}`}>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[color:rgb(0_0_0_/_0.5)]"
        onClick={dismissOnBackdrop ? onClose : undefined}
      />
      <div className={containerClassName}>
        <div
          ref={surfaceRef}
          role="dialog"
          aria-modal="true"
          aria-label={title ? undefined : ariaLabel}
          aria-labelledby={title ? 'overlay-title' : undefined}
          tabIndex={-1}
          className={surfaceClassName}
        >
          {title && (
            <h2 id="overlay-title" className="text-lg font-semibold text-[var(--color-text-default)] mb-4">
              {title}
            </h2>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}
