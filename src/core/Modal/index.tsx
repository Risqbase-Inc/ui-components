'use client'

import * as Dialog from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'
import { TelemetryBeacon } from '../TelemetryBeacon'
import type {
  ModalProps,
  DrawerProps,
  SheetProps,
  BaseOverlayProps,
  ModalSize,
  DrawerSide,
} from './types'

// v4.3 §5.1, closes RALIA F-046.
//
// Backed by `@radix-ui/react-dialog` — Radix handles focus trap, focus
// restoration, scroll-locking, ARIA wiring, and `inert` for siblings.
// We keep our own `Modal` / `Drawer` / `Sheet` API surface as the public
// contract; the Radix dependency is implementation detail (one peer
// upgrade and we still expose `open` / `onClose` / `title`).

const sizeWidth: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

interface OverlayShellProps extends BaseOverlayProps {
  /** Telemetry component name. */
  beaconName: string
  /** Surface element classes — distinguishes Modal/Drawer/Sheet visually. */
  surfaceClassName: string
  /** Wrapping content-element classes (positioning the surface inside the viewport). */
  contentPositionClassName: string
}

function OverlayShell({
  open,
  onClose,
  title,
  'aria-label': ariaLabel,
  children,
  dismissOnBackdrop = true,
  dismissOnEsc = true,
  className = '',
  beaconName,
  surfaceClassName,
  contentPositionClassName,
}: OverlayShellProps & { children: ReactNode }) {
  return (
    <>
      {open && <TelemetryBeacon component={beaconName} />}
      <Dialog.Root
        open={open}
        onOpenChange={(next) => {
          if (!next) onClose()
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay
            className={`fixed inset-0 z-50 bg-[color:rgb(0_0_0_/_0.5)] ${className}`}
            onClick={dismissOnBackdrop ? undefined : (e) => e.preventDefault()}
          />
          <Dialog.Content
            className={`fixed z-50 ${contentPositionClassName} ${surfaceClassName}`}
            onEscapeKeyDown={(e) => {
              if (!dismissOnEsc) e.preventDefault()
            }}
            onPointerDownOutside={(e) => {
              if (!dismissOnBackdrop) e.preventDefault()
            }}
            aria-label={title ? undefined : ariaLabel}
          >
            {title ? (
              <Dialog.Title className="text-lg font-semibold text-[var(--color-text-default)] mb-4">
                {title}
              </Dialog.Title>
            ) : (
              <Dialog.Title className="sr-only">{ariaLabel}</Dialog.Title>
            )}
            {children}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}

export function Modal({ size = 'md', ...props }: ModalProps) {
  return (
    <OverlayShell
      {...props}
      beaconName="Modal"
      contentPositionClassName="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)]"
      surfaceClassName={`${sizeWidth[size]} bg-[var(--color-surface-default)] rounded-[var(--dimension-radius-card-default)] shadow-2xl p-6 outline-none`}
    >
      {props.children}
    </OverlayShell>
  )
}

const drawerSideClass: Record<DrawerSide, string> = {
  right: 'top-0 right-0 h-full',
  left: 'top-0 left-0 h-full',
}

export function Drawer({ side = 'right', ...props }: DrawerProps) {
  return (
    <OverlayShell
      {...props}
      beaconName="Drawer"
      contentPositionClassName={`${drawerSideClass[side]}`}
      surfaceClassName="w-full max-w-md bg-[var(--color-surface-default)] shadow-2xl p-6 outline-none overflow-y-auto"
    >
      {props.children}
    </OverlayShell>
  )
}

export function Sheet({ ...props }: SheetProps) {
  return (
    <OverlayShell
      {...props}
      beaconName="Sheet"
      contentPositionClassName="bottom-0 inset-x-0"
      surfaceClassName="bg-[var(--color-surface-default)] rounded-t-[var(--dimension-radius-card-default)] shadow-2xl p-6 outline-none max-h-[85vh] overflow-y-auto"
    >
      {props.children}
    </OverlayShell>
  )
}

export type { ModalProps, DrawerProps, SheetProps, ModalSize, DrawerSide, BaseOverlayProps } from './types'
