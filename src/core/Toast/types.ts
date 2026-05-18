import type { ReactNode } from 'react'

export type ToastIntent = 'info' | 'success' | 'warning' | 'danger'
export type ToastQuadrant = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

export interface ToastItem {
  id: string
  intent?: ToastIntent
  title: ReactNode
  description?: ReactNode
  /** Auto-dismiss after N ms. Omit for sticky. */
  duration?: number
  action?: { label: string; onClick: () => void }
}

export interface ToastProps {
  toast: ToastItem
  onDismiss: (id: string) => void
}

export interface ToastViewportProps {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
  /** Force a placement quadrant. By default the viewport places toasts
   * opposite the focused-element quadrant (WCAG 2.4.11). */
  quadrant?: ToastQuadrant
}
