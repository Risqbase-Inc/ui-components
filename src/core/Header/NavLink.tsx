import Link from 'next/link'
import { isCurrentPath } from './lib/isCurrent'
import type { NavLink as NavLinkType } from './types'

// Server-renderable nav link. Renders next/link with aria-current="page"
// + the underlined-active visual treatment when currentPath matches.
//
// Spec 07 §3.1: aria-current visual = colour → --color-text-default;
// 2px solid --color-action-primary border-bottom; padding-bottom 4px
// to keep baseline alignment.

const baseClasses =
  'text-[var(--color-header-nav-link-default)] hover:text-[var(--color-header-nav-link-hover)] transition-colors'

const activeClasses =
  'text-[var(--color-text-default)] border-b-2 border-[var(--color-action-primary)] pb-1'

export interface HeaderNavLinkProps extends NavLinkType {
  currentPath?: string
}

export function HeaderNavLink({ label, href, currentPath }: HeaderNavLinkProps) {
  const active = isCurrentPath(href, currentPath)
  const classes = active ? `${baseClasses} ${activeClasses}` : baseClasses
  return (
    <Link href={href} className={classes} aria-current={active ? 'page' : undefined}>
      {label}
    </Link>
  )
}
