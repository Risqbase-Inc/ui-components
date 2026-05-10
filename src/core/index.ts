// Core — universally applicable UI primitives (spec §22.2.1).
// Each component lives in its own subfolder with co-located types,
// accessibility.md, and tokens.md per spec §15.4.

export { Button, PrimaryButton, SecondaryButton, GhostButton } from './Button'
export { Badge, MostPopularBadge, StandaloneProductBadge, NewBadge, ComingSoonBadge } from './Badge'
export { Header } from './Header'
export { Footer } from './Footer'
export { SectionEyebrow } from './SectionEyebrow'

// Theming primitives (spec §15.2.1). Inlined SSR-safe init script,
// runtime mode setter, getter, and rotation/reset helper.
export { setTheme, getTheme, clearTheme, themeInitScript, THEME_STORAGE_KEY } from './theme'

export type { ButtonProps, ButtonVariant, ButtonSize } from './Button/types'
export type { BadgeProps, BadgeVariant } from './Badge/types'
export type { HeaderProps, SiteVariant } from './Header/types'
export type { FooterProps } from './Footer/types'
export type { SectionEyebrowProps } from './SectionEyebrow/types'
export type { Theme } from './theme'
