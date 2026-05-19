import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type IconButtonVariant = 'ghost' | 'primary' | 'secondary'
export type IconButtonSize = 'sm' | 'md' | 'lg'

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Required: SVG / icon node rendered inside the button. */
  icon: ReactNode
  /** Required: accessible name. There is no visible text. */
  'aria-label': string
  variant?: IconButtonVariant
  size?: IconButtonSize
  className?: string
}
