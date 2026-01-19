// Site variant
export type SiteVariant = 'risqbase' | 'ralia'

// Footer
export interface FooterProps {
  variant?: SiteVariant
}

// Header
export interface HeaderProps {
  variant?: SiteVariant
  showLaunchDate?: boolean
}

// Button
export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string
  children: React.ReactNode
}

// Badge
export type BadgeVariant = 'default' | 'highlight' | 'subtle'

export interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

// Section Eyebrow
export interface SectionEyebrowProps {
  children: React.ReactNode
  className?: string
}
