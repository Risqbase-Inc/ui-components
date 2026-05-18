// Core — universally applicable UI primitives (spec §3, v4.3 §5.1).
// Each component lives in its own subfolder with co-located types,
// accessibility.md, and tokens.md.

// v4.2.1 set
export { Button, PrimaryButton, SecondaryButton, GhostButton } from './Button'
export {
  Badge,
  BandBadge,
  MostPopularBadge,
  StandaloneProductBadge,
  NewBadge,
  ComingSoonBadge,
} from './Badge'
export { Header } from './Header'
export { Footer } from './Footer'
export { SectionEyebrow } from './SectionEyebrow'

// v4.3 additions
export { IconButton } from './IconButton'
export { SkipLink } from './SkipLink'
export { Card } from './Card'
export { Callout } from './Callout'
export { Skeleton } from './Skeleton'
export { EmptyState } from './EmptyState'
export { WizardProgress } from './WizardProgress'
export { Modal, Drawer, Sheet } from './Modal'
export { Toast, ToastViewport } from './Toast'

// Theming primitives
export { setTheme, getTheme, clearTheme, themeInitScript, THEME_STORAGE_KEY } from './theme'

// Types
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button/types'
export type { BadgeProps, BadgeVariant, BadgeBand, BandBadgeProps } from './Badge/types'
export type { HeaderProps, SiteVariant } from './Header/types'
export type { FooterProps } from './Footer/types'
export type { SectionEyebrowProps } from './SectionEyebrow/types'
export type { IconButtonProps, IconButtonVariant, IconButtonSize } from './IconButton/types'
export type { SkipLinkProps } from './SkipLink/types'
export type { CardProps, CardVariant, CardPadding } from './Card/types'
export type { CalloutProps, CalloutIntent } from './Callout/types'
export type { SkeletonProps, SkeletonVariant } from './Skeleton/types'
export type { EmptyStateProps, EmptyStateVariant } from './EmptyState/types'
export type { WizardProgressProps, WizardProgressStyle, WizardStep } from './WizardProgress/types'
export type {
  ModalProps,
  DrawerProps,
  SheetProps,
  ModalSize,
  DrawerSide,
  BaseOverlayProps,
} from './Modal/types'
export type { ToastProps, ToastViewportProps, ToastItem, ToastIntent, ToastQuadrant } from './Toast/types'
export type { Theme } from './theme'
