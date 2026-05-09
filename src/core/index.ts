// Core — universally applicable UI primitives (spec §22.2.1).
// Each component lives in its own subfolder with co-located types,
// accessibility.md, and tokens.md per spec §15.4.

export { Button, PrimaryButton, SecondaryButton, GhostButton } from './Button'
export { Badge, MostPopularBadge, StandaloneProductBadge, NewBadge, ComingSoonBadge } from './Badge'
export { Header } from './Header'
export { Footer } from './Footer'
export { SectionEyebrow } from './SectionEyebrow'

export type { ButtonProps, ButtonVariant, ButtonSize } from './Button/types'
export type { BadgeProps, BadgeVariant } from './Badge/types'
export type { HeaderProps, SiteVariant } from './Header/types'
export type { FooterProps } from './Footer/types'
export type { SectionEyebrowProps } from './SectionEyebrow/types'
