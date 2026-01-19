import { SectionEyebrowProps } from './types'

export function SectionEyebrow({
  children,
  className = '',
}: SectionEyebrowProps) {
  const baseStyles = 'text-sm font-semibold tracking-wider text-indigo-600 uppercase mb-4'
  const combinedStyles = `${baseStyles} ${className}`

  return (
    <p className={combinedStyles}>
      {children}
    </p>
  )
}
