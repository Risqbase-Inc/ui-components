'use client'

import { useEffect, useState } from 'react'
import type { ToastProps, ToastViewportProps, ToastIntent, ToastQuadrant } from './types'

// Focus-aware positioner — the viewport places toasts in the quadrant
// *opposite* the currently focused element, avoiding covering keyboard
// focus (WCAG 2.4.11 Focus Not Obscured). v4.3 §5.1, closes RALIA F-054.

const intentSurface: Record<ToastIntent, { border: string; icon: string }> = {
  info:    { border: 'border-l-[var(--color-callout-info-border)]',    icon: 'text-[var(--color-callout-info-icon)]' },
  success: { border: 'border-l-[var(--color-callout-success-border)]', icon: 'text-[var(--color-callout-success-icon)]' },
  warning: { border: 'border-l-[var(--color-callout-warning-border)]', icon: 'text-[var(--color-callout-warning-icon)]' },
  danger:  { border: 'border-l-[var(--color-callout-danger-border)]',  icon: 'text-[var(--color-callout-danger-icon)]' },
}

const ariaRoleFor: Record<ToastIntent, 'status' | 'alert'> = {
  info: 'status',
  success: 'status',
  warning: 'alert',
  danger: 'alert',
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const intent = toast.intent ?? 'info'
  const style = intentSurface[intent]

  useEffect(() => {
    if (!toast.duration) return
    const t = setTimeout(() => onDismiss(toast.id), toast.duration)
    return () => clearTimeout(t)
  }, [toast.id, toast.duration, onDismiss])

  return (
    <div
      role={ariaRoleFor[intent]}
      aria-live={ariaRoleFor[intent] === 'alert' ? 'assertive' : 'polite'}
      className={`flex gap-3 min-w-[280px] max-w-md bg-[var(--color-surface-default)] border border-[var(--color-border-default)] border-l-4 ${style.border} rounded-[var(--dimension-radius-md)] shadow-lg p-4`}
    >
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-[var(--color-text-default)]">{toast.title}</div>
        {toast.description && <div className="text-sm text-[var(--color-text-subtle)] mt-1">{toast.description}</div>}
        {toast.action && (
          <button
            type="button"
            onClick={toast.action.onClick}
            className="mt-2 text-sm font-semibold text-[var(--color-action-primary)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] rounded-[var(--dimension-radius-sm)]"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 w-6 h-6 inline-flex items-center justify-center text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)] rounded-[var(--dimension-radius-sm)] focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)]"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}

const quadrantClasses: Record<ToastQuadrant, string> = {
  'top-left':     'top-4 left-4 items-start',
  'top-right':    'top-4 right-4 items-end',
  'bottom-left':  'bottom-4 left-4 items-start',
  'bottom-right': 'bottom-4 right-4 items-end',
}

function oppositeQuadrant(q: ToastQuadrant): ToastQuadrant {
  switch (q) {
    case 'top-left':     return 'bottom-right'
    case 'top-right':    return 'bottom-left'
    case 'bottom-left':  return 'top-right'
    case 'bottom-right': return 'top-left'
  }
}

function quadrantOfElement(el: Element | null): ToastQuadrant {
  if (!el || typeof window === 'undefined') return 'bottom-right'
  const r = el.getBoundingClientRect()
  const cx = r.left + r.width / 2
  const cy = r.top + r.height / 2
  const right = cx > window.innerWidth / 2
  const bottom = cy > window.innerHeight / 2
  if (right && bottom) return 'bottom-right'
  if (right && !bottom) return 'top-right'
  if (!right && bottom) return 'bottom-left'
  return 'top-left'
}

export function ToastViewport({ toasts, onDismiss, quadrant }: ToastViewportProps) {
  const [focusQuad, setFocusQuad] = useState<ToastQuadrant>('top-left')

  useEffect(() => {
    function onFocus() {
      setFocusQuad(quadrantOfElement(document.activeElement))
    }
    window.addEventListener('focusin', onFocus)
    onFocus()
    return () => window.removeEventListener('focusin', onFocus)
  }, [])

  const placement = quadrant ?? oppositeQuadrant(focusQuad)

  return (
    <div
      aria-label="Notifications"
      className={`fixed z-40 flex flex-col gap-2 pointer-events-none ${quadrantClasses[placement]}`}
    >
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <Toast toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  )
}

export type { ToastProps, ToastViewportProps, ToastItem, ToastIntent, ToastQuadrant } from './types'
