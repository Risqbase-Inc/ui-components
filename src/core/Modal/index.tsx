import { Overlay } from './Overlay'
import type { ModalProps, DrawerProps, SheetProps } from './types'

const sizeWidth: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export function Modal({ size = 'md', ...props }: ModalProps) {
  return (
    <Overlay
      {...props}
      containerClassName="relative h-full w-full flex items-center justify-center p-4"
      surfaceClassName={`relative w-full ${sizeWidth[size]} bg-[var(--color-surface-default)] rounded-[var(--dimension-radius-card-default)] shadow-2xl p-6 outline-none`}
    />
  )
}

export function Drawer({ side = 'right', ...props }: DrawerProps) {
  const sideClass =
    side === 'right'
      ? 'right-0 top-0 h-full w-full max-w-md animate-in slide-in-from-right'
      : 'left-0 top-0 h-full w-full max-w-md animate-in slide-in-from-left'
  return (
    <Overlay
      {...props}
      containerClassName="absolute inset-0 pointer-events-none"
      surfaceClassName={`absolute ${sideClass} bg-[var(--color-surface-default)] shadow-2xl p-6 outline-none pointer-events-auto overflow-y-auto`}
    />
  )
}

export function Sheet({ ...props }: SheetProps) {
  return (
    <Overlay
      {...props}
      containerClassName="absolute inset-x-0 bottom-0"
      surfaceClassName="bg-[var(--color-surface-default)] rounded-t-[var(--dimension-radius-card-default)] shadow-2xl p-6 outline-none max-h-[85vh] overflow-y-auto"
    />
  )
}

export type { ModalProps, DrawerProps, SheetProps, ModalSize, DrawerSide, BaseOverlayProps } from './types'
