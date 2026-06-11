// Header is purely presentational: no useState, no useEffect, no useRef,
// no browser APIs in this file. The v2.1.0 dropdown additions live in
// `./NavDropdown.tsx` (a 'use client' island gated to the dropdown
// sub-tree only) and in `./NavDropdownContext.tsx` (also client). The
// surrounding chrome stays server-rendered per Spec 07 §2.3 +
// cover §2.3.
//
// Re-add 'use client' to this file ONLY if a future change introduces
// client behaviour to the chrome itself.

import Link from 'next/link'
import { TelemetryBeacon } from '../TelemetryBeacon'
import { HeaderNavDropdown } from './NavDropdown'
import { HeaderDropdownProvider } from './NavDropdownContext'
import { HeaderNavLink } from './NavLink'
import type { HeaderProps, NavEntry, NavGroup, SiteVariant } from './types'

// Default nav entries per variant. Back-compat surface for v1.x / v2.0
// consumers who do not pass `navEntries`.
const defaultEntries: Record<SiteVariant, NavEntry[]> = {
  risqbase: [
    { label: 'About', href: '/about' },
    { label: 'RALIA', href: 'https://ralia.io' },
    { label: 'Contact', href: '/contact' },
  ],
  ralia: [
    { label: 'Features', href: '/#features' },
    { label: 'Pricing', href: '/pricing' },
  ],
}

function isNavGroup(entry: NavEntry): entry is NavGroup {
  return 'items' in entry && Array.isArray((entry as { items?: unknown }).items)
}

export function Header({
  variant = 'risqbase',
  showLaunchDate = false,
  navEntries,
  currentPath,
}: HeaderProps) {
  const isRalia = variant === 'ralia'
  const logoText = isRalia ? 'RALIA' : 'RisqBase'
  const tagline = isRalia ? 'by RisqBase' : null
  const entries = navEntries ?? defaultEntries[variant]
  // Wrap nav in the dropdown provider only when at least one entry is a
  // group — keeps the provider (and its 'use client' boundary) out of
  // the tree for pure-link headers (v2.0.0 callers).
  const needsProvider = entries.some(isNavGroup)

  const navContent = (
    <nav className="hidden md:flex items-center space-x-8">
      {entries.map((entry) =>
        isNavGroup(entry) ? (
          <HeaderNavDropdown
            key={`group:${entry.label}`}
            label={entry.label}
            items={entry.items}
            eyebrow={entry.eyebrow}
            currentPath={currentPath}
          />
        ) : (
          <HeaderNavLink
            key={`link:${entry.href}`}
            label={entry.label}
            href={entry.href}
            currentPath={currentPath}
          />
        ),
      )}
    </nav>
  )

  return (
    <>
      <TelemetryBeacon component="Header" variant={variant} />
      <header className="bg-[var(--color-header-background)] border-b border-[var(--color-header-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo — brand mark v3 glyph (shared across variants; wordmark
                text differs). Frozen outline, identical geometry to
                public/mark.svg (keep in sync); themes via currentColor from
                the header-logo token. The link text carries the name. */}
            <Link
              href="/"
              className="flex items-center space-x-2 text-[var(--color-header-logo)]"
            >
              <svg
                viewBox="0 0 160 160"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
                className="h-5 w-5 shrink-0"
              >
                <path d="M22.1 108V52.3h14.8l.3 11.2q1.7-5.9 4.9-8.6 3.2-2.6 8.4-2.6h5.1v12.9h-5.1q-6.6 0-9.7 2.7t-3.1 8.8V108zm39.2 15.6V34.2h15.3v89.4zm48.3-14.3q8.5 0 14.9-3.6t9.9-10.2 3.5-15.3q0-8.8-3.5-15.4t-9.9-10.2-14.9-3.6Q98.3 51 91 56.9q-7.4 5.8-8.7 16l16.1.7q.8-5.1 3.7-7.8 3-2.7 7.5-2.7 5.8 0 9 4.5 3.2 4.4 3.2 12.6 0 8.1-3.2 12.6t-9 4.5q-4.7 0-7.6-2.8t-3.6-8.3l-16.1.6q1.2 10.3 8.6 16.4 7.3 6.1 18.7 6.1"/>
              </svg>
              <span className="text-xl font-bold">{logoText}</span>
              {tagline && (
                <span className="text-[var(--color-header-tagline)] text-sm">{tagline}</span>
              )}
            </Link>

            {/* Navigation */}
            {needsProvider ? (
              <HeaderDropdownProvider>{navContent}</HeaderDropdownProvider>
            ) : (
              navContent
            )}

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {showLaunchDate && (
                <span className="hidden sm:block text-sm text-[var(--color-header-launch-date)]">
                  Launching July 2026
                </span>
              )}
              <Link
                href={isRalia ? '/login' : '/signin'}
                className="text-[var(--color-header-nav-link-default)] hover:text-[var(--color-header-nav-link-hover)] transition-colors"
              >
                {isRalia ? 'Log in' : 'Sign In'}
              </Link>
              <Link
                href={isRalia ? '/signup' : '/get-started'}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-[var(--color-header-cta-foreground)] bg-[var(--color-header-cta-background-default)] rounded-full hover:bg-[var(--color-header-cta-background-hover)] transition-colors"
              >
                {isRalia ? 'Sign up' : 'Get Started'}
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export type { HeaderProps, NavEntry, NavGroup, NavLink, SiteVariant } from './types'
