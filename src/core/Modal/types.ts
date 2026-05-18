import type { ReactNode } from 'react'

export interface BaseOverlayProps {
  open: boolean
  onClose: () => void
  /** Accessible name for the dialog. Either `title` or `aria-label` is required. */
  title?: ReactNode
  'aria-label'?: string
  children: ReactNode
  /** Body `inert` while open — disable for nested overlays. Default true. */
  inertBackground?: boolean
  /** Close on backdrop click. Default true. */
  dismissOnBackdrop?: boolean
  /** Close on Esc. Default true. */
  dismissOnEsc?: boolean
  className?: string
}

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

export interface ModalProps extends BaseOverlayProps {
  size?: ModalSize
}

export type DrawerSide = 'left' | 'right'

export interface DrawerProps extends BaseOverlayProps {
  side?: DrawerSide
}

export type SheetProps = BaseOverlayProps
