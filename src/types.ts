// Back-compat shim. Types now live alongside their components in
// `src/core/<Name>/types.ts`; this file re-exports them so legacy
// deep-imports (`@risqbase-inc/ui-components/types`) keep resolving.

export type { SiteVariant, HeaderProps } from './core/Header/types'
export type { FooterProps } from './core/Footer/types'
export type { ButtonProps, ButtonVariant, ButtonSize } from './core/Button/types'
export type { BadgeProps, BadgeVariant } from './core/Badge/types'
export type { SectionEyebrowProps } from './core/SectionEyebrow/types'
