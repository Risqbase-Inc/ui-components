export type SiteVariant = 'risqbase' | 'ralia'

export interface NavLink {
  label: string
  href: string
}

export interface NavGroup {
  label: string
  /** When present, the nav entry becomes a click-toggle disclosure. */
  items: NavLink[]
  /** Optional eyebrow rendered above the dropdown panel (e.g. "PLATFORM"). */
  eyebrow?: string
}

export type NavEntry = NavLink | NavGroup

export interface HeaderProps {
  variant?: SiteVariant
  showLaunchDate?: boolean
  /** Override nav entries; default is the variant's canonical set (back-compat). */
  navEntries?: NavEntry[]
  /** Current pathname for aria-current matching. When omitted, no link
   *  receives `aria-current="page"`. Pass explicitly from
   *  `usePathname()` in Next.js apps so the Header itself stays
   *  server-renderable. */
  currentPath?: string
}
